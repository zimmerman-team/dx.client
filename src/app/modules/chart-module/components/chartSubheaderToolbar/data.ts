import { IFramesArray } from "app/modules/report-module/views/create/data";
import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

export interface SubheaderToolbarProps {
  name: string;
  isAiSwitchActive: boolean;
  visualOptions?: any;
  dimensions: any;
  setName: (name: string) => void;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistReportState?: () => void;
  isPreviewView: boolean;
  setAutoSaveState: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
      enableAutoSaveSwitch: boolean;
    }>
  >;
  autoSave: boolean;
  onSave: () => void;
  enableAutoSaveSwitch: boolean;
  savedChanges: boolean;
}

export interface ReportSubheaderToolbarProps {
  name: string;
  autoSave: boolean;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
  visualOptions?: any;
  onReportSave: (type: "create" | "edit") => Promise<void>;
  setName: (name: string) => void;
  isSaveEnabled?: boolean;
  rawViz?: any;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  plugins: ToolbarPluginsType;
  headerDetails: IHeaderDetails;
  framesArray: IFramesArray[];
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistReportState?: () => void;
  isPreviewView: boolean;
}
