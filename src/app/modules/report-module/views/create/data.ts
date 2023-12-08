import { EditorState } from "draft-js";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

export interface IRowFrame {
  rowIndex: number;
  rowId: string;
  forceSelectedType?: string;

  type: "rowFrame" | "divider";
  handleRowFrameItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
  previewItems?: (string | object)[];
  handlePersistReportState: () => void;
}
export interface IFramesArray {
  id: string;
  frame: IRowFrame;
  contentWidths: number[];
  contentHeights: number[];
  content: (object | string | null)[];
  contentTypes: ("text" | "divider" | "chart" | null)[];
  structure:
    | null
    | "oneByOne"
    | "oneByTwo"
    | "oneByThree"
    | "oneByFour"
    | "oneByFive";
}

export interface IFramesArrayWithItems extends IFramesArray {
  items: (string | object)[];
}

export interface ReportCreateViewProps {
  open: boolean;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  setReportName: React.Dispatch<React.SetStateAction<string>>;
  reportName: string;
  reportType: "basic" | "advanced" | "ai";
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>;
  deleteFrame: (id: string) => void;
  framesArray: IFramesArray[];
  hasSubHeaderTitleFocused: boolean;
  handlePersistReportState: () => void;
  headerDetails: {
    title: string;
    showHeader: boolean;
    description: EditorState;
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    dateColor: string;
  };
  setHeaderDetails: React.Dispatch<
    React.SetStateAction<{
      title: string;
      showHeader: boolean;
      description: EditorState;
      backgroundColor: string;
      titleColor: string;
      descriptionColor: string;
      dateColor: string;
    }>
  >;

  handleRowFrameItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;

  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  isEditorFocused: boolean;
  setIsEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlaceholderProps {
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>;

  framesArray: IFramesArray[];
  index?: number;
  disableAddrowStructureButton?: boolean;
  deleteFrame: (id: string) => void;
  rowId: string;
  handlePersistReportState: () => void;

  handleRowFrameItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
}
