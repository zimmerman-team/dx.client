/** third party */
import { render, screen } from "@testing-library/react";
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
import Router from "react-router-dom";
import {
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsMappingState,
  SelectedAIChartState,
} from "app/state/api/action-reducers/sync/charts";
import ChartBuilderChartType from "app/modules/chart-module/routes/chart-type";
import {
  ChartTypeModel,
  echartTypes,
} from "app/modules/chart-module/routes/chart-type/data";
import { createMemoryHistory } from "history";
import { Auth0Provider } from "@auth0/auth0-react";
import { mockUseAuth0 } from "app/utils/mockAuth0";
import {
  ChartGet,
  ChartTypesSuggest,
} from "app/state/api/action-reducers/charts";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { isChartAIAgentActive } from "app/state/recoil/atoms";

interface MockProps {
  loading: boolean;
  loadDataset: jest.Mock<any, any, any>;
  setChartFromAPI: jest.Mock<any, any, any>;
  dataTypes: any[];
  setVisualOptions: jest.Mock<any, any, any>;
  setVisualOptionsOnChange: jest.Mock<any, any, any>;
}

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

const history = (path: string) =>
  createMemoryHistory({
    initialEntries: [path],
  });
const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    loading: false,
    loadDataset: jest.fn(),
    setChartFromAPI: jest.fn(),
    setVisualOptions: jest.fn(),
    setVisualOptionsOnChange: jest.fn(),
    dataTypes: [],
    ...props,
  };
};
const appSetup = (
  chartType: string | null,
  dataset: string | null,
  initialRecoilState: (snap: MutableSnapshot) => void,
  newProps: Partial<MockProps> = {},
  historyPath?: string
) => {
  const props = defaultProps(newProps);

  const mockStore = createStore(
    {
      AuthToken: AuthTokenState,
      charts: {
        chartType: ChartsChartTypeState,
        dataset: ChartsDatasetState,
        mapping: ChartsMappingState,
        ChartGet,
        ChartTypesSuggest,
        SelectedAIChartState,
      },
    },
    {
      initialState: {
        charts: {
          chartType: {
            value: chartType,
          },
          dataset: {
            value: dataset,
          },
          mapping: {
            value: {
              "12345": "12345",
            },
          },
        },
      },
    }
  );
  return {
    app: (
      <Router.Router history={history(historyPath ?? "/chart/new/type")}>
        <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
          <StoreProvider store={mockStore}>
            <RecoilRoot initializeState={initialRecoilState}>
              <ChartBuilderChartType {...props} />
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
test("clicking AI switch should toggle switch", async () => {
  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(isChartAIAgentActive, false);
  };
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });
  const { app, mockStore, props } = appSetup(
    null,
    "12345",
    initialRecoilState,
    {},
    "/chart/new/type"
  );

  const aiAgentSwitchId = "ai-agent-switch";

  render(app);
  expect(screen.getByTestId(aiAgentSwitchId)).toBeInTheDocument();
  //turn on switch
  await userEvent.click(screen.getByTestId(aiAgentSwitchId));
  expect(screen.getByTestId(aiAgentSwitchId)).toBeChecked();
  //turn off switch
  await userEvent.click(screen.getByTestId(aiAgentSwitchId));
  expect(screen.getByTestId(aiAgentSwitchId)).not.toBeChecked();
});

test("should select a chart type", async () => {
  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(isChartAIAgentActive, false);
  };
  const user = userEvent.setup();
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });

  const { app, mockStore, props } = appSetup(
    null,
    "12345",
    initialRecoilState,
    {},
    "/chart/new/type?loadataset=true"
  );

  render(app);
  expect(props.loadDataset).toHaveBeenCalled();
  echartTypes(false)
    .filter((c) => c.class === "basic")
    .forEach((ct: ChartTypeModel) => {
      expect(screen.getByTestId(ct.id)).toBeInTheDocument();
    });
  await user.click(screen.getByTestId(echartTypes(false)[0].id));
  expect(mockStore.getState().charts.mapping.value).toEqual({});
  expect(mockStore.getState().charts.chartType.value).toEqual(
    echartTypes(false)[0].id
  );
});

test("should unselect a chart type", async () => {
  const user = userEvent.setup();
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });
  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(isChartAIAgentActive, false);
  };
  const { app, mockStore } = appSetup(
    "echartsBarchart",
    "12345",
    initialRecoilState
  );

  render(app);
  echartTypes(false)
    .filter((c) => c.class === "basic")
    .forEach((ct: ChartTypeModel) => {
      expect(screen.getByTestId(ct.id)).toBeInTheDocument();
    });
  await user.click(screen.getByTestId(echartTypes(false)[0].id));
  expect(mockStore.getState().charts.mapping.value).toEqual({});
  expect(mockStore.getState().charts.chartType.value).toBeNull();
});

test("should redirect to data page if dataset is empty", async () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });
  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(isChartAIAgentActive, false);
  };
  const { app } = appSetup(null, null, initialRecoilState);

  render(app);
  expect(screen.getByTestId("echartsBarchart")).toBeInTheDocument();
  expect(history("/chart/new/data").location.pathname).toEqual(
    "/chart/new/data"
  );
});
