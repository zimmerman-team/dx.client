/* third-party */
import React from "react";
import get from "lodash/get";
import { DndProvider } from "react-dnd";
import { useAuth0 } from "@auth0/auth0-react";
import { useSessionStorage } from "react-use";
import Container from "@material-ui/core/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Switch, Route, useParams } from "react-router-dom";
import {
  getOptionsConfig,
  getDefaultOptionsValues,
  // @ts-ignore
} from "@rawgraphs/rawgraphs-core";
/* project */
import { PageLoader } from "app/modules/common/page-loader";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import { NoMatchPage } from "app/modules/common/no-match-page";
import ChartBuilderLock from "app/modules/chart-module/routes/lock";
import ChartModuleDataView from "app/modules/chart-module/routes/data";
import { SubheaderToolbar } from "../common/subheader-toolbar";
import ChartBuilderExport from "app/modules/chart-module/routes/export";
import ChartBuilderMapping from "app/modules/chart-module/routes/mapping";
import ChartBuilderFilters from "app/modules/chart-module/routes/filters";
import ChartBuilderCustomize from "app/modules/chart-module/routes/customize";
import { ChartBuilderPreview } from "app/modules/chart-module/routes/preview";
import ChartBuilderChartType from "app/modules/chart-module/routes/chart-type";
import { ChartModuleToolBox } from "app/modules/chart-module/components/toolbox";
import { ChartBuilderPreviewTheme } from "app/modules/chart-module/routes/preview-theme";
import { getRequiredFieldsAndErrors } from "app/modules/chart-module/routes/mapping/utils";
import {
  charts,
  ChartAPIModel,
  routeToConfig,
  emptyChartAPI,
  ChartRenderedItem,
  defaultChartOptions,
} from "app/modules/chart-module/data";
import { IHeaderDetails } from "../report-module/components/right-panel/data";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { useRecoilState } from "recoil";
import { loadedDatasetsAtom } from "app/state/recoil/atoms";
import { isEmpty } from "lodash";
import { DatasetListItemAPIModel } from "../data-themes-module/sub-modules/list";

