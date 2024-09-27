/** third party */
import React, { useEffect } from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { useAuth0 } from "@auth0/auth0-react";
/** project */
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import { stepcss } from "app/modules/dataset-module/routes/upload-module/style";
import { PageTopSpacer } from "app/modules/common/page-top-spacer";
import MetaData from "app/modules/dataset-module/routes/upload-module/upload-steps/metaData";
import Processing from "app/modules/dataset-module/routes/upload-module/upload-steps/processing";
import FinishedFragment from "app/modules/dataset-module/routes/upload-module/upload-steps/finishedFragment";
import AddDatasetFragment from "app/modules/dataset-module/routes/upload-module/upload-steps/addDatasetFragment";
import ObjectId from "app/utils/ObjectId";
import { useOnUploadProgress } from "app/hooks/useOnUploadProgress";
import ExternalSearch, {
  IExternalDataset,
} from "app/modules/dataset-module/routes/upload-module/upload-steps/externalSearch";
import IATISearch from "app/modules/dataset-module/routes/upload-module/upload-steps/iatiSearch";
import Stepper from "app/modules/dataset-module/routes/upload-module/component/stepper";
import { Box } from "@material-ui/core";
import { useTitle } from "react-use";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import BreadCrumbs from "app/modules/home-module/components/Breadcrumbs";
import SmallFooter from "app/modules/home-module/components/Footer/smallFooter";
import { useRecoilState } from "recoil";
import { dataUploadTabAtom, planDialogAtom } from "app/state/recoil/atoms";
import BasicSwitch from "app/components/Switch/BasicSwitch";
import Search from "@material-ui/icons/Search";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";

interface Props {
  datasetId: string;
  setDatasetId: React.Dispatch<React.SetStateAction<string>>;
}

