import { Auth0Provider } from "@auth0/auth0-react";
import { act, render } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import GridItem from "../components/AssetCollection/Charts/gridItem";
import ReportsGrid from "../components/AssetCollection/Reports/reportsGrid";
import { StoreProvider, createStore } from "easy-peasy";
import {
  ReportGetList,
  ReportsCount,
} from "app/state/api/action-reducers/reports";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import { mockReportsCrudData } from "./data";
import { setupIntersectionObserverMock } from "app/modules/report-module/__test__/setupIntersectionObserver";
import axios, { AxiosResponse } from "axios";
interface MockProps {
  sortBy: string;
  searchStr: string;
  view: "grid" | "table";
  showMenuButton?: boolean;
  addCard?: boolean;
}

setupIntersectionObserverMock();
let mockLoginStatus = true;
jest.mock("axios");
const mockGet = axios.get as jest.Mock;

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
const history = createMemoryHistory({ initialEntries: ["/"] });

const defaultProps = (newProps: Partial<MockProps> = {}): MockProps => {
  return {
    sortBy: "name",
    searchStr: "",
    view: "grid",
    showMenuButton: true,
    addCard: true,
    ...newProps,
  } as MockProps;
};

const mockStore = (mockActions: boolean) =>
  createStore(
    {
      reports: {
        ReportGetList,
        ReportsCount,
      },
      AuthToken: AuthTokenState,
    },
    {
      mockActions,
      initialState: {
        reports: {
          ReportGetlist: {
            crudData: [],
            loading: false,
            success: true,
          },
          ReportsCount: {
            data: { count: 3 },
            loading: false,
            success: true,
          },
        },
        AuthToken: {
          value: "token",
        },
      },
    }
  );
const appSetup = (newProps: Partial<MockProps> = {}, mockActions: boolean) => {
  const props = defaultProps(newProps);
  return {
    app: (
      <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
        <StoreProvider store={mockStore(mockActions)}>
          <Router history={history}>
            <ReportsGrid {...props} />
          </Router>
        </StoreProvider>
      </Auth0Provider>
    ),
    props,
    mockStore: mockStore(mockActions),
  };
};

test("renders ReportsGrid component", async () => {
  const { app, mockStore, props } = appSetup({}, false);
  mockGet
    .mockResolvedValueOnce({ data: mockReportsCrudData } as AxiosResponse<any>)
    .mockResolvedValueOnce({ data: [] } as AxiosResponse<any>);
  render(app);
  await act(async () => {
    mockStore.getActions().reports.ReportsCount.setData({ count: 1 });
  });
  // expect(screen.getByText("Lana del ray")).toBeInTheDocument();
  // expect(screen.getByText("Lana del ray")).toBeInTheDocument();
});
