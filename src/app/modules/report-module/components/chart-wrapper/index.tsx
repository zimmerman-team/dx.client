import React from "react";
import get from "lodash/get";
import Skeleton from "@material-ui/lab/Skeleton";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import {
  ChartAPIModel,
  ChartRenderedItem,
  emptyChartAPI,
} from "app/modules/chart-module/data";

interface Props {
  id: string;
  width: string;
  chartPreviewInReport?: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
}

export function ReportChartWrapper(props: Props) {
  const token = useStoreState((state) => state.AuthToken.value);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartName, setChartName] = React.useState<string>("");
  const loadChart = useStoreActions((actions) => actions.charts.ChartGet.fetch);
  const chartError = useStoreState((state) => state.charts.ChartGet.errorData);

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );

  const [rawViz, setRawViz] = React.useState<any>(null);
  const [visualOptions, setVisualOptions] = React.useState({});

  const [chartFromAPI, setChartFromAPI] =
    React.useState<ChartRenderedItem | null>(null);

  const renderedChart = React.useMemo(() => {
    return chartFromAPI
      ? chartFromAPI.renderedContent
      : get(chartFromAPI, "content", "");
  }, [chartFromAPI]);

  const resetAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.reset
  );

  const renderedChartMappedData = React.useMemo(() => {
    return get(chartFromAPI, "mappedData", []);
  }, [chartFromAPI]);

  const renderedChartSsr = React.useMemo(() => {
    return get(chartFromAPI, "ssr", false);
  }, [chartFromAPI]);

  const renderedChartType = React.useMemo(() => {
    return get(chartFromAPI, "vizType", "echartsBarchart");
  }, [chartFromAPI]);

  const displayChartName =
    renderedChartType !== "bigNumber" && !props.chartPreviewInReport;

  React.useEffect(() => {
    if (loadedChart && loadedChart.id !== "" && loadedChart.id === props.id) {
      if (loadedChart.name.length > 0) {
        setChartName(loadedChart.name);
      }
    }
  }, [loadedChart]);

  const {
    loadChartDataFromAPI,
    loading,
    notFound,
    setNotFound,
    dataError,
    chartErrorMessage,
    setChartErrorMessage,
  } = useChartsRawData({
    visualOptions,
    setVisualOptions,
    setChartFromAPI,
    chartFromAPI,
    inChartWrapper: true,
  });

  React.useEffect(() => {
    if (token.length > 0) {
      loadChart({ token, getId: props.id });
    }
    return () => {
      clearChart();
    };
  }, [props.id, token]);
  React.useEffect(() => {
    if (notFound || dataError) {
      props.setError(true);
      if ((chartError?.data as any)?.error?.code === "ENTITY_NOT_FOUND") {
        setChartErrorMessage("This chart is no longer available.");
      }
    }
  }, [notFound, dataError]);

  React.useEffect(() => {
    if (props.id) {
      loadChartDataFromAPI(undefined, props.id);
    }
    return () => {
      resetAppliedFilters();
    };
  }, [props.id, token]);

  React.useEffect(() => {
    const visualOptionsWidth = get(visualOptions, "width", 0);
    const containerWidth = containerRef.current?.clientWidth;
    const visualOptionsHeight = get(visualOptions, "height", 0);
    const containerHeight = containerRef.current?.clientHeight;

    if (
      containerRef.current &&
      (visualOptionsWidth !== containerWidth ||
        visualOptionsHeight !== containerHeight)
    ) {
      const tmpVisualOptions = {
        ...visualOptions,
        width: containerWidth,
        height: containerHeight,
      };
      setVisualOptions(tmpVisualOptions);
    }
  }, [
    visualOptions,
    containerRef.current?.clientWidth,
    containerRef.current?.clientHeight,
  ]);

  if (notFound || dataError) {
    return (
      <div
        css={`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #e75656;
          font-size: ${parseInt(props.width) > 250 ? "14px" : "10px"};
          line-height: 15px;
          font-weight: bold;
          font-family: "GothamNarrow-Bold", sans-serif;
          text-align: center;
        `}
      >
        <ErrorOutlineIcon htmlColor="#E75656" fontSize="large" />
        <p>{chartErrorMessage}</p>
      </div>
    );
  }

  if (loading || chartFromAPI === null) {
    return (
      <div
        css={`
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <Skeleton animation="wave" variant="rect" width="100%" height="100%" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-testid="chart-wrapper"
      css={`
        width: 100%;
        height: 100%;

        > div {
          margin: 0 !important;
          overflow: hidden !important;

          :nth-of-type(2) {
            #extra-loader {
              display: none !important;
            }
          }
        }
      `}
    >
      <div
        id="extra-loader"
        css={`
          .MuiSkeleton-wave::after {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(223, 227, 230, 1),
              transparent
            );
          }
        `}
      >
        <Skeleton animation="wave" variant="rect" width="100%" height="100%" />
      </div>

      {displayChartName && (
        <h4
          css={`
            margin: 0;
            margin-bottom: 12px;
            font-family: "GothamNarrow-bold", sans-serif;
            font-size: 14px;
            color: #231d2c;
            letter-spacing: 0.5px;
          `}
        >
          {chartName}
        </h4>
      )}
      <CommonChart
        chartId={props.id}
        setRawViz={setRawViz}
        containerRef={containerRef}
        renderedChart={renderedChart}
        visualOptions={visualOptions}
        renderedChartSsr={renderedChartSsr}
        setVisualOptions={setVisualOptions}
        renderedChartType={renderedChartType}
        renderedChartMappedData={renderedChartMappedData}
        setChartErrorMessage={setChartErrorMessage}
        setNotFound={setNotFound}
        inChartWrapper={true}
        chartPreviewInReport={props.chartPreviewInReport}
      />
    </div>
  );
}
