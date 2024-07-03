import React from "react";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

export default function WarningDialog(props: { isMappingValid: boolean }) {
  return (
    <div>
      <div
        css={`
          height: 362.598px;
          background: #dfe3e5;
          margin: auto;
          margin-top: 5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #e75656;
          font-size: 14px;
          line-height: 20px;
          font-weight: bold;
          font-family: "GothamNarrow-Bold", sans-serif;
          text-align: center;
          button {
            outline: none;
            border: none;
            background: transparent;
            cursor: pointer;
            text-decoration: underline;
          }
          p {
            margin-top: 18px;
          }
        `}
      >
        {!props.isMappingValid && (
          <>
            <ErrorOutlineIcon htmlColor="#6061e5" fontSize="large" />
            <p
              css={`
                color: #000;
              `}
            >
              Can not render chart because mapping is incomplete. Click edit
              button to continue editing chart.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
