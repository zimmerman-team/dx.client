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
import { Link } from "react-router-dom";
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
      id: "echartsMultisetBarchart",
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
      id: "echartsStackedBarchart",
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

  const handleRetryMapping = () => {};

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
            @media (min-width: 768px) {
              @media (max-width: 902px) {
                top: 22%;
                left: 25%;
              }
            }
            @media (min-width: 903px) {
              @media (max-width: 1012px) {
                top: 22%;
                left: 28%;
              }
            }
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
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              text-align: center;
              svg {
                width: 64px;
                height: 64px;
              }

              h3 {
                margin-top: 13.3px;
                margin-bottom: 0px;
                font-size: 36px;
                white-space: pre-line;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              }
              p:nth-of-type(1) {
                margin: 0;
                margin-top: 20px;
                white-space: pre-line;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                font-weight: normal;
                font-size: 18px;
                width: 358px;
              }
              p:nth-of-type(2) {
                margin: 0;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              }
            `}
          >
            <>
              <ErrorOutlineIcon htmlColor="#E75656" />
              <h3>Error</h3>

              <p>
                Mapping could not be processed, please try again or contact your
                administrator.
              </p>
            </>
            <div
              css={`
                gap: 16px;
                display: flex;
                justify-content: center;
                margin-top: 32px;
                @media (max-width: 768px) {
                  flex-direction: column;
                }
                button,
                a {
                  border-radius: 12px;
                  background: #231d2c;
                  display: flex;
                  padding: 0px 24px;
                  justify-content: center;
                  align-items: center;
                  color: #fff;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  border: none;
                  outline: none;
                  text-decoration: none;
                  height: 48px;
                  cursor: pointer;
                }
              `}
            >
              <button onClick={handleRetryMapping}>Retry</button>
              <Link to={`/chart/${props.page}/data`}>
                Select Different Dimensions
              </Link>
              <Link to="/">Back to Dashboard</Link>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
