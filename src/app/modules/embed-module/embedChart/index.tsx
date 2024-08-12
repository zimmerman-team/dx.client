import ChartContainer from "app/components/Dialogs/EmbedChartDialog/chartContainer";
import { emptyChartAPI, ChartAPIModel } from "app/modules/chart-module/data";
import { getDatasetDetailsSource } from "app/modules/chart-module/util/getDatasetDetailsSource";
import { useLoadDatasetDetails } from "app/modules/report-module/components/chart-wrapper/useLoadDatasetDetailsAPI";
import { useRenderChartFromAPI } from "app/modules/report-module/components/chart-wrapper/useRenderChartFromAPI";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { get } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";

export default function EmbedChartRoute() {
  const { chartId, datasetId } =
    useParams<{ chartId: string; datasetId: string }>();
  const { ref } = useResizeObserver<HTMLDivElement>();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { datasetDetails } = useLoadDatasetDetails(datasetId, undefined);
  const loadChart = useStoreActions(
    (actions) => actions.charts.ChartGetInReport.fetch
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGetInReport.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGetInReport.clear
  );
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
  } = useRenderChartFromAPI(undefined, chartId);

  React.useEffect(() => {
    loadChart({ nonAuthCall: true, getId: chartId });

    return () => {
      clearChart();
    };
  }, [chartId]);

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
  let newVisualOptions = visualOptions;

  const { sourceUrl, filename } = getDatasetDetailsSource(
    datasetDetails,
    undefined
  );
  if (containerRef.current) {
    newVisualOptions = {
      ...visualOptions,
      height: containerRef.current.clientHeight,
    };
  }
  return (
    <div
      css={`
        height: 95vh;
      `}
    >
      <div
        ref={ref}
        css={`
          height: 90vh;
          width: 100%;
          padding: 16px 0;
          gap: 4px;
          padding: 24px;
          > p {
            color: #231d2c;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 18px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0;
            margin-bottom: 16px;
          }
        `}
      >
        <p title={loadedChart.name}>{loadedChart.name}</p>

        <ChartContainer
          chartFromAPI={chartFromAPI!}
          chartId={chartId}
          chartName={loadedChart.name}
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
          padding: 0 24px;
          height: 2vh;
        `}
      >
        {dataError || notFound ? (
          <></>
        ) : (
          <p
            id={`datasource-${loadedChart.id || "1"}`}
            css={`
              color: #70777e;
              font-family: "GothamNarrow-Bold", sans-serif;
              font-size: 12px;
              margin: 0;
              a {
                font-family: "GothamNarrow-Bold", sans-serif;
                color: #70777e;
                text-decoration: none;
                border-bottom: 1px solid #70777e;
              }
            `}
          >
            Source:{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {datasetDetails?.source ?? datasetDetails.source} - Data file:{" "}
              {filename}
            </a>
          </p>
        )}
        <div
          css={`
            height: 16px;
          `}
        />
        <div>
          <img src="/logo.svg" alt={"app-logo"} />
        </div>
      </div>
    </div>
  );
}
