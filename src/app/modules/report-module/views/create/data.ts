import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "../../components/right-panel/data";

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
  hasReportNameFocused: boolean;
  handlePersistReportState: () => void;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;

  handleRowFrameItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;

  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
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
