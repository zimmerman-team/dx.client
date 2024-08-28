import { ChartType } from "app/modules/chart-module/components/common-chart/";

export interface ChartBuilderMappingProps {
  loading: boolean;
  dimensions: any[];
  visualOptions: any;
  renderedChart: string;
  renderedChartMappedData: any;
  setChartError: React.Dispatch<React.SetStateAction<boolean>>;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setVisualOptions: (value: any) => void;
  renderedChartType: ChartType;
  containerRef: React.RefObject<HTMLDivElement>;
  isAIAssistedChart: boolean;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}

export interface ChartBuilderMappingMessageProps {
  dimensions: any[];
  requiredFields: { id: string; name: string }[];
  minValuesFields: { id: string; name: string; minValues: number }[];
}
