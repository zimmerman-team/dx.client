import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { Updater } from "use-immer";

interface IRowFrame {
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

export interface StoryCreateViewProps {
  rightPanelOpen: boolean;
  handleRightPanelOpen: () => void;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  setStoryName: React.Dispatch<React.SetStateAction<string>>;
  storyName: string;
  storyType: "basic" | "advanced" | "ai" | null;
  updateFramesArray: Updater<IFramesArray[]>;
  deleteFrame: (id: string) => void;
  framesArray: IFramesArray[];
  hasStoryNameFocused: boolean;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
  onSave: (type: "create" | "edit") => Promise<void>;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
}

export interface PlaceholderProps {
  updateFramesArray: Updater<IFramesArray[]>;
  framesArray: IFramesArray[];
  index?: number;
  disableAddrowStructureButton?: boolean;
  deleteFrame: (id: string) => void;
  rowId: string;
}
