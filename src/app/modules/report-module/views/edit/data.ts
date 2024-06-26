import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "../../components/right-panel/data";

export interface ReportEditViewProps {
  open: boolean;
  reportType: "basic" | "advanced" | "ai" | null;
  isSaveEnabled: boolean;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  hasReportNameFocused: boolean;
  setHasReportNameFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>;
  framesArray: IFramesArray[];
  localPickedCharts: string[];
  setReportName: React.Dispatch<React.SetStateAction<string>>;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
  handlePersistReportState: () => void;
  reportName: string;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;

  handleRowFrameItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
  stopInitializeFramesWidth: boolean;
  setStopInitializeFramesWidth: React.Dispatch<React.SetStateAction<boolean>>;

  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
}
