import { render, screen } from "@testing-library/react";
import Processing from "../upload-steps/processing";

const defaultProcessingError =
  "Data could not be processed, please try again or contact your administrator";

test("data should be processing", async () => {
  const mockSetProcessingError = jest.fn();
  const mockTryAgain = jest.fn();

  render(
    <Processing
      estimatedUploadTime={120}
      fileName="file.csv"
      loaded="100kb"
      percentageLoaded={100}
      processingError={null}
      setProcessingError={mockSetProcessingError}
      tryAgain={mockTryAgain}
    />
  );

  const processingText = screen.getByText("Data is being processed...");
  const progressBar = screen.getByTestId("progress-bar");
  const estimatedTime = screen.getByTestId("estimated-time");
  expect(estimatedTime).toHaveTextContent("seconds (estimated)");
  expect(processingText).toBeInTheDocument();
  expect(progressBar).toBeInTheDocument();
});

test("when estimated times <=0, it should display 'finishing up...'", async () => {
  const mockSetProcessingError = jest.fn();
  const mockTryAgain = jest.fn();

  render(
    <Processing
      estimatedUploadTime={0}
      fileName="file.csv"
      loaded="100kb"
      percentageLoaded={100}
      processingError={null}
      setProcessingError={mockSetProcessingError}
      tryAgain={mockTryAgain}
    />
  );
  const estimatedTime = screen.getByTestId("estimated-time");
  expect(estimatedTime).toHaveTextContent("Finishing up...");
});

test('when estimated times > 60, it should display "minutes and seconds (estimated)"', async () => {
  const mockSetProcessingError = jest.fn();
  const mockTryAgain = jest.fn();

  render(
    <Processing
      estimatedUploadTime={4200}
      fileName="file.csv"
      loaded="100kb"
      percentageLoaded={100}
      processingError={null}
      setProcessingError={mockSetProcessingError}
      tryAgain={mockTryAgain}
    />
  );
  const estimatedTime = screen.getByTestId("estimated-time");
  expect(estimatedTime).toHaveTextContent("minutes and ");
});

test("renders processing message when processingError is true", async () => {
  const mockSetProcessingError = jest.fn();
  const mockTryAgain = jest.fn();

  render(
    <Processing
      estimatedUploadTime={50}
      fileName="file.csv"
      loaded="100kb"
      percentageLoaded={100}
      processingError={defaultProcessingError}
      setProcessingError={mockSetProcessingError}
      tryAgain={mockTryAgain}
    />
  );
  const ErrorText = screen.getByTestId("error-message");
  expect(ErrorText).toBeInTheDocument();
});
