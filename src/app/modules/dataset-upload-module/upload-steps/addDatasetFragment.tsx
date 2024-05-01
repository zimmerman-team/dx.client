/**third party */
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import useDrivePicker from "react-google-drive-picker";
import {
  CallbackDoc,
  PickerCallback,
} from "react-google-drive-picker/dist/typeDefs";
import axios from "axios";
/** project */
import { formatBytes } from "app/utils/formatBytes";
import { useStoreState } from "app/state/store/hooks";
import { DropZone } from "app/modules/dataset-upload-module/component/dropzone/";

interface Props {
  disabled: boolean;
  onFileSubmit: (file: File) => void;
  processingError: string | null;
  setIsExternalSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddDatasetFragment(props: Props) {
  const [openPicker] = useDrivePicker();
  const token = useStoreState((state) => state.AuthToken.value);

  const handleGoogleDriveFilePicker = async (
    file: CallbackDoc,
    accessToken: string
  ) => {
    try {
      const response = await axios({
        url: `https://www.googleapis.com/drive/v3/files/${file.id}${
          file.type === "file" ? "?alt=media" : "/export?mimeType=text/csv"
        }`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob", // important
      });

      const b = response?.data;
      const gfile = new File([b], file.name, { type: "text/csv" });

      props.onFileSubmit(gfile);
    } catch (e) {
      console.log(e, "handleGoogleDriveFilePicker error");
    }
  };
  useEffect(() => {
    if (process.env.REACT_APP_CYPRESS_TEST === "true") {
      window.handleGoogleDriveFilePicker = function (file: any, token: string) {
        handleGoogleDriveFilePicker(file, token);
      };
    }
  }, []);

  const ACCEPTED_FILES = {
    "text/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/xml": [".xml"],
    "application/vnd.ms-excel": [".xls"],
    "application/xhtml+xml": [".xhtml"],
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      props.onFileSubmit(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({ onDrop, accept: ACCEPTED_FILES });

  const getAccessToken = () => {
    return axios.get(
      `${process.env.REACT_APP_API}/dataset/google-drive/user-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const getAccessTokenAndOpenPicker = async () => {
    try {
      const res = await getAccessToken();

      //opens google drive picker
      openPicker({
        clientId: process.env.REACT_APP_GOOGLE_API_CLIENT_ID as string,
        developerKey: process.env.REACT_APP_GOOGLE_API_DEV_KEY as string,
        viewId: "SPREADSHEETS",
        supportDrives: true,
        token: res.data,
        setSelectFolderEnabled: true,
        callbackFunction: (d: PickerCallback) => {
          handleGoogleDriveFilePicker(d.docs[0], res.data);
        },
      });
    } catch (e) {
      console.log(e, "error");
    }
  };

  function handleOpenPicker(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    getAccessTokenAndOpenPicker();
  }

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
      <DropZone
        disabled={props.disabled}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        fileRejections={fileRejections}
        acceptedFiles={acceptedFiles}
        handleOpenPicker={handleOpenPicker}
        uploadError={!!props.processingError}
        setIsExternalSearch={props.setIsExternalSearch}
      />
      {fileRejections.length > 0 && fileRejectionItems}
    </>
  );
}
