import React from "react";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

export default function ErrorComponent(props: {
  page: string;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}) {
  return (
    <div css={commonStyles.container}>
      <div
        css={
          location.pathname === `/chart/${props.page}`
            ? ""
            : commonStyles.innercontainer
        }
      >
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
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            text-align: center;
            button {
              outline: none;
              border: none;
              background: transparent;
              cursor: pointer;
              text-decoration: underline;
            }
            p {
              margin-top: 34px;
              white-space: pre-line;
              line-height: 11px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            }
          `}
        >
          <>
            <ErrorOutlineIcon htmlColor="#E75656" fontSize="large" />
            {(props.chartError || props.dataError) && (
              <p>{props.chartErrorMessage}</p>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
