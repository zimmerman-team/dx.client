import { ChartAPIModel } from "app/modules/chart-module/data";

export interface ChartBuilderPreviewThemeProps {
  editable: any;
  loading: boolean;
  visualOptions: any;
  renderedChart: string;
  renderedChartMappedData: any;
  setVisualOptions: (value: any) => void;
  setIsPreviewView: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement>;
  loadedChart: ChartAPIModel;
  isMappingValid: boolean;
  view: string | undefined;
  isAIAssistedChart: boolean;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}
