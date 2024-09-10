import { EditorState, convertToRaw, RawDraftContentState } from "draft-js";

export interface ReportModel {
  id: string;
  name: string;
  title: string;
  public: boolean;
  showHeader: boolean;
  description: RawDraftContentState;
  heading: RawDraftContentState;
  rows: {
    structure:
      | null
      | "oneByOne"
      | "oneByTwo"
      | "oneByThree"
      | "oneByFour"
      | "oneByFive";

    items: (object | string)[];
    contentWidths: {
      id: string;
      widths: number[];
    };
    contentHeights: {
      id: string;
      heights: number[];
    };
  }[];
  createdDate: Date;
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
  owner: string;
  dateColor: string;
}

export const emptyReport: ReportModel = {
  id: "",
  name: "Untitled report",
  title: "",
  public: false,
  description: convertToRaw(EditorState.createEmpty().getCurrentContent()),
  heading: convertToRaw(EditorState.createEmpty().getCurrentContent()),
  showHeader: true,
  rows: [],
  createdDate: new Date(),
  backgroundColor: "#252c34",
  titleColor: "#ffffff",
  descriptionColor: "#ffffff",
  owner: "",
  dateColor: "#ffffff",
};

export const itemSpacing = "30px";
export const containerGap = "16px";
