import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  chartFromReportAtom,
  isChartDraggingAtom,
  isDividerOrRowFrameDraggingAtom,
  reportRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { RecoilObserver } from "app/utils/recoilObserver";
import { createMemoryHistory } from "history";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Router from "react-router-dom";
import { MutableSnapshot, RecoilRoot } from "recoil";

import {
  ReportElementsType,
  ReportRightPanelCreateView,
} from "app/modules/report-module/components/right-panel-create-view/";
import { StoreProvider, createStore } from "easy-peasy";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import {
  ChartCreate,
  ChartGet,
  ChartGetList,
} from "app/state/api/action-reducers/charts";
import {
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsEnabledFilterOptionGroupsState,
  ChartsMappingState,
} from "app/state/api/action-reducers/sync/charts";
import { mockChartList } from "app/modules/report-module/__test__/data";
import axios, { AxiosResponse } from "axios";
import { ChartsAppliedFiltersState } from "app/state/api/action-reducers/sync/charts/filters";

interface MockProps {
  showHeaderItem: boolean;
  headerDetails: any;
  setHeaderDetails: jest.Mock<any, any, any>;
  framesArray: never[];
  reportName: string;
  handlePersistReportState: jest.Mock<any, any, any>;
}
interface Params {
  mockActions: boolean;
  dataset: any;
  mapping: any;
  chartType: any;
}

//mocks
jest.mock("axios");

const defaultProps = (newProps: Partial<MockProps> = {}): MockProps => {
  return {
    showHeaderItem: true,
    headerDetails: {},
    setHeaderDetails: jest.fn(),
    framesArray: [],
    reportName: "",
    handlePersistReportState: jest.fn(),
    ...newProps,
  };
};
const dragAndDrop = (source: string, target: string) => {
  fireEvent.dragStart(screen.getByText(source));
  fireEvent.dragLeave(screen.getByText(source));
  fireEvent.dragEnter(screen.getByTestId(target));
  fireEvent.dragOver(screen.getByTestId(target));
  fireEvent.drop(screen.getByTestId(target));
};
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
const history = createMemoryHistory({
  initialEntries: ["/chart/new/mapping"],
});
//recoil states
const reportRightPanelViewChange = jest.fn();
const isDividerOrRowFrameDraggingAtomChange = jest.fn();
const chartFromReportAtomChange = jest.fn();
const isChartDraggingAtomChange = jest.fn();

