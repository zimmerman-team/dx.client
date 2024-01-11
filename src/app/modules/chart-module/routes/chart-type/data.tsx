import BarChartIcon from "app/assets/icons/data-themes-chart-types/bar";
import ColoredBarChartIcon from "app/assets/icons/data-themes-chart-types/coloredBarChart";

import GeomapChartIcon from "app/assets/icons/data-themes-chart-types/geomap";
import ColoredGeomapChartIcon from "app/assets/icons/data-themes-chart-types/coloredGeomap";

import LineChartIcon from "app/assets/icons/data-themes-chart-types/line";
import ColoredLineChartIcon from "app/assets/icons/data-themes-chart-types/coloredLineChart";

import SankeyChartIcon from "app/assets/icons/data-themes-chart-types/sankeydiagram";
import ColoredSankeyChartIcon from "app/assets/icons/data-themes-chart-types/coloredSankeyDiagram";

import TreeMapIcon from "app/assets/icons/data-themes-chart-types/treemap";
import ColoredTreeMapIcon from "app/assets/icons/data-themes-chart-types/coloredTreemap";

import BigNumberIcon from "app/assets/icons/data-themes-chart-types/bigNumber";
import ColoredBigNumberIcon from "app/assets/icons/data-themes-chart-types/coloredBigNumber";

import SunburstIcon from "app/assets/icons/data-themes-chart-types/sunburst";
import ColoredSunburstIcon from "app/assets/icons/data-themes-chart-types/coloredSunburst";

import PieIcon from "app/assets/icons/data-themes-chart-types/pie";
import ColoredPieIcon from "app/assets/icons/data-themes-chart-types/coloredPie";

import CirclePackingIcon from "app/assets/icons/data-themes-chart-types/circlepacking";
import ColoredCirclePackingIcon from "app/assets/icons/data-themes-chart-types/coloredCirclepacking";

import ColoredForceGraphIcon from "app/assets/icons/data-themes-chart-types/coloredForcegraph";
import ForceGraphIcon from "app/assets/icons/data-themes-chart-types/forcegraph";

import ColoredCircularGraphIcon from "app/assets/icons/data-themes-chart-types/coloredCirculargraph";
import CircularGraphIcon from "app/assets/icons/data-themes-chart-types/circulargraph";

import AreastackedIcon from "app/assets/icons/data-themes-chart-types/areastacked";
import ColoredAreastackedIcon from "app/assets/icons/data-themes-chart-types/coloredAreastacked";

import BubblechartIcon from "app/assets/icons/data-themes-chart-types/bubble";
import ColoredBubblechartIcon from "app/assets/icons/data-themes-chart-types/coloredBubbleChart";

import RadarchartIcon from "app/assets/icons/data-themes-chart-types/radar";

import HeatmapIcon from "app/assets/icons/data-themes-chart-types/heatmap";

import { ReactComponent as GeomapPreviewImg } from "app/modules/chart-module/assets/geomapPreview.svg";
import { ReactComponent as BigNumberPreviewImg } from "app/modules/chart-module/assets/bigNumberPreview.svg";
import { ReactComponent as LineChartPreviewImg } from "app/modules/chart-module/assets/lineChartPreview.svg";
import { ReactComponent as TreeMapPreviewImg } from "app/modules/chart-module/assets/treemapPreview.svg";
import { ReactComponent as SankeyPreviewImg } from "app/modules/chart-module/assets/sankeyPreview.svg";
import { ReactComponent as BarChartPreviewImg } from "app/modules/chart-module/assets/barChartPreview.svg";

import { ReactComponent as SunburstPreviewImg } from "app/modules/chart-module/assets/sunburstPreview.svg";
import { ReactComponent as PieChartPreviewImg } from "app/modules/chart-module/assets/pieChartPreview.svg";
import { ReactComponent as CirclepackingPreviewImg } from "app/modules/chart-module/assets/circlepackingPreview.svg";
import { ReactComponent as ForcegraphPreviewImg } from "app/modules/chart-module/assets/forcegraphPreview.svg";
import { ReactComponent as CirculargraphPreviewImg } from "app/modules/chart-module/assets/circulargraphPreview.svg";
import { ReactComponent as AreastackedPreviewImg } from "app/modules/chart-module/assets/areastackedPreview.svg";
import { ReactComponent as BubbleChartPreviewImg } from "app/modules/chart-module/assets/bubbleChartPreview.svg";
import { ReactComponent as RadarChartPreviewImg } from "app/modules/chart-module/assets/radarChartPreview.svg";
import { ReactComponent as HeatmapPreviewImg } from "app/modules/chart-module/assets/heatmapPreview.svg";

export interface ChartBuilderChartTypeProps {
  loading: boolean;
}

export interface ChartTypeModel {
  id: string;
  label: string;
  icon: React.ReactNode;
  categories: string[];
  description: string;
  ssr: boolean;
}

