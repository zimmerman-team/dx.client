import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { PageLoader } from "app/modules/common/page-loader";
import { useDataThemesEchart } from "app/hooks/useDataThemesEchart";
import { useUpdateEffectOnce } from "app/hooks/useUpdateEffectOnce";
import GeomapLegend from "../geomap-legend";

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
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setRawViz?: React.Dispatch<any>;
  setVisualOptions: (value: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  chartId?: string;
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  renderedChartType?: ChartType;
  inChartWrapper?: boolean;
  chartPreviewInReport?: boolean;
  mapping?: any;
}

export function CommonChart(props: Readonly<Props>) {
  const { render } = useDataThemesEchart();

  const domRef = React.useRef<HTMLDivElement>(null);
  const chartTypeFromState = useStoreState(
    (state) => state.charts.chartType.value
  );

  const chartType = props.renderedChartType ?? chartTypeFromState;

  useUpdateEffectOnce(() => {
    if (props.containerRef.current) {
      const tmpVisualOptions = {
        ...props.visualOptions,
        width: props.containerRef.current.clientWidth,
        // height: props.containerRef.current.clientHeight, // removed the setting of visual option height to let user set it in the chart builder
      };
      props.setVisualOptions(tmpVisualOptions);
    }
  }, [props.containerRef]);

  // server side rendering
  React.useEffect(() => {
    if (props.renderedChartSsr && domRef && domRef.current) {
      try {
        while (domRef.current.firstChild) {
          domRef.current.removeChild(domRef.current.firstChild);
        }
      } catch (e) {}
      try {
        const element = document.createElement("div");
        element.innerHTML = props.renderedChart.trim();
        const newRawViz = domRef.current.appendChild(
          chartType === "bigNumber"
            ? element.children[0].children[0].children[0]
            : element.firstChild || element
        );
        props.setRawViz && props.setRawViz(newRawViz);
      } catch (e) {
        while (domRef.current.firstChild) {
          domRef.current.removeChild(domRef.current.firstChild);
        }
        if (process.env.NODE_ENV === "development") {
          console.log("chart error", e);
        }
      }
    }
  }, [props.renderedChart]);
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
    if (
      !props.renderedChartSsr &&
      domRef &&
      domRef.current &&
      chartType &&
      props.containerRef.current
    ) {
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
          props.setNotFound(true);
          props.setChartErrorMessage(e.message);
        }
      }
    }
  }, [
    chartType,
    props.visualOptions,
    props.renderedChartSsr,
    props.renderedChartMappedData,
  ]);

  let content;
  let contentHeight;
  if (!props.chartPreviewInReport && props.renderedChartType !== "bigNumber") {
    contentHeight = props.visualOptions?.height - 28 + "px";
  } else {
    contentHeight = "auto";
  }

  if (props.renderedChartSsr) {
    content = (
      <div
        ref={domRef}
        id={`common-chart-render-container-${props.chartId || "1"}-${
          props.chartPreviewInReport
        }`}
        data-cy="common-chart-container-ssr"
        css={`
          overflow-x: auto;
          margin-top: 40px;

          ${chartType === "bigNumber" &&
          window.location.pathname.indexOf("/chart/") > -1 &&
          `
            > div {
              width: 135px;
            }
          `}
          ${chartType === "bigNumber" &&
          props.inChartWrapper &&
          `
        > div {
       ::nth-child(1) {
        font-size: 10px !important;
       }
            }
        `}

          * {
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif !important;
          }
        `}
      />
    );
  } else {
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
            height: 100%;

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
                height: 100%;

                > rect {
                  height: 100%;
                }
              }
            }
          `}
        />
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
  }

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
