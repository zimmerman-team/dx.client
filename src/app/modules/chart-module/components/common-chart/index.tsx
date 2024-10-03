import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { PageLoader } from "app/modules/common/page-loader";
import { useDataThemesEchart } from "app/hooks/useDataThemesEchart";
import GeomapLegend from "app/modules/chart-module/components/geomap-legend";
import { ChartAPIModel } from "app/modules/chart-module/data";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { get } from "lodash";
import { getDatasetDetailsSource } from "app/modules/chart-module/util/getDatasetDetailsSource";

export type ChartType =
  | "echartsBarchart"
  | "echartsGeomap"
  | "echartsLinechart"
  | "echartsAreatimeaxis"
  | "echartsAreastack"
  | "echartsSankey"
  | "echartsTreemap"
  | "echartsSunburst"
  | "echartsForcegraph"
  | "echartsCirculargraph"
  | "echartsCirclepacking"
  | "echartsBubblechart"
  | "echartsMultisetBarchart"
  | "echartsStackedBarchart"
  | "echartsScatterchart"
  | "echartsHeatmap"
  | "echartsGraphgl"
  | "echartsRadarchart"
  | "echartsPiechart"
  | "bigNumber";
interface Props {
  visualOptions: any;
  withHeader?: boolean;
  renderedChart: string;
  renderedChartMappedData: any;
  setRawViz?: React.Dispatch<any>;
  setVisualOptions: (value: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  chartId?: string;
  hideChartSource?: boolean;
  setChartError: React.Dispatch<React.SetStateAction<boolean>>;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  renderedChartType?: ChartType;
  inChartWrapper?: boolean;
  chartPreviewInReport?: boolean;
  mapping?: any;
  datasetDetails?: DatasetListItemAPIModel;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function CommonChart(props: Readonly<Props>) {
  const { render } = useDataThemesEchart();
  const token = useStoreState((state) => state.AuthToken.value);
  const domRef = React.useRef<HTMLDivElement>(null);
  const chartTypeFromState = useStoreState(
    (state) => state.charts.chartType.value
  );

  const chartType = props.renderedChartType ?? chartTypeFromState;
  const loadedChart = useStoreState(
    (state) => state.charts.ChartGet.crudData as ChartAPIModel
  );

  const datasetId = loadedChart?.datasetId;
  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  const { sourceUrl, filename } = getDatasetDetailsSource(
    datasetDetails,
    props.datasetDetails
  );

  const dataSourcePHeight = document
    .getElementById(`datasource-${props.chartId || "1"}`)
    ?.getBoundingClientRect().height;

  let content;
  let contentHeight;
  if (!props.chartPreviewInReport && props.renderedChartType !== "bigNumber") {
    contentHeight = props.visualOptions?.height - 28 + "px";
  } else {
    contentHeight = "auto";
  }

  React.useEffect(() => {
    if (token) {
      loadDataset({
        token,
        getId: datasetId as string,
      });
    } else {
      loadDataset({
        token,
        getId: datasetId as string,
        nonAuthCall: !token,
      });
    }
  }, [token, datasetId]);

  React.useEffect(() => {
    const visualOptionsWidth = get(props.visualOptions, "width", 0);
    const containerWidth = props.containerRef.current?.clientWidth;
    if (props.containerRef.current && visualOptionsWidth !== containerWidth) {
      const tmpVisualOptions = {
        ...props.visualOptions,
        width: containerWidth,
        // height: props.containerRef.current.clientHeight, // removed the setting of visual option height to let user set it in the chart builder
      };
      props.setVisualOptions(tmpVisualOptions);
    }
  }, []);

  // client side rendering
  React.useEffect(() => {
    const visualOptions = props.containerRef.current
      ? {
          ...props.visualOptions,
          width: props.containerRef.current.clientWidth,
          height: props.inChartWrapper
            ? props.containerRef.current.clientHeight -
              (props.withHeader ? 36 : 0)
            : props.visualOptions.height,
        }
      : props.visualOptions;
    if (domRef && domRef.current && chartType && props.containerRef.current) {
      try {
        render(
          props.renderedChartMappedData,
          // @ts-ignore
          domRef.current,
          props.renderedChartType ||
            (chartType as
              | "echartsBarchart"
              | "echartsGeomap"
              | "echartsLinechart"
              | "echartsAreatimeaxis"
              | "echartsAreastack"
              | "echartsSankey"
              | "echartsTreemap"
              | "echartsSunburst"
              | "echartsForcegraph"
              | "echartsCirculargraph"
              | "echartsCirclepacking"
              | "echartsBubblechart"
              | "echartsMultisetBarchart"
              | "echartsStackedBarchart"
              | "echartsScatterchart"
              | "echartsHeatmap"
              | "echartsGraphgl"
              | "echartsRadarchart"
              | "echartsPiechart"
              | "bigNumber"),
          {
            ...visualOptions,
            height: props.inChartWrapper
              ? visualOptions.height - 28
              : visualOptions.height,
          },
          props.mapping,
          `common-chart-render-container-${props.chartId || "1"}-${
            props.chartPreviewInReport
          }`
        );
      } catch (e: any) {
        if (process.env.NODE_ENV === "development") {
          console.log("chart error", e);
          props.setChartError(true);
          props.setChartErrorMessage(e.message);
        }
      }
    }
  }, [chartType, props.visualOptions, props.renderedChartMappedData]);

  content = (
    <div
      css={`
        width: 100%;
        overflow: hidden;
        position: relative;
        height: ${contentHeight};
        * {
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif !important;
        }
      `}
    >
      <div
        ref={domRef}
        id={`common-chart-render-container-${props.chartId || "1"}-${
          props.chartPreviewInReport
        }`}
        data-cy="common-chart-container"
        css={`
          width: auto !important;
          height: calc(100% - ${dataSourcePHeight ?? 0}px);

          > div:first-of-type {
            ${props.renderedChartType === "bigNumber" &&
            props.inChartWrapper &&
            `
              div:nth-child(1) {
              font-size: 12px !important;
              padding-bottom: 6px !important;
              padding-top: 6px !important;
              line-height: 14.4px !important;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif !important;
        
              }
              div:nth-child(2) {
                font-size: 48px !important;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif !important;
                height: 58px !important;
                margin-top: 8px !important;
                margin-bottom: 8px  !important;
              }
              div:nth-child(3) {
                font-size: 12px !important;
                padding-bottom: 6px !important;
                padding-top: 0px !important;
                line-height: 14.4px !important;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif !important;

              }
              div:nth-child(4) {
                font-size: 10px !important;
                margin-top: 0px !important;
              padding-top: 6px !important;
                line-height: 12px !important;
                font-weight: 325 !important;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif !important;
              }
        `}

            > svg {
              height: calc(100% - ${dataSourcePHeight ?? 0}px);

              > rect {
                height: calc(100% - ${dataSourcePHeight ?? 0}px);
              }
            }
          }
        `}
      />

      <p
        id={`datasource-${props.chartId || "1"}`}
        css={`
          color: #70777e;
          font-family: "GothamNarrow-Bold", sans-serif;
          font-size: 12px;
          margin: 0;
          display: ${props.hideChartSource ? "none" : "block"};
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
          {props.datasetDetails?.source ?? datasetDetails.source} - Data file:{" "}
          {filename}
        </a>
      </p>
      {chartType === "echartsGeomap" && props.visualOptions?.showLegend ? (
        <div
          css={`
            position: absolute;
            bottom: 0;
            right: 0;
          `}
        >
          <GeomapLegend
            data={props.renderedChartMappedData}
            visualOptions={props.visualOptions}
            mapping={props.mapping}
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div
        id="extra-loader"
        css={`
          display: none;
        `}
      >
        <PageLoader />
      </div>
      {content}
    </>
  );
}
