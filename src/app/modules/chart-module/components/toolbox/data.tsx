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
  renderChartFromAPI: (chartId?: string | undefined) => Promise<void>;
  exportView: boolean;
  rawViz: any;
  dataTypes: any;
  filterOptionGroups: FilterGroupModel[];
  setVisualOptions: (value: any) => void;
  loadDataset: (endpoint: string) => Promise<boolean>;
  setChartFromAPI: (
    value: React.SetStateAction<ChartRenderedItem | null>
  ) => void;
  deselectDataset: () => void;
  onSave: () => void;
  triggerAutoSave: () => void;
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
  tooltip: string;
  displayTooltip: boolean;
}[] => [
  {
    name: "dataset",
    icon: <TableChartIcon />,
    path: `/chart/${page}/preview-data`,
    tooltip: "Dataset Selection",
    displayTooltip: false,
  },
  {
    name: "chart",
    icon: <AssessmentIcon />,
    path: `/chart/${page}/chart-type`,
    tooltip: "Chart type",
    displayTooltip: false,
  },
  {
    name: "mapping",
    icon: <CloudDoneIcon />,
    path: `/chart/${page}/mapping`,
    tooltip: "Mapping",
    displayTooltip: false,
  },

  {
    name: "filters",
    icon: <TuneIcon />,
    path: `/chart/${page}/filters`,
    tooltip: "Filter",
    displayTooltip: false,
  },
  {
    name: "customize",
    icon: <PaletteIcon />,
    path: `/chart/${page}/customize`,
    tooltip: "Customisation",
    displayTooltip: false,
  },
];
