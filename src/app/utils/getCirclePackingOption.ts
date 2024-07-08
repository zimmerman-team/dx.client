import * as d3 from "d3-hierarchy";
import * as echarts from "echarts/core";
import {
  CustomSeriesOption,
  CustomSeriesRenderItemReturn,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
} from "echarts";
import {
  TooltipComponentOption,
  VisualMapComponentOption,
} from "echarts/components";
import { formatFinancialValue } from "./formatFinancialValue";
import { checkLists } from "app/modules/chart-module/routes/customize/data";

function convertData(root: d3.HierarchyCircularNode<any>) {
  return root.descendants().map((node) => ({
    data: node.data,
    r: node.r,
    x: node.x,
    y: node.y,
    depth: node.depth,
    value: node.depth, // using value as depth so echarts can interpolate colors
    itemValue: node.data.value,
    name: node.data.name,
    path: node.data.path,
    isLeaf: !node.children || !node.children.length,
  }));
}

function getOptionForCirclepacking(data: any[], visualOptions: any) {
  const {
    // Color Palette
    palette,
    // Tooltip
    showTooltip,
    isMonetaryValue,
  } = visualOptions;
  let maxDepth = 0;

  data.forEach((item) => {
    maxDepth = Math.max(item?.depth, maxDepth);
  });

  const renderItem = (
    params: CustomSeriesRenderItemParams,
    api: CustomSeriesRenderItemAPI
  ): CustomSeriesRenderItemReturn => {
    const dataItem = data[params.dataIndex];

    let nodePath = dataItem.path;

    if (!nodePath) {
      // Reder nothing.
      return;
    }
    let isLeaf = dataItem.isLeaf;
    let nodeName = isLeaf ? dataItem.name : "";
    let z2 = dataItem.depth * 2;
    return {
      type: "circle",
      shape: {
        cx: dataItem.x,
        cy: dataItem.y,
        r: dataItem.r,
      },
      transition: ["shape"],
      z2: z2,
      textContent: {
        type: "text",
        style: {
          text: nodeName,
          fontFamily: "Arial",
          width: dataItem.r * 1.3,
          overflow: "break",
          fontSize: dataItem.r / 4,
        },
        emphasis: {
          style: {
            overflow: "break",
            fontSize: Math.max(dataItem.r / 3, 12),
          },
        },
      },
      textConfig: {
        position: "inside",
      },
      style: {
        fill: api.visual("color"),
      },
      emphasis: {
        style: {
          fontFamily: "Arial",
          fontSize: 12,
          shadowBlur: 20,
          shadowOffsetX: 3,
          shadowOffsetY: 5,
          shadowColor: "rgba(0,0,0,0.3)",
        },
      },
    };
  };

  const option: echarts.ComposeOption<
    CustomSeriesOption | TooltipComponentOption | VisualMapComponentOption
  > = {
    tooltip: {
      trigger: showTooltip ? "item" : "none",
      formatter: (params: any) => {
        return `${params.name}: ${
          isMonetaryValue
            ? formatFinancialValue(params.data.itemValue, true)
            : params.data.itemValue
        }`;
      },
    },
    visualMap: {
      show: false,
      type: "continuous",
      min: 0,
      max: maxDepth,
      inRange: {
        color: checkLists
          .find((item) => item.label === palette)
          ?.value.slice(0, maxDepth),
      },
    },

    hoverLayerThreshold: Infinity,
    series: {
      type: "custom",
      renderItem: renderItem,
      progressive: 0,
      coordinateSystem: "none",
      encode: {
        tooltip: "itemValue",
        itemName: "name",
      },
      data: data,
    },
  };
  return option;
}

const stratify = (dataset: any) => {
  return d3
    .stratify<any>()
    .id((d) => d.path)
    .parentId((d) => d.parentPath)(dataset)
    .sum((d) => d.value || 0)
    .sort((a, b) => {
      if (b.value && a.value) {
        return b.value - a.value;
      }
      return 0;
    });
};

export const drillDown = (
  // To change the head to the node with the select path
  dataset: any,
  targetId: string | null,
  visualOptions: any
) => {
  if (dataset.length === 0) {
    return {};
  }
  let root = stratify(dataset);

  const {
    // artboard
    width,
    height,
    nodeClick,
    // margin
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  } = visualOptions;

  // removing margins here because they don't apply to the series
  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height * 0.95 - marginTop - marginBottom; // removing 5% because chart is cutting off by default
  if (nodeClick === "zoomToNode") {
    if (targetId !== null) {
      let y = root.descendants().find((node) => {
        return node.data.path === targetId;
      });
      if (y) {
        root = y;
      }
    }
  }

  root.parent = null;
  // Reset

  d3.pack<any>().size([chartWidth, chartHeight]).padding(3)(root);
  const option = getOptionForCirclepacking(
    convertData(root as d3.HierarchyCircularNode<any>),
    visualOptions
  );

  return option;
};
