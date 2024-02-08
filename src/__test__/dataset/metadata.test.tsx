import {
  fireEvent,
  queryAllByTestId,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFormDetails } from "__test__/mock-data";
import MetaData, {
  SelectCategoryField,
} from "app/modules/dataset-upload-module/upload-steps/metaData";
import { DatasetGet } from "app/state/api/action-reducers/data-themes";
import { StoreProvider, createStore } from "easy-peasy";
import { use } from "echarts";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: () => ({
    handleSubmit: () => jest.fn(),
    getValues: () => jest.fn(),
  }),
}));

test("add meta data", async () => {
  const user = userEvent.setup();

  const mockStore = createStore({
    dataThemes: { DatasetGet: DatasetGet },
  });
  const mockProps = {
    formDetails: {
      name: "Moc Dataset",
      source: "Mock source",
      category: "Education",
      public: false,
      sourceUrl: "https://example.com/mock-source",
      description: "",
    },
    setFormDetails: jest.fn(),
    onSubmit: jest.fn(),
    handleBack: jest.fn(),
  };
  render(
    <StoreProvider store={mockStore}>
      <MemoryRouter initialEntries={[{ pathname: "/dataset-upload" }]}>
        <MetaData {...mockProps} />
      </MemoryRouter>
    </StoreProvider>
  );
  //confirm title is in the document
  const title = screen.getByText(/Describe your data/i);
  expect(title).toBeInTheDocument();

  //test the form fields
  // 1. Data Title
  const titleInput = screen.getByLabelText(/data title/i) as HTMLInputElement;
  expect(titleInput).toBeInTheDocument();
  // check if the input has the correct default value
  expect(titleInput).toHaveValue(mockProps.formDetails.name);
  fireEvent.input(titleInput, { target: { value: "Test Title" } });
  await waitFor(() => {
    expect(mockProps.setFormDetails).toHaveBeenCalledWith({
      name: "Test Title",
      description: "",
      category: "Education",
      public: false,
      source: "Mock source",
      sourceUrl: "https://example.com/mock-source",
    });
  });
  await waitFor(() => {
    expect(mockProps.formDetails).toMatchObject({
      name: "Test Title",
      description: "",
      category: "Education",
      public: false,
      source: "Mock source",
      sourceUrl: "https://example.com/mock-source",
    });
  });

  // 2. Data Description
  const descriptionInput = screen.getByTestId(
    "description"
  ) as HTMLInputElement;
  expect(descriptionInput).toBeInTheDocument();
  // check if the input has the correct default value
  expect(descriptionInput).toHaveValue(mockProps.formDetails.description);
  //   await user.type(descriptionInput, "Test Description");
  fireEvent.input(descriptionInput, { target: { value: "Test Description" } });

  expect(mockProps.setFormDetails).toHaveBeenCalledWith({
    name: "Test Title",
    description: "Test Description",
    category: "Education",
    public: false,
    source: "Mock source",
    sourceUrl: "https://example.com/mock-source",
  });
  await waitFor(() => {
    expect(descriptionInput).toHaveValue("Test Description");
  });

  // 3. Data Category
  const categorySelect = screen.getByLabelText(
    /data category/i
  ) as HTMLInputElement;
  expect(categorySelect).toBeInTheDocument();
  // check if the input has the correct default value
  //   expect(categorySelect).toHaveValue(mockProps.formDetails.category);
  await user.click(categorySelect);
  //click category option
  const categoryOption = screen.getByText(/Arts and Culture/i);
  expect(categoryOption).toBeInTheDocument();
  await user.click(categoryOption);

  // 4. Data Source
  const sourceInput = screen.getByTestId(
    "Source-of-the-data"
  ) as HTMLInputElement;
  expect(sourceInput).toBeInTheDocument();
  // check if the input has the correct default value
  expect(sourceInput).toHaveValue(mockProps.formDetails.source);
  //   await user.type(sourceInput, "Test Source");
  fireEvent.input(sourceInput, { target: { value: "Test source" } });

  // 5. Data Source URL
  const sourceUrlInput = screen.getByTestId(
    "Link-to-data-source"
  ) as HTMLInputElement;
  expect(sourceUrlInput).toBeInTheDocument();
  // check if the input has the correct default value
  expect(sourceUrlInput).toHaveValue(mockProps.formDetails.sourceUrl);
  //   await user.type(sourceUrlInput, "https://example.com/Test-source");
  fireEvent.input(sourceUrlInput, {
    target: { value: "https://example.com/Test-source" },
  });

  const submitButton = screen.getByText(/next/i);
  expect(submitButton).toBeInTheDocument();
  await user.click(submitButton);

  const error = screen.queryAllByTestId("error") as HTMLElement[];
  await waitFor(() => {
    expect(mockProps.setFormDetails).toHaveBeenCalledWith({
      name: "Test Title",
      description: "Test Description",
      category: "Arts and Culture",
      public: false,
      source: "Test source",
      sourceUrl: "https://example.com/Test-source",
    });
  });
  console.log(mockFormDetails, "mockFormDetails");

  //   expect(error).toBeNull();

  await waitFor(() => {
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });
});
