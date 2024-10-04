import React from "react";
import { Tooltip } from "react-tooltip";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as InfoIcon } from "app/modules/chart-module/assets/info-icon.svg";

export default function ToolboxSubHeader(
  props: Readonly<{
    name: string;
    tooltip: string;
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
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
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
          <a href="." className="my-anchor-element">
            <InfoIcon />
          </a>
          <Tooltip
            anchorSelect=".my-anchor-element"
            place="top"
            style={{
              background: "#231D2C",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              fontFamily: '"GothamNarrow-Medium", "Helvetica Neue", sans-serif',
              width: "320px",
              lineHeight: "16px",
            }}
          >
            {props.tooltip}
          </Tooltip>
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
