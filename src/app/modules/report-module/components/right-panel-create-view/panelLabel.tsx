import React from "react";

export default function PanelLabel(props: {
  currentView: "charts" | "media" | "elements" | "editHeader";
}) {
  return (
    <div
      css={`
        display: ${props.currentView === "editHeader" ? "none" : "flex"};
        align-items: center;
        gap: 8px;
        padding-bottom: 3px;
        padding-top: 4px;
        border-bottom: 1px solid #dfe3e5;
        width: 90%;
        margin-left: 5%;
        p {
          font-size: 14px;
          font-family: "Gotham Narrow", sans-serif;
          color: #262c34;
          text-transform: capitalize;
        }
      `}
    >
      <div
        css={`
          width: 23px;
          height: 23px;
          border-radius: 23px;
          background: #252c34;
          color: #fff;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        {(() => {
          if (props.currentView === "elements") {
            return "1";
          } else if (props.currentView === "charts") {
            return "2";
          } else if (props.currentView === "media") {
            return "3";
          } else {
            return "";
          }
        })()}
      </div>
      <div>
        <p>{props.currentView}</p>
      </div>
    </div>
  );
}
