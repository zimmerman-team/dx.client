import { Box } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
  DropzoneRootProps,
  DropzoneInputProps,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import { uploadAreacss } from "app/modules/dataset-upload-module/style";
import { ReactComponent as UploadIcon } from "app/modules/dataset-upload-module/assets/upload.svg";
import { formatBytes } from "app/utils/formatBytes";

export interface DropzoneProps {
  uploadError: boolean;
  disabled: boolean;
  onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
}

export const DropZone = (props: DropzoneProps) => {
  const ACCEPTED_FILES = {
    "text/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/xml": [".xml"],
    "application/vnd.ms-excel": [".xls"],
    "application/xhtml+xml": [".xhtml"],
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({ onDrop: props.onDrop, accept: ACCEPTED_FILES });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.name}>
      {file.name} - {formatBytes(file.size)}
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));
  return (
    <>
      <div
        css={`
          border: 1px dashed var(--Dark-01, #13183f);
          border-radius: 24px;
          cursor: pointer;
          background-color: ${isDragActive && !props.disabled
            ? "#c4c4c4"
            : "auto"};
          background-image: ${isDragActive && !props.disabled
            ? `url(
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='163' height='163' viewBox='0 0 20 20'%3E%3Cg %3E%3Cpolygon fill='%23ffffff' points='20 10 10 0 0 0 20 20'/%3E%3Cpolygon fill='%23ffffff' points='0 10 0 20 10 20'/%3E%3C/g%3E%3C/svg%3E"
            )`
            : "unset"};
        `}
        {...getRootProps()}
      >
        <Box height={112} />
        <div css={uploadAreacss(isDragActive)}>
          <input
            {...getInputProps()}
            data-testid="local-upload"
            data-cy="local-upload-input"
          />
          {!isDragActive && (
            <>
              <UploadIcon />
              <p
                css={`
                  font-weight: 500;
                  font-size: 12px;
                  color: #231d2c;
                  margin-top: 5px;
                  font-family: "Inter", sans-serif;
                  margin: 0;
                  padding: 0;
                  margin-top: 18px;
                `}
              >
                Supports: XMl, XLSX, CSV
              </p>
              <p
                css={`
                  font-size: 20px;
                  line-height: normal;
                  font-style: normal;
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-weight: 325;
                  margin: 0;
                  padding: 0;
                  margin-top: 18px;
                `}
              >
                Drag and Drop Spreadsheets File here
              </p>
            </>
          )}
        </div>
        <Box height={131} />
      </div>
      <Box height={40} />
      {fileRejections.length > 0 && fileRejectionItems}
    </>
  );
};
