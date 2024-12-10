import { IFramesArray } from "app/modules/story-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { Updater } from "use-immer";

export interface StoryEditViewProps {
  rightPanelOpen: boolean;
  handleRightPanelOpen: () => void;
  storyType: "basic" | "advanced" | "ai" | null;
  isSaveEnabled: boolean;
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  hasStoryNameFocused: boolean;
  setHasStoryNameFocused: React.Dispatch<React.SetStateAction<boolean>>;
  updateFramesArray: Updater<IFramesArray[]>;
  framesArray: IFramesArray[];
  setStoryName: React.Dispatch<React.SetStateAction<string>>;
  autoSave: boolean;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
  storyName: string;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
  setHasChangesBeenMade: React.Dispatch<React.SetStateAction<boolean>>;
  stopInitializeFramesWidth: boolean;
  setStopInitializeFramesWidth: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (type: "create" | "edit") => Promise<void>;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
}
