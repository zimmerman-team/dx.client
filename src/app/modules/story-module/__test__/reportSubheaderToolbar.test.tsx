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
import { homeDisplayAtom, chartFromStoryAtom } from "app/state/recoil/atoms";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import { RecoilObserver } from "app/utils/recoilObserver";
import { createStore, StoreProvider } from "easy-peasy";
import { createMemoryHistory } from "history";
import Router from "react-router-dom";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import {
  StoryGet,
  StoryGetList,
  StoryUpdate,
} from "app/state/api/action-reducers/stories";
import axios, { AxiosResponse } from "axios";
import { StorySubheaderToolbar } from "app/modules/story-module/components/storySubHeaderToolbar";
import { setMediaQueryForTest } from "app/utils/setMediaQueryForTest";

interface MockProps {
  name: string;
  autoSave: boolean;
  setAutoSave: jest.Mock<any, any, any>;
  visualOptions?: any;
  onStorySave: (type: "create" | "edit") => Promise<void>;
  setName: (name: string) => void;
  isSaveEnabled?: boolean;
  rawViz?: any;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasStoryNameFocused?: (value: boolean) => void;
  plugins: ToolbarPluginsType;
  isEditorFocused: boolean;
  headerDetails: IHeaderDetails;
  framesArray: IFramesArray[];
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistStoryState?: () => void;
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
  name: "Untitled story",
  autoSave: false,
};
const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    name: "Untitled story",
    autoSave: false,
    setAutoSave: jest.fn((value: { isAutoSaveEnabled: boolean }) => {
      mockSetValues.autoSave = value.isAutoSaveEnabled;
    }),
    visualOptions: {},
    onStorySave: jest.fn().mockImplementation((type) => Promise.resolve()),
    setName: jest.fn((newName: string) => {
      mockSetValues.name = newName;
    }),
    isSaveEnabled: false,
    rawViz: {},
    setHasSubHeaderTitleFocused: jest.fn(),
    setHasStoryNameFocused: jest.fn(),
    plugins: {} as ToolbarPluginsType,
    isEditorFocused: false,
    headerDetails: {} as IHeaderDetails,
    framesArray: [],
    handlePersistStoryState: jest.fn(),
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
      stories: {
        StoryGet,
        StoryGetList,
        StoryUpdate,
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
        stories: {
          storyGet: {
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
              <StorySubheaderToolbar {...props} />
            </RecoilRoot>
          </StoreProvider>
        </Auth0Provider>
      </Router.Router>
    ),
    mockStore,
    props,
  };
};

const setDefaultCrudData = (mockStore: any) => {
  mockStore.getActions().stories.StoryGet.setCrudData({
    id: "12345",
    name: "test",
    owner: "auth0|123",
  });
};

