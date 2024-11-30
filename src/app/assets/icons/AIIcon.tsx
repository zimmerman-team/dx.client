import React from "react";
import { ReactComponent as Icon } from "app/modules/chart-module/assets/ai-icon.svg";
import { Tooltip } from "react-tooltip";

export default function AIIcon() {
  return (
    <>
      <p
        className="AIChart-info"
        css={`
          cursor: pointer;
        `}
      >
        <Icon />
      </p>
      <Tooltip
        anchorSelect=".AIChart-info"
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
        Based on the dataset selected, a recommendation for this chart was
        offered by our AI assistant.
      </Tooltip>
    </>
  );
}
