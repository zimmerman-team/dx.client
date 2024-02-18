import { getByTestId, render, screen } from "@testing-library/react";
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
import { FilterGroup } from "app/modules/chart-module/routes/filters/components/FilterGroup";
import { ChartsAppliedFiltersState } from "app/state/api/action-reducers/sync/charts/filters";
import { ExpandedFilterGroup } from "app/modules/chart-module/routes/filters/components/ExpandedFilterGroup";

interface MockProps {
  key: string;
  name: string;
  options: any;
  loadChartDataFromAPI: jest.Mock<any, any, any>;
  expandGroup: jest.Mock<any, any, any>;
  goBack: jest.Mock<any, any, any>;
}

const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    loadChartDataFromAPI: jest.fn(),
    expandGroup: jest.fn(),
    goBack: jest.fn(),
    key: "1",
    name: "AlcoholUseDisorders",
    options: [
      {
        label: "1",
        value: "1",
      },
      {
        label: "10",
        value: "10",
      },
      {
        label: "100",
        value: "100",
      },
      {
        label: "1000",
        value: "1000",
      },
      {
        label: "10016",
        value: "10016",
      },
      {
        label: "10033",
        value: "10033",
      },
      {
        label: "1005",
        value: "1005",
      },
    ],
    ...props,
  };
};

const defaultStoreValue = (name: string) => ({
  [name]: ["1", "10", "100", "1000", "10016", "10033", "1005"],
});

const emptyStoreValue = () => ({});

const appSetup = (
  app: React.ReactNode,
  name: string,
  storeValue: {
    [key: string]: any[];
  }
) => {
  const mockStore = createStore(
    {
      charts: {
        appliedFilters: ChartsAppliedFiltersState,
      },
    },
    {
      initialState: {
        charts: {
          appliedFilters: {
            value: storeValue,
          },
        },
      },
    }
  );

  return {
    app: <StoreProvider store={mockStore}>{app}</StoreProvider>,
    mockStore,
  };
};

test("filter group should be expandable when clicked", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <FilterGroup {...props} />,
    props.name,
    defaultStoreValue(props.name)
  );
  render(app);
  const filterGroup = screen.getByTestId("filter-group");
  await user.click(filterGroup);
  expect(props.expandGroup).toHaveBeenCalled();
});

test("applied filters list should decrease by 1 when an applied filter is clickecd", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <FilterGroup {...props} />,
    props.name,
    defaultStoreValue(props.name)
  );

  render(app);

  const appliedFiltersList = screen.getAllByTestId("remove-applied-filter");
  expect(screen.getByTestId("applied-filters")).toBeInTheDocument();

  expect(appliedFiltersList.length).toBe(7);

  const appliedFilter = appliedFiltersList[0];

  await user.click(appliedFilter);

  expect(screen.getAllByTestId("remove-applied-filter").length).toBe(6);
  await user.click(screen.getAllByTestId("remove-applied-filter")[0]);
  expect(screen.getAllByTestId("remove-applied-filter").length).toBe(5);

  expect(props.loadChartDataFromAPI).toHaveBeenCalled();
});

test("expanded filter group should close when back button is clicked", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
      loadChartDataFromAPI={props.loadChartDataFromAPI}
    />,
    props.name,
    defaultStoreValue(props.name)
  );
  render(app);

  const backButton = screen.getByRole("button", {
    name: "expanded-filter-close",
  });
  expect(backButton).toBeInTheDocument();
  await user.click(backButton);
  expect(props.goBack).toHaveBeenCalled();
});

test("checking 'select all' checkbox should select all filter options", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app, mockStore } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
      loadChartDataFromAPI={props.loadChartDataFromAPI}
    />,
    props.name,
    emptyStoreValue()
  );
  render(app);

  const selectAllCheckbox = screen.getByRole("checkbox", {
    name: "Select all",
  });
  expect(selectAllCheckbox).toBeInTheDocument();
  await user.click(selectAllCheckbox);
  expect(selectAllCheckbox).toBeChecked();

  props.options.forEach((option: any) => {
    expect(
      screen.getByRole("checkbox", {
        name: option.label,
      })
    ).toBeChecked();
  });

  const applyButton = screen.getByRole("button", {
    name: "Apply",
  });
  await user.click(applyButton);
  expect(mockStore.getState().charts.appliedFilters.value).toEqual(
    defaultStoreValue(props.name)
  );
  expect(props.loadChartDataFromAPI).toHaveBeenCalled();
  expect(props.goBack).toHaveBeenCalled();
});

test("unchecking 'select all' checkbox should unselect all filter options", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
      loadChartDataFromAPI={props.loadChartDataFromAPI}
    />,
    props.name,
    defaultStoreValue(props.name)
  );
  render(app);

  const selectAllCheckbox = screen.getByRole("checkbox", {
    name: "Select all",
  });
  expect(selectAllCheckbox).toBeInTheDocument();
  await user.click(selectAllCheckbox);
  expect(selectAllCheckbox).not.toBeChecked();
});

test("applied filters should be removed when reset button is clicked", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app, mockStore } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
      loadChartDataFromAPI={props.loadChartDataFromAPI}
    />,
    props.name,
    defaultStoreValue(props.name)
  );
  render(app);

  const resetButton = screen.getByRole("button", {
    name: "reset-button",
  });
  expect(resetButton).toBeInTheDocument();
  await user.click(resetButton);
  props.options.forEach((option: any) => {
    expect(
      screen.getByRole("checkbox", {
        name: option.label,
      })
    ).not.toBeChecked();
  });
  expect(mockStore.getState().charts.appliedFilters.value).toEqual({});
  expect(props.loadChartDataFromAPI).toHaveBeenCalled();
});

test("search input should filter options", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
      loadChartDataFromAPI={props.loadChartDataFromAPI}
    />,
    props.name,
    emptyStoreValue()
  );
  render(app);

  const searchInput = screen.getByRole("searchbox");
  expect(searchInput).toBeInTheDocument();

  //search for 100
  await user.type(searchInput, "100");
  expect(screen.getAllByTestId("filter-option-checkbox").length).toBe(5);
  const filteredOptions = ["100", "1000", "10016", "10033", "1005"];
  filteredOptions.forEach((option: string) => {
    expect(screen.getByLabelText(option)).toBeInTheDocument();
  });

  //delete search input
  await user.clear(searchInput);
  expect(screen.getAllByTestId("filter-option-checkbox").length).toBe(7);
  props.options.forEach((option: any) => {
    expect(screen.getByLabelText(option.label)).toBeInTheDocument();
  });
});

test("should multi check and uncheck filter options", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
      loadChartDataFromAPI={props.loadChartDataFromAPI}
    />,
    props.name,
    emptyStoreValue()
  );
  render(app);
  const checkboxList: HTMLElement[] = [];
  props.options.forEach((option: any) => {
    checkboxList.push(screen.getByRole("checkbox", { name: option.label }));
  });
  expect(checkboxList.length).toBe(7);
  //multi check filte options
  await user.click(checkboxList[0]);
  await user.keyboard("{Shift>}");
  await user.click(checkboxList[6]);
  await user.keyboard("{/Shift}");

  checkboxList.forEach((checkBox: HTMLElement) => {
    expect(checkBox).toBeChecked();
  });

  //multi uncheck filte options
  await user.click(checkboxList[6]);
  await user.keyboard("{Shift>}");
  await user.click(checkboxList[0]);

  checkboxList.forEach((checkBox: HTMLElement) => {
    expect(checkBox).not.toBeChecked();
  });
});
