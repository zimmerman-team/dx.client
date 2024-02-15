import { render, screen } from "@testing-library/react";
import ToolboxNav from "../../components/toolbox/steps/navbar";
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

const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    onNavBtnClick: jest.fn(),
    setIsClickable: jest.fn(),
    isClickable: true,
    onMouseOverNavBtn: jest.fn(),
    stepPaths: [{ name: "dataset", path: `/chart/new/preview-data` }],
    ...props,
  };
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

const appSetup = (props: MockProps, page: string, pathname: string) => {
  jest.spyOn(Router, "useParams").mockReturnValue({ page });
  jest.spyOn(Router, "useLocation").mockReturnValue({ pathname });

  const mockStore = createStore({
    charts: {
      activePanels: ChartsActivePanelsState,
    },
  });

  return {
    app: (
      <StoreProvider store={mockStore}>
        <ToolboxNav {...props} />
      </StoreProvider>
    ),
    mockStore,
  };
};

test("when page params is not equal to new", async () => {
  const props = defaultProps({
    stepPaths: [{ name: "dataset", path: `/chart/12345/data` }],
  });
  const { app, mockStore } = appSetup(props, "12345", "/chart/12345/data");
  render(app);

  expect(mockStore.getState().charts.activePanels.value).toEqual("dataset");
});

test("navigations should be clickable, and should call onNavBtnClick function", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(props, "new", "/chart/new/data");
  render(app);

  const navButton = await screen.findByRole("button", { name: "dataset" });
  expect(navButton).toBeInTheDocument();
  expect(navButton).toBeEnabled();
  await user.click(navButton);
  expect(props.onNavBtnClick).toHaveBeenCalledWith(
    props.stepPaths[0].name,
    props.stepPaths[0].path
  );
  //hover on the button
  await user.hover(navButton);
  expect(props.onMouseOverNavBtn).toHaveBeenCalledWith(props.stepPaths[0].name);
  //unhover on the button
  await user.unhover(navButton);
  expect(props.setIsClickable).toHaveBeenCalledWith(false);
});

test("navigations should not be clickable", async () => {
  const user = userEvent.setup();
  const props = defaultProps({ isClickable: false });
  const { app } = appSetup(props, "new", "/chart/new/data");
  render(app);

  const navButton = await screen.findByRole("button", { name: "dataset" });
  expect(navButton).toBeInTheDocument();
  expect(navButton).toBeDisabled();
  //click on the button
  await user.click(navButton);
  expect(props.onNavBtnClick).not.toHaveBeenCalled();
  //hover on the button
  await user.hover(navButton);
  expect(props.onMouseOverNavBtn).toHaveBeenCalledWith(props.stepPaths[0].name);
  //unhover on the button
  await user.unhover(navButton);
  expect(props.setIsClickable).toHaveBeenCalledWith(false);
});
