import { ChartType } from "app/modules/chart-module/components/common-chart";

export interface ChartBuilderCustomizeProps {
  loading: boolean;
  dimensions: any[];
  mappedData: any[];
  visualOptions: any;
  renderedChart: string;
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setVisualOptions: (value: any) => void;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  renderedChartType: ChartType;
  containerRef: React.RefObject<HTMLDivElement>;
}
