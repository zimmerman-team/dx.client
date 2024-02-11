import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFormDetails } from "app/modules/dataset-upload-module/__test__/mock-data";
import MetaData from "app/modules/dataset-upload-module/upload-steps/metaData";
import { DatasetGet } from "app/state/api/action-reducers/data-themes";
import { StoreProvider, createStore } from "easy-peasy";
import { MemoryRouter } from "react-router-dom";
import { CssTextField } from "../../style";

// jest.mock("react-hook-form", () => {
//   const reactHookFormModule = jest.requireActual("react-hook-form");
//   return {
//     ...reactHookFormModule,
//     useForm: () => ({
//       register: jest.fn(),
//       handleSubmit: jest.fn(),
//       formState: {
//         errors: {},
//       },
//       reset: jest.fn(),
//       control: jest.fn(),
//     }),
//   };
// });

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

  const titleInput = screen.getByLabelText(/data title/i) as HTMLInputElement;
  expect(titleInput).toBeInTheDocument();
  expect(titleInput).toHaveValue(mockProps.formDetails.name);

  const descriptionInput = screen.getByTestId(
    "description"
  ) as HTMLInputElement;
  expect(descriptionInput).toBeInTheDocument();
  expect(descriptionInput).toHaveValue(mockProps.formDetails.description);

  const categorySelect = screen.getByLabelText(
    /data category/i
  ) as HTMLInputElement;
  expect(categorySelect).toBeInTheDocument();
  // expect(categorySelect).toHaveValue(mockProps.formDetails.category);

  const sourceInput = screen.getByTestId(
    "Source-of-the-data"
  ) as HTMLInputElement;
  expect(sourceInput).toBeInTheDocument();
  expect(sourceInput).toHaveValue(mockProps.formDetails.source);

  const sourceUrlInput = screen.getByTestId(
    "Link-to-data-source"
  ) as HTMLInputElement;
  expect(sourceUrlInput).toBeInTheDocument();
  expect(sourceUrlInput).toHaveValue(mockProps.formDetails.sourceUrl);

  // Simulate user input
  fireEvent.change(titleInput, { target: { value: "Test Dataset Title" } });

  user.type(
    screen.getByLabelText("Brief description of your dataset*"),
    "This is a test description."
  );
  user.type(screen.getByLabelText("Source of the data"), "Test Source");
  user.type(
    screen.getByLabelText("Link to data source"),
    "http://test-source.com"
  );

  expect(screen.getByTestId("span-name")).toContain("Test Dataset Title");

  // Check if form elements reflect user input
  expect(titleInput.value).toBe("Test Dataset Title");
  expect(descriptionInput).toHaveValue("This is a test description.");
  expect(sourceInput).toHaveValue("Test Source");
  expect(sourceUrlInput).toHaveValue("http://test-source.com");

  // Check if default values change
  expect(mockProps.setFormDetails).toHaveBeenCalledWith({
    name: "Test Dataset Title",
    description: "This is a test description.",
    category: "",
    source: "Test Source",
    sourceUrl: "http://test-source.com",
  });

  // Simulate form submission
  fireEvent.submit(screen.getByRole("button", { name: "Next" }));

  await waitFor(() => {
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });
});
