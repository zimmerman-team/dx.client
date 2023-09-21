import { AIChartTypeProps } from "app/modules/chart-module/data";

export interface ChartBuilderMappingProps {
  loading: boolean;
  dataTypes: any[];
  dimensions: any[];
  visualOptions: any;
  renderedChart: string;
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setVisualOptions: (value: any) => void;
  suggestedChartTypeArray: AIChartTypeProps[];
}

export interface ChartBuilderMappingDimensionProps {
  dimension: any;
  dataTypes: any;
  suggestedChartTypeArray: AIChartTypeProps[];
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
  errors: string[];
  requiredFields: { id: string; name: string }[];
  minValuesFields: { id: string; name: string; minValues: number }[];
}

export const typeIcon = {
  string: "/icons/string.svg",
  number: "/icons/number.svg",
  date: "/icons/date.svg",
};
