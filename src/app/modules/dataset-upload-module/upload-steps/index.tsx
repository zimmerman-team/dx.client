/** third party */
import React from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { find, set } from "lodash";
import { useRecoilState } from "recoil";
/** project */
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import { stepcss } from "app/modules/dataset-upload-module/style";
import { PageTopSpacer } from "app/modules/common/page-top-spacer";
import MetaData from "app/modules/dataset-upload-module/upload-steps/metaData";
import Processing from "app/modules/dataset-upload-module/upload-steps/processing";
import FinishedFragment from "app/modules/dataset-upload-module/upload-steps/finishedFragment";
import AddDatasetFragment from "app/modules/dataset-upload-module/upload-steps/addDatasetFragment";
import { loadedDatasetsAtom } from "app/state/recoil/atoms";
import ObjectId from "app/utils/ObjectId";
import { useOnUploadProgress } from "app/hooks/useOnUploadProgress";
import ExternalSearch, {
  IExternalDataset,
} from "app/modules/dataset-upload-module/upload-steps/externalSearch";
import Stepper from "app/modules/dataset-upload-module/component/stepper";

interface Props {
  datasetId: string;
  setDatasetId: React.Dispatch<React.SetStateAction<string>>;
}

function DatasetUploadSteps(props: Props) {
  const { user } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const steps = ["Connect", "Processing Data", "Description", "Finished"];
  const [formDetails, setFormDetails] = React.useState({
    name: "",
    description: "",
    category: "",
    public: false,
    source: "",
    sourceUrl: "",
  });
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [processingError, setProcessingError] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isExternalSearch, setIsExternalSearch] = React.useState(false);

  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const datasets = useStoreState(
    (state) => state.dataThemes.DatasetGetList.crudData as any[]
  );
  const [_loadedDatasets, setLoadedDatasets] =
    useRecoilState(loadedDatasetsAtom);

  const {
    loadedProgress,
    percentageLoadedProgress,
    estUploadTime,
    setEstUploadTime,
    onUploadProgress,
  } = useOnUploadProgress();
  const { loadDataset, sampleData, dataTotalCount, dataStats, dataTypes } =
    useChartsRawData({
      visualOptions: () => {},
      setVisualOptions: () => {},
      setChartFromAPI: () => {},
      chartFromAPI: null,
    });

  React.useEffect(() => {
    let timer: any;

    if (estUploadTime > 0) {
      timer = setInterval(() => {
        setEstUploadTime((prevEstUploadTime) => prevEstUploadTime - 1);
      }, 1000); // 1000 milliseconds = 1 second
    }

    //Cleanup the timer when estUploadTime becomes 0 or less
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [estUploadTime]);

  const handleNext = () => {
    //handles stepper navigation
    const newActiveStep = activeStep + 1;
    //if last step, set active step to first step
    if (newActiveStep > steps.length - 1) {
      setActiveStep(0);
    }
    //set active step to next step
    setActiveStep(newActiveStep);
  };

  //get description from latest set of api loaded datasets
  const description = find(
    datasets,
    (d: any) => d.id === props.datasetId
  )?.description;

  const handleBack = () => {
    //handles stepper navigation
    if (activeStep > 0) {
      //go back to previous step
      const newActiveStep = activeStep - 1;
      setActiveStep(newActiveStep);
    }
  };

  React.useEffect(() => {
    //update loaded datasets with latest loaded dataset from api
    setLoadedDatasets(datasets);
  }, [datasets]);

  const onSubmitMetadata = () => {
    //Post the dataset
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
        //load dataset and datasets on upload success
        //we do this to load data to populate the table
        loadDataset(`chart/sample-data/${response.data.id}`);
        //we do this to update the dataset list with the new dataset
        loadDatasets({ token, storeInCrudData: true });
        //set active step to finished
        setActiveStep(3);
      })
      .catch((error) => {
        console.debug("Dataset creation error", error);
        setProcessingError(true);
      });
  };

  const onFileSubmit = (file: File) => {
    setSelectedFile(file);
    const formData = new FormData();
    //set active step to processing
    handleNext();

    const id = ObjectId();
    //expose file id to datasetId state; to be used in dataset upload
    //this is used to link the file to the dataset
    props.setDatasetId(id);
    //append file to form data
    let fieldname = "dx" + id;
    formData.append(fieldname, file as File);
    axios
      .post(`${process.env.REACT_APP_API}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      })
      .then(() => {
        //go to next step - metadata
        setActiveStep(2);
      })
      .catch((error) => {
        console.debug("Dataset upload error", error);
        setProcessingError(true);
        setSelectedFile(null);
      });
  };

  const handleDownloadExternalDataset = (externalDataset: IExternalDataset) => {
    const id = ObjectId();
    //expose file id to datasetId state; to be used in dataset upload
    props.setDatasetId(id);
    //set isExternalSearch to false
    setIsExternalSearch(false);
    //set active step to processing
    setActiveStep(1);
    axios
      .post(
        `${process.env.REACT_APP_API}/external-sources/download`,
        { ...externalDataset, id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress,
        }
      )
      .then(() => {
        //populate formDetails with externalDataset fields to be used in metadata
        setFormDetails({
          category: "",
          description: externalDataset.description.substring(0, 150),
          name: externalDataset.name,
          public: false,
          source: externalDataset.source,
          sourceUrl: externalDataset.url,
        });
        //go to next step - metadata
        setActiveStep(2);
      })
      .catch((error) => {
        console.debug("Dataset upload error", error);
        setActiveStep(0);
        setProcessingError(true);
      });
  };

  const currentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <AddDatasetFragment
            onFileSubmit={onFileSubmit}
            disabled={false}
            processingError={processingError}
            setIsExternalSearch={setIsExternalSearch}
          />
        );
      case 1:
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
      case 2:
        return (
          <MetaData
            onSubmit={onSubmitMetadata}
            handleBack={handleBack}
            formDetails={formDetails}
            setFormDetails={setFormDetails}
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
            dataTypes={dataTypes}
          />
        );

      default:
        return (
          <AddDatasetFragment
            onFileSubmit={onFileSubmit}
            disabled={false}
            processingError={processingError}
            setIsExternalSearch={setIsExternalSearch}
          />
        );
    }
  };

  return (
    <>
      {isExternalSearch ? (
        <ExternalSearch
          setFormDetails={setFormDetails}
          setActiveStep={setActiveStep}
          setProcessingError={setProcessingError}
          handleDownload={handleDownloadExternalDataset}
        />
      ) : (
        <Container maxWidth="lg">
          <div css={stepcss}>
            {steps.map((tab, index) => (
              <Stepper
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                index={index}
                tab={tab}
                tabs={steps}
                key={tab}
              />
            ))}
          </div>
          <PageTopSpacer />
          <div>{currentStep()}</div>
        </Container>
      )}
    </>
  );
}

export default withAuthenticationRequired(DatasetUploadSteps);
