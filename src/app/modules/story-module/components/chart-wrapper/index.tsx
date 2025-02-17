import React from "react";
import get from "lodash/get";
import Skeleton from "@material-ui/lab/Skeleton";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { useRenderChartFromAPI } from "./useRenderChartFromAPI";
import { useLoadDatasetDetails } from "./useLoadDatasetDetailsAPI";
import AIIcon from "app/assets/icons/AIIcon";

interface Props {
  id: string;
  width: string;
  chartPreviewInStory?: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
}

export function StoryChartWrapper(props: Props) {
  const token = useStoreState((state) => state.AuthToken.value);
  const chartNotFoundMessage =
    "This chart has been deleted! You can create or add a new chart from Right Panel.";

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartName, setChartName] = React.useState<string>("");
  const [isAiAssisted, setIsAiAssisted] = React.useState<boolean>(false);
  const loadChart = useStoreActions(
    (actions) => actions.charts.ChartGetInStory.fetch
  );
  const chartError = useStoreState(
    (state) => state.charts.ChartGetInStory.errorData
  );

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGetInStory.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGetInStory.clear
  );
  const [datasetId, setDatasetId] = React.useState<string | null>(null);
  const { datasetDetails } = useLoadDatasetDetails(
    datasetId!,
    token ?? undefined
  );

  const [_rawViz, setRawViz] = React.useState<any>(null);
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
  } = useRenderChartFromAPI(token, props.id);

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

  const displayChartName =
    renderedChartType !== "bigNumber" && !props.chartPreviewInStory;

  React.useEffect(() => {
    if (loadedChart && loadedChart.id !== "" && loadedChart.id === props.id) {
      setIsAiAssisted(loadedChart.isAIAssisted);
      setDatasetId(loadedChart.datasetId);
      if (loadedChart.name.length > 0) {
        setChartName(loadedChart.name);
      }
    }
  }, [loadedChart]);

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
        setChartErrorMessage(chartNotFoundMessage);
      }
    }
  }, [notFound, dataError]);

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
  const message = chartNotFoundMessage;
  const boldText = "create or add a new chart";

  const parts = message.split(boldText);

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
          font-weight: bold;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          text-align: center;
          svg {
            width: 53.3px;
            height: 53.3px;
          }
          h3 {
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 36px;
            margin: 16px 0;
          }
          p {
            font-weight: normal;
            font-size: 18px;
            line-height: normal;
            margin: 0;
            margin-top: 4px;
          }
        `}
      >
        <ErrorOutlineIcon htmlColor="#E75656" fontSize="large" />
        <h3>Error</h3>
        <p>
          {chartErrorMessage === chartNotFoundMessage ? (
            <>
              {parts[0]}
              <b>{boldText}</b>
              {parts[1]}
            </>
          ) : (
            chartErrorMessage
          )}
        </p>
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
        position: relative;
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
            font-family: "GothamNarrow-bold", "Helvetica Neue", sans-serif;
            font-size: 14px;
            color: #231d2c;
            letter-spacing: 0.5px;
            word-break: break-all;
          `}
        >
          {chartName}
        </h4>
      )}
      <div
        css={`
          display: ${isAiAssisted ? "block" : "none"};
          position: absolute;
          right: 4%;
          top: 4%;
        `}
      >
        <AIIcon />
      </div>
      <CommonChart
        chartId={props.id}
        setRawViz={setRawViz}
        containerRef={containerRef}
        renderedChart={renderedChart}
        visualOptions={visualOptions}
        setVisualOptions={setVisualOptions}
        renderedChartType={renderedChartType}
        renderedChartMappedData={renderedChartMappedData}
        setChartErrorMessage={setChartErrorMessage}
        setChartError={setNotFound}
        inChartWrapper={true}
        chartPreviewInStory={props.chartPreviewInStory}
        mapping={chartFromAPI?.mapping}
        datasetDetails={datasetDetails}
      />
    </div>
  );
}
