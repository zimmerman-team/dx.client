/* third-party */
import React from "react";
/* project */
import { ReactComponent as InfoIcon } from "app/modules/story-module/asset/info-icon.svg";
import { Tooltip } from "react-tooltip";

export default function PanelLabel(props: {
  currentView: "charts" | "media" | "elements" | "editHeader";
}) {
  let label = "Elements to control this story";
  let tooltip =
    "Choose what elements you want to have in your story. Simply drag and drop them on the canvas!";
  if (props.currentView === "charts") {
    label = "Charts";
    tooltip =
      "Add charts from Dataxplorer into your story. Simply drag and drop charts into the story placeholders!";
  } else if (props.currentView === "media") {
    label = "Media content";
    tooltip =
      "Add media content to your story. Simply drag and drop media content into the story placeholders!";
  }
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
        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        p {
          font-size: 14px;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          color: #262c34;
          text-transform: capitalize;
        }
      `}
    >
      <p>{label}</p>
      <span className="story-panel-info">
        <InfoIcon />
      </span>
      <Tooltip
        anchorSelect=".story-panel-info"
        place="bottom"
        style={{
          background: "#231D2C",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "12px",
          fontFamily: "GothamNarrow-Medium, 'Helvetica Neue', sans-serif",
          width: "320px",
          lineHeight: "16px",
          zIndex: 1,
        }}
      >
        {tooltip}
      </Tooltip>
    </div>
  );
}
