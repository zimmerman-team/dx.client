/* third-party */
import React from "react";
/* project */
import { ReactComponent as InfoIcon } from "app/modules/report-module/asset/info-icon.svg";

export default function PanelLabel(props: {
  currentView: "charts" | "media" | "elements" | "editHeader";
}) {
  return (
    <div
      css={`
        display: ${props.currentView === "editHeader" ? "none" : "flex"};
        align-items: center;
        gap: 8px;
        width: 90%;
        border-bottom: 1px solid #dfe3e5;
        padding-bottom: 3px;
        padding-top: 4px;
        margin-left: 5%;
        margin-bottom: 8px;
        p {
          font-size: 14px;
          font-family: "GothamNarrow-Bold", sans-serif;
          color: #262c34;
          text-transform: capitalize;
        }
      `}
    >
      <p>{props.currentView}</p>
      <InfoIcon />
    </div>
  );
}
