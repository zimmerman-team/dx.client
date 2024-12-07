import { EditorState } from "draft-js";
import { IFramesArray } from "app/modules/story-module/views/create/data";

export interface IHeaderDetails {
  title: string;
  heading: EditorState;
  showHeader: boolean;
  description: EditorState;
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
  dateColor: string;
  isUpdated?: boolean;
}
export interface StoryRightPanelProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  showHeaderItem: boolean;
  currentView: "initial" | "edit" | "create" | "preview" | "ai-template";
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
  framesArray: IFramesArray[];
  storyName: string;
  onSave: (type: "create" | "edit") => Promise<void>;
}
