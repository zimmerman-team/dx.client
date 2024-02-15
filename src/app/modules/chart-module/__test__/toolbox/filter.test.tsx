import { render, screen } from "@testing-library/react";
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
import Router from "react-router-dom";
import { ChartsActivePanelsState } from "app/state/api/action-reducers/sync/charts";

interface MockProps {
  onNavBtnClick: jest.Mock<any, any, any>;
  setIsClickable: jest.Mock<any, any, any>;
  isClickable: boolean;
  onMouseOverNavBtn: jest.Mock<any, any, any>;
  stepPaths: { name: string; path: string }[];
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

const appSetup = (app: React.ReactNode) => {
  jest.spyOn(Router, "useParams").mockReturnValue({ page: "new" });
  jest
    .spyOn(Router, "useLocation")
    .mockReturnValue({ pathname: "/chart/new/data" });
  const mockStore = createStore({
    charts: {
      activePanels: ChartsActivePanelsState,
    },
  });

  return <StoreProvider store={mockStore}>{app}</StoreProvider>;
};

test("filter group should be expandable", async () => {});
