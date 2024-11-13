import { createStore, persist } from "easy-peasy";
import { StoreModel } from "app/state/api/interfaces";

import {
  AuthTokenState,
  DataSourceSnackbarVisibilityState,
  DataSourceState,
} from "app/state/api/action-reducers/sync";
import GlobalSearch, {
  GlobalSearchCharts,
  GlobalSearchDatasets,
  GlobalSearchReports,
} from "app/state/api/action-reducers/search";
import {
  DatasetGetList,
  DatasetCount,
  DatasetGet,
} from "app/state/api/action-reducers/data-themes";
import {
  ChartsActivePanelsState,
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsEnabledFilterOptionGroupsState,
  ChartsMappingState,
  SelectedAIChartState,
} from "app/state/api/action-reducers/sync/charts";
import { ChartsAppliedFiltersState } from "app/state/api/action-reducers/sync/charts/filters";
import {
  ChartCreate,
  ChartDelete,
  ChartDuplicate,
  ChartGet,
  ChartGetInReport,
  ChartGetList,
  ChartTypesSuggest,
  ChartUpdate,
  ChartsCount,
} from "app/state/api/action-reducers/charts";
import {
  ReportCreate,
  ReportDelete,
  ReportDuplicate,
  ReportGet,
  ReportGetList,
  ReportUpdate,
  ReportsCount,
} from "app/state/api/action-reducers/reports";
import {
  AssetGetList,
  AssetsCount,
} from "app/state/api/action-reducers/assets";
import { UserProfile } from "app/state/api/action-reducers/user";

const storeContent: StoreModel = {
  // global search
  GlobalSearch: persist(GlobalSearch),

  // sync state variables
  DataSourceState: persist(DataSourceState),
  DataSourceSnackbarVisibility: persist(DataSourceSnackbarVisibilityState),
  AuthToken: persist(AuthTokenState),
  user: {
    UserProfile: UserProfile,
  },
  dataThemes: {
    DatasetGetList: DatasetGetList,
    DatasetGet: persist(DatasetGet),
    DatasetCount: persist(DatasetCount),
  },
  assets: {
    AssetGetList: AssetGetList,
    AssetsCount: AssetsCount,
  },
  charts: {
    ChartGet: persist(ChartGet),
    ChartGetInReport: persist(ChartGetInReport),
    ChartCreate: persist(ChartCreate),
    ChartUpdate: persist(ChartUpdate),
    ChartDelete: persist(ChartDelete),
    ChartDuplicate: persist(ChartDuplicate),
    ChartGetList: ChartGetList,
    ChartsCount: persist(ChartsCount),
    ChartTypesSuggest: persist(ChartTypesSuggest),
    activePanels: persist(ChartsActivePanelsState),
    dataset: persist(ChartsDatasetState),
    mapping: persist(ChartsMappingState),
    chartType: persist(ChartsChartTypeState),
    appliedFilters: persist(ChartsAppliedFiltersState),
    enabledFilterOptionGroups: persist(ChartsEnabledFilterOptionGroupsState),
    SelectedAIChartState: persist(SelectedAIChartState),
  },
  reports: {
    ReportGet: persist(ReportGet),
    ReportCreate: persist(ReportCreate),
    ReportUpdate: persist(ReportUpdate),
    ReportDelete: persist(ReportDelete),
    ReportDuplicate: persist(ReportDuplicate),
    ReportGetList: ReportGetList,
    ReportsCount: persist(ReportsCount),
  },
  search: {
    charts: persist(GlobalSearchCharts),
    reports: persist(GlobalSearchReports),
    datasets: persist(GlobalSearchDatasets),
  },
};

export const store = createStore(storeContent);
