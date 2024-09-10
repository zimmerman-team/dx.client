import { Action, Thunk } from "easy-peasy";
import {
  AuthTokenModel,
  DataSourceSnackbarVisibilityStateModel,
  DataSourceStateModel,
} from "app/state/api/action-reducers/sync";
import {
  ChartsActivePanelsStateModel,
  ChartsChartTypeStateModel,
  ChartsDatasetStateModel,
  ChartsEnabledFilterOptionGroupsStateModel,
  ChartsMappingStateModel,
  SelectedAIChartModel,
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
  planWarning: string | null;
  data: ResponseData<ResponseModel> | null | ResponseData<ResponseModel>[];
  crudData: object | object[] | null;
  setData: Action<ApiModel<QueryModel, ResponseModel>, any>;
  setCrudData: Action<ApiModel<QueryModel, object | object[] | null>, any>;
  errorData: Errors | null;
  onError: Action<ApiModel<QueryModel, ResponseModel>, Errors>;
  setSuccess: Action<ApiModel<QueryModel, ResponseModel>>;
  setPlanWarning: Action<ApiModel<QueryModel, ResponseModel>, string>;
  clearPlanWarning: Action<ApiModel<QueryModel, ResponseModel>>;
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

interface ApiCallParams {}

interface ApiResponseModel {
  data: any[];
  count: number;
}

export type ApiCallModel = ApiModel<
  ApiCallParams | ApiCallParams[] | string,
  ApiResponseModel
>;

export interface StoreModel {
  // global search
  GlobalSearch: ApiCallModel;
  // datasource selector
  DataSourceState: DataSourceStateModel;
  // AvailableDatasources: ApiCallModel;
  // MappedDatasets: ApiCallModel;
  DataSourceSnackbarVisibility: DataSourceSnackbarVisibilityStateModel;
  // sync data path vars
  AuthToken: AuthTokenModel;
  dataThemes: {
    DatasetGetList: ApiCallModel;
    DatasetCount: ApiCallModel;
    DatasetGet: ApiCallModel;
  };
  assets: {
    AssetGetList: ApiCallModel;
    AssetsCount: ApiCallModel;
  };
  charts: {
    ChartGet: ApiCallModel;
    ChartGetInReport: ApiCallModel;
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
    SelectedAIChartState: SelectedAIChartModel;
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
