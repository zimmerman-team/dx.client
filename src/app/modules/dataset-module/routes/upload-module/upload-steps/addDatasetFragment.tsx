/**third party */
import React, { useCallback } from "react";

/** project */

import { DropZone } from "app/modules/dataset-module/routes/upload-module/component/dropzone";
import { Box } from "@material-ui/core";
import LocalIcon from "../assets/upload-options-icons/local";
import GoogleIcon from "../assets/upload-options-icons/google";
import MicrosoftIcon from "../assets/upload-options-icons/microsoft";
import ApiIcon from "../assets/upload-options-icons/api";
import MSSQLIcon from "../assets/upload-options-icons/mssql.png";
import MYSQLIcon from "../assets/upload-options-icons/mysql.png";
import PostgresIcon from "../assets/upload-options-icons/postgres";
import MongoDbIcon from "../assets/upload-options-icons/mongodb";
import HubspotIcon from "../assets/upload-options-icons/hubspot";
import UploadOption from "../component/uploadOption";
import { useCookie } from "react-use";
import useGoogleDrivePicker from "app/hooks/useGoogleDrivePicker";
import { useOneDrivePicker } from "app/hooks/useOneDrivePicker";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";

interface Props {
  disabled: boolean;
  onFileSubmit: (file: File) => void;
  processingError: string | null;
  activeOption: string | null;
  setActiveOption: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddDatasetFragment(props: Props) {
  const [googleDriveToken, setGoogleDriveToken, deleteGoogleDriveToken] =
    useCookie("googleDriveToken");

  const { userPlan } = useCheckUserPlan();

  const { getAccessTokenAndOpenPicker } = useGoogleDrivePicker({
    onCancel: () => {
      props.setActiveOption(null);
    },
    onFileSubmit: (file: File) => {
      props.onFileSubmit(file);
    },
    googleDriveToken,
    setGoogleDriveToken,
  });

  const { launchPicker, clearToken, connected } = useOneDrivePicker({
    onCancel: () => {
      props.setActiveOption(null);
    },
    onFileSubmit: (file: File) => {
      props.onFileSubmit(file);
    },
    onDownloadStart: () => {
      props.setActiveStep(1);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      props.onFileSubmit(acceptedFiles[0]);
    }
  }, []);

  const uploadOptions = [
    {
      name: "Local upload",
      type: "Table Dataset",
      formats: ["CSV", "XSLX", "JSON", "ODS", "SQLite"],
      icon: <LocalIcon />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "Google Drive",
      type: "Upload",
      formats: [],
      icon: <GoogleIcon />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        getAccessTokenAndOpenPicker();
      },
      canConnect: true,
      connected: !!googleDriveToken,
      onLogout: () => {
        deleteGoogleDriveToken();
      },
      upgradeRequired: userPlan?.planData.name === "Free",
    },
    {
      name: "Microsoft Cloud",
      type: "Upload",
      formats: [],
      icon: <MicrosoftIcon />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        launchPicker();
      },
      canConnect: true,
      connected: connected,
      onLogout: async () => {
        await clearToken();
      },
      upgradeRequired: userPlan?.planData.name === "Free",
    },
    {
      name: "API Connection",
      type: "URL, JSON or XML root",
      formats: ["CSV", "XSLX", "JSON", "ODS", "SQLite"],
      icon: <ApiIcon />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "MSSQL",
      type: "DataBase Connection",
      formats: ["Coming Soon"],
      icon: <img width={30} height={33.462} src={MSSQLIcon} />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "MYSQL",
      type: "DataBase Connection",
      formats: ["Coming Soon"],
      icon: <img width={30} height={30} src={MYSQLIcon} />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "PostgreSQL",
      type: "DataBase Connection",
      formats: ["Coming Soon"],
      icon: <PostgresIcon />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "MongoDB",
      type: "DataBase Connection",
      formats: ["Coming Soon"],
      icon: <MongoDbIcon />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "Hubspot",
      type: "DataBase Connection",
      formats: ["Coming Soon"],
      icon: <HubspotIcon />,
      onClick: () => {},
      upgradeRequired: false,
    },
  ];

  return (
    <>
      <div
        css={`
          h1 {
            font-family: "Inter", sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #231d2c;
            margin: 0px;
          }
          p {
            color: #231d2c;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            font-size: 14px;
            font-weight: 325;
            line-height: 20px;
            letter-spacing: 0.5px;
            margin: 0px;
            padding: 0px;
          }
        `}
      >
        <h1>File Upload</h1>
        <Box height={22} />
        <p>
          Upload your favourite data effortlessly in Dataxplorer, and with just
          a few clicks, import datasets without the hassle of downloading,{" "}
          <br />
          enabling you to visualize and analyse diverse data like never before.
        </p>
      </div>

      <Box height={48} />

      {props.activeOption === "Local upload" ? (
        <>
          <DropZone
            disabled={props.disabled}
            uploadError={!!props.processingError}
            onDrop={onDrop}
          />
        </>
      ) : (
        <div>
          <div
            css={`
              padding: 19px 23px;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              border-radius: 16px 16px 0px 0px;
              width: 100%;
            `}
          >
            Connect your data
          </div>
          <div
            css={`
              padding: 24px;
            `}
          >
            <div
              css={`
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 10px;
              `}
            >
              {uploadOptions.slice(0, 3).map((option) => (
                <UploadOption
                  key={option.name}
                  name={option.name}
                  type={option.type}
                  formats={option.formats}
                  icon={option.icon}
                  onClick={option.onClick}
                  setActiveOption={props.setActiveOption}
                  canConnect={option.canConnect}
                  connected={option.connected}
                  onLogout={option.onLogout}
                  upgradeRequired={option.upgradeRequired}
                />
              ))}
            </div>
            <Box height={32} />
            <div
              css={`
                border-bottom: 1px solid #e2eaee;
                width: 100%;
              `}
            />
            <Box height={32} />
            <div
              css={`
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 10px;
                opacity: 0.5;
              `}
            >
              {uploadOptions.slice(3).map((option) => (
                <UploadOption
                  key={option.name}
                  name={option.name}
                  type={option.type}
                  formats={option.formats}
                  icon={option.icon}
                  onClick={option.onClick}
                  disabled
                  setActiveOption={props.setActiveOption}
                  upgradeRequired={option.upgradeRequired}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
