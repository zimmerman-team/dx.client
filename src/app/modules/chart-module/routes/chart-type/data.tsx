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
import ColoredRadarchartIcon from "app/assets/icons/data-themes-chart-types/coloredRadarChart";

import HeatmapIcon from "app/assets/icons/data-themes-chart-types/heatmap";
import ColoredHeatmapIcon from "app/assets/icons/data-themes-chart-types/coloredHeatmap";

import ScatterIcon from "app/assets/icons/data-themes-chart-types/scatter";
import ColoredScatterIcon from "app/assets/icons/data-themes-chart-types/coloredScatterChart";

import AreaTimeAxisIcon from "app/assets/icons/data-themes-chart-types/areatimeaxis";
import ColoredAreaTimeAxisIcon from "app/assets/icons/data-themes-chart-types/coloredAreatimeaxis";

import GraphGLIcon from "app/assets/icons/data-themes-chart-types/graphgl";
import ColoredGraphGLIcon from "app/assets/icons/data-themes-chart-types/coloredGraphGl";

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
import { ReactComponent as ScatterChartPreviewImg } from "app/modules/chart-module/assets/scatterChartPreview.svg";
import { ReactComponent as GraphGlPreviewImg } from "app/modules/chart-module/assets/graphglPreview.svg";
import { ReactComponent as AreatimeaxisPreviewImg } from "app/modules/chart-module/assets/areastackedPreview.svg";
import { ChartRenderedItem } from "app/modules/chart-module/data";
import { IChartType } from "app/state/api/action-reducers/sync/charts";

export interface ChartBuilderChartTypeProps {
  loading: boolean;
  loadDataset: (endpoint: string) => Promise<any>;
  setChartFromAPI: (
    value: React.SetStateAction<ChartRenderedItem | null>
  ) => void;
  setVisualOptions: (value: any) => void;
  setVisualOptionsOnChange: (value: any) => void;
  dataTypes: any;
}

export interface ChartTypeModel {
  id: IChartType;
  label: string;
  icon: React.ReactNode;
  categories: string[];
  description: string;
  ssr: boolean;
}
export const chartTypesFromMiddleWare = {
  barchart: "echartsBarchart",
  multisetbarchart: "echartsMultisetBarchart",
  stackedbarchart: "echartsStackedBarchart",
  geomap: "echartsGeomap",
  linechart: "echartsLinechart",
  sankey: "echartsSankey",
  treemap: "echartsTreemap",
  areastack: "echartsAreastack",
  sunburst: "echartsSunburst",
  piechart: "echartsPiechart",
  circlepacking: "echartsCirclepacking",
  circulargraph: "echartsCirculargraph",
  forcegraph: "echartsForcegraph",
  bubblechart: "echartsBubblechart",
  heatmap: "echartsHeatmap",
  radarchart: "echartsRadarchart",
  graphgl: "echartsGraphgl",
  areatimeaxis: "echartsAreatimeaxis",
  scatterchart: "echartsScatterchart",
};
interface IEchartTypes {
  id: IChartType;
  label: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  categories: string[];
  class: string;
  ssr: boolean;
  description: string;
}

const barChartDescription =
  "Bar charts present data by visually displaying and comparing categorical information or discrete values through the use of bars of varying lengths or heights.";
const changesOverTime = "changes over time";
const graphDescription =
  "Network graphs illustrate relationships between nodes in a network. Nodes are represented as points, and connections between nodes are depicted as lines";

