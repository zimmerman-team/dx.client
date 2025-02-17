import React from "react";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { Link, useHistory, useLocation } from "react-router-dom";
import GuidelinesDialog from "./guidelinesDialog";

export default function ErrorComponent(props: {
  page: string;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
  view?: string;
  selectDataProps?: {
    loadDataset: (endpoint: string) => Promise<boolean>;
    datasetId: string;
  };
}) {
  const [modalDisplay, setModalDisplay] = React.useState(false);
  const handleModal = () => {
    setModalDisplay(!modalDisplay);
  };
  const reloadDataset = () => {
    if (!props.selectDataProps) return;
    props.selectDataProps
      .loadDataset(props.selectDataProps.datasetId)
      .then(() => {
        history.push(`/chart/${props.page}/preview-data`);
      });
  };
  const location = useLocation();
  const history = useHistory();
  const handleRetry = () => {
    switch (props.view) {
      case "preview-data":
        return reloadDataset();
      case "preview":
      case "default":
        return () => {};
    }
  };

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
            line-height: 20px;
            font-weight: bold;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            text-align: center;

            h3 {
              margin-top: 13.3px;
              margin-bottom: 0px;
              font-size: 36px;
              white-space: pre-line;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            }
            p:nth-of-type(1) {
              font-size: 18px;
              margin: 0px;
              margin-top: 20px;
              font-weight: normal;
              white-space: pre-line;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              width: 358px;
            }
            > button:nth-of-type(1) {
              color: #231d2c;
              text-align: center;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 18px;
              font-style: normal;
              font-weight: 325;
              line-height: 24px;
              text-decoration: underline;
              border: none;
              outline: none;
              background: transparent;
              margin-top: 32px;
              cursor: pointer;
            }
            svg {
              width: 64px;
              height: 64px;
            }
            @media (max-width: 768px) {
              height: 488px;
            }
          `}
        >
          <>
            <ErrorOutlineIcon htmlColor="#E75656" fontSize="large" />
            <h3>Error</h3>
            {(props.chartError || props.dataError) && (
              <p>{props.chartErrorMessage}</p>
            )}

            <button onClick={handleModal}>
              Check Supported Datetime Format
            </button>
            <div
              css={`
                gap: 16px;
                display: flex;
                justify-content: center;
                margin-top: 32px;
                @media (max-width: 768px) {
                  flex-direction: column;
                }
                button,
                a {
                  border-radius: 12px;
                  background: #231d2c;
                  display: flex;
                  padding: 0px 24px;
                  justify-content: center;
                  align-items: center;
                  color: #fff;
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  border: none;
                  outline: none;
                  text-decoration: none;
                  height: 48px;
                  cursor: pointer;
                }
              `}
            >
              <button onClick={handleRetry}>Retry</button>
              <Link to={`/chart/${props.page}/data`}>
                Select Another Dataset
              </Link>
              <Link to="/">Back to Dashboard</Link>
            </div>
          </>
        </div>
      </div>
      <GuidelinesDialog
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        contentType="file"
      />
    </div>
  );
}
