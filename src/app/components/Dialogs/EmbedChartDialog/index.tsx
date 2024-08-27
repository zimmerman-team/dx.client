import React from "react";
import CloseOutlined from "@material-ui/icons/ClearOutlined";
import Modal from "@material-ui/core/Modal";
import { useStyles } from "../deleteChartDialog";
import { useRenderChartFromAPI } from "app/modules/report-module/components/chart-wrapper/useRenderChartFromAPI";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import get from "lodash/get";
import { useLoadDatasetDetails } from "app/modules/report-module/components/chart-wrapper/useLoadDatasetDetailsAPI";
import { useAuth0 } from "@auth0/auth0-react";
import ChartContainer from "./chartContainer";
import { copyToClipboard } from "app/utils/copyToClipboard";
import { useStoreState } from "app/state/store/hooks";
import LinkOptions from "./linkOptions";
import BasicSwitch from "app/components/Switch/BasicSwitch";
import EmbedOptions from "./embedOptions";

export default function EmbedChartDialog(props: {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
  chartId: string;
  chartName: string;
  datasetId: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const token = useStoreState((state) => state.AuthToken.value);
  const classes = useStyles();
  const { user } = useAuth0();
  console.log(props.datasetId, "datasetId");
  const { datasetDetails } = useLoadDatasetDetails(
    props.datasetId!,
    token ?? undefined
  );
  const [displayMode, setDisplayMode] = React.useState<string>("tracklist");
  const [widthValue, setWidthValue] = React.useState<number>(0);
  const [heightValue, setHeightValue] = React.useState<number>(0);
  const [copyAlert, setCopyAlert] = React.useState<boolean>(false);
  const [activeSwitchTab, setActiveSwitchTab] =
    React.useState<string>("embed-code");

  const {
    loading,
    notFound,
    chartErrorMessage,
    dataError,
    visualOptions,
    chartFromAPI,
    setChartErrorMessage,
    setVisualOptions,
    setNotFound,
  } = useRenderChartFromAPI(token, props.chartId);

  let newVisualOptions = visualOptions;

  const displayModes = [
    { value: "tracklist", label: "With tracklist" },
    { value: "compact", label: "Compact" },
  ];
  const switchTabs = [
    { value: "embed-code", label: "Embed Code" },
    { value: "lishared-link", label: "Shared Link" },
  ];

  const renderedChart = React.useMemo(() => {
    return chartFromAPI
      ? chartFromAPI.renderedContent
      : get(chartFromAPI, "content", "");
  }, [chartFromAPI]);

  const renderedChartMappedData = React.useMemo(() => {
    return get(chartFromAPI, "mappedData", []);
  }, [chartFromAPI]);

  const renderedChartType = React.useMemo(() => {
    return get(chartFromAPI, "vizType", "echartsBarchart");
  }, [chartFromAPI]);

  if (containerRef.current) {
    newVisualOptions = {
      ...visualOptions,
      height: 260,
    };
  }
  const handleDisplayModeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDisplayMode((event.target as HTMLInputElement).value);
  };

  const handleSwitchTab = (value: string) => {
    setActiveSwitchTab(value);
  };

  const handleCopyToClipboard = async () => {
    copyToClipboard("embed-code").then(() => {
      setCopyAlert(true);
    });
  };
  return (
    <>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <div
          css={`
            background: #fff;
            width: 691px;
            padding: 24px 24px 32px 24px;
            border-radius: 8px;
          `}
        >
          <div
            css={`
              height: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <img src="/logo.svg" alt={"app-logo"} />
            <IconButton onClick={() => props.setModalDisplay(false)}>
              <CloseOutlined htmlColor="#231D2C" />
            </IconButton>
          </div>

          <div
            css={`
              height: 80px;
              border-bottom: 0.5px solid #b49696;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <div
              css={`
                width: 269px;
                height: 48px;
              `}
            >
              <BasicSwitch
                activeTab={activeSwitchTab}
                handleSwitch={handleSwitchTab}
                setActiveTab={setActiveSwitchTab}
                tabs={switchTabs}
              />
            </div>
          </div>

          <div
            css={`
              height: 285px;
              padding: 16px 0;
              display: flex;
              gap: 4px;
              width: 100%;
            `}
          >
            <div
              css={`
                width: 73%;
                > p {
                  color: #231d2c;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 14px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  max-width: 70%;
                  margin: 0;
                }
              `}
            >
              <p title={props.chartName}>{props.chartName}</p>
              <ChartContainer
                chartFromAPI={chartFromAPI!}
                chartId={props.chartId}
                chartName={props.chartName}
                containerRef={containerRef}
                datasetDetails={datasetDetails}
                renderedChart={renderedChart}
                renderedChartMappedData={renderedChartMappedData}
                renderedChartType={renderedChartType}
                setChartError={setNotFound}
                setNotFound={setNotFound}
                setVisualOptions={setVisualOptions}
                visualOptions={newVisualOptions}
                setChartErrorMessage={setChartErrorMessage}
                chartErrorMessage={chartErrorMessage}
                dataError={dataError}
                notFound={notFound}
              />
            </div>
            <div
              css={`
                width: 20%;
                p {
                  display: flex;
                  flex-direction: column;
                  text-transform: capitalize;
                  margin: 0;
                  span:nth-of-type(1) {
                    color: #70777e;
                    font-family: "GothamNarrow-Medium", "Helvetica Neue",
                      sans-serif;
                    font-size: 12px;
                    margin: 0;
                    line-height: 14.52px;
                  }
                  span:nth-of-type(2) {
                    color: #231d2c;
                    font-family: "GothamNarrow-Medium", "Helvetica Neue",
                      sans-serif;
                    font-size: 12px;
                    margin: 0;
                    line-height: 14.52px;
                  }
                }
              `}
            >
              <p>
                <span>Author:</span>
                <span>{user?.given_name || "NOT SPECIFIED"}</span>
              </p>
              <div
                css={`
                  height: 8px;
                `}
              />
              <p>
                <span>Data Source:</span>
                <span>{datasetDetails.source}</span>
              </p>
            </div>
          </div>
          {activeSwitchTab === "embed-code" ? (
            <EmbedOptions
              chartId={props.chartId}
              displayMode={displayMode}
              handleDisplayModeChange={handleDisplayModeChange}
              widthValue={widthValue}
              setWidthValue={setWidthValue}
              heightValue={heightValue}
              setHeightValue={setHeightValue}
              handleCopyToClipboard={handleCopyToClipboard}
              datasetId={props.datasetId}
              displayModes={displayModes}
            />
          ) : (
            <LinkOptions
              chartId={props.chartId}
              datasetId={props.datasetId}
              handleCopyToClipboard={handleCopyToClipboard}
            />
          )}
        </div>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={copyAlert}
        autoHideDuration={5000}
        onClose={() => setCopyAlert(false)}
        message="copied to clipboard"
        data-testid="copied-link-snackbar"
      />
    </>
  );
}
