import { InfoSnackbarDuplicateContentcss } from "app/modules/report-module/components/reportSubHeaderToolbar/infosnackbar";
import React from "react";
import { CloseOutlined } from "@material-ui/icons";

export default function DuplicateMessage(props: {
  name: string;
  closeSnackbar: () => void;
  action: () => void;
  type: "data" | "chart" | "report";
}) {
  return (
    <div css={InfoSnackbarDuplicateContentcss}>
      <p>
        <span>{props.name}</span>{" "}
        <span
          css={`
            margin-top: 1px;
          `}
        >
          <CloseOutlined onClick={props.closeSnackbar} />
        </span>
      </p>
      <p>
        The {props.type} has been successfully duplicated. You can find the
        duplicated version in the library.
      </p>
      <button onClick={props.action}>
        Go to {props.type === "data" ? "dataset" : props.type}
      </button>
    </div>
  );
}
