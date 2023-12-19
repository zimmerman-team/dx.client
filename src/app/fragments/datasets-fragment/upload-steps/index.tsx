import React from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import { stepcss } from "app/fragments/datasets-fragment/style";
import { PageTopSpacer } from "app/modules/common/page-top-spacer";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import MetaData from "app/fragments/datasets-fragment/upload-steps/metaData";
import Processing from "app/fragments/datasets-fragment/upload-steps/processing";
import FinishedFragment from "app/fragments/datasets-fragment/upload-steps/finishedFragment";
import AddDatasetFragment from "app/fragments/datasets-fragment/upload-steps/addDatasetFragment";
import { useRecoilState } from "recoil";
import { loadedDatasetsAtom } from "app/state/recoil/atoms";
import ObjectId from "app/utils/ObjectId";
import { find } from "lodash";

function DatasetUploadSteps(props: {
  datasetId: string;
  setDatasetId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { user } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [_uploadSuccess, setUploadSuccess] = React.useState(false);
  const [processingError, setProcessingError] = React.useState(false);
  const [_errorMessage, setErrorMessage] = React.useState("");
  const [loadedProgress, setLoadedProgress] = React.useState("0B");
  const [percentageLoadedProgress, setPercentageLoadedProgress] =
    React.useState(0);
  const [estUploadTime, setEstUploadTime] = React.useState(0);
  const [formDetails, setFormDetails] = React.useState({
    name: "",
    description: "",
    category: "General",
    public: false,
    source: "",
    sourceUrl: "",
  });

  React.useEffect(() => {
    let timer: any;

    if (estUploadTime > 0) {
      timer = setInterval(() => {
        setEstUploadTime((prevEstUploadTime) => prevEstUploadTime - 1);
      }, 1000); // 1000 milliseconds = 1 second
    }

    // Cleanup the timer when estUploadTime becomes 0 or less
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [estUploadTime]);

  const steps = ["Connect", "Description", "Processing Data", "Finished"];

  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const datasets = useStoreState(
    (state) => state.dataThemes.DatasetGetList.crudData as any[]
  );

  const [_loadedDatasets, setLoadedDatasets] =
    useRecoilState(loadedDatasetsAtom);

  const { loadDataset, sampleData, dataTotalCount, dataStats } =
    useChartsRawData({
      visualOptions: () => {},
      setVisualOptions: () => {},
      setChartFromAPI: () => {},
      chartFromAPI: null,
    });

  const description = find(
    datasets,
    (d: any) => d.id === props.datasetId
  )?.description;

  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
    if (newActiveStep === 1) {
      return;
    }
    if (newActiveStep > steps.length - 1) {
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const newActiveStep = activeStep - 1;
      setActiveStep(newActiveStep);
    }
  };

  React.useEffect(() => {
    setLoadedDatasets(datasets);
  }, [datasets]);

  const onUploadProgress = (progressEvent: any) => {
    const { loaded, total } = progressEvent;

    /**
     ATPB: Average Time per Byte, FS: File Size
     ATPB (FS < 1 KB): 0.00020274914089347078 seconds/byte
     ATPB (FS >= 1 KB and < 1 MB): 7.006672447772506e-06 seconds/byte
     ATPB (FS >= 1 MB and < 10 MB): 2.8944496268656717e-06 seconds/byte
     ATPB (FS >= 10 MB): 2.2532963802805073e-06 seconds/byte
     lets floor that to 10 decimal places, and calculate the time per byte in
     seconds for the different sizes, as they are all different due to overhead
     */
    const timePerByteIfBytes = 0.0002027491;
    const timePerByteIfKiloBytes = 0.0000070067;
    const timePerByteIfMegaBytes = 0.0000028944;
    const timePerByteIfLargest = 0.0000022533;

    const KB = 1024;
    const MB = 1048576;
    const MB10 = 10485760;
    let timePerByte = timePerByteIfBytes;
    if (total >= KB && total < MB) timePerByte = timePerByteIfKiloBytes;
    if (total >= MB && total < MB10) timePerByte = timePerByteIfMegaBytes;
    if (total >= MB10) timePerByte = timePerByteIfLargest;
    const timeEstimate = timePerByte * total;

    let loadedProgressValue = `${loaded}B`;
    if (loaded > KB && loaded < MB)
      loadedProgressValue = `${(loaded / KB).toFixed(2)}KB`;
    if (loaded > MB) loadedProgressValue = `${(loaded / MB).toFixed(2)}MB`;
    setLoadedProgress(loadedProgressValue);
    setPercentageLoadedProgress(Math.floor((loaded * 100) / total));

    setEstUploadTime(timeEstimate);
  };

  const onSubmit = async () => {
    // Post the dataset
    axios
      .post(
        `${process.env.REACT_APP_API}/datasets`,
        { ...formDetails, authId: user?.sub, id: props.datasetId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // if the dataset was created successfully, post the file to the server
        loadDataset(`chart/sample-data/${response.data.id}`);
        loadDatasets({ token, storeInCrudData: true });

        setActiveStep(3);
      })
      .catch((error) => {
        console.debug("Dataset creation error", error);
        setProcessingError(true);

        setUploading(false);
        setUploadSuccess(false);
      });
  };

  const onFileSubmit = () => {
    const formData = new FormData();
    setUploading(true);
    const id = ObjectId();
    props.setDatasetId(id);
    let fieldname = "dx" + id;
    formData.append(fieldname, selectedFile as File);
    axios
      .post(`${process.env.REACT_APP_API}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      })
      .then(async () => {
        setUploading(false);
        setUploadSuccess(true);
        handleNext();
      })
      .catch((error) => {
        console.debug("Dataset upload error", error);
        setProcessingError(true);
        setUploading(false);
        setUploadSuccess(false);
        setSelectedFile(null);
        setErrorMessage(
          "The file could not be uploaded, make sure it is less than 40MB, and of type XLSX, CSV, JSON or XML."
        );
      });
  };

  React.useEffect(() => {
    if (selectedFile) {
      onFileSubmit();
    }
  }, [selectedFile]);

  const currentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <AddDatasetFragment
            setFile={setSelectedFile}
            disabled={false}
            uploading={uploading}
            processingError={processingError}
            processing={{
              processingError,
              loaded: loadedProgress,
              percentageLoaded: percentageLoadedProgress,
              estimatedUploadTime: estUploadTime,
              setProcessingError,
              fileName: (selectedFile && selectedFile.name) as string,
            }}
          />
        );
      case 1:
        return (
          <MetaData
            onSubmit={onSubmit}
            handleBack={handleBack}
            formDetails={formDetails}
            setFormDetails={setFormDetails}
          />
        );
      case 2:
        return (
          <Processing
            setProcessingError={setProcessingError}
            processingError={processingError}
            fileName={(selectedFile && selectedFile.name) as string}
            loaded={loadedProgress}
            percentageLoaded={percentageLoadedProgress}
            estimatedUploadTime={estUploadTime}
          />
        );

      case 3:
        return (
          <FinishedFragment
            data={sampleData}
            stats={dataStats}
            datasetId={props.datasetId}
            dataTotalCount={dataTotalCount}
            description={description}
          />
        );
      default:
        return (
          <AddDatasetFragment
            setFile={setSelectedFile}
            disabled={false}
            uploading={uploading}
            processingError={processingError}
            processing={{
              processingError,
              loaded: loadedProgress,
              percentageLoaded: percentageLoadedProgress,
              estimatedUploadTime: estUploadTime,
              setProcessingError,
              fileName: (selectedFile && selectedFile.name) as string,
            }}
          />
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <div css={stepcss}>
        {steps.map((tab, index) => (
          <div
            key={tab}
            css={`
              gap: 1rem;
              display: flex;
              align-items: center;
            `}
          >
            {index !== 0 && (
              <div
                css={`
                  width: 80px;
                  border: 1px solid
                    ${index <= activeStep ? "#6061e5" : "#231D2C"};
                `}
              />
            )}
            <button
              type="button"
              onClick={() => {
                if (activeStep > 0) {
                  setActiveStep(index);
                }
              }}
              css={`
                outline: none;
                border: none;
                height: 27px;
                display: flex;
                padding: 5px 16px;
                width: max-content;
                align-items: center;
                border-radius: 32px;
                justify-content: center;
                font-weight: ${index === activeStep && "bold"};
                border: ${index === activeStep && "1px solid #6061E5"};
                background: ${index <= activeStep ? "#dadaf8" : "#E4E4E4"};
              `}
            >
              {tab}
            </button>
          </div>
        ))}
      </div>
      <PageTopSpacer />
      <div>{currentStep()}</div>
    </Container>
  );
}

export default withAuthenticationRequired(DatasetUploadSteps);