const appSetup = (
  newProps: Partial<MockProps> = {},
  params: Partial<Params> = {}
) => {
  const props = defaultProps(newProps);

  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(reportRightPanelViewAtom, "elements");
  };

  const Droppable = () => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: [
        ReportElementsType.TEXT,
        ReportElementsType.BIG_NUMBER,
        ReportElementsType.CHART,
      ],

      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        item: monitor.getItem(),
      }),
      drop: (item: any, monitor) => {},
    }));
    return <div ref={drop} data-testid="drop-item" />;
  };
  const mockStore = createStore(
    {
      AuthToken: AuthTokenState,
      charts: {
        dataset: ChartsDatasetState,
        appliedFilters: ChartsAppliedFiltersState,
        enabledFilterOptionGroups: ChartsEnabledFilterOptionGroupsState,
        chartType: ChartsChartTypeState,

        mapping: ChartsMappingState,
        ChartGetList,
        ChartGet,
        ChartCreate,
      },
    },
    {
      mockActions: Boolean(params.mockActions),
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
        <StoreProvider store={mockStore}>
          <RecoilRoot initializeState={initialRecoilState}>
            <RecoilObserver
              node={reportRightPanelViewAtom}
              onChange={reportRightPanelViewChange}
            />
            <RecoilObserver
              node={isDividerOrRowFrameDraggingAtom}
              onChange={isDividerOrRowFrameDraggingAtomChange}
            />
            <RecoilObserver
              node={chartFromReportAtom}
              onChange={chartFromReportAtomChange}
            />
            <RecoilObserver
              node={isChartDraggingAtom}
              onChange={isChartDraggingAtomChange}
            />
            <DndProvider backend={HTML5Backend}>
              <ReportRightPanelCreateView {...props} />
              <Droppable />
            </DndProvider>
          </RecoilRoot>
        </StoreProvider>
      </Router.Router>
    ),

    props,
    mockStore,
  };
};
test("clicking tabs should switch views", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  const axiosMock = axios.get as jest.Mock;
  axiosMock.mockResolvedValue({
    data: mockChartList,
  } as AxiosResponse<any>);
  const user = userEvent.setup();
  const { app } = appSetup();

  render(app);
  expect(screen.getByText(/header/)).toBeInTheDocument();
  await user.click(screen.getByTestId("elements-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("elements");
  expect(
    screen.getByText("Remove or add header to your report")
  ).toBeInTheDocument();

  await user.click(screen.getByTestId("charts-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("charts");
  expect(screen.getByText("charts")).toBeInTheDocument();

  await user.click(screen.getByTestId("media-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("media");
  expect(screen.getByText("media")).toBeInTheDocument();
});

test("elements items should be draggable", async () => {
  const user = userEvent.setup();

  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });
  const { app } = appSetup({}, { mockActions: false });
  render(app);
  dragAndDrop("Add row frame", "drop-item");
  dragAndDrop("Add divider", "drop-item");
  await user
    .setup({ pointerEventsCheck: 2 })
    .click(screen.getByTestId("Header"));
});

test("should search for charts in in chart view", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });

  const axiosMock = axios.get as jest.Mock;

  axiosMock.mockResolvedValue({
    data: [
      {
        id: "65e96b1f20c7fb0ac9ce039a",
        name: "Wine quality (Copy)",
        public: false,
        vizType: "echartsBarchart",
        datasetId: "65e9672ecc1d4b0a62cd6079",
        createdDate: "2024-03-07T07:22:07.342Z",
      },
    ],
  } as AxiosResponse<any>);

  const { app, mockStore } = appSetup({}, { mockActions: false });
  render(app);
  mockStore.getActions().charts.ChartGetList.setCrudData(mockChartList);

  await user.click(screen.getByTestId("charts-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("charts");
  expect(screen.getByText("charts")).toBeInTheDocument();

  await user.type(screen.getByRole("textbox"), "wine");

  //   expect(mockStore.getActions().charts.ChartGetList.fetch).toHaveBeenCalled();
  expect(screen.getByText("Wine quality (Copy)")).toBeInTheDocument();
  expect(screen.queryByText("Energy")).not.toBeInTheDocument();
});

test("clicking add chart card should redirect to chart page", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });
  (axios.get as jest.Mock).mockResolvedValue({
    data: mockChartList,
  });
  const user = userEvent.setup();
  const { app } = appSetup();
  render(app);
  await user.click(screen.getByTestId("charts-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("charts");
  expect(screen.getByText("charts")).toBeInTheDocument();
  await userEvent.click(screen.getByText("New chart"));
  expect(history.location.pathname).toBe("/chart/new/data");
});

test("charts items should be draggable", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });
  (axios.get as jest.Mock).mockResolvedValue({
    data: mockChartList,
  });
  const { app, mockStore } = appSetup();
  render(app);
  mockStore.getActions().charts.ChartGetList.setCrudData(mockChartList);
  await user.click(screen.getByTestId("charts-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("charts");
  expect(screen.getByText("charts")).toBeInTheDocument();
  fireEvent.dragStart(screen.getByTestId("chart-0"));
  fireEvent.dragLeave(screen.getByTestId("chart-0"));
  fireEvent.dragEnter(screen.getByTestId("drop-item"));
  fireEvent.dragOver(screen.getByTestId("drop-item"));
  fireEvent.drop(screen.getByTestId("drop-item"));
});

test("chart card should be expandable", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "12345", view: "edit" });
  (axios.get as jest.Mock).mockResolvedValue({
    data: mockChartList,
  });
  (axios.post as jest.Mock).mockResolvedValue({
    data: {},
  });
  const { app, mockStore } = appSetup({}, { mockActions: false });
  render(app);
  mockStore.getActions().charts.ChartGetList.setCrudData(mockChartList);

  await user.click(screen.getByTestId("charts-button"));
  expect(reportRightPanelViewChange).toHaveBeenCalledWith("charts");
  expect(screen.getByText("charts")).toBeInTheDocument();
  expect(screen.getByText(/Sort by Recent/)).toBeInTheDocument();
  expect(screen.getByTestId("create-chart-card")).toBeInTheDocument();

  await user.click(screen.getAllByTestId("expand-chart-button")[0]);
});
