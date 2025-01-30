/* third-party */
import React from "react";
import get from "lodash/get";
import { DndProvider } from "react-dnd";
import { useAuth0 } from "@auth0/auth0-react";
import { useSessionStorage } from "react-use";
import Container from "@material-ui/core/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  Switch,
  Route,
  useParams,
  useHistory,
  matchPath,
} from "react-router-dom";
import {
  getOptionsConfig,
  getDefaultOptionsValues,
  // @ts-ignore
} from "@rawgraphs/rawgraphs-core";
/* project */
import { PageLoader } from "app/modules/common/page-loader";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import { NoMatchPage } from "app/modules/common/no-match-page";
import ChartModuleDataView from "app/modules/chart-module/routes/select-data";
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
  ChartRenderedItem,
  defaultChartOptions,
  chartViews,
  chartPaths,
} from "app/modules/chart-module/data";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { isEmpty } from "lodash";
import useResizeObserver from "use-resize-observer";
import { ChartType } from "app/modules/chart-module/components/common-chart";
import { getRequiredFieldsAndErrors } from "app/modules/chart-module/routes/mapping/utils";
import axios from "axios";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  chartFromStoryAtom,
  isChartAIAgentActive,
  isChartAutoMappedAtom,
  planDialogAtom,
} from "app/state/recoil/atoms";
import { IDatasetDetails } from "./components/toolbox/steps/panels-content/SelectDataset";
import { APPLICATION_JSON } from "app/state/api";

