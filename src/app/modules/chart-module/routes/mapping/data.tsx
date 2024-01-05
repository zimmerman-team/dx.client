import { ChartType } from "app/modules/chart-module/components/common-chart/";

export interface ChartBuilderMappingProps {
  loading: boolean;
  dimensions: any[];
  visualOptions: any;
  renderedChart: string;
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setVisualOptions: (value: any) => void;
  renderedChartType: ChartType;
}

export interface ChartBuilderMappingDimensionProps {
  dimension: any;
  dataTypes: any;

  replaceDimension: (
    fromDimension: string,
    toDimension: string,
    fromIndex: number,
    toIndex: number,
    multiple?: boolean
  ) => void;
}

export interface ChartBuilderMappingMessageProps {
  dimensions: any[];
  requiredFields: { id: string; name: string }[];
  minValuesFields: { id: string; name: string; minValues: number }[];
}

export const typeIcon = {
  string: "/icons/string.svg",
  number: "/icons/number.svg",
  date: "/icons/date.svg",
};
