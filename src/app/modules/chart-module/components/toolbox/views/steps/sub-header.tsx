import React from "react";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import { IconButton } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "app/modules/chart-module/assets/info-icon.svg";

export default function ToolboxSubHeader(
  props: Readonly<{
    name: string;
    level: number;
    showResetButton?: boolean;
    resetFilters?: () => void;
  }>
) {
  return (
    <div
      css={`
        border-bottom: 1px solid #dfe3e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 24px;
        padding-right: 24px;
        button {
          padding: 4px;
          color: #495057;
          cursor: pointer;
          :hover {
            background: transparent;
          }
        }
        div {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        p:nth-child(1) {
          font-family: "Gotham Narrow", sans-serif;
          font-size: 14px;
          font-weight: 700;
        }
        p :nth-child(2) {
          height: 17px;
        }
      `}
    >
      <div>
        <p>{props.name}</p>{" "}
        <p>
          <InfoIcon />
        </p>
      </div>
      {props.showResetButton && (
        <div>
          <span>Reset filters</span>{" "}
          <IconButton onClick={props.resetFilters}>
            <SettingsBackupRestoreIcon color="inherit" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
