import { render, screen } from "@testing-library/react";
import Filter from "../components/Filter";
import userEvent from "@testing-library/user-event";

interface MockProps {
  searchValue: string;
  setSearchValue: jest.Mock<any, any, any>;
  setSortValue: jest.Mock<any, any, any>;
  sortValue: string;
  setAssetsView: jest.Mock<any, any, any>;
  assetsView: "table" | "grid";
  terminateSearch?: jest.Mock<any, any, any>;
  searchInputWidth?: string;
  openSearch: boolean;
  setOpenSearch: jest.Mock<any, any, any>;
  searchIconCypressId: string;
}

const defaultProps = (newProps: Partial<MockProps>): MockProps => {
  return {
    searchValue: "",
    setSearchValue: jest.fn(),
    setSortValue: jest.fn(),
    sortValue: "",
    setAssetsView: jest.fn(),
    assetsView: "table",
    openSearch: false,
    terminateSearch: jest.fn(),
    setOpenSearch: jest.fn(),
    searchIconCypressId: "",
    ...newProps,
  };
};
const appSetup = (newProps: Partial<MockProps>) => {
  const props = defaultProps(newProps);
  return {
    app: (
      <>
        <Filter {...props} />
      </>
    ),
    props,
  };
};

test("should render Filter component", async () => {
  const { app } = appSetup({});
  render(app);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("clicking search button should display input field", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({ openSearch: true });
  render(app);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "search-button" }));
  expect(props.setOpenSearch).toHaveBeenCalledWith(true);
  await user.type(screen.getByRole("textbox"), "Kenya");
  expect(props.terminateSearch).toHaveBeenCalled();
  expect(props.setSearchValue).toHaveBeenCalledTimes(5);
});

test("should close search input field", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({ openSearch: true });
  render(app);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "search-button" }));
  expect(props.setOpenSearch).toHaveBeenCalledWith(true);
  await user.click(screen.getByRole("button", { name: "close-search" }));
  expect(props.setOpenSearch).toHaveBeenCalledWith(false);
});

test("clicking view button should change view from grid to table", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({ assetsView: "grid" });
  render(app);
  expect(
    screen.getByRole("button", { name: "table-view-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "table-view-button" }));
  expect(props.setAssetsView).toHaveBeenCalledWith("table");
});

test("clicking view button should change view from table to grid", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({ assetsView: "table" });
  render(app);
  expect(
    screen.getByRole("button", { name: "grid-view-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "grid-view-button" }));
  expect(props.setAssetsView).toHaveBeenCalledWith("grid");
});

test("clicking sort button should display sort options", async () => {
  const user = userEvent.setup();
  const { app } = appSetup({});
  render(app);
  expect(
    screen.getByRole("button", { name: "sort-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "sort-button" }));
  expect(screen.getByText("Sort by")).toBeInTheDocument();
});

test("clicking sort option name should change sort value", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({});
  render(app);
  expect(
    screen.getByRole("button", { name: "sort-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "sort-button" }));
  expect(screen.getByText("Sort by")).toBeInTheDocument();
  await user.click(screen.getByText("Name"));
  expect(props.setSortValue).toHaveBeenCalledWith("name");
});

test("clicking sort option created date should change sort value", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({});
  render(app);
  expect(
    screen.getByRole("button", { name: "sort-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "sort-button" }));
  expect(screen.getByText("Sort by")).toBeInTheDocument();
  await user.click(screen.getByText("Created date"));
  expect(props.setSortValue).toHaveBeenCalledWith("createdDate");
});

test("clicking sort option updated date should change sort value", async () => {
  const user = userEvent.setup();
  const { app, props } = appSetup({});
  render(app);
  expect(
    screen.getByRole("button", { name: "sort-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "sort-button" }));
  expect(screen.getByText("Sort by")).toBeInTheDocument();
  await user.click(screen.getByText("Last updated"));
  expect(props.setSortValue).toHaveBeenCalledWith("updatedDate");
});

test("clicking sort option should close sort options", async () => {
  const user = userEvent.setup();
  const { app } = appSetup({});
  render(app);
  expect(
    screen.getByRole("button", { name: "sort-button" })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "sort-button" }));
  expect(screen.getByText("Sort by")).toBeInTheDocument();
  await user.click(screen.getByText("Last updated"));
  expect(screen.queryByText("Sort by")).not.toBeInTheDocument();
});
