import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import AddDatasetFragment, {
  DropZone,
} from "app/modules/dataset-upload-module/upload-steps/addDatasetFragment";
import userEvent from "@testing-library/user-event";
import { StoreProvider, createStore } from "easy-peasy";
import {
  AuthTokenModel,
  AuthTokenState,
} from "app/state/api/action-reducers/sync";
import { mockFileRejections } from "../mock-data";

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
        setFile={mockSetSelectedFile}
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
  const uploadButton = screen.getByTestId("local-upload") as HTMLInputElement;

  expect(dndText).toBeInTheDocument();
  Object.defineProperty(uploadButton, "files", { value: [file] });
  fireEvent.drop(uploadButton);

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
  const user = userEvent.setup();
  const acceptedFiles = [
    new File(["(⌐□_□)"], "chucknorris.csv", { type: "text/csv" }),
  ];

  const mockGetRootProps = jest.fn();
  const mockGetInputProps = jest.fn();
  const mockSetIsExternalSearch = jest.fn();
  const mockHandleOpenPicker = jest.fn();

  render(
    <DropZone
      disabled={false}
      getRootProps={mockGetRootProps}
      getInputProps={mockGetInputProps}
      isDragActive={false}
      fileRejections={mockFileRejections}
      acceptedFiles={acceptedFiles}
      handleOpenPicker={mockHandleOpenPicker}
      uploadError={false}
      setIsExternalSearch={mockSetIsExternalSearch}
    />
  );

  const googleDriveButton = screen.getByTestId("google-drive-button");
  await user.click(googleDriveButton);
  expect(mockHandleOpenPicker).toHaveBeenCalled();
});

// test("google drive picker", async () => {
//   const mockSetSelectedFile = jest.fn();
//   const mockSetIsExternalSearch = jest.fn();

//   const app = appFn(mockSetSelectedFile, mockSetIsExternalSearch);

//   render(app);

//   const googleDriveButton = screen.getByTestId("google-drive-button");
//   fireEvent.click(googleDriveButton);

//   await waitForElementToBeRemoved(() => screen.getByText(/drag and drop/i));
//   expect(screen.getByText(/select a file/i)).toBeInTheDocument();
// });
