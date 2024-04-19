import { createStore, persist } from "easy-peasy";
import { StoreModel } from "app/state/api/interfaces";

import { AppliedFiltersState } from "app/state/api/action-reducers/sync/filters";
import {
  AuthTokenState,
  DataSourceSnackbarVisibilityState,
  DataSourceState,
  PageHeaderVizDrilldownsState,
  ToolBoxPanelAggregateByState,
  ToolBoxPanelAllocationsPeriodState,
  ToolBoxPanelBudgetFlowDrilldownSelectors,
  ToolBoxPanelBudgetTimeCycleDrilldownYearSelector,
  ToolBoxPanelDisbursementsSliderValues,
  ToolBoxPanelDonorMapTypeState,
  ToolBoxPanelDonorMapViewState,
  ToolBoxPanelEligibilityAdvancedCheckboxState,
  ToolBoxPanelEligibilityYearState,
  ToolBoxPanelInvestmentsMapViewState,
  ToolBoxPanelPFPeriodState,
  ToolBoxPanelResultsYearState,
} from "app/state/api/action-reducers/sync";

import GlobalSearch, {
  GlobalSearchCharts,
  GlobalSearchDatasets,
  GlobalSearchReports,
} from "app/state/api/action-reducers/search";

import DonorFilterOptions from "app/state/api/action-reducers/filters/donors";
import StatusFilterOptions from "app/state/api/action-reducers/filters/status";
import LocationFilterOptions from "app/state/api/action-reducers/filters/locations";
import ComponentFilterOptions from "app/state/api/action-reducers/filters/components";
import PartnerTypeFilterOptions from "app/state/api/action-reducers/filters/partnerTypes";
import ReplenishmentPeriodFilterOptions from "app/state/api/action-reducers/filters/replenishmentPeriods";

import componentsAppBar from "app/state/api/action-reducers/cms/componentsAppBar";
import componentsChartsBudgets from "app/state/api/action-reducers/cms/componentsChartsBudgets";
import componentsChartsCommon from "app/state/api/action-reducers/cms/componentsChartsCommon";
import componentsChartsEligibility from "app/state/api/action-reducers/cms/componentsChartsEligibility";
import componentsChartsGeomap from "app/state/api/action-reducers/cms/componentsChartsGeomap";
import componentsChartsGrants from "app/state/api/action-reducers/cms/componentsChartsGrants";
import componentsChartsInvestments from "app/state/api/action-reducers/cms/componentsChartsInvestments";
import componentsChartsNetwork from "app/state/api/action-reducers/cms/componentsChartsNetwork";
import componentsChartsPerformanceRating from "app/state/api/action-reducers/cms/componentsChartsPerformanceRating";
import componentsChartsPledges from "app/state/api/action-reducers/cms/componentsChartsPledges";
import componentsCookieDialog from "app/state/api/action-reducers/cms/componentsCookieDialog";
import componentsDatasetCarousel from "app/state/api/action-reducers/cms/componentsDatasetCarousel";
import componentsInformationPanel from "app/state/api/action-reducers/cms/componentsInformationPanel";
import componentsMobile from "app/state/api/action-reducers/cms/componentsMobile";
import componentsPageHeader from "app/state/api/action-reducers/cms/componentsPageHeader";
import componentsPerformanceFrameworkComponents from "app/state/api/action-reducers/cms/componentsPerformanceFrameworkComponents";
import componentsSearch from "app/state/api/action-reducers/cms/componentsSearch";
import componentsSlideInPanel from "app/state/api/action-reducers/cms/componentsSlideInPanel";
import modulesLanding from "app/state/api/action-reducers/cms/modulesLanding";
import modulesAbout from "app/state/api/action-reducers/cms/modulesAbout";
import modulesCommon from "app/state/api/action-reducers/cms/modulesCommon";
import modulesCountryDetail from "app/state/api/action-reducers/cms/modulesCountryDetail";
import modulesDatasets from "app/state/api/action-reducers/cms/modulesDatasets";
import modulesGrantDetail from "app/state/api/action-reducers/cms/modulesGrantDetail";
import modulesGrants from "app/state/api/action-reducers/cms/modulesGrants";
import {
  DataThemesMappingState,
  DataThemesStepChartTypeState,
  DataThemesStepSelectionsState,
  DataThemesIndexState,
  DataThemesVizIndexState,
  DataThemesIdsState,
  DataThemesActivePanelsState,
  DataThemesTitlesState,
  DataThemesTextContentState,
  DataThemesPublicState,
  DataThemesVizOrderState,
  DataThemesVizDeletedState,
  DataThemesVizDuplicatedState,
  DataThemesTabDeletedState,
  DataThemesEnabledFilterOptionGroupsState,
} from "app/state/api/action-reducers/sync/data-themes";
import { DataThemesAppliedFiltersState } from "app/state/api/action-reducers/sync/data-themes/filters";
import {
  DataThemeCreate,
  DataThemeDelete,
  DataThemeDuplicate,
  DataThemeGet,
  DataThemeGetList,
  DataThemeUpdate,
  DatasetGetList,
  DatasetCreate,
  DatasetCount,
  DatasetGet,
  ExternalDatasetGet,
  ExternalDatasetDownload,
  ExternalDatasetGetLimited,
} from "app/state/api/action-reducers/data-themes";
import countrySummary from "../api/action-reducers/cms/countrySummary";
import notesAndDisclaimers from "../api/action-reducers/cms/notesAndDisclaimers";
import {
  DataPathActiveStep,
  DataPathPanelVisibilityState,
  DataPathStepsState,
} from "../api/action-reducers/sync/dataPath";

