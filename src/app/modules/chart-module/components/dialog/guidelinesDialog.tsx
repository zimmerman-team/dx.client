import { IconButton, Modal, createStyles, makeStyles } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import React from "react";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
  contentType: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    paper: {
      outline: 0,
      width: 712,
      borderRadius: "16px",
      position: "relative",
      // padding: "0rem 2.5rem 2.5rem 3.5rem",
      backgroundColor: "#fff",
      padding: "40px 48px",
      boxShadow:
        "0px 14.8787px 22.318px rgba(0, 0, 0, 0.05), 0px 4.4636px 7.43933px rgba(0, 0, 0, 0.05), 0px 0.743933px 7.43933px rgba(0, 0, 0, 0.05)",
      "@media (max-width: 650px)": {
        width: "80%",
      },
    },
  })
);

export default function GuidelinesDialog(props: Props) {
  const classes = useStyles();
  const getGuidelines = () => {
    switch (props.contentType) {
      case "date":
        return (
          <div>
            <h3
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin: 0px;
                margin-bottom: 16px;
                line-height: 48px;
                font-size: 40px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
              `}
            >
              Supported Datetime Formats
            </h3>
            <div>
              <h4>1. Accepted Datetime Formats:</h4>
              <ul>
                <li>YYYY-MM-DD (e.g., 2025-01-23)</li>
                <li> DD/MM/YYYY (e.g., 23/01/2025)</li>
                <li> MM/DD/YYYY (e.g., 01/23/2025)</li>
              </ul>
            </div>
            <div>
              <h4>2. Common Issues:</h4>
              <ul>
                <li>Mixed formats (e.g., 2025/01-23)</li>
                <li>Non-standard separators (e.g., 23.Jan.2025)</li>
                <li>Extra text (e.g., "Date: 2025-01-23")</li>
                <li>Non-English terms (e.g., 23-Octobre-2025)</li>
                <li>Invalid values (e.g., 2025-13-01).</li>
                <li> Missing AM/PM in 12-hour times (e.g., 3:45)</li>
              </ul>
            </div>
            <div>
              <h4>3. Troubleshooting:</h4>
              <ul>
                <li>
                  If the dates are still not detected correctly, check your
                  source file for hidden formatting or localization issues.
                </li>
                <li>
                  {" "}
                  Reformat the dates using a tool like Excel or Google Sheets
                  and re-upload the file.
                </li>
              </ul>
            </div>
          </div>
        );
      case "file":
        return (
          <div>
            <h3
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin: 0px;
                margin-bottom: 16px;
                line-height: 48px;
                font-size: 40px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
              `}
            >
              Supported File Formats
            </h3>
            <div>
              <h4>1. Accepted File Types::</h4>
              <ul>
                <li>CSV: Comma-Separated Values (.csv)</li>
                <li>Excel: Microsoft Excel files (.xlsx, .xls)</li>
                <li> JSON: JavaScript Object Notation (.json)</li>
                <li>ODS: OpenDocument Spreadsheet (.ods)</li>
                <li>SQLite: SQLite Database files (.sqlite, .db)</li>
              </ul>
            </div>
            <div>
              <h4>2. Formatting Tips:</h4>
              <ul>
                <li>
                  Ensure the file size is below the platform's upload limit.
                </li>
                <li>
                  Remove any special characters or formatting that might
                  interfere with processing.
                </li>
                <li>
                  For Excel files, ensure the data is in the first sheet and
                  properly structured (no merged cells).
                </li>
                <li>Non-English terms (e.g., 23-Octobre-2025)</li>
                <li>Invalid values (e.g., 2025-13-01).</li>
                <li> Missing AM/PM in 12-hour times (e.g., 3:45)</li>
              </ul>
            </div>
            <div>
              <h4>3. Troubleshooting:</h4>
              <ul>
                <li>
                  If your file isn't being detected, double-check the extension
                  and ensure it's one of the supported types.
                </li>
                <li>
                  {" "}
                  Convert unsupported formats to one of the above using tools
                  like Excel, Google Sheets, or an online converter.
                </li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          className={classes.paper}
          css={`
            color: #231d2c;
            h4 {
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 18px;
              margin: 0px;
              padding-left: 6px;
            }
            ul {
              margin: 0px;
            }
            button:nth-of-type(2) {
              border-radius: 12px;
              background: #231d2c;
              display: flex;
              padding: 18.5px 24px;
              justify-content: center;
              align-items: center;
              gap: 8px;
              border: none;
              outline: none;
              color: #fff;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              margin-top: 36px;
              display: flex;
              align-self: flex-end;
              justify-self: flex-end;
              cursor: pointer;
            }
          `}
        >
          <IconButton
            onClick={() => props.setModalDisplay(false)}
            css={`
              position: absolute;
              right: 8px;
              top: 6px;
            `}
          >
            <CloseOutlined htmlColor="#231D2C" />
          </IconButton>
          {getGuidelines()}
          <button onClick={() => props.setModalDisplay(false)}>Got it!</button>
        </div>
      </Modal>
    </div>
  );
}
