import { EditorState } from "draft-js";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

export interface IRowFrame {
  rowIndex: number;
  rowId: string;
  forceSelectedType?: string;
  type: "rowFrame" | "divider";
  previewItems?: (string | object)[];
}
export interface IFramesArray {
  id: string;
  frame: IRowFrame;
  contentWidths: number[];
  contentHeights: number[];
  content: (object | string | null)[];
  contentTypes: ("text" | "divider" | "chart" | "video" | "image" | null)[];
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
  reportType: "basic" | "advanced" | "ai" | null;
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>;
  deleteFrame: (id: string) => void;
  framesArray: IFramesArray[];
  onSave: (type: "create" | "edit") => Promise<void>;
  hasSubHeaderTitleFocused: boolean;
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
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
}

export interface PlaceholderProps {
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>;
  framesArray: IFramesArray[];
  index?: number;
  disableAddrowStructureButton?: boolean;
  deleteFrame: (id: string) => void;
  rowId: string;
}