export default function ChartModule() {
  const { isLoading, isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const { page, view } = useParams<{ page: string; view?: string }>();
  const [chartFromAPI, setChartFromAPI] =
    React.useState<ChartRenderedItem | null>(null);
  const [visualOptions, setVisualOptions] = useSessionStorage<any>(
    "visualOptions",
    {}
  );
  const [rawViz, setRawViz] = React.useState<any>(null);
  const [toolboxOpen, setToolboxOpen] = React.useState(Boolean(view));

  const [chartName, setChartName] = React.useState("Untitled Chart");
  const [isPreviewView, setIsPreviewView] = React.useState(false);
  const [hasSubHeaderTitleFocused, setHasSubHeaderTitleFocused] =
    React.useState(false);

  const chartType = useStoreState((state) => state.charts.chartType.value);
  const mapping = useStoreState((state) => state.charts.mapping.value);

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
    isEditMode,
    loadDataset,
    loadChartDataFromAPI,
    error401,
    setDataError,
    setNotFound,
    notFound,
    dataError,
    dataTypesFromRenderedChart,
  } = useChartsRawData({
    visualOptions,
    setVisualOptions,
    setChartFromAPI,
    chartFromAPI,
    dimensions,
  });
  const [chartErrorMessage, setChartErrorMessage] = React.useState(
    "Something went wrong with rendering your chart!"
  );
  const isSaveLoading = useStoreState(
    (state) => state.charts.ChartCreate.loading
  );
  const isChartLoading = useStoreState(
    (state) => state.charts.ChartGet.loading
  );

  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
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
  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );
  const createChartClear = useStoreActions(
    (actions) => actions.charts.ChartCreate.clear
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

  const resetEnabledFilterOptionGroups = useStoreActions(
    (actions) => actions.charts.enabledFilterOptionGroups.clear
  );

  const [loadedDatasets, setLoadedDatasets] =
    useRecoilState(loadedDatasetsAtom);

  const dataset = useStoreState((state) => state.charts.dataset.value);

  const config = get(routeToConfig, `["${view}"]`, routeToConfig.preview);

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

  //empty chart when chart type and dataset types changes
  React.useEffect(() => {
    setChartFromAPI(null);
  }, [chartType, dataTypes]);

  React.useEffect(() => {
    if (dataset === null) {
      resetMapping();
    }
  }, [dataset]);

  //set chart name to selected dataset if chart name has not been focused
  React.useEffect(() => {
    if (page === "new" && !hasSubHeaderTitleFocused && dataset) {
      const datasetName = datasets.find((d) => d.id === dataset)?.name;
      setChartName(datasetName as string);
    }
    if (isEmpty(dataset) && page === "new" && !hasSubHeaderTitleFocused) {
      setChartName("Untitled Chart");
    }
  }, [dataset]);

  //set chart name to loaded chart name
  React.useEffect(() => {
    if (page !== "new" && loadedChart.name.length > 0) {
      setChartName(loadedChart.name);
    }
  }, [loadedChart]);

  React.useEffect(() => {
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
      width:
        !visualOptions.width ||
        visualOptions.width === defaultOptionsValues.width
          ? defaultOptionsValues.width
          : visualOptions.width,
    };
    setVisualOptions(tmpVisualOptions);
  }

  function addVizToLocalStates() {
    setVisualOptions({});
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
    setChartName("Untitled Chart");
    setDataError(false);
    setNotFound(false);
  }

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

  function getForceEnabledPreviewValue(param?: string) {
    if (param === "preview") {
      return true;
    }
    if (param === "mapping") {
      const { updRequiredFields, updMinValuesFields } =
        getRequiredFieldsAndErrors(mapping, dimensions);
      return updRequiredFields.length === 0 && updMinValuesFields.length === 0;
    }
    return false;
  }

  React.useEffect(() => {
    if (!loading && chartType) {
      setVisualOptionsOnChange();
    }
  }, [chartType, loading]);

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
              font-family: "Gotham Narrow", sans-serif;
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
            {notFound ? (
              <p>
                {chartErrorMessage}
                <br />
                {chartErrorMessage !==
                  "Sankey is a DAG, the original data has cycle!" && (
                  <>
                    <span>
                      <button onClick={() => loadChartDataFromAPI()}>
                        Reload
                      </button>{" "}
                    </span>
                    to try again.
                  </>
                )}
              </p>
            ) : (
              <p>
                Something went wrong with loading your data!
                <br />
                Choose another dataset or upload new.
              </p>
            )}
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
      <SubheaderToolbar
        visualOptions={visualOptions}
        name={chartName}
        setName={setChartName}
        rawViz={rawViz}
        setHasSubHeaderTitleFocused={setHasSubHeaderTitleFocused}
        forceEnablePreviewSave={getForceEnabledPreviewValue(view)}
        appliedHeaderDetails={{} as IHeaderDetails}
        framesArray={[]}
        headerDetails={{} as IHeaderDetails}
        isPreviewView={isPreviewView}
      />
      {view && (
        <ChartModuleToolBox
          rawViz={rawViz}
          data={sampleData}
          chartName={chartName}
          dataTypes={dataTypes2}
          isEditMode={isEditMode}
          mappedData={mappedData}
          loadDataset={loadDataset}
          textView={config.textView}
          dataSteps={config.dataSteps}
          guideView={config.guideView}
          openPanel={config.openPanel}
          visualOptions={visualOptions}
          exportView={config.exportView}
          filtersView={config.filtersView}
          loadChartDataFromAPI={loadChartDataFromAPI}
          setVisualOptions={setVisualOptions}
          loading={loading || isChartLoading}
          filterOptionGroups={filterOptionGroups}
          addVizToLocalStates={addVizToLocalStates}
          previewMode={!isEditMode && page !== "new"}
          openToolbox={toolboxOpen}
          setToolboxOpen={setToolboxOpen}
          dimensions={dimensions}
          setChartFromAPI={setChartFromAPI}
          setDatasetName={setChartName}
          onClose={() => setToolboxOpen(false)}
          onOpen={() => setToolboxOpen(true)}
        />
      )}

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
        >
          {dataError || notFound ? (
            <>{errorComponent()}</>
          ) : (
            <Switch>
              {(isSaveLoading || isChartLoading) && <PageLoader />}
              <Route path="/chart/:page/export">
                <ChartBuilderExport
                  loading={loading}
                  setRawViz={setRawViz}
                  renderedChart={content}
                  visualOptions={visualOptions}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  setChartErrorMessage={setChartErrorMessage}
                  setNotFound={setNotFound}
                />
              </Route>
              <Route path="/chart/:page/customize">
                <ChartBuilderCustomize
                  loading={loading}
                  dimensions={dimensions}
                  mappedData={mappedData}
                  renderedChart={content}
                  visualOptions={visualOptions}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
                  setChartErrorMessage={setChartErrorMessage}
                  setNotFound={setNotFound}
                />
              </Route>
              <Route path="/chart/:page/lock">
                <ChartBuilderLock
                  loading={loading}
                  setRawViz={setRawViz}
                  renderedChart={content}
                  dimensions={dimensions}
                  visualOptions={visualOptions}
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
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
                  setVisualOptions={setVisualOptions}
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
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
                  renderedChartSsr={activeRenderedChartSsr}
                  renderedChartMappedData={renderedChartMappedData}
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
                  editable={isEditMode || (page === "new" && !view)}
                  setIsPreviewView={setIsPreviewView}
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
                  editable={isEditMode || (page === "new" && !view)}
                  setIsPreviewView={setIsPreviewView}
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
