import { Action, Thunk } from "easy-peasy";
import { AppliedFiltersStateModel } from "app/state/api/action-reducers/sync/filters";
import { DataThemesAppliedFiltersStateModel } from "app/state/api/action-reducers/sync/data-themes/filters";
import {
  DataThemesMappingStateModel,
  DataThemesStepChartTypeStateModel,
  DataThemesStepSelectionsStateModel,
  DataThemesIndexStateModel,
  DataThemesIdsStateModel,
  DataThemesActivePanelsStateModel,
  DataThemesTitlesStateModel,
  DataThemesTextContentStateModel,
  DataThemesPublicStateModel,
  DataThemesVizOrderStateModel,
  DataThemesVizDeletedStateModel,
  DataThemesVizDuplicatedStateModel,
  DataThemesTabDeletedStateModel,
  DataThemesEnabledFilterOptionGroupsStateModel,
} from "app/state/api/action-reducers/sync/data-themes";
import {
  AuthTokenModel,
  DataSourceSnackbarVisibilityStateModel,
  DataSourceStateModel,
  PageHeaderVizDrilldownsStateModel,
  ReportOrderStateModel,
  ToolBoxPanelAggregateByStateModel,
  ToolBoxPanelAllocationsPeriodStateModel,
  ToolBoxPanelBudgetFlowDrilldownSelectorsModel,
  ToolBoxPanelBudgetTimeCycleDrilldownYearSelectorModel,
  ToolBoxPanelDisbursementsSliderValuesModel,
  ToolBoxPanelDonorMapTypeStateModel,
  ToolBoxPanelDonorMapViewStateModel,
  ToolBoxPanelEligibilityAdvancedCheckboxStateModel,
  ToolBoxPanelEligibilityYearStateModel,
  ToolBoxPanelInvestmentsMapViewStateModel,
  ToolBoxPanelPFPeriodStateModel,
  ToolBoxPanelResultsYearStateModel,
} from "app/state/api/action-reducers/sync";
import {
  CMSApiComponentsAppBar,
  CMSApiComponentsChartsBudgets,
  CMSApiComponentsChartsCommon,
  CMSApiComponentsChartsEligibility,
  CMSApiComponentsChartsGeomap,
  CMSApiComponentsChartsGrants,
  CMSApiComponentsChartsInvestments,
  CMSApiComponentsChartsNetwork,
  CMSApiComponentsChartsPerformanceRating,
  CMSApiComponentsChartsPledges,
  CMSApiComponentsCookieDialog,
  CMSApiComponentsDatasetCarousel,
  CMSApiComponentsInformationPanel,
  CMSApiComponentsMobile,
  CMSApiComponentsPageHeader,
  CMSApiComponentsPerformanceFrameworkComponents,
  CMSApiComponentsSearch,
  CMSApiComponentsSlideInPanel,
  CMSApiModulesLanding,
  CMSApiModulesAbout,
  CMSApiModulesCommon,
  CMSApiModulesCountryDetail,
  CMSApiModulesDatasets,
  CMSApiModulesGrantDetail,
  CMSApiModulesGrants,
  CMSApiCountrySummary,
  CMSApiNotesAndDisclaimers,
} from "app/state/api/interfaces/cms";
import {
  DataPathActiveStepStateModel,
  DataPathPanelVisibilityStateModel,
  DataPathStepsStateModel,
} from "../action-reducers/sync/dataPath";
import {
  ChartsActivePanelsStateModel,
  ChartsChartTypeStateModel,
  ChartsDatasetStateModel,
  ChartsEnabledFilterOptionGroupsStateModel,
  ChartsMappingStateModel,
} from "../action-reducers/sync/charts";
import { ChartsAppliedFiltersStateModel } from "../action-reducers/sync/charts/filters";

export interface RequestValues<T> {
  values?: T;
  token?: string;
  getId?: string;
  patchId?: string;
  deleteId?: string;
  endpoint?: string;
  addOnData?: boolean;
  isCMSfetch?: boolean;
  filterString?: string;
  nonAuthCall?: boolean;
  storeInCrudData?: boolean;
}

export interface ResponseData<T> {
  data: any[];
  count: number;
  addOnData?: boolean;
  isUpdateCrudData?: boolean;
}

export interface Errors {
  status: number | null;
  statusText: string | null;
  result: object | null;
  data: object | null;
}