function DatasetUploadSteps(props: Props) {
  useTitle("DX Dataxplorer - Upload Dataset");

  const { user } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const steps = ["Connect", "Processing Data", "Description", "Finished"];
  const [_, setPlanDialog] = useRecoilState(planDialogAtom);
  const [formDetails, setFormDetails] = React.useState({
    name: "",
    description: "",
    category: "",
    public: false,
    source: "",
    sourceUrl: "",
  });
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [processingError, setProcessingError] = React.useState<string | null>(
    null
  );
  const [processingMessage, setProcessingMessage] = React.useState("");
  const [processed, setProcessed] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sources, setSources] = React.useState<string[]>([]);

  const [activeTab, setActiveTab] = useRecoilState(dataUploadTabAtom);
  const [activeOption, setActiveOption] = React.useState<string | null>(null);

  const defaultProcessingError =
    "Data could not be processed, please try again or contact your administrator";

  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const loadDatasetDetails = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );

  React.useEffect(() => {
    if (activeStep === 3) {
      if (token) {
        loadDatasetDetails({
          token,
          getId: props.datasetId,
        });
      } else {
        loadDatasetDetails({
          token,
          getId: props.datasetId,
          nonAuthCall: !token,
        });
      }
    }
  }, [token, props.datasetId, activeStep]);

  const {
    loadedProgress,
    percentageLoadedProgress,
    estUploadTime,
    setEstUploadTime,
    onUploadProgress,
  } = useOnUploadProgress();
  const {
    loadDataset: loadSampleDataset,
    sampleData,
    dataTotalCount,
    dataStats,
    dataTypes,
  } = useChartsRawData({
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

  const handleBack = () => {
    //handles stepper navigation
    if (activeStep > 0) {
      //go back to previous step
      const newActiveStep = activeStep - 1;
      setActiveStep(newActiveStep);
    }
  };
  const handleTabSwitch = (tab: "search" | "file" | "iati") => {
    setActiveTab(tab);
  };
  React.useEffect(() => {
    if (activeStep === 0) {
      setProcessingError("");
      setProcessingMessage("");
      setProcessed(false);
    }
  }, [activeStep]);

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
        loadSampleDataset(response.data.data.id);
        //we do this to update the dataset list with the new dataset
        loadDatasets({ token, storeInCrudData: true });
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        if (response.data.planWarning) {
          setPlanDialog({
            open: true,
            message: response.data.planWarning,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        //set active step to finished
        setActiveStep(3);
      })
      .catch((error) => {
        console.debug("Dataset creation error", error);
        setProcessingError(defaultProcessingError);
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
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress,
      })
      .then((response) => {
        //go to next step - metadata
        if (!response.data.error) {
          setActiveStep(2);
          setProcessed(true);
          return;
        }
        if (response.data?.errorType !== "planError") {
          setProcessingError(response.data.error);
          console.debug("Dataset upload error", response.data.error);
          return;
        }
        if (response.data?.processingMessage) {
          setPlanDialog({
            open: true,
            message: response.data.error,
            tryAgain: "Try another dataset",
            onTryAgain: tryAgain,
          });
          setProcessingMessage(response.data?.processingMessage ?? "");
        } else {
          setPlanDialog({
            open: true,
            message: response.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
          setProcessingMessage(response.data.error ?? "");
        }
      })
      .catch((error) => {
        console.debug("Dataset upload error", error);
        setProcessingError(defaultProcessingError);
        setSelectedFile(null);
      });
  };

  const handleDownloadExternalDataset = (externalDataset: IExternalDataset) => {
    const id = ObjectId();
    //expose file id to datasetId state; to be used in dataset upload
    props.setDatasetId(id);
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
      .then((response) => {
        //populate formDetails with externalDataset fields to be used in metadata

        if (response.data.error) {
          setProcessingError(response.data.error);
          console.debug("Dataset upload error", response.data.error);
        } else {
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
          setProcessed(true);
        }
      })
      .catch((error) => {
        console.debug("Dataset upload error", error);
        setActiveStep(0);
        setProcessingError(defaultProcessingError);
      });
  };

  // Define the new handler for IATI search
  const handleIATISearch = async (query: string, fl: string) => {
    try {
      setActiveStep(1);
      await axios
        .post("http://localhost:4004/external-sources/iati", { query, fl })
        .then((response) => {
          const result = response.data.result;
          const icQuery = result.substring(
            result.indexOf("query: ") + 7,
            result.indexOf(" - datasetId: ")
          );
          const dsId = result
            .substring(result.indexOf("datasetId: ") + 11)
            .trim();
          props.setDatasetId(dsId);
          setFormDetails({
            category: "IATI",
            description: `We have converted your search query to the following solr query to IATI.cloud: ${icQuery}`,
            name: query,
            public: false,
            source: "IATI.cloud",
            sourceUrl: "https://datastore.iati.cloud/home",
          });
          //go to next step - metadata
          setActiveStep(2);
          setProcessed(true);
        })
        .catch((error) => {
          setProcessingError(
            "Unable to search for IATI data at this time, please try again later. If the problem persists, please contact your administrator."
          );
          setActiveStep(0);
          console.error("IATI Search error", error);
        });
    } catch (error) {
      setProcessingError(
        "Unable to search for IATI data at this time, please try again later. If the problem persists, please contact your administrator."
      );
      setActiveStep(0);
      console.error("CatchAll IATI Search error", error);
    }
  };

  const tryAgain = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (activeOption) {
      setActiveOption(null);
    }
  }, [activeTab]);

  const currentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Box height={32} />
            <BreadCrumbs
              items={[
                {
                  title: "Library",
                  path: location.search.includes("fromHome=true")
                    ? "/"
                    : "/dashboard",
                },
                {
                  title: (
                    <span
                      onClick={() => {
                        if (activeOption) {
                          setActiveOption(null);
                        }
                      }}
                    >
                      Connect Data
                    </span>
                  ),
                  path: "#",
                },
                ...(activeOption ? [{ title: activeOption }] : []),
              ]}
            />
            <Box height={24} />
            <div
              css={`
                width: 666px;
                height: 56px;
              `}
            >
              <BasicSwitch
                activeTab={activeTab}
                handleSwitch={handleTabSwitch}
                setActiveTab={setActiveTab}
                tabs={[
                  {
                    label: "Federated search",
                    value: "search",
                    testId: "federated-search-tab",
                    icon: <Search />,
                  },
                  {
                    label: "File upload",
                    value: "file",
                    testId: "file-upload-tab",
                    icon: <DesktopWindowsIcon />,
                  },
                  {
                    label: "IATI search",
                    value: "iati",
                    testId: "iati-tab",
                    icon: <DesktopWindowsIcon />,
                  },
                ]}
              />
            </div>
            <Box height={24} />
            {activeTab === "search" ? (
              <ExternalSearch
                setFormDetails={setFormDetails}
                setActiveStep={setActiveStep}
                setProcessingError={setProcessingError}
                handleDownload={handleDownloadExternalDataset}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                openSearch={openSearch}
                setOpenSearch={setOpenSearch}
                sources={sources}
                setSources={setSources}
              />
            ) : activeTab === "iati" ? (
              <IATISearch handleIATISearch={handleIATISearch} />
            ) : (
              <AddDatasetFragment
                onFileSubmit={onFileSubmit}
                disabled={false}
                processingError={processingError}
                setActiveOption={setActiveOption}
                activeOption={activeOption}
                setActiveStep={setActiveStep}
              />
            )}
          </>
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
            processingMessage={processingMessage}
            tryAgain={tryAgain}
          />
        );
      case 2:
        return (
          <>
            <div
              css={`
                height: 40px;
              `}
            />
            <MetaData
              onSubmit={onSubmitMetadata}
              handleBack={handleBack}
              formDetails={formDetails}
              setFormDetails={setFormDetails}
            />
          </>
        );

      case 3:
        return (
          <>
            <Box height={32} />
            <FinishedFragment
              data={sampleData}
              stats={dataStats}
              datasetId={props.datasetId}
              dataTotalCount={dataTotalCount}
              dataTypes={dataTypes}
              datasetDetails={datasetDetails}
              canDatasetEditDelete={true} //if user has just uploaded the dataset, then they own it and can edit it.
            />
          </>
        );

      default:
        return (
          <AddDatasetFragment
            onFileSubmit={onFileSubmit}
            disabled={false}
            processingError={processingError}
            setActiveOption={setActiveOption}
            activeOption={activeOption}
            setActiveStep={setActiveStep}
          />
        );
    }
  };

  return (
    <>
      <div
        css={`
          min-height: calc(100vh - 73px);
        `}
      >
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
                disabled={index > 0 && !processed && activeStep !== index}
              />
            ))}
          </div>

          <>
            <PageTopSpacer /> <div>{currentStep()}</div>
          </>
        </Container>
      </div>
      {activeStep === 0 ? <SmallFooter /> : null}
    </>
  );
}

export default DatasetUploadSteps;
