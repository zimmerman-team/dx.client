import { EditorState } from "draft-js";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

export interface ReportEditViewProps {
  open: boolean;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  hasSubHeaderTitleFocused: boolean;
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>;
  framesArray: IFramesArray[];
  localPickedCharts: string[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  setAutoSave: React.Dispatch<React.SetStateAction<boolean>>;
  handlePersistReportState: () => void;
  reportName: string;
  headerDetails: {
    title: EditorState;
    showHeader: boolean;
    description: EditorState;
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    dateColor: string;
  };
  setHeaderDetails: React.Dispatch<
    React.SetStateAction<{
      title: EditorState;
      showHeader: boolean;
      description: EditorState;
      backgroundColor: string;
      titleColor: string;
      descriptionColor: string;
      dateColor: string;
    }>
  >;
  setAppliedHeaderDetails: React.Dispatch<
    React.SetStateAction<{
      title: EditorState;
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
  stopInitializeFramesWidth: boolean;
  setStopInitializeFramesWidth: React.Dispatch<React.SetStateAction<boolean>>;

  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  isEditorFocused: boolean;
  setIsEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
}
