import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddDatasetFragment from "app/modules/dataset-module/routes/upload-module/upload-steps/addDatasetFragment";
import userEvent from "@testing-library/user-event";
import { StoreProvider, createStore } from "easy-peasy";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import axios from "axios";

interface MockProps {
  onFileSubmit: jest.Mock<any, any, any>;
  disabled: boolean;
  processingError: string | null;
  activeOption: string | null;
  setActiveOption: jest.Mock<any, any, any>;
  setActiveStep: jest.Mock<any, any, any>;
}

const localUploadOption = "Local upload";

const defaultProps = (newProps: Partial<MockProps> = {}): MockProps => {
  return {
    onFileSubmit: jest.fn(),
    disabled: false,
    processingError: null,
    activeOption: null,
    setActiveOption: jest.fn().mockImplementation(() => localUploadOption),
    setActiveStep: jest.fn(),
    ...newProps,
  };
};

const mockOpenPicker = jest.fn();
jest.mock("react-google-drive-picker", () => {
  return {
    __esModule: true,
    default: () => {
      return [mockOpenPicker];
    },
  };
});
jest.mock("app/hooks/useOneDrivePicker", () => {
  return {
    useOneDrivePicker: () => {
      return {
        launchPicker: jest.fn(),
        clearToken: jest.fn(),
        connected: true,
      };
    },
  };
});

jest.mock("axios");

const appFn = (newProps: Partial<MockProps> = {}) => {
  const mockStore = createStore({
    AuthToken: AuthTokenState,
  });
  const props = defaultProps(newProps);

  return {
    app: (
      <StoreProvider store={mockStore}>
        <AddDatasetFragment {...props} />
      </StoreProvider>
    ),
    props,
  };
};

test("open local upload option", async () => {
  const mockSetSelectedFile = jest.fn();
  const { app, props } = appFn({
    onFileSubmit: mockSetSelectedFile,
  });
  const user = userEvent.setup();
  render(app);
  await user.click(
    screen.getByTestId(/Local upload-option/i) as HTMLInputElement
  );
  expect(props.setActiveOption).toHaveBeenCalledWith(localUploadOption);
});

test("local file upload of dataset", async () => {
  const mockSetSelectedFile = jest.fn();
  const { app, props } = appFn({
    onFileSubmit: mockSetSelectedFile,
    activeOption: localUploadOption,
  });

  render(app);

  const file = new File(["(⌐□_□)"], "chucknorris.csv", { type: "text/csv" });

  expect(
    screen.getByText(/Drag and Drop Spreadsheets File here/i)
  ).toBeInTheDocument();

  const uploadInput = screen.getByTestId("local-upload") as HTMLInputElement;

  Object.defineProperty(uploadInput, "files", { value: [file] });

  fireEvent.drop(uploadInput);

  await waitFor(() => {
    expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
  });
});

test("select google drive button", async () => {
  const mockSetSelectedFile = jest.fn();
  const user = userEvent.setup();
  const { app, props } = appFn({
    onFileSubmit: mockSetSelectedFile,
  });
  mockOpenPicker.mockImplementation(({ callbackFunction }) => {
    callbackFunction({ docs: [{ id: "123", name: "test.csv", type: "file" }] });
  });
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: "access_token" });

  render(app);
  await user.click(
    screen.getByTestId(/Google Drive-option/i) as HTMLInputElement
  );
  expect(props.setActiveOption).toHaveBeenCalledWith("Google Drive");

  // Assert that openPicker is called with the correct parameters
  expect(mockOpenPicker).toHaveBeenCalledWith({
    clientId: expect.any(String),
    developerKey: expect.any(String),
    viewId: "SPREADSHEETS",
    supportDrives: true,
    token: null,
    setSelectFolderEnabled: true,
    callbackFunction: expect.any(Function),
  });

  await waitFor(() => {
    expect(mockSetSelectedFile).toHaveBeenCalled();
  });
});
