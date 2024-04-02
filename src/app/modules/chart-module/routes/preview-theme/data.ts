import { ChartAPIModel } from "app/modules/chart-module/data";

export interface ChartBuilderPreviewThemeProps {
  editable: any;
  loading: boolean;
  visualOptions: any;
  renderedChart: string;
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setVisualOptions: (value: any) => void;
  setIsPreviewView: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement>;
  loadedChart: ChartAPIModel;
  view: string | undefined;
}
