import React from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import uniqBy from "lodash/uniqBy";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import {
  MapChart,
  BarChart,
  LineChart,
  PieChart,
  SankeyChart,
  TreemapChart,
  SunburstChart,
  CustomChart,
  GraphChart,
  ScatterChart,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { checkLists } from "app/modules/data-themes-module/sub-modules/theme-builder/views/customize/data";
import { charts } from "app/modules/chart-module/data";
import { drillDown } from "app/utils/getCirclePackingOption";

echarts.use([
  BarChart,
  MapChart,
  PieChart,
  LineChart,
  GraphChart,
  CustomChart,
  SankeyChart,
  TreemapChart,
  GridComponent,
  SunburstChart,
  ScatterChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
]);

export function useDataThemesEchart() {
  function onResize(chart: echarts.EChartsType, id: string, height?: number) {
    const container = document.getElementById(id);
    chart.resize({
      width: container?.clientWidth,
      height: height ?? "auto",
    });
  }

  function echartsBarchart(data: any, visualOptions: any) {
    const {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      realTimeSort,
      color,
      splitLineY,
      barRadius,
      xAxisLineColor,
      xAxisLabelFontSize,
      focus,
      xAxisLabelColor,
      xAxisLabelInterval,
      showTooltip,
      isMonetaryValue,
      label,
    } = visualOptions;

    const bars = data.map((d: any) => d.bars);
    const sizes = data.map((d: any) => d.size);

    const option = {
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
      },
      xAxis: {
        data: bars,
        show: true,
        type: "category",
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: xAxisLineColor,
          },
        },
        axisLabel: {
          show: label,
          color: xAxisLabelColor || "#000",
          fontSize: xAxisLabelFontSize || 12,
          interval: xAxisLabelInterval || "auto",
        },
      },
      yAxis: {
        type: "value",
        show: true,
        splitLine: {
          show: splitLineY ?? true,
        },
      },
      // xAxis: orientation === "horizontal" ? { type: "value" } : { data: bars },
      // yAxis: orientation === "vertical" ? { type: "value" } : { data: bars },
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          name: "",
          // height,
          type: "bar",
          data: sizes,
          realtimeSort: realTimeSort ?? true,
          itemStyle: {
            color: color,
            borderRadius: barRadius,
          },
          emphasis: {
            focus,
          },
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          return `${params.name}: ${
            isMonetaryValue
              ? formatFinancialValue(params.value, true)
              : params.value
          }`;
        },
      },
    };

    return option;
  }

  function echartsPiechart(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      showLegend,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // chart
      drawDonut,
      arcThickness,
    } = visualOptions;
    const defaultRadius = 80;

    const thicknessPercent =
      defaultRadius - (arcThickness / 100) * defaultRadius;

    const option = {
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          return `${params.name}: ${
            isMonetaryValue
              ? formatFinancialValue(params.value, true)
              : params.value
          }`;
        },
      },
      legend: {
        top: "5%",
        left: "center",
        show: showLegend,
      },
      series: [
        {
          width,
          height,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          type: "pie",
          radius: drawDonut
            ? [`${thicknessPercent}%`, `${defaultRadius}%`]
            : [`${defaultRadius}%`],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };
    return option;
  }

  function echartsGeomap(data: any, visualOptions: any) {
    const {
      // artboard
      height,
      background,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      palette,

      showTooltip,
      isMonetaryValue,
    } = visualOptions;

    echarts.registerMap("World", data.geoJSON);

    const sizes = data.results.map((d: any) => d.value);

    const option = {
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        showDelay: 0,
        transitionDuration: 0.2,
        confine: true,
        formatter: (params: any) => {
          if (params.value) {
            return `${params.name}: ${
              isMonetaryValue
                ? formatFinancialValue(params.value, true)
                : params.value
            }`;
          }
        },
      },
      visualMap: {
        left: "right",
        min: Math.min(...sizes),
        max: Math.max(...sizes),
        inRange: {
          color: checkLists.find((item) => item.label === palette)?.value,
        },
        text: ["High", "Low"],
        calculable: true,
      },
      series: [
        {
          type: "map",
          height,
          roam: false,
          map: "World",
          data: data.results,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          emphasis: {
            label: {
              show: false,
            },
            itemStyle: {
              areaColor: "#cdd4df",
            },
          },
          select: {
            disabled: true,
          },
        },
      ],
    };

    return option;
  }

  function echartsLinechart(data: any, visualOptions: any) {
    const {
      // artboard
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      showLegend,
      // Tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;
    const option = {
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        zlevel: -1,
        z: -1,
      },
      xAxis: {
        type: "category",
        data: data.xAxisValues || [],
        zlevel: -1,
        z: -1,
      },
      yAxis: {
        type: "value",
        zlevel: -1,
        z: -1,
      },
      legend: {
        show: showLegend,
        data: filter(
          get(data, "lines", []).map((d: any) => d[0]),
          (d: any) => d !== null
        ),
      },
      // backgroundColor: background,
      backgroundColor: "transparent",

      series: filter(get(data, "lines", []), (l: any) => l !== null).map(
        (d: any) => ({
          type: "line",
          name: d[0],
          data: d[1].map((l: any) => l.y),
          z: -1,
          zlevel: -1,
        })
      ),
      tooltip: {
        show: showTooltip,
        trigger: "axis",

        confine: true,
        valueFormatter: (value: number | string) =>
          isMonetaryValue
            ? formatFinancialValue(parseInt(value.toString(), 10), true)
            : value,
      },
    };

    return option;
  }

  function echartsAreastack(data: any, visualOptions: any) {
    const {
      // artboard
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      showLegend,
      // Tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;
    const option = {
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        zlevel: -1,
        z: -1,
      },
      xAxis: {
        type: "category",
        data: data.xAxisValues || [],
        zlevel: -1,
        z: -1,
      },
      yAxis: {
        type: "value",
        zlevel: -1,
        z: -1,
      },
      legend: {
        show: showLegend,
        data: filter(
          get(data, "lines", []).map((d: any) => d[0]),
          (d: any) => d !== null
        ),
      },
      // backgroundColor: background,
      backgroundColor: "transparent",

      series: filter(get(data, "lines", []), (l: any) => l !== null).map(
        (d: any) => ({
          type: "line",
          name: d[0],
          data: d[1].map((l: any) => l.y),
          stack: "Total",
          areaStyle: {},
          z: -1,
          zlevel: -1,
        })
      ),
      tooltip: {
        show: showTooltip,
        trigger: "axis",

        confine: true,
        valueFormatter: (value: number | string) =>
          isMonetaryValue
            ? formatFinancialValue(parseInt(value.toString(), 10), true)
            : value,
      },
    };

    return option;
  }

  function echartsBubblechart(data: any, visualOptions: any) {
    const {
      // artboard
      showLegend,
      // margin
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Label
      showLabels,
      labelFontSize,
    } = visualOptions;
    const groups = Object.keys(data);

    const maxSize = Math.max(
      ...groups.map((group) =>
        data[group].reduce((prev: number, curr: any) => {
          return Math.max(prev, curr.size);
        }, 0)
      )
    );

    const option = {
      legend: {
        right: "10%",
        top: "3%",
        data: groups,
        show: showLegend,
      },
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
      },
      xAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        scale: true,
      },
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          return `${params.data[3]}: ${
            isMonetaryValue
              ? formatFinancialValue(params.value, true)
              : params.data[2]
          }`;
        },
      },
      series: groups.map((group) => ({
        name: group,
        data: data[group].map((item: any) => [
          item.x,
          item.y,
          (item.size / maxSize) * 50, // making the symbol size relative to the max value but max at 50,
          item.label,
          item.color,
        ]),
        type: "scatter",
        symbolSize: function (singleData: any) {
          return singleData[2];
        },
        label: { show: showLabels, fontSize: labelFontSize },
        emphasis: {
          focus: "series",
          label: {
            show: true,
            formatter: function (param: any) {
              return param.data[3];
            },
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(120, 36, 50, 0.5)",
          shadowOffsetY: 5,
        },
      })),
    };
    return option;
  }

  function echartsSankey(data: any, visualOptions: any) {
    const {
      // artboard
      height,
      background,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      nodesWidth,
      nodesPadding,
      linksOpacity,
      nodeAlign,
      orient,
      // Labels
      showLabels,
      labelRotate,
      labelPosition,
      labelFontSize,
      // Tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;

    let nodes: { name: string }[] = [];
    data.forEach((d: any) => {
      nodes.push({ name: d.source });
      nodes.push({ name: d.target });
    });
    nodes = uniqBy(nodes, "name");

    const option = {
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          type: "sankey",
          data: nodes,
          links: data,
          height,
          orient,
          nodeAlign,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          nodeGap: nodesPadding,
          nodeWidth: nodesWidth,
          emphasis: {
            focus: "adjacency",
          },
          lineStyle: {
            curveness: 0.5,
            color: "source",
            opacity: linksOpacity,
          },
          label: {
            show: showLabels,
            rotate: labelRotate,
            position: labelPosition,
            fontSize: labelFontSize,
            formatter: (params: any) => {
              const splits = params.name.split("-");
              if (splits.length === 1) {
                return params.name;
              }
              const text = splits.slice(1).join("-");
              return text;
            },
          },
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          let result = "";
          if (params.data.source && params.data.target && params.data.value) {
            let source = "";
            let target = "";
            let splits = params.data.source.split("-");
            if (splits.length === 1) {
              source = params.data.source;
            } else {
              source = splits.slice(1).join("-");
            }
            splits = params.data.target.split("-");
            if (splits.length === 1) {
              target = params.data.target;
            } else {
              target = splits.slice(1).join("-");
            }
            result = `${source} - ${target}: ${
              isMonetaryValue
                ? formatFinancialValue(params.data.value, true)
                : params.data.value
            }`;
          } else {
            let name = "";
            let splits = params.name.split("-");
            if (splits.length === 1) {
              name = params.name;
            } else {
              name = splits.slice(1).join("-");
            }
            result = name;
          }
          return result;
        },
      },
    };

    return option;
  }

  function echartsForcegraph(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      showLegend,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      linksOpacity,
      draggable,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // labels
      showLabels,
      labelFontSize,
      // chart
      nodeSize,
      forceRepulsion,
    } = visualOptions;

    const nodes = uniqBy(data.nodes, "name");

    nodes?.forEach(function (node: any) {
      node.symbolSize = nodeSize;
    });

    data.links?.forEach(function (link: any) {
      link.lineStyle = {
        opacity: linksOpacity,
      };
    });

    const option = {
      legend: [
        {
          data: data.categories?.map(function (a: { name: string }) {
            return a.name;
          }),
          show: showLegend,
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        formatter: (params: any) => {
          return `${params.name}: ${
            isMonetaryValue
              ? formatFinancialValue(params.data.value, true)
              : params.data.value
          }`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          data: nodes,
          links: data.links,
          categories: data.categories,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          width,
          height,
          roam: draggable,
          label: {
            position: "right",
            show: showLabels,
            fontSize: labelFontSize,
          },
          force: {
            repulsion: forceRepulsion,
          },
        },
      ],
    };
    return option;
  }

  function echartsCirculargraph(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      showLegend,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      linksOpacity,
      draggable,
      linksCurveness,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // labels
      showLabels,
      labelFontSize,
      rotateLabel,
    } = visualOptions;

    const maxValue = data.nodes?.reduce((prev: number, curr: any) => {
      return Math.max(prev, curr.value);
    }, 0);

    data.nodes?.forEach(function (node: any) {
      node.symbolSize = (node.value / maxValue) * 50; // making the symbol size relative to the max value but max at 50
      let show = false;
      if (showLabels == "largeNodes") {
        show = node.symbolSize > 30;
      } else if (showLabels == "true") {
        show = true;
      }
      node.label = {
        show,
      };
    });

    data.links?.forEach(function (link: any) {
      link.lineStyle = {
        opacity: linksOpacity,
      };
    });

    const nodes = uniqBy(data.nodes, "name");

    const option = {
      legend: [
        {
          data: data.categories?.map(function (a: { name: string }) {
            return a.name;
          }),

          align: "left",
          show: showLegend,
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        formatter: (params: any) => {
          return `${params.name}: ${
            isMonetaryValue
              ? formatFinancialValue(params.data.value, true)
              : params.data.value
          }`;
        },
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          type: "graph",
          layout: "circular",
          circular: {
            rotateLabel: rotateLabel,
          },
          data: nodes,
          links: data.links,
          categories: data.categories,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          width,
          height: 0.8 * height - marginTop - marginBottom, // Default height from echarts is overflowing so I had to remove .5 percent from the height to fit
          roam: draggable as boolean,
          force: {
            repulsion: 100,
          },
          label: {
            position: "right",
            formatter: "{b}",
            show: showLabels,
            fontSize: labelFontSize,
          },
          lineStyle: {
            color: "source",
            curveness: linksCurveness,
          },
        },
      ],
    };
    return option as any;
  }

  function echartsTreemap(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // labels
      showLabels,
      labelFontSize,
      showBreadcrumbs,
      // tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;

    const option = {
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          name: "All",
          type: "treemap",
          data,
          width,
          height,
          roam: false,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          leafDepth: 1,
          label: {
            show: showLabels,
            fontSize: labelFontSize,
          },
          breadcrumb: {
            show: showBreadcrumbs,
            top: 0,
            bottom: "auto",
          },
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          return `${params.name}: ${
            isMonetaryValue
              ? formatFinancialValue(params.data.value, true)
              : params.data.value
          }`;
        },
      },
    };

    return option;
  }

  function echartsCirclepacking(
    data: any,
    visualOptions: any,
    targetPath: string | null
  ) {
    const option = drillDown(data, targetPath, visualOptions);
    return option;
  }

  function echartsSunburst(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // labels
      showLabels,
      labelFontSize,
      // tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;

    const option = {
      // backgroundColor: background,
      backgroundColor: "transparent",
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        formatter: (params: any) => {
          return `${params.name}: ${
            isMonetaryValue
              ? formatFinancialValue(params.data.value, true)
              : params.data.value
          }`;
        },
      },
      series: [
        {
          name: "All",
          type: "sunburst",
          data,
          radius: [0, "95%"],
          sort: undefined,
          emphasis: {
            focus: "ancestor",
          },
          levels: [
            {},
            {
              r0: "15%",
              r: "35%",
              itemStyle: {
                borderWidth: 2,
              },
              label: {
                rotate: "tangential",
              },
            },
            {
              r0: "35%",
              r: "70%",
              label: {
                align: "right",
              },
            },
            {
              r0: "70%",
              r: "72%",
              label: {
                position: "outside",
                padding: 3,
                silent: false,
              },
              itemStyle: {
                borderWidth: 3,
              },
            },
          ],
          width,
          height: height,
          roam: false,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          leafDepth: 1,
          label: {
            show: showLabels,
            fontSize: labelFontSize,
          },
        },
      ],
    };

    return option;
  }
  function bigNumberRender(data: any, node: HTMLElement) {
    const formatedData = {
      ...data,
      description: data?.description?.value[0],
      title: data?.title?.value[0],
      subtitle: data?.subtitle?.value[0],
    };

    const renderBigNumber = charts["bigNumber"].render;
    renderBigNumber(node, formatedData);
  }

  function render(
    data: any,
    node: HTMLElement,
    chartType:
      | "echartsBarchart"
      | "echartsGeomap"
      | "echartsLinechart"
      | "echartsAreastack"
      | "echartsSankey"
      | "echartsTreemap"
      | "bigNumber"
      | "echartsSunburst"
      | "echartsForcegraph"
      | "echartsCirculargraph"
      | "echartsPiechart"
      | "echartsBubblechart"
      | "echartsCirclepacking",

    visualOptions: any,
    id: string
  ) {
    if (chartType === "bigNumber") {
      bigNumberRender(data, node);
    } else {
      new ResizeObserver(() => onResize(chart, id, node.clientHeight)).observe(
        node
      );

      const chart = echarts.init(node, undefined, {
        renderer: "canvas",
        height: visualOptions.height,
      });

      window.removeEventListener("resize", () => onResize(chart, id));

      const CHART_TYPE_TO_COMPONENT = {
        echartsBarchart: () => echartsBarchart(data, visualOptions),
        echartsGeomap: () => echartsGeomap(data, visualOptions),
        echartsLinechart: () => echartsLinechart(data, visualOptions),
        echartsAreastack: () => echartsAreastack(data, visualOptions),
        echartsSankey: () => echartsSankey(data, visualOptions),
        echartsTreemap: () => echartsTreemap(data, visualOptions),
        echartsSunburst: () => echartsSunburst(data, visualOptions),
        echartsForcegraph: () => echartsForcegraph(data, visualOptions),
        echartsCirculargraph: () => echartsCirculargraph(data, visualOptions),
        echartsPiechart: () => echartsPiechart(data, visualOptions),
        echartsBubblechart: () => echartsBubblechart(data, visualOptions),
        echartsCirclepacking: () =>
          echartsCirclepacking(data, visualOptions, null),
      };

      chart.setOption(CHART_TYPE_TO_COMPONENT[chartType]());

      window.addEventListener("resize", () => onResize(chart, id));
      if (chartType === "echartsCirclepacking") {
        chart.on("click", { seriesIndex: 0 }, (params: any) => {
          chart.setOption(
            echartsCirclepacking(data, visualOptions, params.data.path)
          );
        });

        // Reset: click on the blank area.
        chart.getZr().on("click", function (event) {
          if (!event.target) {
            chart.setOption(echartsCirclepacking(data, visualOptions, null));
          }
        });
      }
    }
  }

  return { render };
}
