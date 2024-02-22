import { IFramesArray } from "app/modules/report-module/views/create/data";
import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

export interface SubheaderToolbarProps {
  name: string;
  visualOptions?: any;
  dimensions: any;
  setName: (name: string) => void;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistReportState?: () => void;
  isPreviewView: boolean;
}

export interface ReportSubheaderToolbarProps {
  name: string;
  autoSave: boolean;
  setAutoSave: React.Dispatch<React.SetStateAction<boolean>>;
  visualOptions?: any;
  onReportSave: (type: "create" | "edit") => Promise<void>;
  setName: (name: string) => void;
  forceEnablePreviewSave?: boolean;
  rawViz?: any;
  reportName: string;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  plugins: ToolbarPluginsType;
  isEditorFocused: boolean;
  headerDetails: IHeaderDetails;
  framesArray: IFramesArray[];
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistReportState?: () => void;
  isPreviewView: boolean;
}
