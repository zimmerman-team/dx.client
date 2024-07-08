import { Auth0Provider } from "@auth0/auth0-react";
import {
  ChartGet,
  ChartCreate,
  ChartUpdate,
} from "app/state/api/action-reducers/charts";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import userEvent from "@testing-library/user-event";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { homeDisplayAtom, chartFromReportAtom } from "app/state/recoil/atoms";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import { RecoilObserver } from "app/utils/recoilObserver";
import { createStore, StoreProvider } from "easy-peasy";
import { createMemoryHistory } from "history";
import Router from "react-router-dom";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import {
  ReportGet,
  ReportGetList,
  ReportUpdate,
} from "app/state/api/action-reducers/reports";
import axios, { AxiosResponse } from "axios";
import { ReportSubheaderToolbar } from "app/modules/report-module/components/reportSubHeaderToolbar";

interface MockProps {
  name: string;
  autoSave: boolean;
  setAutoSave: jest.Mock<any, any, any>;
  visualOptions?: any;
  onReportSave: (type: "create" | "edit") => Promise<void>;
  setName: (name: string) => void;
  isSaveEnabled?: boolean;
  rawViz?: any;
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
type Params = {
  mockActions: boolean;
  initialRecoilState?: (snap: MutableSnapshot) => void;
};

//mocks
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

let mockLoginStatus = true;
jest.mock("@auth0/auth0-react", () => {
  const originalModule = jest.requireActual("@auth0/auth0-react");
  return {
    __esModule: true,
    ...originalModule,
    useAuth0: () => mockUseAuth0(mockLoginStatus),
    Auth0Provider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});
const mockSetValues = {
  name: "Untitled report",
  autoSave: false,
};
const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    name: "Untitled report",
    autoSave: false,
    setAutoSave: jest.fn((value: { isAutoSaveEnabled: boolean }) => {
      mockSetValues.autoSave = value.isAutoSaveEnabled;
    }),
    visualOptions: {},
    onReportSave: jest.fn().mockImplementation((type) => Promise.resolve()),
    setName: jest.fn((newName: string) => {
      mockSetValues.name = newName;
    }),
    isSaveEnabled: false,
    rawViz: {},
    setHasSubHeaderTitleFocused: jest.fn(),
    setHasSubHeaderTitleBlurred: jest.fn(),
    plugins: {} as ToolbarPluginsType,
    isEditorFocused: false,
    headerDetails: {} as IHeaderDetails,
    framesArray: [],
    handlePersistReportState: jest.fn(),
    isPreviewView: false,
    ...props,
  };
};
const history = createMemoryHistory({
  initialEntries: ["/chart/new/mapping"],
});
const appSetup = (params: Params, newProps: Partial<MockProps> = {}) => {
  const props = defaultProps(newProps);
  const onHomeTabChange = jest.fn();
  const mockStore = createStore(
    {
      AuthToken: AuthTokenState,
      reports: {
        ReportGet,
        ReportGetList,
        ReportUpdate,
      },
      charts: {
        ChartGet,
        ChartCreate,
        ChartUpdate,
      },
    },
    {
      mockActions: params.mockActions,
      initialState: {
        charts: {
          chartGet: {
            crudData: {
              owner: "auth0|123",
            },
          },
        },
        reports: {
          reportGet: {
            crudData: {
              owner: "auth0|123",
            },
          },
        },
      },
    }
  );
  return {
    app: (
      <Router.Router history={history}>
        <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
          <StoreProvider store={mockStore}>
            <RecoilRoot initializeState={params.initialRecoilState}>
              <RecoilObserver
                node={homeDisplayAtom}
                onChange={onHomeTabChange}
              />
              <ReportSubheaderToolbar {...props} />
            </RecoilRoot>
          </StoreProvider>
        </Auth0Provider>
      </Router.Router>
    ),
    mockStore,
    props,
  };
};

//test cases

test("focusing on input should call setHasSubHeaderTitleFocused", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  const { app, props } = appSetup({ mockActions: false });
  render(app);
  screen.getByRole("textbox").focus();
  expect(props.setHasSubHeaderTitleFocused).toHaveBeenCalledWith(true);
});