export const echartTypes = (big: boolean): IEchartTypes[] => {
  return [
    {
      id: "echartsBarchart",
      label: "Bar chart",
      icon: <BarChartIcon big={big} />,
      preview: <BarChartPreviewImg />,
      categories: ["Correllations"],
      class: "basic",
      ssr: false,
      description: barChartDescription,
    },
    {
      id: "echartsMultisetBarchart",
      label: "Multi-set Bar chart",
      icon: <BarChartIcon big={big} />,
      preview: <BarChartPreviewImg />,
      categories: ["Correllations", "Proportions"],
      class: "advanced",
      ssr: false,
      description: barChartDescription,
    },
    {
      id: "echartsStackedBarchart",
      label: "Stacked Bar chart",
      icon: <BarChartIcon big={big} />,
      preview: <BarChartPreviewImg />,
      categories: ["Correllations", "Proportions"],
      class: "advanced",
      ssr: false,
      description: barChartDescription,
    },
    {
      id: "echartsLinechart",
      label: "Line chart",
      icon: <LineChartIcon big={big} />,
      preview: <LineChartPreviewImg />,
      categories: ["Trends", changesOverTime],
      class: "basic",

      ssr: false,
      description:
        "Line charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsPiechart",
      label: "Pie Chart",
      icon: <PieIcon big={big} />,
      preview: <PieChartPreviewImg />,
      categories: ["Proportions"],
      class: "basic",
      ssr: false,
      description:
        "Pie charts display data as slices of a circular pie, where each slice represents a category or value.",
    },
    {
      id: "echartsScatterchart",
      label: "Scatter Chart",
      icon: <ScatterIcon big={big} />,
      preview: <ScatterChartPreviewImg />,
      categories: ["Correlations", "Proportions"],
      class: "basic",
      ssr: false,
      description:
        "Scatter plot is a graphical representation of data points in a two-dimensional space. Scatter plots are used to analyze the relationship or correlation between two variables and identify any patterns or trends.",
    },
    {
      id: "echartsGeomap",
      label: "Geo map",
      icon: <GeomapChartIcon big={big} />,
      preview: <GeomapPreviewImg />,
      categories: ["Locations"],
      class: "basic",

      ssr: false,
      description:
        "A geomap is a map of a country, continent, or region map, with colors and values assigned to specific regions. Values are displayed as a color scale, and you can specify optional hovertext for regions. ",
    },

    {
      id: "echartsSankey",
      label: "Sankey diagram",
      icon: <SankeyChartIcon big={big} />,
      preview: <SankeyPreviewImg />,
      categories: ["Networks"],
      class: "advanced",

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
      class: "advanced",

      ssr: false,
      description:
        "Tree maps present hierarchical data structures by visually depicting the relative proportions and relationships among different categories or subcategories, making them useful for displaying complex data in a compact and informative manner.",
    },
    {
      id: "echartsHeatmap",
      label: "Heat map",
      icon: <HeatmapIcon big={big} />,
      preview: <HeatmapPreviewImg />,
      categories: ["Correlations", "Proportions"],
      class: "advanced",
      ssr: false,
      description:
        "Heatmaps visualize data using color-coded cells in a tabular format. Each cell represents a specific combination of two variables, typically displayed as rows and columns.",
    },
    {
      id: "echartsBubblechart",
      label: "Bubble Chart",
      icon: <BubblechartIcon big={big} />,
      preview: <BubbleChartPreviewImg />,
      categories: ["Correlations", "Proportions"],
      class: "advanced",
      ssr: false,
      description:
        "Bubble charts are used to display three dimensions of data on a two-dimensional plot. Each bubble represents a data point and is positioned based on its x and y values.",
    },
    {
      id: "echartsRadarchart",
      label: "Radar Chart",
      icon: <RadarchartIcon big={big} />,
      preview: <RadarChartPreviewImg />,
      categories: ["Correlations"],
      class: "advanced",
      ssr: false,
      description:
        "Radar charts are particularly useful for assessing and comparing the strengths and weaknesses of different data points or individuals across various attributes.",
    },
    {
      id: "bigNumber",
      label: "Big number",
      icon: <BigNumberIcon />,
      preview: <BigNumberPreviewImg />,
      categories: ["Key data points"],
      class: "advanced",

      ssr: true,
      description:
        "Big number charts present specific, standout numerical values or key performance indicators in a visually prominent and easily digestible format, enabling quick recognition of important data points.",
    },
    {
      id: "echartsAreastack",
      label: "Line Stacked Chart",
      icon: <AreastackedIcon big={big} />,
      preview: <AreastackedPreviewImg />,
      categories: ["Trends", changesOverTime],
      class: "compound",
      ssr: false,
      description:
        "Line stacked charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsAreatimeaxis",
      label: "Area Time Axis Chart",
      icon: <AreaTimeAxisIcon big={big} />,
      preview: <AreatimeaxisPreviewImg />,
      categories: ["Trends", changesOverTime],
      class: "compound",
      ssr: false,
      description:
        "Area time Axis charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsSunburst",
      label: "Sunburst diagram",
      icon: <SunburstIcon big={big} />,
      preview: <SunburstPreviewImg />,
      categories: ["Hierarchies", "Proportions"],
      class: "compound",

      ssr: false,
      description:
        "Sunburst charts visualize hierarchical data using a circular layout. The innermost circle represents the main category, while the subsequent circles represent subcategories.",
    },

    {
      id: "echartsCirclepacking",
      label: "Circle Packing Chart",
      icon: <CirclePackingIcon big={big} />,
      preview: <CirclepackingPreviewImg />,
      categories: ["Hierarchies", "Proportions"],
      class: "compound",
      ssr: false,
      description:
        "Circle Packing chart present hierarchical data structures by visually depicting the relative proportions and relationships among different categories or subcategories.",
    },
    {
      id: "echartsCirculargraph",
      label: "Circular Network Graph",
      icon: <CircularGraphIcon big={big} />,
      preview: <CirculargraphPreviewImg />,
      categories: ["Networks"],
      class: "compound",
      ssr: false,
      description: graphDescription,
    },
    {
      id: "echartsForcegraph",
      label: "Network Graph",
      icon: <ForceGraphIcon big={big} />,
      preview: <ForcegraphPreviewImg />,
      categories: ["Networks"],
      class: "compound",
      ssr: false,
      description: graphDescription,
    },

    {
      id: "echartsGraphgl",
      label: "Graph GL Chart",
      icon: <GraphGLIcon big={big} />,
      preview: <GraphGlPreviewImg />,
      categories: ["Networks"],
      class: "compound",
      ssr: false,
      description: graphDescription,
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
      description: barChartDescription,
    },
    {
      id: "echartsMultisetBarchart",
      label: "Multi-set Bar chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Correllations", "Proportions"],
      ssr: false,
      description: barChartDescription,
    },
    {
      id: "echartsStackedBarchart",
      label: "Stacked Bar chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Correllations", "Proportions"],
      ssr: false,
      description: barChartDescription,
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
      categories: ["Trends", changesOverTime],
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
        "Sunburst charts visualize hierarchical data using a circular layout. The innermost circle represents the main category, while the subsequent circles represent subcategories.",
    },
    {
      id: "echartsPiechart",
      label: "Pie Chart",
      icon: <ColoredPieIcon />,
      categories: ["Proportions"],
      ssr: false,
      description:
        "Pie charts display data as slices of a circular pie, where each slice represents a category or value.",
    },
    {
      id: "echartsCirclepacking",
      label: "Circle Packing Chart",
      icon: <ColoredCirclePackingIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "Circle Packing chart present hierarchical data structures by visually depicting the relative proportions and relationships among different categories or subcategories.",
    },
    {
      id: "echartsForcegraph",
      label: "Network Graph",
      icon: <ColoredForceGraphIcon />,
      categories: ["Networks"],
      ssr: false,
      description: graphDescription,
    },
    {
      id: "echartsCirculargraph",
      label: "Circular Network Graph",
      icon: <ColoredCircularGraphIcon />,
      categories: ["Networks"],
      ssr: false,
      description: graphDescription,
    },
    {
      id: "echartsAreastack",
      label: "Line Stacked Chart",
      icon: <ColoredAreastackedIcon />,
      categories: ["Trends", changesOverTime],
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
        "Bubble charts are used to display three dimensions of data on a two-dimensional plot. Each bubble represents a data point and is positioned based on its x and y values.",
    },
    {
      id: "echartsHeatmap",
      label: "Heat map",
      icon: <ColoredHeatmapIcon />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "Heatmaps visualize data using color-coded cells in a tabular format. Each cell represents a specific combination of two variables, typically displayed as rows and columns.",
    },
    {
      id: "echartsRadarchart",
      label: "Radar Chart",
      icon: <ColoredRadarchartIcon />,
      categories: ["Correlations"],
      ssr: false,
      description:
        "Radar charts are particularly useful for assessing and comparing the strengths and weaknesses of different data points or individuals across various attributes.",
    },
    {
      id: "echartsGraphgl",
      label: "Graph GL Chart",
      icon: <ColoredGraphGLIcon />,
      categories: ["Networks"],
      ssr: false,
      description: graphDescription,
    },

    {
      id: "echartsAreatimeaxis",
      label: "Area Time Axis Chart",
      icon: <ColoredAreaTimeAxisIcon />,
      categories: ["Trends", changesOverTime],
      ssr: false,
      description:
        "Area time Axis charts present data by illustrating trends and changes in continuous or sequential data points over time, making them ideal for visualizing patterns, fluctuations, or relationships in data.",
    },
    {
      id: "echartsScatterchart",
      label: "Scatter Chart",
      icon: <ColoredScatterIcon />,
      categories: ["Correlations", "Proportions"],
      ssr: false,
      description:
        "Scatter plot is a graphical representation of data points in a two-dimensional space. Scatter plots are used to analyze the relationship or correlation between two variables and identify any patterns or trends.",
    },
  ];
};
