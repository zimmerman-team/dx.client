import React from "react";
import ComputerIcon from "app/modules/dataset-module/routes/upload-module/assets/computer-icon";
import { Search } from "@material-ui/icons";

interface Props {
  activeTab: "search" | "file";
  setActiveTab: (c: "search" | "file") => void;
}

function UploadTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div
      css={`
        display: flex;
        background: #dadaf8;
        border-radius: 100px;
        display: flex;
        align-items: center;
        padding: 4px 6.5px;
        gap: 8px;
        width: max-content;
        button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          text-transform: uppercase;
          border-radius: 30px;
          font-family: Inter;
          font-size: 14px;
          min-width: 203px;
          border: none;
          justify-content: center;
          cursor: pointer;
          :hover {
            opacity: 0.8;
          }
        }
      `}
    >
      <button
        css={`
          background: ${activeTab === "search" ? "#6061E5" : "transparent"};
          font-weight: ${activeTab === "search" ? "bold" : "medium"};
          color: ${activeTab === "search" ? "white" : "#231D2C"};
        `}
        onClick={() => setActiveTab("search")}
        data-cy="federated-search-tab"
      >
        <Search /> Federated search
      </button>

      <button
        css={`
          background: ${activeTab === "file" ? "#6061E5" : "transparent"};
          font-weight: ${activeTab === "file" ? "bold" : "medium"};
          color: ${activeTab === "file" ? "white" : "#231D2C"};
        `}
        onClick={() => setActiveTab("file")}
        data-cy="file-upload-tab"
      >
        <ComputerIcon color={activeTab === "file" ? "white" : "#231D2C"} /> FILE
        upload
      </button>
    </div>
  );
}

export default UploadTabs;
