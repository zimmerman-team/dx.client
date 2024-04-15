/** third party */
import { fireEvent, render, screen } from "@testing-library/react";
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
/** project */
import { FilterGroup } from "app/modules/chart-module/routes/filters/components/FilterGroup";
import { ChartsAppliedFiltersState } from "app/state/api/action-reducers/sync/charts/filters";
import { ExpandedFilterGroup } from "app/modules/chart-module/routes/filters/components/ExpandedFilterGroup";
import { FilterGroupOptionModel } from "app/components/ToolBoxPanel/components/filters/data";

interface MockProps {
  key: string;
  name: string;
  options: any;
  renderChartFromAPI: jest.Mock<any, any, any>;
  expandGroup: jest.Mock<any, any, any>;
  goBack: jest.Mock<any, any, any>;
}
const optionsWithSubOptions = [
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
    subOptions: [
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
  },
];

const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    renderChartFromAPI: jest.fn(),
    expandGroup: jest.fn(),
    goBack: jest.fn(),
    key: "1",
    name: "AlcoholUseDisorders",
    // options: [
    //   {
    //     label: "1",
    //     value: "1",
    //   },
    //   {
    //     label: "10",
    //     value: "10",
    //   },
    //   {
    //     label: "100",
    //     value: "100",
    //   },
    //   {
    //     label: "1000",
    //     value: "1000",
    //   },
    //   {
    //     label: "10016",
    //     value: "10016",
    //   },
    //   {
    //     label: "10033",
    //     value: "10033",
    //   },
    //   {
    //     label: "1005",
    //     value: "1005",
    //   },
    // ],
    options: optionsWithSubOptions,
    ...props,
  };
};

const defaultStoreValue = (name: string) => ({
  [name]: ["1", "10", "100", "1000", "10016", "10033", "1005"],
});

const emptyStoreValue = () => ({});

const checkIfAllOptionsAreChecked = (options: FilterGroupOptionModel[]) => {
  const isOptionExpanded = screen.queryByTestId("filter-sub-options");
  //check if all options are checked including suboptions
  options.forEach((option: FilterGroupOptionModel) => {
    expect(
      screen.getByRole("checkbox", {
        name: option.label,
      })
    ).toBeChecked();
    if (option.subOptions && isOptionExpanded) {
      checkIfAllOptionsAreChecked(option.subOptions);
    }
  });
};

const checkIfAllOptionsAreUnchecked = (options: FilterGroupOptionModel[]) => {
  const isOptionExpanded = screen.queryByTestId("filter-sub-options");
  //check if all options are checked including suboptions
  options.forEach((option: FilterGroupOptionModel) => {
    expect(
      screen.getByRole("checkbox", {
        name: option.label,
      })
    ).not.toBeChecked();
    if (option.subOptions && isOptionExpanded) {
      checkIfAllOptionsAreUnchecked(option.subOptions);
    }
  });
};

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

//test cases
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
  const { app, mockStore } = appSetup(
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

  screen.getAllByTestId("remove-applied-filter").forEach((appliedFilter) => {
    expect(appliedFilter).toBeInTheDocument();
    fireEvent.click(appliedFilter);
  });
  expect(mockStore.getState().charts.appliedFilters.value[props.name]).toBeNull;

  expect(props.renderChartFromAPI).toHaveBeenCalled();
});

test("expanded filter group should close when back button is clicked", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
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

test("clicking expand button should expand suboptions", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
    />,
    props.name,
    emptyStoreValue()
  );
  render(app);

  const expandButton = screen.getByTestId("expand-filter-option-button");
  expect(expandButton).toBeInTheDocument();
  await user.click(expandButton);
  expect(screen.getByTestId("filter-sub-options")).toBeInTheDocument();
  const toggleOverlay = screen.getByTestId("expand-filter-option-overlay");
  await user.click(toggleOverlay);
  expect(screen.queryByTestId("filter-sub-options")).not.toBeInTheDocument();
});

test("checking 'select all' checkbox should select all filter options", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app, mockStore } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
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

  checkIfAllOptionsAreChecked(props.options);

  const applyButton = screen.getByRole("button", {
    name: "Apply",
  });
  await user.click(applyButton);
  expect(mockStore.getState().charts.appliedFilters.value).toEqual(
    defaultStoreValue(props.name)
  );
  expect(props.renderChartFromAPI).toHaveBeenCalled();
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
  checkIfAllOptionsAreUnchecked(props.options);
});

test("applied filters should be removed when reset button is clicked", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app, mockStore } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
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
  checkIfAllOptionsAreUnchecked(props.options);

  expect(mockStore.getState().charts.appliedFilters.value).toEqual({});
  expect(props.renderChartFromAPI).toHaveBeenCalled();
});

test("search input should filter options", async () => {
  const user = userEvent.setup();
  const props = defaultProps();
  const { app } = appSetup(
    <ExpandedFilterGroup
      name={props.name}
      options={props.options}
      goBack={props.goBack}
    />,
    props.name,
    emptyStoreValue()
  );
  render(app);

  const searchInput = screen.getByRole("textbox");
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
  expect(screen.getAllByTestId("filter-option-checkbox").length).toBe(3);
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
    />,
    props.name,
    emptyStoreValue()
  );
  render(app);
  const checkboxList: HTMLElement[] = [];
  props.options.forEach((option: any) => {
    checkboxList.push(screen.getByRole("checkbox", { name: option.label }));
  });
  expect(checkboxList.length).toBe(3);
  //multi check filte options
  await user.click(checkboxList[0]);
  await user.keyboard("{Shift>}");
  await user.click(checkboxList[2]);
  await user.keyboard("{/Shift}");

  checkboxList.forEach((checkBox: HTMLElement) => {
    expect(checkBox).toBeChecked();
  });

  //multi uncheck filte options
  await user.click(checkboxList[2]);
  await user.keyboard("{Shift>}");
  await user.click(checkboxList[0]);

  checkboxList.forEach((checkBox: HTMLElement) => {
    expect(checkBox).not.toBeChecked();
  });
});
