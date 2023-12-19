import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";

export interface DataThemesToolBoxPreviewProps {
  tabIndex: number;
  vizIndex: number;
  loadChartDataFromAPI: (
    customAppliedFilters?: [
      [
        {
          [key: string]: any[];
        }
      ]
    ]
  ) => void;
  filterOptionGroups: FilterGroupModel[];
}