export interface ApiModel<QueryModel, ResponseModel> {
  loading: boolean;
  success: boolean;
  data: ResponseData<ResponseModel> | null | ResponseData<ResponseModel>[];
  crudData: object | object[] | null;
  setData: Action<ApiModel<QueryModel, ResponseModel>, any>;
  setCrudData: Action<ApiModel<QueryModel, object | object[] | null>, any>;
  errorData: Errors | null;
  onError: Action<ApiModel<QueryModel, ResponseModel>, Errors>;
  setSuccess: Action<ApiModel<QueryModel, ResponseModel>>;
  onSuccess: Action<
    ApiModel<QueryModel, ResponseModel>,
    ResponseData<ResponseModel> | ResponseData<ResponseModel>[]
  >;
  onSuccessCrudData: Action<
    ApiModel<QueryModel, ResponseModel>,
    ResponseData<ResponseModel> | ResponseData<ResponseModel>[]
  >;
  onRequest: Action<ApiModel<QueryModel, ResponseModel>>;
  fetch: Thunk<ApiModel<QueryModel, ResponseModel>, RequestValues<QueryModel>>;
  clear: Action<ApiModel<QueryModel, ResponseModel>>;
  fetchWithEndpoint: Thunk<
    ApiModel<QueryModel, ResponseModel>,
    RequestValues<QueryModel>
  >;
  post: Thunk<ApiModel<QueryModel, ResponseModel>, RequestValues<QueryModel>>;
  patch: Thunk<ApiModel<QueryModel, ResponseModel>, RequestValues<QueryModel>>;
  delete: Thunk<ApiModel<QueryModel, ResponseModel>, RequestValues<QueryModel>>;
}

// todo: add all available filters
interface ApiCallParamsFilters {}

export interface ApiCallParams {}

export interface ApiResponseModel {
  data: any[];
  count: number;
}

export type ApiCallModel = ApiModel<
  ApiCallParams | ApiCallParams[] | string,
  ApiResponseModel
>;

// CMS API Call model for
export type CMSApiCallModel = ApiModel<
  CMSApiCallParams,
  | CMSApiComponentsAppBar
  | CMSApiComponentsChartsBudgets
  | CMSApiComponentsChartsCommon
  | CMSApiComponentsChartsEligibility
  | CMSApiComponentsChartsGeomap
  | CMSApiComponentsChartsGrants
  | CMSApiComponentsChartsInvestments
  | CMSApiComponentsChartsNetwork
  | CMSApiComponentsChartsPerformanceRating
  | CMSApiComponentsChartsPledges
  | CMSApiComponentsCookieDialog
  | CMSApiComponentsDatasetCarousel
  | CMSApiComponentsInformationPanel
  | CMSApiComponentsMobile
  | CMSApiComponentsPageHeader
  | CMSApiComponentsPerformanceFrameworkComponents
  | CMSApiComponentsSearch
  | CMSApiComponentsSlideInPanel
  | CMSApiModulesLanding
  | CMSApiModulesAbout
  | CMSApiModulesCommon
  | CMSApiModulesCountryDetail
  | CMSApiModulesDatasets
  | CMSApiModulesGrantDetail
  | CMSApiModulesGrants
  | CMSApiCountrySummary
  | CMSApiNotesAndDisclaimers
>;

export interface CMSApiCallParams {}

export interface StoreModel {
  // global search
  GlobalSearch: ApiCallModel;

