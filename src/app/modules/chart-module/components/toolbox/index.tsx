/* third-party */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { isEmpty } from "lodash";
import { Slide, SnackbarContent, useMediaQuery } from "@material-ui/core";
/* project */
import { styles } from "app/modules/chart-module/components/toolbox/styles";
import { ChartExporter } from "app/modules/chart-module/components/exporter";
import {
  ChartToolBoxProps,
  ToolboxNavType,
} from "app/modules/chart-module/components/toolbox/data";
import { ChartToolBoxSteps } from "app/modules/chart-module/components/toolbox/steps";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import {
  emptyChartAPI,
  ChartAPIModel,
  chartViews,
} from "app/modules/chart-module/data";
import ToolboxNav from "app/modules/chart-module/components/toolbox/steps/navbar";
import { InfoSnackbar } from "app/modules/chart-module/components/chartSubheaderToolbar/infoSnackbar";

export function ChartModuleToolBox(props: Readonly<ChartToolBoxProps>) {
  const { page, view } = useParams<{ page: string; view?: string }>();
  const isValidView = Object.values(chartViews).find((v) => v === view);
  const history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isClickable, setIsClickable] = React.useState(false);

  const location = useLocation();

  const dataset = useStoreState((state) => state.charts.dataset.value);

  const activePanels = useStoreState(
    (state) => state.charts.activePanels.value
  );

  const setActivePanels = useStoreActions(
    (state) => state.charts.activePanels.setValue
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  const [showSnackbar, setShowSnackbar] = React.useState<string | null>(null);
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const [displayToolbar, setDisplayToolbar] = React.useState<"block" | "none">(
    "block"
  );

  const stepPaths = [
    { name: "dataset", path: `/chart/${page}/data` },
    { name: "dataset", path: `/chart/${page}/preview-data` },
    { name: "chart", path: `/chart/${page}/chart-type` },
    { name: "mapping", path: `/chart/${page}/mapping` },
    { name: "filters", path: `/chart/${page}/filters` },
    { name: "customize", path: `/chart/${page}/customize` },
  ];

  const onNavBtnClick = (name: ToolboxNavType, path: string) => {
    if (
      name === "dataset" ||
      name === "selectDataset" ||
      name === "chart" ||
      name === "mapping"
    ) {
      if (name === "dataset" && !isEmpty(dataset)) {
        history.push(`/chart/${page}/preview-data`);
        return;
      }
      if (name === "chart" && !isEmpty(dataset)) {
        history.push(`/chart/${page}/chart-type`);
        return;
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        if (page === "new") {
          props.triggerAutoSave();
        } else {
          history.push(`/chart/${page}/mapping`);
        }
        return;
      }
    } else if (!isEmpty(props.mappedData)) {
      history.push(path);
    }
  };

  React.useEffect(() => {
    const step = stepPaths.find(
      (step) => step.path === location.pathname
    )?.name;

    setActivePanels(step as ToolboxNavType);
  }, [location.pathname]);

  const onMouseOverNavBtn = (name: ToolboxNavType) => {
    //handles state to set cursor types for nav buttons
    if (
      name === "dataset" ||
      name === "selectDataset" ||
      name === "chart" ||
      name === "mapping"
    ) {
      if (name === "dataset") {
        setIsClickable(true);
      }
      if (name === "chart" && !isEmpty(dataset)) {
        setIsClickable(true);
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        setIsClickable(true);
      }
    } else if (!isEmpty(props.mappedData)) {
      setIsClickable(true);
    }
  };

  React.useEffect(() => {
    if (
      location.pathname === `/chart/${page}` ||
      view === "preview" ||
      !isValidView
    ) {
      setDisplayToolbar("none");
      props.setToolboxOpen(false);
    } else {
      setDisplayToolbar("block");
      props.setToolboxOpen(true);
    }
  }, [location.pathname]);

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  if (!canChartEditDelete && page !== "new") {
    return null;
  }

  return (
    <>
      <Slide
        direction="left"
        in={props.openToolbox}
        style={{ visibility: "visible", display: displayToolbar }}
      >
        <div css={styles.container}>
          {!isMobile && (
            <div
              role="button"
              tabIndex={-1}
              css={`
                top: calc((100% - 205px) / 2);
                left: -16px;
                color: #fff;
                width: 16px;
                height: 133px;
                display: flex;
                cursor: pointer;
                position: absolute;
                background: #231d2c;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                border-radius: 10px 0px 0px 10px;
                transition: background 0.2s ease-in-out;
                &:hover {
                  background: #13183f;
                }
                > svg {
                  transform: rotate(${!props.openToolbox ? "-" : ""}90deg);
                  > path {
                    fill: #fff;
                  }
                }
              `}
              onClick={() => {
                if (props.openToolbox) {
                  props.onClose();
                } else {
                  props.onOpen();
                }
              }}
            >
              <TriangleXSIcon />
            </div>
          )}

          <ToolboxNav
            stepPaths={stepPaths}
            onNavBtnClick={onNavBtnClick}
            isClickable={isClickable}
            setIsClickable={setIsClickable}
            onMouseOverNavBtn={onMouseOverNavBtn}
          />
          {props.dataSteps && (
            <ChartToolBoxSteps
              data={props.data}
              rawViz={props.rawViz}
              loading={props.loading}
              dataTypes={props.dataTypes}
              openPanel={props.openPanel}
              mappedData={props.mappedData}
              loadDataset={props.loadDataset}
              visualOptions={props.visualOptions}
              setVisualOptions={props.setVisualOptions}
              filterOptionGroups={props.filterOptionGroups}
              save={props.onSave}
              dimensions={props.dimensions}
              activeStep={activePanels}
              onNavBtnClick={onNavBtnClick}
              stepPaths={stepPaths}
              isClickable={isClickable}
              setIsClickable={setIsClickable}
              onMouseOverNavBtn={onMouseOverNavBtn}
              setChartFromAPI={props.setChartFromAPI}
              deselectDataset={props.deselectDataset}
              setShowSnackbar={setShowSnackbar}
            />
          )}

          {props.exportView && props.rawViz && (
            <div css={styles.exportview}>
              <ChartExporter rawViz={props.rawViz} />
            </div>
          )}
        </div>
      </Slide>
      <InfoSnackbar
        gap={location.pathname.includes("report")}
        data-testid="create-chart-snackbar"
        onClose={() => setShowSnackbar(null)}
        open={showSnackbar !== null && showSnackbar !== ""}
      >
        <div
          css={`
            border-radius: 20px;
            width: 1232px;
            padding: 8px 0;
            display: flex;
            align-items: center;
            background: #fff;
            box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
            justify-content: center;
            column-gap: 48px;
            p {
              font-size: 18px;
              font-style: normal;
              margin: 0;
              line-height: 20px; /* 111.111% */
              letter-spacing: 0.5px;
            }
            button {
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              font-family: Inter;
              line-height: normal;
              text-align: center;
              color: #fff;
              background: #231d2c;
              border-radius: 20px;
              border: none;
              padding: 12px 27px;
              cursor: pointer;
            }
          `}
        >
          <p
            css={`
              font-family: GothamNarrow-Bold;
              font-weight: 400;
            `}
          >
            Your chart has been successfully saved! You can now find it in your
            library.
          </p>
          <div
            css={`
              display: flex;
              align-items: center;
              column-gap: 24px;
            `}
          >
            <button
              onClick={() => {
                setShowSnackbar(null);
                history.push("/report/new/initial");
              }}
            >
              CREATE REPORT
            </button>
            <p
              css={`
                font-family: GothamNarrow-Book;
                font-weight: 325;
              `}
            >
              or
            </p>

            <button
              onClick={() => {
                setShowSnackbar(null);
                history.push("/");
              }}
            >
              BACK TO EXPLORE
            </button>
          </div>
        </div>
      </InfoSnackbar>
    </>
  );
}
