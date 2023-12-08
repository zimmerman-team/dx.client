/* third-party */
import React from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory, useParams } from "react-router-dom";
import { createChartFromReportAtom } from "app/state/recoil/atoms";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
/* project */
import { styles } from "app/modules/chart-module/components/toolbox/styles";
import { ChartExporter } from "app/modules/chart-module/components/exporter";
import { ChartToolBoxProps } from "app/modules/chart-module/components/toolbox/data";
import { ChartToolBoxSteps } from "app/modules/chart-module/components/toolbox/views/steps";
import ToolboxNav, { ToolboxNavType } from "./views/steps/navbar";
import { Slide, useMediaQuery } from "@material-ui/core";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import { isEmpty } from "lodash";

export function ChartModuleToolBox(props: ChartToolBoxProps) {
  const { page, view } = useParams<{ page: string; view?: string }>();
  const { user } = useAuth0();
  const history = useHistory();
  const token = useStoreState((state) => state.AuthToken.value);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isClickable, setIsClickable] = React.useState(false);

  const mapping = useStoreState((state) => state.charts.mapping.value);
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const enabledFilterOptionGroups = useStoreState(
    (state) => state.charts.enabledFilterOptionGroups.value
  );
  const activePanels = useStoreState(
    (state) => state.charts.activePanels.value
  );

  const setActivePanels = useStoreActions(
    (state) => state.charts.activePanels.setValue
  );
  const selectedChartType = useStoreState(
    (state) => state.charts.chartType.value
  );

  const createChart = useStoreActions(
    (actions) => actions.charts.ChartCreate.post
  );
  const editChart = useStoreActions(
    (actions) => actions.charts.ChartUpdate.patch
  );
  const [createChartFromReport, setCreateChartFromReport] = useRecoilState(
    createChartFromReportAtom
  );
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const [displayToolbar, setDisplayToolbar] = React.useState<"block" | "none">(
    "block"
  );

  const stepPaths = [
    { name: "data", path: `/chart/${page}/data` },
    { name: "dataset", path: `/chart/${page}/preview-data` },
    { name: "chart", path: `/chart/${page}/chart-type` },
    { name: "mapping", path: `/chart/${page}/mapping` },
    { name: "filters", path: `/chart/${page}/filters` },
    { name: "customize", path: `/chart/${page}/customize` },
  ];

  const onNavBtnClick = (name: ToolboxNavType) => {
    if (
      name === "dataset" ||
      name === "selectDataset" ||
      name === "chart" ||
      name === "mapping"
    ) {
      if (name === "dataset" && !isEmpty(dataset)) {
        setActivePanels(name);

        return;
      }
      if (name === "chart" && !isEmpty(dataset)) {
        setActivePanels(name);

        return;
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        setActivePanels(name);

        return;
      }
    } else if (!isEmpty(props.mappedData)) {
      setActivePanels(name);
    }
  };
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
        return;
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        setIsClickable(true);
        return;
      }
    } else if (!isEmpty(props.mappedData)) {
      setIsClickable(true);
    }
  };
  function onSave() {
    const chart = {
      name: props.chartName,
      authId: user?.sub,
      vizType: selectedChartType,
      mapping,
      datasetId: dataset,
      vizOptions: props.visualOptions,
      appliedFilters,
      enabledFilterOptionGroups,
    };
    if (props.isEditMode && page !== "new") {
      editChart({
        token,
        patchId: page,
        values: chart,
      });
    } else {
      createChart({
        token,
        values: chart,
      });
    }
    //Completes chart creation , returns to persisted report state
    if (createChartFromReport.state) {
      setCreateChartFromReport({
        ...createChartFromReport,
        state: false,
      });
      if (createChartFromReport.view === undefined) {
        history.push(`/report/${createChartFromReport.page}/edit`);
      } else {
        history.push(
          `/report/${createChartFromReport.page}/${createChartFromReport.view}`
        );
      }
    }
  }

  React.useEffect(() => {
    if (location.pathname === `/chart/${page}` || view == "preview") {
      setDisplayToolbar("none");
      props.setToolboxOpen(false);
    } else {
      setDisplayToolbar("block");
      props.setToolboxOpen(true);
    }
  }, [location.pathname]);

  return (
    <Slide
      direction="left"
      in={props.openToolbox}
      style={{ visibility: "visible", display: displayToolbar }}
    >
      <div css={styles.container(props.filtersView)}>
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
          activeStep={activePanels}
          setActiveStep={setActivePanels}
          mappedData={props.mappedData}
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
            forceNextEnabled={props.forceNextEnabled}
            setVisualOptions={props.setVisualOptions}
            filterOptionGroups={props.filterOptionGroups}
            filtersView={props.filtersView}
            save={onSave}
            dimensions={props.dimensions}
            activeStep={activePanels}
            onNavBtnClick={onNavBtnClick}
            stepPaths={stepPaths}
            isClickable={isClickable}
            setIsClickable={setIsClickable}
            onMouseOverNavBtn={onMouseOverNavBtn}
          />
        )}

        {props.exportView && props.rawViz && (
          <div css={styles.exportview}>
            <ChartExporter rawViz={props.rawViz} />
          </div>
        )}
      </div>
    </Slide>
  );
}
