import { Box } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
  DropzoneRootProps,
  DropzoneInputProps,
  FileRejection,
} from "react-dropzone";
import {
  uploadAreacss,
  uploadDatasetcss,
} from "app/modules/dataset-upload-module/style";
import { ReactComponent as UploadIcon } from "app/modules/dataset-upload-module/assets/upload.svg";
import { ReactComponent as LocalUploadIcon } from "app/modules/dataset-upload-module/assets/local-upload.svg";
import { ReactComponent as GoogleDriveIcon } from "app/modules/dataset-upload-module/assets/google-drive.svg";
import { ReactComponent as ErrorIcon } from "app/modules/dataset-upload-module/assets/error-icon.svg";

export interface DropzoneProps {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  isDragActive: boolean;
  fileRejections: FileRejection[];
  acceptedFiles: File[];
  isFocused?: boolean;
  isDragAccept?: boolean;
  isDragReject?: boolean;
  isFileDialogActive?: boolean;
  draggedFiles?: File[];
  rootRef?: React.RefObject<HTMLElement>;
  inputRef?: React.RefObject<HTMLInputElement>;
  handleOpenPicker(e: React.MouseEvent<HTMLButtonElement>): void;
  uploadError: boolean;
  disabled: boolean;
  setIsExternalSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropZone = (props: DropzoneProps) => {
  const handleExternalSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.setIsExternalSearch(true);
  };
  return (
    <div css={uploadDatasetcss} {...props.getRootProps()}>
      <div>
        <p>Add your file</p>
      </div>
      <div css={uploadAreacss(props.isDragActive)}>
        <input
          {...props.getInputProps()}
          data-testid="local-upload"
          data-cy="local-upload-input"
        />
        {!props.isDragActive && (
          <>
            <UploadIcon
              css={`
                margin-top: 2rem;
              `}
            />
            <p
              css={`
                font-weight: 500;
                font-size: 12px;
                color: #231d2c;
                margin-top: 5px;
              `}
            >
              Supports: XLSX, CSV
            </p>
            <p
              css={`
                font-size: 20px;
                line-height: 24px;
                font-style: normal;
              `}
            >
              Drag and Drop Spreadsheets File here <br /> or connect to Google
              Drive
            </p>
            <Box height={30} />
            <div
              css={`
                display: flex;
                gap: 1rem;
              `}
            >
              <button
                onClick={handleExternalSearch}
                data-cy="external-search-button"
              >
                <SearchIcon color="secondary" /> <p>External search</p>
              </button>
              <button>
                <LocalUploadIcon /> <p>Local upload</p>
              </button>

              <button
                type="button"
                onClick={props.handleOpenPicker}
                data-testid="google-drive-button"
                data-cy="google-drive-button"
              >
                <GoogleDriveIcon /> <p>Connect to google drive</p>
              </button>
            </div>
            <Box height={40} />
            {/* {props.uploadError && (
              <div
                css={`
                  color: #e75656;
                  font-size: 18;
                  font-family: " Gotham Narrow", sans-serif;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                  p {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    margin: 0;
                  }
                  small {
                    text-align: center;
                  }
                `}
              >
                <p>
                  <ErrorIcon />{" "}
                  <span>Unable to upload your file. Please try again!</span>
                </p>
                <span>Error</span>
              </div>
            )} */}
          </>
        )}
      </div>
    </div>
  );
};
