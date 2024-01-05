import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { convertToRaw, EditorState } from "draft-js";
import { DatasetListItemAPIModel } from "app/modules/data-themes-module/sub-modules/list";

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

export const cmsDataAtom = atom({
  key: "cmsDataAtom",
  default: {
    componentsAppBar: {},
    componentsChartsBudgets: {},
    componentsChartsCommon: {},
    componentsChartsEligibility: {},
    componentsChartsGeomap: {},
    componentsChartsGrants: {},
    componentsChartsInvestments: {},
    componentsChartsNetwork: {},
    componentsChartsPerformanceRating: {},
    componentsChartsPledges: {},
    componentsCookieDialog: {},
    componentsDatasetCarousel: {},
    componentsInformationPanel: {},
    componentsMobile: {},
    componentsPageHeader: {},
    componentsPerformanceFrameworkComponents: {},
    componentsSearch: {},
    componentsSlideInPanel: {},
    modulesLanding: {},
    modulesAbout: {},
    modulesCommon: {},
    modulesCountryDetail: {},
    modulesDatasets: {},
    modulesGrantDetail: {},
    modulesGrants: {},
  },
  effects_UNSTABLE: [persistAtom],
});

export const emptyRowsAtom = atom({
  key: "emptyRowsAtom",
  default: false,
});
export const untitledReportAtom = atom({
  key: "untitledReportAtom",
  default: false,
});

export const homeDisplayAtom = atom<"data" | "charts" | "reports">({
  key: "homeDisplayAtom",
  default: "reports",
});

export const reportRightPanelViewAtom = atom<
  "elements" | "charts" | "media" | "editHeader"
>({
  key: "reportRightPanelViewAtom",
  default: "elements",
});

export const isChartDraggingAtom = atom<"chart" | "bigNumber" | null>({
  key: "isChartDraggingAtom",
  default: null,
});

export const isDividerOrRowFrameDraggingAtom = atom<boolean>({
  key: "isDividerOrRowFrameDraggingAtom",
  default: false,
});

export const unSavedReportPreviewMode = atom<boolean>({
  key: "unSavedReportPreviewMode",
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
export const unSavedReportPreviewModeAtom = atom<boolean>({
  key: "unSavedReportPreviewModeAtom",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const loadedDatasetsAtom = atom<DatasetListItemAPIModel[]>({
  key: "loadedDatasetsAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const createChartFromReportAtom = atom<{
  state: boolean;
  view: string;
  page: string;
  action: "create" | "edit" | null;
}>({
  key: "createChartFromReportAtom",
  default: {
    state: false,
    view: "",
    page: "",
    action: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export const persistedReportStateAtom = atom<{
  reportName: string;
  headerDetails: {
    title: string;
    description: string;
    showHeader: boolean;
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    dateColor: string;
  };

  framesArray: string;
}>({
  key: "reportCreateStateAtom",
  default: {
    reportName: "Untitled report",
    headerDetails: {
      title: "",
      description: JSON.stringify(
        convertToRaw(EditorState.createEmpty().getCurrentContent())
      ),
      showHeader: true,
      backgroundColor: "#252c34",
      titleColor: "#ffffff",
      descriptionColor: "#ffffff",
      dateColor: "#ffffff",
    },

    framesArray: JSON.stringify([]),
  },
  effects_UNSTABLE: [persistAtom],
});
