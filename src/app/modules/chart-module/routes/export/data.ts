import React from "react";
import { ChartType } from "app/modules/chart-module/components/common-chart";

export interface ChartBuilderExportProps {
  loading: boolean;
  visualOptions: any;
  renderedChart: string;
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setRawViz: React.Dispatch<any>;
  setVisualOptions: (value: any) => void;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  renderedChartType: ChartType;
}
