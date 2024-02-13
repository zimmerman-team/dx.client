import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Processing from "../upload-steps/processing";
test("data should be processing", async () => {
  const mockSetProcessingError = jest.fn();

  render(
    <Processing
      estimatedUploadTime={100}
      fileName="file.csv"
      loaded="100kb"
      percentageLoaded={100}
      processingError={false}
      setProcessingError={mockSetProcessingError}
    />
  );

  const processingText = screen.getByText("Data is being processed...");
  const progressBar = screen.getByTestId("progress-bar");
  expect(processingText).toBeInTheDocument();
  expect(progressBar).toBeInTheDocument();
});

test("renders processing message when processingError is false", async () => {
  const mockSetProcessingError = jest.fn();

  render(
    <Processing
      estimatedUploadTime={100}
      fileName="file.csv"
      loaded="100kb"
      percentageLoaded={100}
      processingError={true}
      setProcessingError={mockSetProcessingError}
    />
  );
  const ErrorText = screen.getByTestId("error-message");
  expect(ErrorText).toBeInTheDocument();
});