//test cases
describe("Tests for tablet and desktop view", () => {
  beforeEach(() => {
    setMediaQueryForTest(768);
  });
  test("focusing on input should call setHasStoryNameFocused", async () => {
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
    const { app, props } = appSetup({ mockActions: false });
    render(app);
    screen.getByRole("textbox").focus();
    expect(props.setHasStoryNameFocused).toHaveBeenCalledWith(true);
  });

  test("blurring on input should call setHasStoryNameFocused", async () => {
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
    const { app, props } = appSetup({ mockActions: false });
    render(app);
    screen.getByRole("textbox").focus();
    screen.getByRole("textbox").blur();
    expect(props.setHasStoryNameFocused).toHaveBeenCalledWith(true);
  });

  test("clicking on input when value is Untitled story should clear the input", async () => {
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

  test("typing on input should edit story title", async () => {
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "n65e6d7498ad6100d2b27bd5cew", view: "edit" });
    const initialRecoilState = (snap: MutableSnapshot) => {
      snap.set(chartFromStoryAtom, {
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

  const waitForStorySave = (props: MockProps) => {
    expect(props.onStorySave).toHaveBeenCalledWith("edit");
    expect(history.location.pathname).toBe("/story/65dcb26aaf4c8500693f1ab7");
  };

  test("clicking view story button should save story and go to story detail page", async () => {
    const user = userEvent.setup();
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });

    const { app, props } = appSetup({ mockActions: false });
    render(app);
    const viewStoryButton = screen.getByRole("button", {
      name: /view story button/i,
    });
    await user.click(viewStoryButton);
    await waitFor(() => waitForStorySave(props));
  });

  test("clicking view story button in tablet view should save story and go to story detail page", async () => {
    const user = userEvent.setup();
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });

    const { app, props } = appSetup({ mockActions: false });
    render(app);
    const viewStoryButton = screen.getByRole("button", {
      name: /view-story-button-tablet/i,
    });
    await user.click(viewStoryButton);
    await waitFor(() => waitForStorySave(props));
  });

  const autoSaveSwitchId = "auto-save-switch";

  test("autosave switch should toggle autosave state from false to true", async () => {
    const user = userEvent.setup();

    const { app, props } = appSetup({ mockActions: false });
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: "edit" });
    render(app);

    expect(screen.getByTestId(autoSaveSwitchId)).not.toBeChecked();

    await user.click(screen.getByTestId(autoSaveSwitchId));
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
    expect(screen.getByTestId(autoSaveSwitchId)).toBeChecked();

    await user.click(screen.getByTestId(autoSaveSwitchId));
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

  test("save button should call onStorySave when clicked", async () => {
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
    expect(props.onStorySave).toHaveBeenCalledWith("edit");
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
      mockStore.getActions().stories.StoryUpdate.onSuccess([]);
    });

    expect(mockStore.getState().stories.StoryUpdate.success).toBeTruthy();
    expect(screen.getByText(/All changes saved/)).toBeVisible();

    // expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  test("input field should be disabled in story detail page", async () => {
    const { app, mockStore } = appSetup(
      { mockActions: false },
      { isSaveEnabled: true, isPreviewView: true }
    );
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: undefined });
    act(() => setDefaultCrudData(mockStore));
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
    act(() => setDefaultCrudData(mockStore));
    render(app);
    await user.click(screen.getByRole("button", { name: "export-button" }));
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByText(".png")).toBeVisible();
    expect(screen.getByText(".svg")).toBeVisible();
  });

  const goToStory = "GO TO STORY";

  test("clicking on duplicate button should open duplicate dialog", async () => {
    const user = userEvent.setup();
    const { app, mockStore } = appSetup(
      { mockActions: false },
      { isSaveEnabled: false, isPreviewView: true }
    );
    const axiosMock = axios.get as jest.Mock;

    axiosMock
      .mockResolvedValueOnce({
        data: { data: { id: "12345" } },
      } as AxiosResponse<any>)
      .mockResolvedValueOnce({ data: { data: [] } });
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "12345", view: undefined });
    act(() => setDefaultCrudData(mockStore));
    render(app);
    await user.click(screen.getByTestId("duplicate-button"));
    expect(axiosMock).toHaveBeenCalled();

    expect(
      screen.getByText("Story has been duplicated successfully!")
    ).toBeVisible();

    expect(screen.getByRole("button", { name: goToStory })).toBeVisible();
    await user.click(screen.getByRole("button", { name: goToStory }));
    expect(screen.getByRole("button", { name: goToStory })).not.toBeVisible();

    expect(history.location.pathname).toBe("/story/12345");
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
    act(() => setDefaultCrudData(mockStore));
    render(app);
    await user.click(screen.getByTestId("share-button"));
    expect(screen.getByRole("button", { name: "Copy link" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(screen.getByText("Link copied to clipboard")).toBeVisible();
  });

  test("clicking on edit button should redirect to story edit page", async () => {
    const user = userEvent.setup();
    const { app, mockStore } = appSetup(
      { mockActions: false },
      { isSaveEnabled: false, isPreviewView: true }
    );
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "12345", view: undefined });
    act(() => setDefaultCrudData(mockStore));
    render(app);
    await user.click(screen.getByTestId("edit-button"));
    expect(history.location.pathname).toBe("/story/12345/edit");
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
    act(() => setDefaultCrudData(mockStore));
    render(app);
    await user.click(screen.getByTestId("delete-button"));
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByText("Absolutely sure you want to delete the story(s)?")
    ).toBeVisible();
    const input = screen.getByPlaceholderText('Type "DELETE" to confirm');
    await user.type(input, "DELETE");
    expect(input).toHaveValue("DELETE");
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
    fireEvent.submit(screen.getByRole("form"));
    expect(axiosMock).toHaveBeenCalled();
  });
});

describe("Tests for mobile view", () => {
  beforeEach(() => {
    setMediaQueryForTest(450);
  });
  test("export,  share, edit, buttons should not be visible in story detail mode for mobile views", async () => {
    const { app, mockStore } = appSetup(
      { mockActions: false },
      { isSaveEnabled: true }
    );
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ page: "65dcb26aaf4c8500693f1ab7", view: undefined });
    act(() => setDefaultCrudData(mockStore));
    render(app);
    expect(screen.queryByRole("button", { name: "export-button" })).toBeNull();

    expect(screen.getByTestId("duplicate-button")).toBeVisible();
    expect(screen.getByTestId("share-button")).toBeVisible();
    expect(screen.queryByTestId("edit-button")).toBeNull();
    expect(screen.queryByTestId("delete-button")).toBeNull();
  });
});
