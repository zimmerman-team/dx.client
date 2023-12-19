import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { PageLoader } from "app/modules/common/page-loader";
import { useDataThemesEchart } from "app/hooks/useDataThemesEchart";
import { useUpdateEffectOnce } from "app/hooks/useUpdateEffectOnce";

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
  renderedChartType?:
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
    | "echartsPiechart";
  inChartWrapper?: boolean;
}

export function CommonChart(props: Props) {
  const { render } = useDataThemesEchart();

  const domRef = React.useRef<HTMLDivElement>(null);
  const chartType = useStoreState((state) => state.charts.chartType.value);

  useUpdateEffectOnce(() => {
    if (props.containerRef.current) {
      const tmpVisualOptions = {
        ...props.visualOptions,
        width: props.containerRef.current.clientWidth,
        height: props.containerRef.current.clientHeight,
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
          height:
            props.containerRef.current.clientHeight -
            (props.withHeader ? 36 : 0),
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
              | "echartsPiechart"),
          {
            ...visualOptions,
            height: props.inChartWrapper
              ? visualOptions.height - 28
              : visualOptions.height,
          },
          `common-chart-render-container-${props.chartId || "1"}`
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

  if (props.renderedChartSsr) {
    content = (
      <div
        ref={domRef}
        id={`common-chart-render-container-${props.chartId || "1"}`}
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
          height: ${props.inChartWrapper
            ? props.visualOptions.height - 28
            : props.visualOptions.height}px;
          * {
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif !important;
          }
        `}
      >
        <div
          ref={domRef}
          id={`common-chart-render-container-${props.chartId || "1"}`}
          css={`
            width: auto !important;
            height: 100%;

            > div:first-of-type {
              ${chartType === "bigNumber" &&
              props.inChartWrapper &&
              `
              
    
      div:nth-child(1) {
        font-size: 9.39px !important;
        padding-bottom: 0px !important;
       }
       div:nth-child(2) {
        font-size: 45.834px !important;
        line-height: normal !important;
        height: 0px !important;
        margin-top: 29px !important;
        margin-bottom: 25px  !important;

       }
        div:nth-child(3) {
          font-size: 9.39px !important;
          padding-bottom: 0px !important;
          padding-top: 0px !important;

        }
        div:nth-child(4) {
          font-size: 7.572px !important;
          margin-top: 0px !important;
          line-height: 16px !important;
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
