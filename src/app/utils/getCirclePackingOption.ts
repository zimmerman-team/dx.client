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

function convertData(root: d3.HierarchyCircularNode<any>) {
  return root.descendants().map((node) => ({
    data: node.data,
    r: node.r,
    x: node.x,
    y: node.y,
    depth: node.depth,
    value: node.data.value,
    name: node.data.name,
    path: node.data.path,
    isLeaf: !node.children || !node.children.length,
  }));
}

function getOptionForCirclepacking(data: any[]) {
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
        fill: interpolateColor(
          "#006edd",
          "#e0ffff",
          0,
          maxDepth,
          dataItem.depth
        ),
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
    dataset: {
      source: data,
    },
    tooltip: {},
    visualMap: {
      show: false,
      type: "continuous",
      min: 1,
      max: maxDepth,
      calculable: true,
      dimension: 1,
      inRange: {
        color: ["#006edd", "#e0ffff"],
      },
    },

    hoverLayerThreshold: Infinity,
    series: {
      type: "custom",
      renderItem: renderItem,
      progressive: 0,
      coordinateSystem: "none",
      encode: {
        tooltip: "value",
        itemName: "name",
      },
      data: data,
    },
  };
  return option;
}

const interpolateColor = (
  color1: string,
  color2: string,
  min: number,
  max: number,
  value: number
) => {
  // Example usage

  const dimensionValue = value;

  // Calculate the factor for interpolation
  const factor = (dimensionValue - min) / (max - min);
  // Parse the color values
  const c1 = color1.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16));
  const c2 = color2.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16));
  if (c1 && c2) {
    const interpolatedColor = c1.map((component, index) =>
      Math.round(component + factor * (c2[index] - component))
    );
    const resultColor =
      "#" +
      interpolatedColor?.map((v) => v.toString(16).padStart(2, "0")).join("");
    return resultColor;
  }
};

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
    // margin
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  } = visualOptions;

  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  if (targetId !== null) {
    let y = root.descendants().find((node) => {
      return node.data.path === targetId;
    });
    if (y) {
      root = y;
    }
  }

  root.parent = null;
  // Reset

  d3.pack<any>().size([chartWidth, chartHeight]).padding(3)(root);
  const option = getOptionForCirclepacking(
    convertData(root as d3.HierarchyCircularNode<any>)
  );

  return option;
};
