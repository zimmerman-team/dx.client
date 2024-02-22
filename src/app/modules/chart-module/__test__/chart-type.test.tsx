/** third party */
import { render, screen } from "@testing-library/react";
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
import Router from "react-router-dom";
import {
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsMappingState,
} from "app/state/api/action-reducers/sync/charts";
import ChartBuilderChartType from "app/modules/chart-module/routes/chart-type";
import { ChartTypeModel, echartTypes } from "../routes/chart-type/data";
import { createMemoryHistory } from "history";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const history = createMemoryHistory({
  initialEntries: ["/chart/new/type"],
});
const appSetup = (chartType: string | null, dataset: string | null) => {
  const mockStore = createStore(
    {
      charts: {
        chartType: ChartsChartTypeState,
        dataset: ChartsDatasetState,
        mapping: ChartsMappingState,
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
      <Router.Router history={history}>
        <StoreProvider store={mockStore}>
          <ChartBuilderChartType loading={false} />
        </StoreProvider>
      </Router.Router>
    ),
    mockStore,
  };
};

//test cases

test("should select a chart type", async () => {
  const user = userEvent.setup();
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });

  const { app, mockStore } = appSetup(null, "12345");

  render(app);
  echartTypes(false).forEach((ct: ChartTypeModel) => {
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

  const { app, mockStore } = appSetup("echartsBarchart", "12345");

  render(app);
  echartTypes(false).forEach((ct: ChartTypeModel) => {
    expect(screen.getByTestId(ct.id)).toBeInTheDocument();
  });
  await user.click(screen.getByTestId(echartTypes(false)[0].id));
  expect(mockStore.getState().charts.mapping.value).toEqual({});
  expect(mockStore.getState().charts.chartType.value).toBeNull();
});

test("should redirect to data page if dataset is empty", async () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });

  const { app } = appSetup(null, null);

  render(app);
  expect(screen.getByTestId("echartsBarchart")).toBeInTheDocument();
  expect(history.location.pathname).toEqual("/chart/new/data");
});
