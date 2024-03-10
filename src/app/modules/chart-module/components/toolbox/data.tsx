import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { ChartRenderedItem } from "app/modules/chart-module/data";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import TableChartIcon from "@material-ui/icons/TableChart";
import AssessmentIcon from "@material-ui/icons/Assessment";
import TuneIcon from "@material-ui/icons/Tune";
import PaletteIcon from "@material-ui/icons/Palette";

export interface ChartToolBoxProps {
  data: { [key: string]: string | number | null }[];
  loading: boolean;
  mappedData: any;
  chartName: string;
  openPanel?: number;
  dataSteps: boolean;
  guideView: boolean;
  textView: boolean;
  visualOptions: any;
  dimensions: any[];
  setDatasetName: React.Dispatch<React.SetStateAction<string>>;
  setToolboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openToolbox: boolean;
  onClose: () => void;
  onOpen: () => void;
  loadChartDataFromAPI: (
    customAppliedFilters?: [
      [
        {
          [key: string]: any[];
        }
      ]
    ]
  ) => void;
  exportView: boolean;
  rawViz: any;
  dataTypes: any;
  addVizToLocalStates: () => void;
  filterOptionGroups: FilterGroupModel[];
  setVisualOptions: (value: any) => void;
  loadDataset: (endpoint: string) => Promise<boolean>;
  setChartFromAPI: (
    value: React.SetStateAction<ChartRenderedItem | null>
  ) => void;
  deselectDataset: () => void;
}

export type ToolboxNavType =
  | "dataset"
  | "mapping"
  | "lock"
  | "customize"
  | "filters"
  | "chart"
  | "selectDataset";

export const toolboxNavContent = (
  page: string
): {
  name: ToolboxNavType;
  icon: JSX.Element;
  path: string;
}[] => [
  {
    name: "dataset",
    icon: <TableChartIcon />,
    path: `/chart/${page}/preview-data`,
  },
  {
    name: "chart",
    icon: <AssessmentIcon />,
    path: `/chart/${page}/chart-type`,
  },
  {
    name: "mapping",
    icon: <CloudDoneIcon />,
    path: `/chart/${page}/mapping`,
  },

  { name: "filters", icon: <TuneIcon />, path: `/chart/${page}/filters` },
  {
    name: "customize",
    icon: <PaletteIcon />,
    path: `/chart/${page}/customize`,
  },
];
