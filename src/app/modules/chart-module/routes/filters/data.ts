import { ChartType } from "app/modules/chart-module/components/common-chart";

export interface ChartBuilderFiltersProps {
  loading: boolean;
  dimensions: any[];
  visualOptions: any;
  renderedChart: string;
  renderedChartMappedData: any;
  setVisualOptions: (value: any) => void;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setChartError: React.Dispatch<React.SetStateAction<boolean>>;
  renderedChartType: ChartType;
  containerRef: React.RefObject<HTMLDivElement>;
  isAIAssistedChart: boolean;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}
