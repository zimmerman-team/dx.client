import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import GeomapPlaceholder from "app/modules/chart-module/components/placeholder/geomapPlaceholder";
import { ReactComponent as LinechartPlaceholderImage } from "app/modules/chart-module/assets/lineChartPlaceholder.svg";
import { ReactComponent as BigNumberPlaceholderImage } from "app/modules/chart-module/assets/bigNumberPlaceholder.svg";
import { ReactComponent as BarChartPlaceholderImage } from "app/modules/chart-module/assets/barChartPlaceholder.svg";
import { ReactComponent as SankeyPlaceholderImage } from "app/modules/chart-module/assets/sankeyPlaceholder.svg";
import { ReactComponent as TreemapPlaceholderImage } from "app/modules/chart-module/assets/treemapPlaceholder.svg";

export default function ChartPlaceholder(props: { loading?: boolean }) {
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const activePanels = useStoreState(
    (state) => state.charts.activePanels.value
  );

  const chartPlaceholders = [
    {
      id: "echartsBarchart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
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
      id: "echartsForcegraph",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
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
      id: "echartsCirculargraph",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
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
      id: "echartsCirclepacking",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
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
      id: "echartsPiechart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;
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
      id: "echartsBubblechart",
      placeholder: (
        <div
          css={`
            padding-right: 38px;

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
      id: "echartsAreastack",
      placeholder: (
        <div
          css={`
            padding-right: 38px;

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

  const displayPlaceholder = () => {
    switch (activePanels) {
      case "mapping":
        return (
          <div
            css={`
              position: relative;
            `}
          >
            {!props.loading && <div>{getChartPlaceholder()}</div>}
          </div>
        );
      default:
        return;
    }
  };

  return <div css={commonStyles.container}>{displayPlaceholder()}</div>;
}