import {
  ChartsActivePanelsState,
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsEnabledFilterOptionGroupsState,
  ChartsMappingState,
} from "../api/action-reducers/sync/charts";
import { ChartsAppliedFiltersState } from "../api/action-reducers/sync/charts/filters";
import {
  ChartCreate,
  ChartDelete,
  ChartDuplicate,
  ChartGet,
  ChartGetInReport,
  ChartGetList,
  ChartUpdate,
  ChartsCount,
} from "../api/action-reducers/charts";
import {
  ReportCreate,
  ReportDelete,
  ReportDuplicate,
  ReportGet,
  ReportGetList,
  ReportUpdate,
  ReportsCount,
} from "../api/action-reducers/reports";

const storeContent: StoreModel = {
  // global search
  GlobalSearch: persist(GlobalSearch),

  // filter options api
  LocationFilterOptions: persist(LocationFilterOptions),
  ComponentFilterOptions: persist(ComponentFilterOptions),
  PartnerTypeFilterOptions: persist(PartnerTypeFilterOptions),
  StatusFilterOptions: persist(StatusFilterOptions),
  ReplenishmentPeriodFilterOptions: persist(ReplenishmentPeriodFilterOptions),
  DonorFilterOptions: persist(DonorFilterOptions),
  // sync state variables
  AppliedFiltersState: persist(AppliedFiltersState),
  ToolBoxPanelPFPeriodState: persist(ToolBoxPanelPFPeriodState),
  PageHeaderVizDrilldownsState: persist(PageHeaderVizDrilldownsState),
  ToolBoxPanelAggregateByState: persist(ToolBoxPanelAggregateByState),
  ToolBoxPanelResultsYearState: persist(ToolBoxPanelResultsYearState),
  ToolBoxPanelDonorMapTypeState: persist(ToolBoxPanelDonorMapTypeState),
  ToolBoxPanelDonorMapViewState: persist(ToolBoxPanelDonorMapViewState),
  ToolBoxPanelEligibilityYearState: persist(ToolBoxPanelEligibilityYearState),
  ToolBoxPanelInvestmentsMapViewState: persist(
    ToolBoxPanelInvestmentsMapViewState
  ),
  ToolBoxPanelAllocationsPeriodState: persist(
    ToolBoxPanelAllocationsPeriodState
  ),
  ToolBoxPanelDisbursementsSliderValues,
  ToolBoxPanelEligibilityAdvancedCheckboxState: persist(
    ToolBoxPanelEligibilityAdvancedCheckboxState
  ),
  ToolBoxPanelBudgetFlowDrilldownSelectors,
  ToolBoxPanelBudgetTimeCycleDrilldownYearSelector,
  DataSourceState: persist(DataSourceState),
  // sync data path vars
  DataPathPanelVisibilityState,
  DataPathSteps: persist(DataPathStepsState),
  DataPathActiveStep: DataPathActiveStep,

  DataSourceSnackbarVisibility: persist(DataSourceSnackbarVisibilityState),
  AuthToken: AuthTokenState,
  // CMS API
  cms: {
    componentsAppBar: persist(componentsAppBar),
    componentsChartsBudgets: persist(componentsChartsBudgets),
    componentsChartsCommon: persist(componentsChartsCommon),
    componentsChartsEligibility: persist(componentsChartsEligibility),
    componentsChartsGeomap: persist(componentsChartsGeomap),
    componentsChartsGrants: persist(componentsChartsGrants),
    componentsChartsInvestments: persist(componentsChartsInvestments),
    componentsChartsNetwork: persist(componentsChartsNetwork),
    componentsChartsPerformanceRating: persist(
      componentsChartsPerformanceRating
    ),
    componentsChartsPledges: persist(componentsChartsPledges),
    componentsCookieDialog: persist(componentsCookieDialog),
    componentsDatasetCarousel: persist(componentsDatasetCarousel),
    componentsInformationPanel: persist(componentsInformationPanel),
    componentsMobile: persist(componentsMobile),
    componentsPageHeader: persist(componentsPageHeader),
    componentsPerformanceFrameworkComponents: persist(
      componentsPerformanceFrameworkComponents
    ),
    componentsSearch: persist(componentsSearch),
    componentsSlideInPanel: persist(componentsSlideInPanel),
    modulesLanding: persist(modulesLanding),
    modulesAbout: persist(modulesAbout),
    modulesCommon: persist(modulesCommon),
    modulesCountryDetail: persist(modulesCountryDetail),
    modulesDatasets: persist(modulesDatasets),
    modulesGrantDetail: persist(modulesGrantDetail),
    modulesGrants: persist(modulesGrants),
    countrySummary: persist(countrySummary),
    notesAndDisclaimers: persist(notesAndDisclaimers),
  },
  dataThemes: {
    activeTabIndex: persist(DataThemesIndexState),
    activeVizIndex: persist(DataThemesVizIndexState),
    ids: persist(DataThemesIdsState),
    activePanels: persist(DataThemesActivePanelsState),
    titles: persist(DataThemesTitlesState),
    textContent: persist(DataThemesTextContentState),
    sync: {
      stepSelections: persist(DataThemesStepSelectionsState),
      chartType: persist(DataThemesStepChartTypeState),
      mapping: persist(DataThemesMappingState),
      public: persist(DataThemesPublicState),
      vizOrderData: persist(DataThemesVizOrderState),
      vizDeleted: persist(DataThemesVizDeletedState),
      vizDuplicated: persist(DataThemesVizDuplicatedState),
      tabDeleted: persist(DataThemesTabDeletedState),
      enabledFilterOptionGroups: persist(
        DataThemesEnabledFilterOptionGroupsState
      ),
    },
    appliedFilters: persist(DataThemesAppliedFiltersState),
    DataThemeGet: persist(DataThemeGet),
    DataThemeCreate: persist(DataThemeCreate),
    DataThemeUpdate: persist(DataThemeUpdate),
    DataThemeDelete: persist(DataThemeDelete),
    DataThemeDuplicate: persist(DataThemeDuplicate),
    DataThemeGetList: persist(DataThemeGetList),
    DatasetGetList: DatasetGetList,
    DatasetGet: persist(DatasetGet),
    ExternalDatasetGet: persist(ExternalDatasetGet),
    ExternalDatasetGetLimited: persist(ExternalDatasetGetLimited),

    ExternalDatasetDownload: persist(ExternalDatasetDownload),
    DatasetCount: persist(DatasetCount),
    DatasetCreate: persist(DatasetCreate),
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
    activePanels: persist(ChartsActivePanelsState),
    dataset: persist(ChartsDatasetState),
    mapping: persist(ChartsMappingState),
    chartType: persist(ChartsChartTypeState),
    appliedFilters: persist(ChartsAppliedFiltersState),
    enabledFilterOptionGroups: persist(ChartsEnabledFilterOptionGroupsState),
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
