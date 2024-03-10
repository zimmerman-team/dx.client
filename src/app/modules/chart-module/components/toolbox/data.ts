import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { ChartRenderedItem } from "app/modules/chart-module/data";

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