export const echartTypes = (big: boolean) => {
  return [
    {
      id: "echartsBarchart",
      label: "Bar chart",
      icon: <BarChartIcon big={big} />,
      preview: <BarChartPreviewImg />,
      categories: ["Correllations"],
      ssr: false,
      description:
        "Bar charts present data by visually displaying and comparing categorical information or discrete values through the use of bars of varying lengths or heights.",
    },
    {
      id: "echartsGeomap",
      label: "Geo map",
      icon: <GeomapChartIcon big={big} />,
      preview: <GeomapPreviewImg />,
      categories: ["Locations"],
      ssr: false,
      description:
        "A geomap is a map of a country, continent, or region map, with colors and values assigned to specific regions. Values are displayed as a color scale, and you can specify optional hovertext for regions. ",
    },
    {
      id: "echartsLinechart",
      label: "Line chart",
      icon: <LineChartIcon big={big} />,
      preview: <LineChartPreviewImg />,
      categories: ["Trends", "changes over time"],
      ssr: false,
      description:
        "Line charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsSankey",
      label: "Sankey diagram",
      icon: <SankeyChartIcon big={big} />,
      preview: <SankeyPreviewImg />,
      categories: ["Networks"],
      ssr: false,
      description:
        "Sankey diagrams represent flows among nodes of a network. Nodes are represented as rectangles, the height represents their value. Flows are represented with curved lines whose width is proportional to their value.",
    },
    {
      id: "echartsTreemap",
      label: "Treemap diagram",
      icon: <TreeMapIcon big={big} />,
      preview: <TreeMapPreviewImg />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "Tree maps present hierarchical data structures by visually depicting the relative proportions and relationships among different categories or subcategories, making them useful for displaying complex data in a compact and informative manner.",
    },
    {
      id: "bigNumber",
      label: "Big number",
      icon: <BigNumberIcon />,
      preview: <BigNumberPreviewImg />,
      categories: ["Key data points"],
      ssr: true,
      description:
        "Big number charts present specific, standout numerical values or key performance indicators in a visually prominent and easily digestible format, enabling quick recognition of important data points.",
    },
    {
      id: "echartsSunburst",
      label: "Sunburst diagram",
      icon: <SunburstIcon big={big} />,
      preview: <SunburstPreviewImg />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension using concentric circles. The circle in the center represents the root node, with the hierarchies moving outward from the center. The angle of each arc corresponds to the qualitative dimension.",
    },
    {
      id: "echartsPiechart",
      label: "Pie Chart",
      icon: <PieIcon big={big} />,
      preview: <PieChartPreviewImg />,
      categories: ["Proportions"],
      ssr: false,
      description:
        "It allows you to see the proportions between values that make up a whole, by using arcs composing a circle.",
    },
    {
      id: "echartsCirclepacking",
      label: "Circle Packing Chart",
      icon: <CirclePackingIcon big={big} />,
      preview: <CirclepackingPreviewImg />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays values of leaf nodes of a hierarchical structure by using circles areas. The hierarchical structure is depicted using nested circles. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "echartsForcegraph",
      label: "Network Graph",
      icon: <ForceGraphIcon big={big} />,
      preview: <ForcegraphPreviewImg />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as circles",
    },
    {
      id: "echartsCirculargraph",
      label: "Circular Network Graph",
      icon: <CircularGraphIcon big={big} />,
      preview: <CirculargraphPreviewImg />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as circles",
    },
    {
      id: "echartsAreastack",
      label: "Line Stacked Chart",
      icon: <AreastackedIcon big={big} />,
      preview: <AreastackedPreviewImg />,
      categories: ["Trends", "changes over time"],
      ssr: false,
      description:
        "Line stack charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsBubblechart",
      label: "Bubble Chart",
      icon: <BubblechartIcon big={big} />,
      preview: <BubbleChartPreviewImg />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "The basic layout is a scatter plot, which allows to see correlations among two continuous dimensions. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "echartsHeatmap",
      label: "Heat map",
      icon: <HeatmapIcon big={big} />,
      preview: <HeatmapPreviewImg />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "The basic layout is a scatter plot, which allows to see correlations among two continuous dimensions. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "echartsRadarchart",
      label: "Radar Chart",
      icon: <RadarchartIcon big={big} />,
      preview: <RadarChartPreviewImg />,
      categories: ["Correlations"],
      ssr: false,
      description:
        "It displays multiple continuous dimensions as axes starting from the same point and by disposing them radially. Each dimension is represented as an axis starting from the center of the cart. The same scale is applied to all the axes.",
    },
    {
      id: "echartsGraphgl",
      label: "Graph GL Chart",
      icon: <BarChartIcon big={big} />,
      preview: <BarChartPreviewImg />,
      categories: ["Networks"],
      ssr: false,
      description: "It represents flows among nodes of a network.",
    },

    {
      id: "echartsAreatimeaxis",
      label: "Area Time Axis Chart",
      icon: <LineChartIcon big={big} />,
      preview: <LineChartPreviewImg />,
      categories: ["Time Series", "Correlations"],
      ssr: false,
      description:
        "It displays a quantitative dimension over a continuous interval or time period.",
    },
    {
      id: "echartsScatterchart",
      label: "Scatter Chart",
      icon: <BarChartIcon big={big} />,
      preview: <BarChartPreviewImg />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "It allows to see correlations among two continuous dimensions.",
    },
    {
      id: "placeholder9",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder10",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
  ];
};

export const coloredEchartTypes = () => {
  return [
    {
      id: "echartsBarchart",
      label: "Bar chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Correllations"],
      ssr: false,
      description:
        "It displays a categorical dimension and related amounts. Each bar represents a category, width is proportional to the quantitative dimension.",
    },
    {
      id: "echartsGeomap",
      label: "Geo map",
      icon: (
        <ColoredGeomapChartIcon
          css={`
            margin-left: -5px;
          `}
        />
      ),
      categories: ["Locations"],
      ssr: false,
      description: "Geo map",
    },
    {
      id: "echartsLinechart",
      label: "Line chart",
      icon: <ColoredLineChartIcon />,
      categories: ["Trends", "changes over time"],
      ssr: false,
      description:
        "It displays a quantitative dimension over a continuous interval or time period. Colour can be optionally used to encode an additional quantitative or categorical dimension.",
    },
    {
      id: "echartsSankey",
      label: "Sankey diagram",
      icon: <ColoredSankeyChartIcon />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as rectangles, the height represents their value. Flows are represented with curved lines whose width is proportional to their value.",
    },
    {
      id: "echartsTreemap",
      label: "Treemap diagram",
      icon: <ColoredTreeMapIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension. It is composed of an area divided into small rectangles, representing the last level of the tree structure. The rectangles’ size depends on the quantitative dimension.",
    },
    {
      id: "bigNumber",
      label: "Big Number diagram",
      icon: <ColoredBigNumberIcon />,
      categories: ["Key data points"],
      ssr: true,
      description:
        "Big number charts present specific, standout numerical values or key performance indicators in a visually prominent and easily digestible format, enabling quick recognition of important data points.",
    },
    {
      id: "echartsSunburst",
      label: "Sunburst diagram",
      icon: <ColoredSunburstIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension using concentric circles. The circle in the center represents the root node, with the hierarchies moving outward from the center. The angle of each arc corresponds to the qualitative dimension.",
    },
    {
      id: "echartsPiechart",
      label: "Pie Chart",
      icon: <ColoredPieIcon />,
      categories: ["Proportions"],
      ssr: false,
      description:
        "It allows you to see the proportions between values that make up a whole, by using arcs composing a circle.",
    },
    {
      id: "echartsCirclepacking",
      label: "Circle Packing Chart",
      icon: <ColoredCirclePackingIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays values of leaf nodes of a hierarchical structure by using circles areas. The hierarchical structure is depicted using nested circles. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "echartsForcegraph",
      label: "Network Graph",
      icon: <ColoredForceGraphIcon />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as circles, the size represents their value. Flows are represented with straight lines whose width is proportional to their value.",
    },
    {
      id: "echartsCirculargraph",
      label: "Circular Network Graph",
      icon: <ColoredCircularGraphIcon />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as circles",
    },
    {
      id: "echartsAreastack",
      label: "Line Stacked Chart",
      icon: <ColoredAreastackedIcon />,
      categories: ["Trends", "changes over time"],
      ssr: false,
      description:
        "Line stacked charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsBubblechart",
      label: "Bubble Chart",
      icon: <ColoredBubblechartIcon />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "The basic layout is a scatter plot, which allows to see correlations among two continuous dimensions. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "echartsHeatmap",
      label: "Heat map",
      icon: <ColoredBarChartIcon />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "The basic layout is a scatter plot, which allows to see correlations among two continuous dimensions. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "echartsRadarchart",
      label: "Radar Chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Correlations"],
      ssr: false,
      description:
        "It displays multiple continuous dimensions as axes starting from the same point and by disposing them radially. Each dimension is represented as an axis starting from the center of the cart. The same scale is applied to all the axes.",
    },
    {
      id: "echartsGraphgl",
      label: "Graph GL Chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Networks"],
      ssr: false,
      description: "It represents flows among nodes of a network.",
    },

    {
      id: "echartsAreatimeaxis",
      label: "Area Time Axis Chart",
      icon: <ColoredLineChartIcon />,
      categories: ["Time Series", "Correlations"],
      ssr: false,
      description:
        "It displays a quantitative dimension over a continuous interval or time period.",
    },
    {
      id: "echartsScatterchart",
      label: "Scatter Chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "It allows to see correlations among two continuous dimensions.",
    },
  ];
};
