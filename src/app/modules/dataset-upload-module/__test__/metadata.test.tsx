import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MetaData from "app/modules/dataset-upload-module/upload-steps/metaData";
import { DatasetGet } from "app/state/api/action-reducers/data-themes";
import { StoreProvider, createStore } from "easy-peasy";
import { Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { mockFormDetails } from "./mock-data";

interface MockProps {
  formDetails: {
    name: string;
    source: string;
    category: string;
    public: boolean;
    sourceUrl: string;
    description: string;
  };
  setFormDetails: jest.Mock<any, any>;
  onSubmit: jest.Mock<any, any>;
  handleBack: jest.Mock<any, any>;
}
const formResponse = {
  formDetails: mockFormDetails,
};
const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    formDetails: formResponse.formDetails,
    setFormDetails: jest.fn((newFormDetails) => {
      formResponse.formDetails = newFormDetails;
    }),
    onSubmit: jest.fn(),
    handleBack: jest.fn(),
    ...props,
  };
};

const appSetup = (path: string) => {
  const mockStore = createStore({
    dataThemes: { DatasetGet: DatasetGet },
  });
  const history = createMemoryHistory({
    initialEntries: [path],
  });
  const mockProps = defaultProps();

  return {
    app: (
      <Router history={history}>
        <StoreProvider store={mockStore}>
          <Switch>
            <MetaData {...mockProps} />
          </Switch>
        </StoreProvider>
      </Router>
    ),
    mockProps,
  };
};
test("add meta data", async () => {
  const user = userEvent.setup();

  const { app, mockProps } = appSetup("/dataset/new/upload");
  render(app);

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

  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(mockProps.onSubmit).toHaveBeenCalled();
});

test("when in edit mode, the cancel button should be displayed", async () => {
  const user = userEvent.setup();

  const { app, mockProps } = appSetup(`/dataset/1234/edit`);
  render(app);

  const backButton = await screen.findByRole("button", { name: "Cancel" });
  expect(backButton).toBeInTheDocument();
  await user.click(backButton);
  expect(mockProps.handleBack).toHaveBeenCalled();
});
