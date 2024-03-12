import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderBlock from "app/modules/report-module/sub-module/components/headerBlock/";
import { EditorState } from "draft-js";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import Router from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { RecoilObserver } from "app/utils/recoilObserver";
import { createMemoryHistory } from "history";
import { reportRightPanelViewAtom } from "app/state/recoil/atoms";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import createEmojiPlugin from "@draft-js-plugins/emoji";

interface MockProps {
  previewMode: boolean;
  hasSubHeaderTitleFocused?: boolean;
  setHasSubHeaderTitleFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  setReportName?: React.Dispatch<React.SetStateAction<string>>;
  reportName?: string;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  isEditorFocused: boolean;
  setIsEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
  headerDetails: {
    title: string;
    showHeader: boolean;
    description: EditorState;
    createdDate: Date;
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    dateColor: string;
  };
  setHeaderDetails: jest.Mock<any, [newHeaderDetails: any], any>;
}
const headerDetailsResult = {
  headerDetails: {
    title: "",
    description: EditorState.createEmpty(),
    backgroundColor: "",
    titleColor: "",
    descriptionColor: "",
    dateColor: "",
  },
};
const mockCreateEmojiPlugin = jest.fn();
jest.mock("@draft-js-plugins/emoji", () => {
  return {
    __esModule: true,
    default: () => {
      return [mockCreateEmojiPlugin];
    },
  };
});

const defaultProps = (props: Partial<MockProps>): MockProps => {
  return {
    previewMode: false,
    hasSubHeaderTitleFocused: false,
    setHasSubHeaderTitleFocused: jest.fn(),
    setReportName: jest.fn(),
    reportName: "Test Report",
    setPlugins: jest.fn(),
    isEditorFocused: false,
    setIsEditorFocused: jest.fn(),
    headerDetails: {
      title: "Test Title",
      showHeader: true,
      description: EditorState.createEmpty(),
      createdDate: new Date(),
      backgroundColor: "#fff",
      titleColor: "#000",
      descriptionColor: "#000",
      dateColor: "#000",
    },
    setHeaderDetails: jest.fn(
      (newHeaderDetails) =>
        (headerDetailsResult.headerDetails = newHeaderDetails)
    ),
    ...props,
  };
};

const history = createMemoryHistory({
  initialEntries: ["/chart/new/mapping"],
});
const appSetup = (newProps: Partial<MockProps> = {}) => {
  const props = defaultProps(newProps);
  const reportRightPanelViewChange = jest.fn();

  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(reportRightPanelViewAtom, "elements");
  };

  return {
    app: (
      <Router.Router history={history}>
        <RecoilRoot initializeState={initialRecoilState}>
          <RecoilObserver
            node={reportRightPanelViewAtom}
            onChange={reportRightPanelViewChange}
          />
          <DndProvider backend={HTML5Backend}>
            <HeaderBlock {...props} />
          </DndProvider>
        </RecoilRoot>
      </Router.Router>
    ),

    props,
  };
};

test("title input should be visible and editable", async () => {
  const user = userEvent.setup();
  //spy on window alert
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const { app } = appSetup();
  render(app);
  expect(screen.getByPlaceholderText("Add a header title")).toBeEnabled();
  fireEvent.change(screen.getByPlaceholderText("Add a header title"), {
    target: { value: "Test Title" },
  });
  expect(headerDetailsResult.headerDetails.title).toBe("Test Title");
});

test("focusing on description input should clear placeholder", async () => {
  const user = userEvent.setup();

  const { app } = appSetup();
  render(app);
  expect(screen.getByText("Add a header description")).toBeEnabled();
  await user.click(screen.getByText("Add a header description"));

  expect(screen.queryByText("Add a header description")).toBeNull();
});

test("focusing on description input should call setIsEditorFocused", async () => {
  const user = userEvent.setup();

  const { app, props } = appSetup();
  render(app);
  await user.click(screen.getByText("Add a header description"));
  expect(props.setIsEditorFocused).toHaveBeenCalledWith(true);
});

// test("description input should be visible and editable", async () => {
//   const user = userEvent.setup();
//   const { app } = appSetup();
//   render(app);
//   expect(screen.getByText("Add a header description")).toBeEnabled();
//   await user.type(
//     screen.getByText("Add a header description"),
//     "Test Description"
//   );
//   expect(
//     headerDetailsResult.headerDetails.description
//       .getCurrentContent()
//       .getPlainText()
//   ).toBe("Test Description");
// });

test("hovering should show the edit and delete buttons", async () => {
  const user = userEvent.setup();

  const { app } = appSetup();
  render(app);
  await user.hover(screen.getByTestId("header-block"));
  //   expect(screen.getByText("B")).toBeVisible();
  //   expect(screen.getByText("I")).toBeVisible();
  //   expect(screen.getByText("U")).toBeVisible();
  //   expect(screen.getByText("Emoji")).toBeVisible();
});
