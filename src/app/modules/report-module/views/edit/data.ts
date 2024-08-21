import { EditorState } from "draft-js";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { Updater } from "use-immer";

export interface ReportEditViewProps {
  rightPanelOpen: boolean;
  handleRightPanelOpen: () => void;
  reportType: "basic" | "advanced" | "ai" | null;
  isSaveEnabled: boolean;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  hasSubHeaderTitleFocused: boolean;
  setHasSubHeaderTitleFocused: React.Dispatch<React.SetStateAction<boolean>>;
  updateFramesArray: Updater<IFramesArray[]>;
  framesArray: IFramesArray[];
  localPickedCharts: string[];
  setReportName: React.Dispatch<React.SetStateAction<string>>;
  autoSave: boolean;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
  reportName: string;
  setHasChangesBeenMade: React.Dispatch<React.SetStateAction<boolean>>;
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
  stopInitializeFramesWidth: boolean;
  setStopInitializeFramesWidth: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (type: "create" | "edit") => Promise<void>;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
}
