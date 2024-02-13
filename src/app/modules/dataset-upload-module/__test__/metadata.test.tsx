import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFormDetails } from "app/modules/dataset-upload-module/__test__/mock-data";
import MetaData from "app/modules/dataset-upload-module/upload-steps/metaData";
import { DatasetGet } from "app/state/api/action-reducers/data-themes";
import { StoreProvider, createStore } from "easy-peasy";
import { MemoryRouter, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";

test("add meta data", async () => {
  const user = userEvent.setup();

  const mockStore = createStore({
    dataThemes: { DatasetGet: DatasetGet },
  });
  const formResponse = {
    formDetails: {
      name: "Moc Dataset",
      source: "Mock source",
      category: "Education",
      public: false,
      sourceUrl: "https://example.com/mock-source",
      description: "",
    },
  };
  const mockProps = {
    formDetails: formResponse.formDetails,
    setFormDetails: jest.fn((newFormDetails) => {
      formResponse.formDetails = newFormDetails;
    }),
    onSubmit: jest.fn(),
    handleBack: jest.fn(),
  };

  const datasetTestId = "testid";
  const history = createMemoryHistory({
    initialEntries: ["/dataset/new/upload"],
  });
  render(
    <StoreProvider store={mockStore}>
      <Router history={history}>
        <Switch>
          <MetaData {...mockProps} />
        </Switch>
      </Router>
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
  expect(formResponse.formDetails.name).toBe("Test Dataset Title");

  fireEvent.change(descriptionInput, {
    target: { value: "This is a test description." },
  });
  expect(formResponse.formDetails.description).toBe(
    "This is a test description."
  );

  fireEvent.change(sourceInput, { target: { value: "Test Source" } });
  expect(formResponse.formDetails.source).toBe("Test Source");

  fireEvent.change(sourceUrlInput, {
    target: { value: "http://test-source.com" },
  });
  expect(formResponse.formDetails.sourceUrl).toBe("http://test-source.com");

  fireEvent.click(categorySelect);
  const educationOption = screen.getByText(/education/i);
  fireEvent.click(educationOption);
  expect(formResponse.formDetails.category).toBe("Education");

  // Simulate form submission

  user.click(screen.getByRole("button", { name: "Next" }));
  const error = screen.queryAllByTestId("error");
  expect(error).toHaveLength(0);

  expect(mockProps.onSubmit).toHaveBeenCalled();
  history.push(`/dataset/${datasetTestId}/edit`);
  const backButton = screen.getByRole("button", { name: "Cancel" });
  expect(backButton).toBeInTheDocument();
  user.click(backButton);
  expect(mockProps.handleBack).toHaveBeenCalled();
});
