import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";
import { Updater } from "use-immer";

export interface ReportEditViewProps {
  rightPanelOpen: boolean;
  handleRightPanelOpen: () => void;
  reportType: "basic" | "advanced" | "ai" | null;
  isSaveEnabled: boolean;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  hasReportNameFocused: boolean;
  setHasReportNameFocused: React.Dispatch<React.SetStateAction<boolean>>;
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
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
  setHasChangesBeenMade: React.Dispatch<React.SetStateAction<boolean>>;
  stopInitializeFramesWidth: boolean;
  setStopInitializeFramesWidth: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (type: "create" | "edit") => Promise<void>;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
}
