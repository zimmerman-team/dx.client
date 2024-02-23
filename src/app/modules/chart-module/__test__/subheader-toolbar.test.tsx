/** third party */
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Auth0Provider } from "@auth0/auth0-react";
import Router from "react-router-dom";
import { RecoilRoot } from "recoil";
import { createMemoryHistory } from "history";
/** project */
import {
  ChartsActivePanelsState,
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsEnabledFilterOptionGroupsState,
  ChartsMappingState,
} from "app/state/api/action-reducers/sync/charts";
import { ChartSubheaderToolbar } from "app/modules/chart-module/components/chartSubheaderToolbar/";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import {
  mockChartList,
  mockMappingValue,
} from "app/modules/chart-module/__test__/data";
import { RecoilObserver } from "app/utils/recoilObserver";
import {
  homeDisplayAtom,
  reportRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { ChartsAppliedFiltersState } from "app/state/api/action-reducers/sync/charts/filters";
import {
  ChartCreate,
  ChartGet,
  ChartGetList,
  ChartUpdate,
} from "app/state/api/action-reducers/charts";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import axios, { AxiosResponse } from "axios";

interface MockProps {
  name: string;
  visualOptions?: any;
  setName: (name: string) => void;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistReportState?: () => void;
  isPreviewView: boolean;
  dimensions: any;
}
type Params = {
  dataset: string | null;
  mapping: any;
  chartType: string | null;
  mockActions: boolean;
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

const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    name: "test",
    setName: jest.fn(),
    visualOptions: {},
    dimensions: [{}],
    setHasSubHeaderTitleFocused: jest.fn(),
    setHasSubHeaderTitleBlurred: jest.fn(),
    setStopInitializeFramesWidth: jest.fn(),
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
  const onChange = jest.fn();
  const mockStore = createStore(
    {
      AuthToken: AuthTokenState,
      charts: {
        dataset: ChartsDatasetState,
        mapping: ChartsMappingState,
        chaerType: ChartsChartTypeState,
        appliedFilters: ChartsAppliedFiltersState,
        enabledFilterOptionGroups: ChartsEnabledFilterOptionGroupsState,
        activePanels: ChartsActivePanelsState,
        ChartGetList,
        ChartGet,
        ChartCreate,
        ChartUpdate,
      },
    },
    {
      mockActions: params.mockActions,
      initialState: {
        charts: {
          dataset: {
            value: params.dataset,
          },
          mapping: {
            value: params.mapping,
          },
          chartType: {
            value: params.chartType,
          },
          appliedFilters: {
            value: {},
          },
          enabledFilterOptionGroups: {
            value: [],
          },
          activePanels: {
            value: "selectDataset",
          },
          chartGet: {
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
            <RecoilRoot>
              <RecoilObserver node={homeDisplayAtom} onChange={onChange} />
              <RecoilObserver
                node={reportRightPanelViewAtom}
                onChange={onChange}
              />
              <ChartSubheaderToolbar {...props} />
            </RecoilRoot>
          </StoreProvider>
        </Auth0Provider>
      </Router.Router>
    ),
    mockStore,
  };
};

//test cases

test("buttons should not be clickable when mapping and chart type are empty", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app } = appSetup({
    dataset: "12345",
    mapping: {},
    chartType: null,
    mockActions: true,
  });
  render(app);
  const saveButton = screen.getByRole("button", { name: "save-button" });
  const previewButton = screen.getByRole("button", {
    name: "preview-button",
  });
  expect(saveButton).toBeDisabled();
  expect(previewButton).toBeDisabled();
});

test("buttons should be clickable when mapping and chart type are not empty", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: true,
  });
  render(app);
  const saveButton = screen.getByRole("button", { name: "save-button" });
  const previewButton = screen.getByRole("button", {
    name: "preview-button",
  });
  expect(saveButton).toBeEnabled();
  expect(previewButton).toBeEnabled();
});

test("clicking preview button should reroute to preview page", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: true,
  });
  render(app);
  const previewButton = screen.getByRole("button", {
    name: "preview-button",
  });
  expect(previewButton).toBeEnabled();
  await user.click(previewButton);
  expect(history.location.pathname).toBe("/chart/new/preview");
});

test("clicking save button should create chart", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app, mockStore } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: false,
  });
  render(app);
  // click save button
  const saveButton = screen.getByRole("button", { name: "save-button" });
  expect(saveButton).toBeEnabled();
  axios.post = jest.fn().mockResolvedValueOnce({ data: { id: "12345" } });
  await user.click(saveButton);
  expect(mockStore.getState().charts.ChartCreate.success).toBeTruthy();
  expect(history.location.pathname).toBe("/chart/12345");
});

test("all buttons should be visible and active when page is not new", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: false,
  });
  render(app);
  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });

  expect(screen.getByRole("button", { name: "export-button" })).toBeVisible();
  expect(
    screen.getByRole("button", { name: "duplicate-button" })
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "edit-button" })).toBeVisible();
  expect(screen.getByRole("button", { name: "delete-button" })).toBeVisible();
  expect(screen.getByRole("button", { name: "share-button" })).toBeVisible();
});

test("clicking delete button should display delete modal", async () => {
  const user = userEvent.setup();
  // Mocking the Axios request
  const mockedAxios = axios.delete as jest.Mock;
  const mockGetAxios = axios.get as jest.Mock;
  mockedAxios.mockResolvedValueOnce({ data: [] } as AxiosResponse<any>);
  mockGetAxios.mockResolvedValueOnce({
    data: mockChartList,
  } as AxiosResponse<any>);
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: false,
  });

  render(app);

  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });

  expect(screen.getByRole("button", { name: "delete-button" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "delete-button" }));
  expect(screen.getByRole("form")).toBeInTheDocument();
  expect(
    screen.getByText("Absolutely sure you want to delete the chart(s)?")
  ).toBeVisible();
  const input = screen.getByPlaceholderText('Type "DELETE" to confirm');
  await user.type(input, "DELETE");
  expect(input).toHaveValue("DELETE");
  expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  fireEvent.submit(screen.getByRole("form"));
  expect(mockedAxios).toHaveBeenCalled();
});

test("clicking duplicate button should duplicate chart", async () => {
  const user = userEvent.setup();
  // Mocking the Axios request
  const mockedAxios = axios.get as jest.Mock;
  mockedAxios
    .mockResolvedValueOnce({
      data: { id: "chart-id" },
    } as AxiosResponse<any>)
    .mockResolvedValueOnce({ data: mockChartList });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: true,
  });
  render(app);

  await user.click(screen.getByRole("button", { name: "duplicate-button" }));
  expect(mockedAxios).toHaveBeenCalled();
});

test("clicking edit button should reroute to edit page", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: false,
  });
  render(app);

  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });

  expect(screen.getByRole("button", { name: "edit-button" })).toBeVisible();

  await user.click(screen.getByRole("button", { name: "edit-button" }));
  expect(history.location.pathname).toBe("/chart/chartid/customize");
});

test("clicking share button should display share popover", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: false,
  });
  render(app);

  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData({
      id: "12345",
      name: "test",
      owner: "auth0|123",
    });
  });

  expect(screen.getByRole("button", { name: "share-button" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "share-button" }));
  expect(screen.getByLabelText("copy-link-popover")).toBeVisible();
  expect(screen.getByRole("button", { name: "Copy link" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Copy link" }));

  expect(screen.getByText("Link copied to clipboard")).toBeVisible();
  //test that link exists in clipboard
  expect(navigator.clipboard.readText()).toBe("http://localhost/chart/chartid");
});