export default function ChartModule() {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const history = useHistory();
  const { page, view } = useParams<{ page: string; view?: string }>();
  const isValidView = Object.values(chartViews).find((v) => v === view);
  const [chartFromAPI, setChartFromAPI] =
    React.useState<ChartRenderedItem | null>(null);
  const [visualOptions, setVisualOptions] = useSessionStorage<any>(
    "visualOptions",
    {}
  );

  const setPlanDialog = useSetRecoilState(planDialogAtom);
  const [rawViz, setRawViz] = React.useState<any>(null);
  const [toolboxOpen, setToolboxOpen] = React.useState(Boolean(isValidView));
  const [savedChanges, setSavedChanges] = React.useState<boolean>(false);
  const defaultChartTitle = "Untitled Chart";
  const [chartName, setChartName] = React.useState(defaultChartTitle);
  const [isPreviewView, setIsPreviewView] = React.useState(false);
  const [hasSubHeaderTitleFocused, setHasSubHeaderTitleFocused] =
    React.useState(false);

  const [isLoadedChartMappingValid, setIsLoadedChartMappingValid] =
    React.useState<null | boolean>(false);

  const chartType = useStoreState((state) => state.charts.chartType.value);
  const setChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const datasetId = useStoreState((state) => state.charts.dataset.value);

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
    setDataTypes,
    dataStats,
    sampleData,
    isPreviewMode,
    loadDataset,
    renderChartFromAPI,
    error401,
    setDataError,
    setChartError,
    chartError,
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
    isLoadedChartMappingValid,
    setIsLoadedChartMappingValid,
  });

  const isSaveLoading = useStoreState(
    (state) => state.charts.ChartCreate.loading
  );

  const [chartLoading, setChartLoading] = React.useState<boolean | null>(null);
  const isChartLoading = useStoreState(
    (state) => state.charts.ChartGet.loading
  );
  const editView = !!(page !== "new" && view);
  const [autoSaveState, setAutoSaveState] = React.useState({
    isAutoSaveEnabled: editView || false,
    enableAutoSaveSwitch: editView || false,
  });
  const clearChartTypesSuggestions = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.clear
  );
  const isAiSwitchActive = useRecoilValue(isChartAIAgentActive);
  const resetIsChartAutoMapped = useResetRecoilState(isChartAutoMappedAtom);
  const selectedAIChart = useStoreState(
    (state) => state.charts.SelectedAIChartState.value
  );

  const [chartFromStory, setChartFromStory] =
    useRecoilState(chartFromStoryAtom);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const setAllAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.setAll
  );
  const enabledFilterOptionGroups = useStoreState(
    (state) => state.charts.enabledFilterOptionGroups.value
  );
  const loadChart = useStoreActions((actions) => actions.charts.ChartGet.fetch);

  const loadedChart = useStoreState(
    (state) => state.charts.ChartGet.crudData as ChartAPIModel
  );

  const chartError401 = useStoreState(
    (state) =>
      get(state.charts.ChartGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.charts.ChartGet.crudData, "error", "") === "Unauthorized"
  );

  const errorChartName = useStoreState((state) =>
    get(state.charts.ChartGet.crudData, "name", "")
  );
  const editChart = useStoreActions(
    (actions) => actions.charts.ChartUpdate.patch
  );
  const editChartCrudData = useStoreState(
    (state) => state.charts.ChartUpdate.crudData
  ) as ChartAPIModel;
  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );
  const createChartClear = useStoreActions(
    (actions) => actions.charts.ChartCreate.clear
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
  const clearDatasetDetails = useStoreActions(
    (state) => state.dataThemes.DatasetGet.clear
  );
  const setSelectedAIChart = useStoreActions(
    (actions) => actions.charts.SelectedAIChartState.setValue
  );
  const setDatasetId = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const datasetDetail = useStoreState(
    (state) => state.dataThemes.DatasetGet.crudData
  ) as IDatasetDetails;

  const resetEnabledFilterOptionGroups = useStoreActions(
    (actions) => actions.charts.enabledFilterOptionGroups.clear
  );
  const { updRequiredFields, updMinValuesFields } = getRequiredFieldsAndErrors(
    mapping,
    dimensions
  );
  const isMappingValid =
    updRequiredFields.length === 0 && updMinValuesFields.length === 0;

  const config = get(routeToConfig, `["${view}"]`, routeToConfig.preview);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

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
    setDatasetId(null);
    setChartFromAPI(null);
    setDataError(false);
    setChartError(false);
    clearDatasetDetails();
  };

  React.useEffect(() => {
    if (!isChartLoading && chartLoading === null) {
      return;
    }
    setChartLoading(isChartLoading);
  }, [isChartLoading]);

  const onSave = async () => {
    const chart = {
      name: chartName,
      authId: user?.sub,
      vizType: chartType,
      mapping,
      datasetId,
      vizOptions: visualOptions || {},
      dataTypes: dataTypes2,
      appliedFilters,
      enabledFilterOptionGroups,
      isMappingValid,
      isAIAssisted: selectedAIChart,
    };
    if (page === "new") {
      try {
        return await axios.post(`${process.env.REACT_APP_API}/chart/`, chart, {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.log(e);
      }
    } else if (view !== undefined) {
      editChart({
        token,
        patchId: page,
        values: chart,
      });
    }
  };

  const onTriggerAutoSave = async () => {
    try {
      setAutoSaveState({
        isAutoSaveEnabled: true,
        enableAutoSaveSwitch: true,
      });
      if (page === "new") {
        const response = await onSave();
        const data = response?.data?.data;
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        if (response?.data.planWarning) {
          setPlanDialog({
            open: true,
            message: response.data.planWarning,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        history.push(
          `/chart/${data.id}/mapping${
            chartFromStory.state
              ? `?fromstory=true&page=${chartFromStory.page}`
              : ""
          }`
        );
      } else {
        onSave();
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    //handles what happens after chart is created or edited
    let timeout: NodeJS.Timeout;
    if (editChartSuccess) {
      setSavedChanges(true);
      timeout = setTimeout(() => {
        setSavedChanges(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [editChartSuccess]);

  React.useEffect(() => {
    //set chart name to selected dataset if chart name has not been focused
    if (page === "new" && !hasSubHeaderTitleFocused && datasetDetail) {
      setChartName(datasetDetail?.name as string);
    }
    if (isEmpty(datasetId) && page === "new" && !hasSubHeaderTitleFocused) {
      setChartName(defaultChartTitle);
    }
    //resets mapping and applied filters when dataset becomes null
    if (datasetId === null) {
      resetMapping();
      resetAppliedFilters();
    }
  }, [datasetId, datasetDetail]);

  React.useEffect(() => {
    //retrieve chart details from loadedChart details
    if (loadedChart) {
      if (page !== "new" && loadedChart?.name.length > 0) {
        setChartName(loadedChart.name);
      }
      loadDataset(loadedChart.datasetId!);
      setSelectedAIChart(loadedChart.isAIAssisted);
      setIsLoadedChartMappingValid(loadedChart.isMappingValid);
      setChartType(loadedChart.vizType);
      setDatasetId(loadedChart.datasetId);
      setMapping(loadedChart.mapping);
      setAllAppliedFilters(loadedChart.appliedFilters);
      setVisualOptions(loadedChart.vizOptions);
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

  function setVisualOptionsOnChange(chartType: string | null = null) {
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

  async function clear() {
    sessionStorage.setItem("visualOptions", JSON.stringify({}));
    resetDataset();
    resetMapping();
    resetChartType();
    resetAppliedFilters();
    resetEnabledFilterOptionGroups();
    clearChart();
    createChartClear();
    editChartClear();
    clearDatasetDetails();
    clearChartTypesSuggestions();
    setChartName(defaultChartTitle);
    setDataError(false);
    setChartError(false);
    setDataTypes([]);
    resetIsChartAutoMapped();
    setChartFromStory((prev) => ({
      ...prev,
      state: false,
      page: "",
      view: "",
    }));
  }
  function clearChartBuilder() {
    console.log("--about to reset chart states");
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

  React.useEffect(() => {
    if (page !== "new") {
      if (!isLoading) {
        if (token.length > 0) {
          console.log("---load chart");
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

  if (chartError401 || error401) {
    return (
      <>
        <div css="width: 100%; height: 48px;" />
        <NotAuthorizedMessageModule
          asset="chart"
          action="view"
          name={errorChartName}
        />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ChartSubheaderToolbar
        visualOptions={visualOptions}
        isAiSwitchActive={isAiSwitchActive}
        name={chartName}
        setName={setChartName}
        setHasSubHeaderTitleFocused={setHasSubHeaderTitleFocused}
        isPreviewView={isPreviewView}
        dimensions={dimensions}
        setAutoSaveState={setAutoSaveState}
        autoSave={autoSaveState.isAutoSaveEnabled}
        enableAutoSaveSwitch={autoSaveState.enableAutoSaveSwitch}
        onSave={onSave}
        savedChanges={savedChanges}
        isMappingValid={isMappingValid}
      />
      {isChartLoading || isSaveLoading ? (
        <PageLoader />
      ) : (
        <>
          {chartLoading === null ||
          canChartEditDelete ||
          !!matchPath(window.location.pathname, {
            path: "/chart/:page",
            exact: true,
            strict: true,
          }) ||
          page === "new" ? (
            <>
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
                renderChartFromAPI={renderChartFromAPI}
                setVisualOptions={setVisualOptions}
                loading={loading || isChartLoading}
                filterOptionGroups={filterOptionGroups}
                openToolbox={toolboxOpen}
                setToolboxOpen={setToolboxOpen}
                dimensions={dimensions}
                setChartFromAPI={setChartFromAPI}
                setDatasetName={setChartName}
                onClose={() => setToolboxOpen(false)}
                onOpen={() => setToolboxOpen(true)}
                deselectDataset={deselectDataset}
                onSave={onSave}
                triggerAutoSave={onTriggerAutoSave}
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
                    @media (min-width: 768px) {
                      @media (max-width: 1024px) {
                        width: 100%;
                      }
                    }
                  `}
                  ref={ref}
                >
                  <Switch>
                    <Route exact path={chartPaths.customize}>
                      <ChartBuilderCustomize
                        loading={loading}
                        dimensions={dimensions}
                        mappedData={mappedData}
                        containerRef={containerRef}
                        renderedChart={content}
                        visualOptions={visualOptions}
                        setVisualOptions={setVisualOptions}
                        renderedChartMappedData={renderedChartMappedData}
                        renderedChartType={chartType as ChartType}
                        setChartErrorMessage={setChartErrorMessage}
                        setChartError={setChartError}
                        isAIAssistedChart={editChartCrudData?.isAIAssisted}
                        dataError={dataError}
                        chartError={chartError}
                        chartErrorMessage={chartErrorMessage}
                      />
                    </Route>

                    <Route exact path={chartPaths.filters}>
                      <ChartBuilderFilters
                        loading={loading}
                        renderedChart={content}
                        dimensions={dimensions}
                        visualOptions={visualOptions}
                        containerRef={containerRef}
                        setVisualOptions={setVisualOptions}
                        renderedChartMappedData={renderedChartMappedData}
                        renderedChartType={chartType as ChartType}
                        setChartErrorMessage={setChartErrorMessage}
                        setChartError={setChartError}
                        isAIAssistedChart={editChartCrudData?.isAIAssisted}
                        dataError={dataError}
                        chartError={chartError}
                        chartErrorMessage={chartErrorMessage}
                      />
                    </Route>
                    <Route exact path={chartPaths.mapping}>
                      <ChartBuilderMapping
                        loading={loading}
                        visualOptions={visualOptions}
                        setVisualOptions={setVisualOptions}
                        dimensions={dimensions}
                        renderedChart={content}
                        containerRef={containerRef}
                        renderedChartMappedData={renderedChartMappedData}
                        renderedChartType={chartType as ChartType}
                        setChartErrorMessage={setChartErrorMessage}
                        setChartError={setChartError}
                        isAIAssistedChart={editChartCrudData?.isAIAssisted}
                        dataError={dataError}
                        chartError={chartError}
                        chartErrorMessage={chartErrorMessage}
                      />
                    </Route>
                    <Route exact path={chartPaths.chartType}>
                      <ChartBuilderChartType
                        loading={loading}
                        loadDataset={loadDataset}
                        setChartFromAPI={setChartFromAPI}
                        setVisualOptions={setVisualOptions}
                        dataTypes={dataTypes2}
                        setVisualOptionsOnChange={setVisualOptionsOnChange}
                      />
                    </Route>
                    <Route exact path={chartPaths.previewData}>
                      <ChartBuilderPreview
                        loading={loading}
                        data={sampleData}
                        loadDataset={loadDataset}
                        stats={dataStats}
                        dataTypes={dataTypes2}
                        filterOptionGroups={filterOptionGroups}
                        dataError={dataError}
                        chartError={chartError}
                        chartErrorMessage={chartErrorMessage}
                      />
                    </Route>
                    <Route exact path={chartPaths.data}>
                      <ChartModuleDataView
                        loadDataset={loadDataset}
                        toolboxOpen={toolboxOpen}
                        setChartFromAPI={setChartFromAPI}
                      />
                    </Route>
                    <Route exact path={chartPaths.preview}>
                      <ChartBuilderPreviewTheme
                        loading={loading || isChartLoading}
                        visualOptions={visualOptions}
                        renderedChart={renderedChart}
                        setVisualOptions={setVisualOptions}
                        renderedChartMappedData={renderedChartMappedData}
                        editable={!isPreviewMode || (page === "new" && !view)}
                        setIsPreviewView={setIsPreviewView}
                        containerRef={containerRef}
                        loadedChart={loadedChart}
                        isMappingValid={isMappingValid}
                        view={view}
                        isAIAssistedChart={editChartCrudData?.isAIAssisted}
                        dataError={dataError}
                        chartError={chartError}
                        chartErrorMessage={chartErrorMessage}
                      />
                    </Route>
                    <Route exact path={chartPaths.detail}>
                      <ChartBuilderPreviewTheme
                        loading={loading || isChartLoading}
                        visualOptions={visualOptions}
                        renderedChart={renderedChart}
                        setVisualOptions={setVisualOptions}
                        renderedChartMappedData={renderedChartMappedData}
                        editable={!isPreviewMode}
                        setIsPreviewView={setIsPreviewView}
                        containerRef={containerRef}
                        loadedChart={loadedChart}
                        isMappingValid={isMappingValid}
                        view={view}
                        isAIAssistedChart={
                          editChartCrudData?.isAIAssisted ??
                          loadedChart?.isAIAssisted
                        }
                        dataError={dataError}
                        chartError={chartError}
                        chartErrorMessage={chartErrorMessage}
                      />
                    </Route>
                    <Route path="*">
                      <NoMatchPage />
                    </Route>
                  </Switch>
                </div>
              </Container>
            </>
          ) : (
            <>
              <div css="width: 100%; height: 100px;" />
              <NotAuthorizedMessageModule asset="chart" action="edit" />
            </>
          )}
        </>
      )}
    </DndProvider>
  );
}