  // filter options api
  LocationFilterOptions: ApiCallModel;
  ComponentFilterOptions: ApiCallModel;
  PartnerTypeFilterOptions: ApiCallModel;
  StatusFilterOptions: ApiCallModel;
  ReplenishmentPeriodFilterOptions: ApiCallModel;
  DonorFilterOptions: ApiCallModel;
  // sync state variables
  AppliedFiltersState: AppliedFiltersStateModel;
  ToolBoxPanelPFPeriodState: ToolBoxPanelPFPeriodStateModel;
  PageHeaderVizDrilldownsState: PageHeaderVizDrilldownsStateModel;
  ToolBoxPanelAggregateByState: ToolBoxPanelAggregateByStateModel;
  ToolBoxPanelResultsYearState: ToolBoxPanelResultsYearStateModel;
  ToolBoxPanelDonorMapTypeState: ToolBoxPanelDonorMapTypeStateModel;
  ToolBoxPanelDonorMapViewState: ToolBoxPanelDonorMapViewStateModel;
  ToolBoxPanelEligibilityYearState: ToolBoxPanelEligibilityYearStateModel;
  ToolBoxPanelAllocationsPeriodState: ToolBoxPanelAllocationsPeriodStateModel;
  ToolBoxPanelInvestmentsMapViewState: ToolBoxPanelInvestmentsMapViewStateModel;
  ToolBoxPanelDisbursementsSliderValues: ToolBoxPanelDisbursementsSliderValuesModel;
  ToolBoxPanelBudgetFlowDrilldownSelectors: ToolBoxPanelBudgetFlowDrilldownSelectorsModel;
  ToolBoxPanelEligibilityAdvancedCheckboxState: ToolBoxPanelEligibilityAdvancedCheckboxStateModel;
  ToolBoxPanelBudgetTimeCycleDrilldownYearSelector: ToolBoxPanelBudgetTimeCycleDrilldownYearSelectorModel;
  // datasource selector
  DataSourceState: DataSourceStateModel;
  // AvailableDatasources: ApiCallModel;
  // MappedDatasets: ApiCallModel;
  DataSourceSnackbarVisibility: DataSourceSnackbarVisibilityStateModel;
  // sync data path vars
  DataPathPanelVisibilityState: DataPathPanelVisibilityStateModel;
  DataPathSteps: DataPathStepsStateModel;
  DataPathActiveStep: DataPathActiveStepStateModel;
  AuthToken: AuthTokenModel;
  // CMS
  cms: {
    componentsAppBar: CMSApiCallModel;
    componentsChartsBudgets: CMSApiCallModel;
    componentsChartsCommon: CMSApiCallModel;
    componentsChartsEligibility: CMSApiCallModel;
    componentsChartsGeomap: CMSApiCallModel;
    componentsChartsGrants: CMSApiCallModel;
    componentsChartsInvestments: CMSApiCallModel;
    componentsChartsNetwork: CMSApiCallModel;
    componentsChartsPerformanceRating: CMSApiCallModel;
    componentsChartsPledges: CMSApiCallModel;
    componentsCookieDialog: CMSApiCallModel;
    componentsDatasetCarousel: CMSApiCallModel;
    componentsInformationPanel: CMSApiCallModel;
    componentsMobile: CMSApiCallModel;
    componentsPageHeader: CMSApiCallModel;
    componentsPerformanceFrameworkComponents: CMSApiCallModel;
    componentsSearch: CMSApiCallModel;
    componentsSlideInPanel: CMSApiCallModel;
    modulesLanding: CMSApiCallModel;
    modulesAbout: CMSApiCallModel;
    modulesCommon: CMSApiCallModel;
    modulesCountryDetail: CMSApiCallModel;
    modulesDatasets: CMSApiCallModel;
    modulesGrantDetail: CMSApiCallModel;
    modulesGrants: CMSApiCallModel;
    countrySummary: CMSApiCallModel;
    notesAndDisclaimers: CMSApiCallModel;
  };
  dataThemes: {
    activeTabIndex: DataThemesIndexStateModel;
    activeVizIndex: DataThemesIndexStateModel;
    ids: DataThemesIdsStateModel;
    activePanels: DataThemesActivePanelsStateModel;
    titles: DataThemesTitlesStateModel;
    textContent: DataThemesTextContentStateModel;
    sync: {
      stepSelections: DataThemesStepSelectionsStateModel;
      chartType: DataThemesStepChartTypeStateModel;
      mapping: DataThemesMappingStateModel;
      public: DataThemesPublicStateModel;
      vizOrderData: DataThemesVizOrderStateModel;
      vizDeleted: DataThemesVizDeletedStateModel;
      vizDuplicated: DataThemesVizDuplicatedStateModel;
      tabDeleted: DataThemesTabDeletedStateModel;
      enabledFilterOptionGroups: DataThemesEnabledFilterOptionGroupsStateModel;
    };
    appliedFilters: DataThemesAppliedFiltersStateModel;
    DataThemeGet: ApiCallModel;
    DataThemeCreate: ApiCallModel;
    DataThemeUpdate: ApiCallModel;
    DataThemeDelete: ApiCallModel;
    DataThemeDuplicate: ApiCallModel;
    DataThemeGetList: ApiCallModel;
    DatasetGetList: ApiCallModel;
    DatasetCount: ApiCallModel;
    DatasetCreate: ApiCallModel;
    DatasetGet: ApiCallModel;
    ExternalDatasetGet: ApiCallModel;
    ExternalDatasetGetLimited: ApiCallModel;

    ExternalDatasetDownload: ApiCallModel;
  };
  charts: {
    ChartGet: ApiCallModel;
    ChartCreate: ApiCallModel;
    ChartUpdate: ApiCallModel;
    ChartDelete: ApiCallModel;
    ChartDuplicate: ApiCallModel;
    ChartGetList: ApiCallModel;
    ChartsCount: ApiCallModel;
    ChartTypesSuggest: ApiCallModel;
    activePanels: ChartsActivePanelsStateModel;
    dataset: ChartsDatasetStateModel;
    mapping: ChartsMappingStateModel;
    chartType: ChartsChartTypeStateModel;
    appliedFilters: ChartsAppliedFiltersStateModel;
    enabledFilterOptionGroups: ChartsEnabledFilterOptionGroupsStateModel;
  };
  reports: {
    ReportGet: ApiCallModel;
    ReportCreate: ApiCallModel;
    ReportUpdate: ApiCallModel;
    ReportDelete: ApiCallModel;
    ReportDuplicate: ApiCallModel;
    ReportGetList: ApiCallModel;
    ReportsCount: ApiCallModel;
  };
  search: {
    charts: ApiCallModel;
    reports: ApiCallModel;
    datasets: ApiCallModel;
  };
}
