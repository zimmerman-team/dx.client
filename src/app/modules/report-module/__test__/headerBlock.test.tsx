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
import { MutableSnapshot, RecoilRoot } from "recoil";
import { RecoilObserver } from "app/utils/recoilObserver";
import { createMemoryHistory } from "history";
import { reportRightPanelViewAtom } from "app/state/recoil/atoms";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface MockProps {
  previewMode: boolean;
  hasSubHeaderTitleFocused?: boolean;
  setHasSubHeaderTitleFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  setReportName?: React.Dispatch<React.SetStateAction<string>>;
  reportName?: string;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
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
    createdDate: new Date(),
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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const defaultProps = (props: Partial<MockProps>): MockProps => {
  return {
    previewMode: false,
    hasSubHeaderTitleFocused: false,
    setHasSubHeaderTitleFocused: jest.fn(),
    setReportName: jest.fn(),
    reportName: "Test Report",
    setPlugins: jest.fn(),
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

const dragAndDrop = (source: string, target: string) => {
  fireEvent.dragStart(screen.getByTestId(source));
  fireEvent.dragLeave(screen.getByTestId(source));
  fireEvent.dragEnter(screen.getByTestId(target));
  fireEvent.dragOver(screen.getByTestId(target));
  fireEvent.drop(screen.getByTestId(target));
};

const history = createMemoryHistory({
  initialEntries: ["/chart/new/mapping"],
});
const reportRightPanelViewChange = jest.fn();

const appSetup = (newProps: Partial<MockProps> = {}) => {
  const props = defaultProps(newProps);

  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(reportRightPanelViewAtom, "elements");
  };

  const Draggable = () => {
    const [_, drag] = useDrag(() => ({
      type: "header",
      item: {
        type: "header",
        value: "",
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    return <div ref={drag} data-testid="drag-item" />;
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
            <Draggable />
          </DndProvider>
        </RecoilRoot>
      </Router.Router>
    ),

    props,
  };
};
const reportPath = "/report/12345/edit";
test("title input should be visible and editable", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  //spy on window alert
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const { app, props } = appSetup();
  render(app);
  expect(screen.getByPlaceholderText("Add a header title")).toBeEnabled();
  fireEvent.change(screen.getByPlaceholderText("Add a header title"), {
    target: { value: "Test Tite" },
  });
  expect(props.setHeaderDetails).toHaveBeenCalledWith(
    expect.objectContaining({ title: "Test Tite" })
  );
  expect(headerDetailsResult.headerDetails.title).toBe("Test Tite");
});

const addAHeaderDesc = "Add a header description";

test("focusing on description input should clear placeholder", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  const { app } = appSetup();
  render(app);
  expect(screen.getByText(addAHeaderDesc)).toBeEnabled();
  await user.click(screen.getByText(addAHeaderDesc));

  expect(screen.queryByText(addAHeaderDesc)).toBeNull();
});

test("focusing on description input should call setIsEditorFocused", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  const { app, props } = appSetup();
  render(app);
  await user.click(screen.getByText(addAHeaderDesc));
});

// test("description input should be visible and editable", async () => {
//   const user = userEvent.setup();
//   const { app } = appSetup();
//   render(app);
//   expect(screen.getByText(addAHeaderDesc)).toBeEnabled();
//   await user.type(
//     screen.getByText(addAHeaderDesc),
//     "Test Description"
//   );
//   expect(
//     headerDetailsResult.headerDetails.description
//       .getCurrentContent()
//       .getPlainText()
//   ).toBe("Test Description");
// });

const headerBlockId = "header-block";
const editHeaderButtonId = "edit-header-button";
const deleteHeaderButtonId = "delete-header-button";

test("hovering and unhovering should show and hide the edit and delete buttons", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  const { app } = appSetup();
  render(app);
  await user.hover(screen.getByTestId(headerBlockId));
  expect(screen.getByTestId(editHeaderButtonId)).toBeEnabled();
  expect(screen.getByTestId(deleteHeaderButtonId)).toBeEnabled();
  await user.unhover(screen.getByTestId(headerBlockId));
  expect(screen.queryByTestId(editHeaderButtonId)).toBeNull();
  expect(screen.queryByTestId(deleteHeaderButtonId)).toBeNull();
});
test("hovering should show the edit and delete buttons", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  const { app, props } = appSetup();
  render(app);
  await user.hover(screen.getByTestId(headerBlockId));
  expect(screen.getByTestId(editHeaderButtonId)).toBeEnabled();
  expect(screen.getByTestId(deleteHeaderButtonId)).toBeEnabled();

  fireEvent.click(screen.getByTestId(editHeaderButtonId));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("editHeader");

  fireEvent.click(screen.getByTestId(deleteHeaderButtonId));
  expect(props.setHeaderDetails).toHaveBeenCalledWith({
    ...props.headerDetails,
    showHeader: false,
  });
});

test("drop area should be visible when showHeader is false", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  const { app } = appSetup({
    headerDetails: { ...headerDetailsResult.headerDetails, showHeader: false },
  });
  render(app);
  expect(screen.getByTestId("drop-area")).toBeEnabled();
});

test("drop area should call setHeaderDetails when dropped", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  jest.spyOn(Router, "useLocation").mockReturnValue({
    pathname: reportPath,
  } as any);
  const { app, props } = appSetup({
    headerDetails: { ...headerDetailsResult.headerDetails, showHeader: false },
  });
  render(app);
  dragAndDrop("drag-item", "drop-area");
  expect(props.setHeaderDetails).toHaveBeenCalledWith({
    ...props.headerDetails,
    showHeader: true,
  });
});
