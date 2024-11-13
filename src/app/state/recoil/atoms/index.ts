import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

export interface IRowFrameStructure {
  rowType:
    | "oneByOne"
    | "oneByTwo"
    | "oneByThree"
    | "oneByFour"
    | "oneByFive"
    | "";

  disableAddRowStructureButton: boolean;
  index: number;
}

const { persistAtom } = recoilPersist();

export const emptyRowsAtom = atom({
  key: "emptyRowsAtom",
  default: false,
});
export const untitledReportAtom = atom({
  key: "untitledReportAtom",
  default: false,
});

export const allAssetsViewAtom = atom<"grid" | "table">({
  key: "allAssetsViewAtom",
  default: "grid",
  effects_UNSTABLE: [persistAtom],
});

export const allAssetsSortBy = atom<"name" | "updatedDate" | "createdDate">({
  key: "allAssetsSortBy",
  default: "updatedDate",
  effects_UNSTABLE: [persistAtom],
});

export const homeDisplayAtom = atom<"all" | "data" | "charts" | "reports">({
  key: "homeDisplayAtom",
  default: "all",
  effects_UNSTABLE: [persistAtom],
});

export const reportRightPanelViewAtom = atom<
  "elements" | "charts" | "media" | "editHeader"
>({
  key: "reportRightPanelViewAtom",
  default: "charts",
});

export const isChartDraggingAtom = atom<"chart" | "bigNumber" | null>({
  key: "isChartDraggingAtom",
  default: null,
});

export const isDividerOrRowFrameDraggingAtom = atom<{
  state: boolean;
  rowId: string | null;
}>({
  key: "isDividerOrRowFrameDraggingAtom",
  default: {
    state: false,
    rowId: null,
  },
});
export const isChartAIAgentActive = atom<boolean>({
  key: "isChartAIAgentActiveAtom",
  default: true,
});

export const isChartAutoMappedAtom = atom<boolean>({
  key: "isChartAutoMappedAtom",
  default: false,
});

export const reportContentIsResizingAtom = atom<boolean>({
  key: "reportContentIsResizing",
  default: false,
});

export const reportContentContainerWidth = atom<number>({
  key: "reportContentContainerWidth",
  default: 0,
});

export const reportCreationTourStepAtom = atom<number>({
  key: "reportCreationTourStepAtom",
  default: 0,
});

export const loadedDatasetsAtom = atom<DatasetListItemAPIModel[]>({
  key: "loadedDatasetsAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const loadedChartsInReportAtom = atom<string[]>({
  key: "loadedChartsInReportAtom",
  default: [],
});

export const chartFromReportAtom = atom<{
  state: boolean;
  view: string;
  page: string;
  action: "create" | "edit" | null;
  chartId: string | null;
}>({
  key: "chartFromReportAtom",
  default: {
    state: false,
    view: "",
    page: "",
    action: null,
    chartId: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export const dataUploadTabAtom = atom<"search" | "file">({
  key: "dataUploadTabAtom",
  default: "search",
  effects_UNSTABLE: [persistAtom],
});

export const planDialogAtom = atom<{
  open: boolean;
  message: string;
  tryAgain: string;
  onTryAgain: () => void;
}>({
  key: "planDialogAtom",
  default: {
    open: false,
    message: "",
    tryAgain: "",
    onTryAgain: () => {},
  },
});

export const fetchPlanLoadingAtom = atom<boolean>({
  key: "fetchPlanLoadingAtom",
  default: false,
});
