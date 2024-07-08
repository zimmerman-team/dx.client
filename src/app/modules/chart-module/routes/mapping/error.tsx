import React from "react";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";

import GeomapPlaceholder from "app/modules/chart-module/components/placeholder/geomapPlaceholder";
import { ReactComponent as LinechartPlaceholderImage } from "app/modules/chart-module/assets/lineChartPlaceholder.svg";
import { ReactComponent as BigNumberPlaceholderImage } from "app/modules/chart-module/assets/bigNumberPlaceholder.svg";
import { ReactComponent as BarChartPlaceholderImage } from "app/modules/chart-module/assets/barChartPlaceholder.svg";
import { ReactComponent as SankeyPlaceholderImage } from "app/modules/chart-module/assets/sankeyPlaceholder.svg";
import { ReactComponent as TreemapPlaceholderImage } from "app/modules/chart-module/assets/treemapPlaceholder.svg";

import { ReactComponent as SunburstPlaceholderImage } from "app/modules/chart-module/assets/sunburstPlaceholder.svg";
import { ReactComponent as PieChartPlaceholderImage } from "app/modules/chart-module/assets/pieChartPlaceholder.svg";
import { ReactComponent as CirclepackingPlaceholderImage } from "app/modules/chart-module/assets/circlepackingPlaceholder.svg";
import { ReactComponent as ForcegraphPlaceholderImage } from "app/modules/chart-module/assets/forcegraphPlaceholder.svg";
import { ReactComponent as CirculargraphPlaceholderImage } from "app/modules/chart-module/assets/circulargraphPlaceholder.svg";
import { ReactComponent as RadarChartPlaceholderImage } from "app/modules/chart-module/assets/radarChartPlaceholder.svg";
import { ReactComponent as ScatterChartPlaceholderImage } from "app/modules/chart-module/assets/scatterChartPlaceholder.svg";
import { ReactComponent as GraphglPlaceholderImage } from "app/modules/chart-module/assets/graphglPlaceholder.svg";
import { ReactComponent as HeatmapPlaceholderImage } from "app/modules/chart-module/assets/heatmapPlaceholder.svg";
import { ReactComponent as AreatimeaxisPlaceholderImage } from "app/modules/chart-module/assets/areatimeaxisPlaceholder.svg";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

import { useStoreState } from "app/state/store/hooks";
import { CHART_DEFAULT_HEIGHT } from "app/modules/chart-module/data";
export default function MappingErrorComponent(props: {
  page: string;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}) {
  const chartType = useStoreState((state) => state.charts.chartType.value);

  const chartPlaceholders = [
    {
      id: "echartsBarchart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <BarChartPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsGeomap",
      placeholder: <GeomapPlaceholder />,
    },
    {
      id: "echartsLinechart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <LinechartPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsSankey",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;

            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <SankeyPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsTreemap",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;

            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <TreemapPlaceholderImage />
        </div>
      ),
    },
    {
      id: "bigNumber",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
          `}
        >
          <div
            css={`
              height: 100px;
            `}
          />
          <BigNumberPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsSunburst",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <SunburstPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsPiechart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <PieChartPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsCirclepacking",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <CirclepackingPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsForcegraph",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <ForcegraphPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsCirculargraph",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <CirculargraphPlaceholderImage />
        </div>
      ),
    },

    {
      id: "echartsBubblechart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <LinechartPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsScatterchart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;

            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <ScatterChartPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsHeatmap",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <HeatmapPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsAreatimeaxis",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;

            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <AreatimeaxisPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsGraphgl",
      placeholder: (
        <div
          css={`
            padding-right: 38px;

            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <GraphglPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsRadarchart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <RadarChartPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsAreastack",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
            height: 100%;
            svg {
              width: 100%;
              height: 100%;
            }
          `}
        >
          <LinechartPlaceholderImage />
        </div>
      ),
    },
  ];
  const getChartPlaceholder = () => {
    const placeholder = chartPlaceholders.find(
      (chartPlaceholder) => chartPlaceholder.id === chartType
    );
    return placeholder?.placeholder;
  };

  return (
    <div
      css={`
        ${commonStyles.container}
        position: relative;
      `}
    >
      <div css={commonStyles.innercontainer}>
        <div
          css={`
            height: ${CHART_DEFAULT_HEIGHT}px;
          `}
        >
          {getChartPlaceholder()}
        </div>
        <div
          css={`
            position: absolute;
            top: 28%;
            left: 32%;
          `}
        >
          <div
            css={`
              height: 362.598px;

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
              svg {
                width: 48px;
                height: 48px;
              }
              button {
                outline: none;
                border: none;
                background: transparent;
                cursor: pointer;
                text-decoration: underline;
              }
              p:nth-of-type(1) {
                margin-top: 34px;
                white-space: pre-line;
                line-height: 22px;
                font-family: "GothamNarrow-Bold", sans-serif;
                font-size: 18px;
              }
              p:nth-of-type(2) {
                margin: 0;
                font-family: "GothamNarrow-Book", sans-serif;
              }
            `}
          >
            <>
              <ErrorOutlineIcon htmlColor="#E75656" />
              <p>
                Something went wrong rendering your chart! <br /> Check your
                mapping or pick different dimensions.
              </p>
              <p>"Error rendering dimensions" </p>
            </>
            {/* {(props.chartError || props.dataError) && (
          )} */}
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