test("blurring on input should call setHasSubHeaderTitleBlurred", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  const { app, props } = appSetup({ mockActions: false });
  render(app);
  screen.getByRole("textbox").focus();
  screen.getByRole("textbox").blur();
  expect(props.setHasSubHeaderTitleBlurred).toHaveBeenCalledWith(true);
});

test("clicking on input when value is Untitled report should clear the input", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  const { app, props } = appSetup({ mockActions: false });
  render(app);
  screen.getByRole("textbox").focus();
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "new title" },
  });
  fireEvent.click(screen.getByRole("textbox"));
  expect(screen.getByRole("textbox")).toHaveValue("");
});

test("typing on input should edit report title", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "n65e6d7498ad6100d2b27bd5cew", view: "edit" });
  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(chartFromReportAtom, {
      state: true,
      page: "65dcb26aaf4c8500693f1ab7",
      action: "edit",
      view: "edit",
      chartId: null,
    });
  };
  const { app, props } = appSetup({ mockActions: false, initialRecoilState });
  render(app);

  screen.getByRole("textbox").focus();
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "new title" },
  });
  expect(mockSetValues.name).toBe("new title");
});

test("clicking view report button should save report and go to report detail page", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });

  const { app, props } = appSetup({ mockActions: false });
  render(app);
  const viewReportButton = screen.getByRole("button", {
    name: /view report button/,
  });
  await user.click(viewReportButton);
  await waitFor(() => {
    expect(props.onReportSave).toHaveBeenCalledWith("edit");
    expect(history.location.pathname).toBe("/report/65dcb26aaf4c8500693f1ab7");
  });
});

test("autosave switch should toggle autosave state from false to true", async () => {
  const user = userEvent.setup();

  const { app, props } = appSetup({ mockActions: false });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  render(app);

  expect(screen.getByTestId("auto-save-switch")).not.toBeChecked();

  await user.click(screen.getByTestId("auto-save-switch"));
  expect(props.setAutoSave).toHaveBeenCalledWith({
    isAutoSaveEnabled: true,
    enableAutoSaveSwitch: true,
  });
  expect(mockSetValues.autoSave).toBeTruthy();
});

test("autosave switch should toggle autosave state from true to false", async () => {
  const user = userEvent.setup();

  const { app, props } = appSetup({ mockActions: false }, { autoSave: true });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  render(app);
  expect(screen.getByTestId("auto-save-switch")).toBeChecked();

  await user.click(screen.getByTestId("auto-save-switch"));
  expect(props.setAutoSave).toHaveBeenCalledWith({
    isAutoSaveEnabled: false,
    enableAutoSaveSwitch: true,
  });
  expect(mockSetValues.autoSave).toBeFalsy();
});

test("save button should be disabled when user has performed no action", async () => {
  const { app, props } = appSetup({ mockActions: false });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  render(app);

  expect(screen.getByRole("button", { name: /save button/ })).toBeDisabled();
});

test("save button should be enabled when user has performed an action", async () => {
  const { app, props } = appSetup(
    { mockActions: false },
    { isSaveEnabled: true }
  );
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  render(app);

  expect(screen.getByRole("button", { name: /save button/ })).toBeEnabled();
});

test("save button should call onReportSave when clicked", async () => {
  const user = userEvent.setup();
  const { app, mockStore, props } = appSetup(
    { mockActions: true },
    { isSaveEnabled: true }
  );
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  render(app);

  await user.click(screen.getByRole("button", { name: /save button/ }));
  expect(props.onReportSave).toHaveBeenCalledWith("edit");
});

test("savedChanges state should be true after edit success", async () => {
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: true }
  );

  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
  render(app);
  await act(async () => {
    mockStore.getActions().reports.ReportUpdate.onSuccess([]);
  });

  expect(mockStore.getState().reports.ReportUpdate.success).toBeTruthy();
  expect(screen.getByText(/All changes saved/)).toBeVisible();

  // expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
});

