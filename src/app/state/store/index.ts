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
  GlobalSearchStories,
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
  ChartGetInStory,
  ChartGetList,
  ChartTypesSuggest,
  ChartUpdate,
  ChartsCount,
} from "app/state/api/action-reducers/charts";
import {
  StoryCreate,
  StoryDelete,
  StoryDuplicate,
  StoryGet,
  StoryGetList,
  StoryUpdate,
  StoriesCount,
} from "app/state/api/action-reducers/stories";
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
    ChartGetInStory: persist(ChartGetInStory),
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
  stories: {
    StoryGet: persist(StoryGet),
    StoryCreate: persist(StoryCreate),
    StoryUpdate: persist(StoryUpdate),
    StoryDelete: persist(StoryDelete),
    StoryDuplicate: persist(StoryDuplicate),
    StoryGetList: StoryGetList,
    StoriesCount: persist(StoriesCount),
  },
  search: {
    charts: persist(GlobalSearchCharts),
    stories: persist(GlobalSearchStories),
    datasets: persist(GlobalSearchDatasets),
  },
};

export const store = createStore(storeContent);
