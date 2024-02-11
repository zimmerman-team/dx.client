import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { DropZone } from "app/modules/dataset-upload-module/component/dropzone";
import { mockFileRejections } from "../mock-data";
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