test("export, duplicate, share, edit, delete buttons should be visible in report detail mode", async () => {
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: true }
  );
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  expect(screen.getByRole("button", { name: "export-button" })).toBeVisible();

  expect(screen.getByTestId("duplicate-button")).toBeVisible();
  expect(screen.getByTestId("share-button")).toBeVisible();
  expect(screen.getByTestId("edit-button")).toBeVisible();
  expect(screen.getByTestId("delete-button")).toBeVisible();
});

test("input field should be disabled in report detail page", async () => {
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: true, isPreviewView: true }
  );
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  expect(screen.getByRole("textbox")).toBeDisabled();
});

test("clicking on export button should open export menu", async () => {
  const user = userEvent.setup();
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: true, isPreviewView: true }
  );
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  await user.click(screen.getByRole("button", { name: "export-button" }));
  expect(screen.getByRole("menu")).toBeVisible();
  expect(screen.getByText(".png")).toBeVisible();
  expect(screen.getByText(".svg")).toBeVisible();
});

test("clicking on duplicate button should open duplicate dialog", async () => {
  const user = userEvent.setup();
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: false, isPreviewView: true }
  );
  const axiosMock = axios.get as jest.Mock;

  axiosMock
    .mockResolvedValueOnce({ data: { id: "12345" } } as AxiosResponse<any>)
    .mockResolvedValueOnce({ data: [] });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  await user.click(screen.getByTestId("duplicate-button"));
  expect(axiosMock).toHaveBeenCalled();

  expect(
    screen.getByText("Report has been duplicated successfully!")
  ).toBeVisible();

  expect(screen.getByRole("button", { name: "GO TO REPORT" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "GO TO REPORT" }));
  expect(
    screen.getByRole("button", { name: "GO TO REPORT" })
  ).not.toBeVisible();

  expect(history.location.pathname).toBe("/report/12345");
});

test("clicking on share button should open share dialog", async () => {
  const user = userEvent.setup();
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: false, isPreviewView: true }
  );
  const axiosMock = axios.get as jest.Mock;

  axiosMock
    .mockResolvedValueOnce({ data: { id: "12345" } } as AxiosResponse<any>)
    .mockResolvedValueOnce({ data: [] });
  jest.spyOn(window, "prompt").mockImplementation((message) => "Link copied");

  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  await user.click(screen.getByTestId("share-button"));
  expect(screen.getByRole("button", { name: "Copy link" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Copy link" }));
  expect(screen.getByText("Link copied to clipboard")).toBeVisible();
});

test("clicking on edit button should redirect to report edit page", async () => {
  const user = userEvent.setup();
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: false, isPreviewView: true }
  );
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  await user.click(screen.getByTestId("edit-button"));
  expect(history.location.pathname).toBe("/report/12345/edit");
});

test("clicking on delete button should open delete dialog", async () => {
  const user = userEvent.setup();
  const { app, mockStore } = appSetup(
    { mockActions: false },
    { isSaveEnabled: false, isPreviewView: true }
  );

  const axiosMock = axios.delete as jest.Mock;
  const axiosGetMock = axios.get as jest.Mock;
  axiosGetMock.mockResolvedValueOnce({
    data: [],
  } as AxiosResponse<any>);

  axiosMock.mockResolvedValueOnce({
    data: { id: "12345" },
  } as AxiosResponse<any>);
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: undefined });
  act(() => {
    mockStore.getActions().reports.ReportGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });
  render(app);
  await user.click(screen.getByTestId("delete-button"));
  expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Delete" }));
  expect(screen.getByRole("form")).toBeInTheDocument();
  expect(
    screen.getByText("Absolutely sure you want to delete the report(s)?")
  ).toBeVisible();
  const input = screen.getByPlaceholderText('Type "DELETE" to confirm');
  await user.type(input, "DELETE");
  expect(input).toHaveValue("DELETE");
  expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  fireEvent.submit(screen.getByRole("form"));
  expect(axiosMock).toHaveBeenCalled();
});
