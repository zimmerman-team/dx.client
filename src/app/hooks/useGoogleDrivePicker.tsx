import React from "react";
import useDrivePicker from "react-google-drive-picker";
import {
  CallbackDoc,
  PickerCallback,
} from "react-google-drive-picker/dist/typeDefs";
import axios from "axios";
import { useCookie } from "react-use";

interface Props {
  onFileSubmit: (file: File) => void;
  onCancel: () => void;
  googleDriveToken: string | null;
  setGoogleDriveToken: (
    newValue: string,
    options?: Cookies.CookieAttributes | undefined
  ) => void;
}

function useGoogleDrivePicker({
  onCancel,
  onFileSubmit,
  googleDriveToken,
  setGoogleDriveToken,
}: Props) {
  const [openPicker, tokenFromPicker] = useDrivePicker();

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
      onFileSubmit(gfile);
    } catch (e) {
      console.log(e, "handleGoogleDriveFilePicker error");
    }
  };
  React.useEffect(() => {
    if (process.env.REACT_APP_CYPRESS_TEST === "true") {
      window.handleGoogleDriveFilePicker = function (file: any, token: string) {
        handleGoogleDriveFilePicker(file, token);
      };
    }
  }, []);

  React.useEffect(() => {
    if (tokenFromPicker) {
      setGoogleDriveToken(tokenFromPicker.access_token, {
        expires: new Date(new Date().getTime() + 3540 * 1000),
        httpsOnly: true,
        secure: true,
        sameSite: "strict",
      });
    }
  }, [tokenFromPicker]);

  const getAccessTokenAndOpenPicker = async () => {
    try {
      //opens google drive picker
      openPicker({
        clientId: process.env.REACT_APP_GOOGLE_API_CLIENT_ID as string,
        developerKey: process.env.REACT_APP_GOOGLE_API_DEV_KEY as string,
        viewId: "SPREADSHEETS",
        supportDrives: true,
        token: googleDriveToken!,
        setSelectFolderEnabled: true,
        callbackFunction: (d: PickerCallback) => {
          if (d.docs?.[0]) {
            handleGoogleDriveFilePicker(
              d.docs[0],
              googleDriveToken! ?? tokenFromPicker?.access_token
            );
          } else if (d.action === "cancel") {
            onCancel();
          }
        },
      });
    } catch (e) {
      console.log(e, "error");
    }
  };

  return { getAccessTokenAndOpenPicker };
}

export default useGoogleDrivePicker;
