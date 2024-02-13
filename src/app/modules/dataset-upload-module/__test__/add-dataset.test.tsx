import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddDatasetFragment from "app/modules/dataset-upload-module/upload-steps/addDatasetFragment";
import userEvent from "@testing-library/user-event";
import { StoreProvider, createStore } from "easy-peasy";
import {
  AuthTokenModel,
  AuthTokenState,
} from "app/state/api/action-reducers/sync";
import axios from "axios";

const mockOpenPicker = jest.fn();
jest.mock("react-google-drive-picker", () => {
  return {
    __esModule: true,
    default: () => {
      return [mockOpenPicker];
    },
  };
});

jest.mock("axios");

const appFn = (
  mockSetSelectedFile: jest.Mock<any, any, any>,
  mockSetIsExternalSearch: jest.Mock<any, any, any>
) => {
  const mockStore = createStore({
    AuthToken: AuthTokenState as AuthTokenModel,
  });

  return (
    <StoreProvider store={mockStore}>
      <AddDatasetFragment
        onFileSubmit={mockSetSelectedFile}
        disabled={false}
        processingError={false}
        setIsExternalSearch={mockSetIsExternalSearch}
      />
    </StoreProvider>
  );
};

test("local upload of dataset", async () => {
  const mockSetSelectedFile = jest.fn();
  const mockSetIsExternalSearch = jest.fn();
  const app = appFn(mockSetSelectedFile, mockSetIsExternalSearch);
  render(app);

  const file = new File(["(⌐□_□)"], "chucknorris.csv", { type: "text/csv" });
  const dndText = screen.getByText(/drag and drop/i);
  expect(dndText).toBeInTheDocument();
  const uploadInput = screen.getByTestId("local-upload") as HTMLInputElement;

  Object.defineProperty(uploadInput, "files", { value: [file] });

  fireEvent.drop(uploadInput);

  await waitFor(() => {
    expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
  });
});

test("external search of dataset", async () => {
  const user = userEvent.setup();

  const mockSetSelectedFile = jest.fn();
  const mockSetIsExternalSearch = jest.fn();

  const app = appFn(mockSetSelectedFile, mockSetIsExternalSearch);

  render(app);

  const searchButton = screen.getByText(/external search/i);
  await user.click(searchButton);
  expect(mockSetIsExternalSearch).toHaveBeenCalledWith(true);
});

test("google drive button", async () => {
  const mockSetSelectedFile = jest.fn();
  const mockSetIsExternalSearch = jest.fn();
  const app = appFn(mockSetSelectedFile, mockSetIsExternalSearch);
  mockOpenPicker.mockImplementation(({ callbackFunction }) => {
    callbackFunction({ docs: [{ id: "123", name: "test.csv", type: "file" }] });
  });
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: "access_token" });

  render(app);
  const googleDriveButton = screen.getByTestId("google-drive-button");

  expect(googleDriveButton).toBeInTheDocument();
  await userEvent.click(googleDriveButton);
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

  // Assert that openPicker is called with the correct parameters
  expect(mockOpenPicker).toHaveBeenCalledWith({
    clientId: expect.any(String),
    developerKey: expect.any(String),
    viewId: "SPREADSHEETS",
    supportDrives: true,
    token: "access_token",
    setSelectFolderEnabled: true,
    callbackFunction: expect.any(Function),
  });

  await waitFor(() => {
    expect(mockSetSelectedFile).toHaveBeenCalled();
  });
});
