/* third-party */
import React from "react";
import get from "lodash/get";
import { DndProvider } from "react-dnd";
import { useAuth0 } from "@auth0/auth0-react";
import { useSessionStorage } from "react-use";
import Container from "@material-ui/core/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Switch, Route, useParams, useHistory } from "react-router-dom";
import {
  getOptionsConfig,
  getDefaultOptionsValues,
  // @ts-ignore
} from "@rawgraphs/rawgraphs-core";
/* project */
import { PageLoader } from "app/modules/common/page-loader";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import { NoMatchPage } from "app/modules/common/no-match-page";
import ChartModuleDataView from "app/modules/chart-module/routes/data";
import { ChartSubheaderToolbar } from "./components/chartSubheaderToolbar";
import ChartBuilderMapping from "app/modules/chart-module/routes/mapping";
import ChartBuilderFilters from "app/modules/chart-module/routes/filters";
import ChartBuilderCustomize from "app/modules/chart-module/routes/customize";
import { ChartBuilderPreview } from "app/modules/chart-module/routes/preview";
import ChartBuilderChartType from "app/modules/chart-module/routes/chart-type";
import { ChartModuleToolBox } from "app/modules/chart-module/components/toolbox";
import { ChartBuilderPreviewTheme } from "app/modules/chart-module/routes/preview-theme";
import {
  charts,
  ChartAPIModel,
  routeToConfig,
  emptyChartAPI,
  ChartRenderedItem,
  defaultChartOptions,
} from "app/modules/chart-module/data";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { isEmpty } from "lodash";
import useResizeObserver from "use-resize-observer";
import { ChartType } from "app/modules/chart-module/components/common-chart";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import {
  chartFromReportAtom,
  reportRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";

export default function ChartModule() {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const history = useHistory();
  const { page, view } = useParams<{ page: string; view?: string }>();
  const [chartFromAPI, setChartFromAPI] =
    React.useState<ChartRenderedItem | null>(null);
  const [visualOptions, setVisualOptions] = useSessionStorage<any>(
    "visualOptions",
    {}
  );
  const [rawViz, setRawViz] = React.useState<any>(null);
  const [toolboxOpen, setToolboxOpen] = React.useState(Boolean(view));
  const [savedChanges, setSavedChanges] = React.useState<boolean>(false);

  const [chartName, setChartName] = React.useState("Untitled Chart");
  const [isPreviewView, setIsPreviewView] = React.useState(false);
  const [hasSubHeaderTitleFocused, setHasSubHeaderTitleFocused] =
    React.useState(false);

  const chartType = useStoreState((state) => state.charts.chartType.value);
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const dataset = useStoreState((state) => state.charts.dataset.value);

  const dimensions = React.useMemo(() => {
    return get(
      chartFromAPI,
      "dimensions",
      get(charts, `[${chartType}].dimensions`, [])
    );
  }, [chartFromAPI, chartType]);
  const {
    loading,
    dataTypes,
    dataStats,
    sampleData,
    isPreviewMode,
    loadDataset,
    loadChartDataFromAPI,
    error401,
    setDataError,
    setNotFound,
    notFound,
    dataError,
    dataTypesFromRenderedChart,
    chartErrorMessage,
    setChartErrorMessage,
  } = useChartsRawData({
    visualOptions,
    setVisualOptions,
    setChartFromAPI,
    chartFromAPI,
    dimensions,
  });

  const isSaveLoading = useStoreState(
    (state) => state.charts.ChartCreate.loading
  );
  const isChartLoading = useStoreState(
    (state) => state.charts.ChartGet.loading
  );
  const editView = !!(page !== "new" && view);
  console.log(editView, "ditview");
  const [autoSaveState, setAutoSaveState] = React.useState({
    isAutoSaveEnabled: false,
    showAutoSaveSwitch: editView || false,
  });
  const [chartFromReport, _setChartFromReport] =
    useRecoilState(chartFromReportAtom);
  const setRightPanelView = useRecoilState(reportRightPanelViewAtom)[1];

  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const enabledFilterOptionGroups = useStoreState(
    (state) => state.charts.enabledFilterOptionGroups.value
  );
  const loadChart = useStoreActions((actions) => actions.charts.ChartGet.fetch);

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const chartError401 = useStoreState(
    (state) =>
      get(state.charts.ChartGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.charts.ChartGet.crudData, "error", "") === "Unauthorized"
  );
  const createChart = useStoreActions(
    (actions) => actions.charts.ChartCreate.post
  );
  const editChart = useStoreActions(
    (actions) => actions.charts.ChartUpdate.patch
  );
  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );
  const createChartClear = useStoreActions(
    (actions) => actions.charts.ChartCreate.clear
  );
  const createChartData = useStoreState(
    (state) =>
      (state.charts.ChartCreate.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const createChartSuccess = useStoreState(
    (state) => state.charts.ChartCreate.success
  );
  const editChartSuccess = useStoreState(
    (state) => state.charts.ChartUpdate.success
  );
  const editChartClear = useStoreActions(
    (actions) => actions.charts.ChartUpdate.clear
  );
  const resetAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.reset
  );
  const resetMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );
  const resetChartType = useStoreActions(
    (actions) => actions.charts.chartType.reset
  );
  const resetDataset = useStoreActions(
    (actions) => actions.charts.dataset.reset
  );
  const datasets = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGetList.crudData ??
        []) as DatasetListItemAPIModel[]
  );
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  const resetEnabledFilterOptionGroups = useStoreActions(
    (actions) => actions.charts.enabledFilterOptionGroups.clear
  );

  const config = get(routeToConfig, `["${view}"]`, routeToConfig.preview);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const content = React.useMemo(
    () => get(chartFromAPI, "renderedContent", ""),
    [chartFromAPI]
  );

  const dataTypes2 = React.useMemo(() => {
    if (isEmpty(dataTypes)) {
      return dataTypesFromRenderedChart;
    }
    return dataTypes;
  }, [dataTypes, dataTypesFromRenderedChart]);

  const deselectDataset = () => {
    setDataset(null);
    setDataError(false);
    setNotFound(false);
  };

  const onSave = () => {
    const chart = {
      name: chartName,
      authId: user?.sub,
      vizType: chartType,
      mapping,
      datasetId: dataset,
      vizOptions: visualOptions || {},
      appliedFilters,
      enabledFilterOptionGroups,
    };
    if (view !== undefined && page !== "new") {
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
  };

  //handles what happens after chart is created or edited
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if ((editChartSuccess || createChartSuccess) && chartFromReport.state) {
      //returns back to persisted report view
      setRightPanelView("charts");
      history.push(`/report/${chartFromReport.page}/edit`);
    } else if (editChartSuccess && !chartFromReport.state) {
      //returns back to chart detail page
      setSavedChanges(true);
      timeout = setTimeout(() => {
        setSavedChanges(false);
      }, 3000);
      // history.push(`/chart/${page}`);
    } else if (
      createChartSuccess &&
      !chartFromReport.state &&
      createChartData.id
    ) {
      //returns back to chart detail page
      console.log("herrr");
      createChartClear();
      history.replace(`/chart/${createChartData.id}/mapping`);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [editChartSuccess, createChartSuccess, createChartData]);

  React.useEffect(() => {
    //empty chart when chart type and or  dataset types changes
    setChartFromAPI(null);
  }, [chartType, dataTypes]);

  React.useEffect(() => {
    //set chart name to selected dataset if chart name has not been focused
    if (page === "new" && !hasSubHeaderTitleFocused && dataset) {
      const datasetName = datasets.find((d) => d.id === dataset)?.name;
      setChartName(datasetName as string);
    }
    if (isEmpty(dataset) && page === "new" && !hasSubHeaderTitleFocused) {
      setChartName("Untitled Chart");
    }
    //resets mapping and applied filters when dataset becomes null
    if (dataset === null) {
      resetMapping();
      resetAppliedFilters();
    }
  }, [dataset]);

  React.useEffect(() => {
    //set chart name to loaded chart name
    if (page !== "new" && loadedChart.name.length > 0) {
      setChartName(loadedChart.name);
    }
    //set mapping from loaded chart as it always has the complete mapping values
    //TODO: This will need to change when we have the complete mapping values for big number
    if (loadedChart.vizType === "bigNumber") {
      setMapping(loadedChart.mapping);
    }
  }, [loadedChart]);

  const mappedData = React.useMemo(
    () => get(chartFromAPI, "mappedData", ""),
    [chartFromAPI]
  );

  const filterOptionGroups = React.useMemo(
    () => get(chartFromAPI, "filterOptionGroups", []),
    [chartFromAPI]
  );

  const renderedChart = React.useMemo(() => {
    return chartFromAPI
      ? chartFromAPI.renderedContent
      : get(chartFromAPI, "content", "");
  }, [chartFromAPI]);

  const renderedChartMappedData = React.useMemo(() => {
    return get(chartFromAPI, "mappedData", []);
  }, [chartFromAPI]);

  const renderedChartSsr = React.useMemo(() => {
    return get(chartFromAPI, "ssr", false);
  }, [chartFromAPI]);

  const activeRenderedChartSsr = React.useMemo(
    () => Boolean(renderedChartSsr),
    [renderedChartSsr]
  );

  function setVisualOptionsOnChange() {
    const options = {
      ...getOptionsConfig(
        get(charts, chartType ?? "echartsBarchart", charts.echartsBarchart)
          .visualOptions
      ),
      ...get(defaultChartOptions, chartType ?? "echartsBarchart", {}),
    };
    const defaultOptionsValues = getDefaultOptionsValues(options);

    let tmpVisualOptions: any = { ...(visualOptions || defaultOptionsValues) };
    tmpVisualOptions = {
      ...defaultOptionsValues,
      ...tmpVisualOptions,
      width: defaultOptionsValues.width,
    };
    setVisualOptions(tmpVisualOptions);
  }

  function addVizToLocalStates() {
    setVisualOptions({});
  }

  async function clear() {
    sessionStorage.setItem("visualOptions", JSON.stringify({}));
    // resetDataset();
    // resetMapping();
    // resetChartType();
    // resetAppliedFilters();
    // resetEnabledFilterOptionGroups();
    clearChart();
    createChartClear();
    editChartClear();
    setChartName("Untitled Chart");
    setDataError(false);
    setNotFound(false);
  }

  const clearNonAsyncStates = () => {
    const resetStates = async () => {
      resetDataset();
      resetMapping();
      resetChartType();
      resetAppliedFilters();
      resetEnabledFilterOptionGroups();
    };
    resetStates().then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(" clear non async states", dataset, chartType);
      }
    });
  };

  React.useEffect(() => {
    const handlePageExit = () => {
      clearNonAsyncStates();
    };

    // ComponentWillUnmount equivalent
    return () => {
      if (!createChartSuccess) {
        handlePageExit();
      }
    };
  }, []);

  React.useEffect(() => {
    // Updates visual options width when container width changes
    // This adjusts the width of the chart when the toolbox is open or closed
    const visualOptionsWidth = get(visualOptions, "width", 0);
    const containerWidth = containerRef.current?.clientWidth;

    if (containerRef.current && visualOptionsWidth !== containerWidth) {
      // Sets only when container width is different from visual options width
      const tmpVisualOptions = {
        ...visualOptions,
        width: containerWidth,
      };
      setVisualOptions(tmpVisualOptions);
    }
  }, [visualOptions, containerRef.current?.clientWidth]);

  const { ref } = useResizeObserver<HTMLDivElement>();

  function clearChartBuilder() {
    clear().then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "End of reset.",
          "--visualOptions",
          visualOptions,
          chartName
        );
      }
    });
  }

  React.useEffect(() => {
    if (!loading && chartType) {
      setVisualOptionsOnChange();
    }
  }, [chartType, loading]);
  console.log(createChartSuccess, "createChartSuccess");

  React.useEffect(() => {
    if (page !== "new") {
      if (!isLoading) {
        if (token.length > 0) {
          loadChart({ token, getId: page });
        } else if (!isAuthenticated) {
          loadChart({ nonAuthCall: true, getId: page });
        }
      } else {
        clearChart();
      }
    }
    return () => {
      clearChartBuilder();
    };
  }, [page, token, isLoading, isAuthenticated]);

  const errorComponent = () => {
    return (
      <div css={commonStyles.container}>
        <div
          css={
            location.pathname === `/chart/${page}`
              ? ""
              : commonStyles.innercontainer
          }
        >
          <div
            css={`
              height: 362.598px;
              background: #dfe3e5;
              margin: auto;
              margin-top: 5%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #e75656;
              font-size: 14px;
              line-height: 20px;
              font-weight: bold;
              font-family: "GothamNarrow-Bold", sans-serif;
              text-align: center;
              button {
                outline: none;
                border: none;
                background: transparent;
                cursor: pointer;
                text-decoration: underline;
              }
              p {
                margin-top: 18px;
              }
            `}
          >
            <ErrorOutlineIcon htmlColor="#E75656" fontSize="large" />
            {notFound || (dataError && <p>{chartErrorMessage}</p>)}
          </div>
        </div>
      </div>
    );
  };

  if (chartError401 || error401) {
    return (
      <>
        <div css="width: 100%; height: 100px;" />
        <NotAuthorizedMessageModule asset="chart" />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ChartSubheaderToolbar
        visualOptions={visualOptions}
        name={chartName}
        setName={setChartName}
        setHasSubHeaderTitleFocused={setHasSubHeaderTitleFocused}
        isPreviewView={isPreviewView}
        dimensions={dimensions}
        setAutoSaveState={setAutoSaveState}
        autoSave={autoSaveState.isAutoSaveEnabled}
        showAutoSaveSwitch={autoSaveState.showAutoSaveSwitch}
        onSave={onSave}
        savedChanges={savedChanges}
      />
      <ChartModuleToolBox
        rawViz={rawViz}
        data={sampleData}
        chartName={chartName}
        dataTypes={dataTypes2}
        mappedData={mappedData}
        loadDataset={loadDataset}
        textView={config.textView}
        dataSteps={config.dataSteps}
        guideView={config.guideView}
        openPanel={config.openPanel}
        visualOptions={visualOptions}
        exportView={config.exportView}
        loadChartDataFromAPI={loadChartDataFromAPI}
        setVisualOptions={setVisualOptions}
        loading={loading || isChartLoading}
        filterOptionGroups={filterOptionGroups}
        addVizToLocalStates={addVizToLocalStates}
        openToolbox={toolboxOpen}
        setToolboxOpen={setToolboxOpen}
        dimensions={dimensions}
        setChartFromAPI={setChartFromAPI}
        setDatasetName={setChartName}
        onClose={() => setToolboxOpen(false)}
        onOpen={() => setToolboxOpen(true)}
        deselectDataset={deselectDataset}
        setAutoSaveState={setAutoSaveState}
        showAutoSaveSwitch={autoSaveState.showAutoSaveSwitch}
        onSave={onSave}
      />

      <div
        css={`
          height: 50px;
        `}
      />
      <Container>
        <div
          css={`
            top: 50px;
            position: relative;
            width: ${toolboxOpen
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};

            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
          `}
          ref={ref}
        >
          {dataError || notFound ? (
            <>{errorComponent()}</>
          ) : (
            <Switch>
              {(isSaveLoading || isChartLoading) && <PageLoader />}

              <Route path="/chart/:page/customize">
                <ChartBuilderCustomize
                  loading={loading}
                  dimensions={dimensions}
                  mappedData={mappedData}
                  containerRef={containerRef}
                  renderedChart={content}
                  visualOptions={visualOptions}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  renderedChartType={chartType as ChartType}
                  setChartErrorMessage={setChartErrorMessage}
                  setNotFound={setNotFound}
                />
              </Route>

              <Route path="/chart/:page/filters">
                <ChartBuilderFilters
                  loading={loading}
                  renderedChart={content}
                  dimensions={dimensions}
                  visualOptions={visualOptions}
                  containerRef={containerRef}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  renderedChartType={chartType as ChartType}
                  setChartErrorMessage={setChartErrorMessage}
                  setNotFound={setNotFound}
                />
              </Route>
              <Route path="/chart/:page/mapping">
                <ChartBuilderMapping
                  loading={loading}
                  visualOptions={visualOptions}
                  setVisualOptions={setVisualOptions}
                  dimensions={dimensions}
                  renderedChart={content}
                  containerRef={containerRef}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  renderedChartType={chartType as ChartType}
                  setChartErrorMessage={setChartErrorMessage}
                  setNotFound={setNotFound}
                />
              </Route>
              <Route path="/chart/:page/chart-type">
                <ChartBuilderChartType loading={loading} />
              </Route>
              <Route path="/chart/:page/preview-data">
                <ChartBuilderPreview
                  loading={loading}
                  data={sampleData}
                  loadDataset={loadDataset}
                  stats={dataStats}
                  filterOptionGroups={filterOptionGroups}
                />
              </Route>
              <Route path="/chart/:page/data">
                <ChartModuleDataView
                  loadDataset={loadDataset}
                  clearChartBuilder={clearChartBuilder}
                />
              </Route>
              <Route path="/chart/:page/preview">
                <ChartBuilderPreviewTheme
                  loading={loading || isChartLoading}
                  visualOptions={visualOptions}
                  renderedChart={renderedChart}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={renderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  editable={!isPreviewMode || (page === "new" && !view)}
                  setIsPreviewView={setIsPreviewView}
                  containerRef={containerRef}
                />
              </Route>
              <Route path="/chart/:page">
                <ChartBuilderPreviewTheme
                  loading={loading || isChartLoading}
                  visualOptions={visualOptions}
                  renderedChart={renderedChart}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={renderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  editable={!isPreviewMode}
                  setIsPreviewView={setIsPreviewView}
                  containerRef={containerRef}
                />
              </Route>
              <Route path="*">
                <NoMatchPage />
              </Route>
            </Switch>
          )}
        </div>
      </Container>
    </DndProvider>
  );
}
