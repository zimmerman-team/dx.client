import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { dataSetsCss } from "app/modules/dataset-upload-module/style";
import { useStoreActions } from "app/state/store/hooks";
import { DatasetDataTable } from "app/modules/dataset-upload-module/component/data-table";
import { CssSnackbar, ISnackbarState } from "./previewFragment";
import { ArrowBack } from "@material-ui/icons";
import { ReactComponent as FullScreenIcon } from "../assets/full-screen.svg";
import { ReactComponent as CloseFullScreenIcon } from "../assets/close-full-screen.svg";
import { homeDisplayAtom } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";

interface Props {
  data: any[];
  stats: any[];
  datasetId: string;
  dataTotalCount: number;
  description: string;
  dataTypes: never[];
  canDatasetEditDelete?: boolean;
}

export default function FinishedFragment(props: Props) {
  const history = useHistory();
  const location = useLocation();

  const [display, setDisplay] = useRecoilState(homeDisplayAtom);

  const setDatasetId = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  function handleCreateNewChart() {
    setDatasetId(props.datasetId);
  }

  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

  const [openFullScreenTooltip, setOpenFullScreenTooltip] =
    React.useState(false);

  const [closeFullScreenTooltip, setCloseFullScreenTooltip] =
    React.useState(false);

  const [openFullScreen, setOpenFullScreen] = React.useState(false);

  React.useEffect(() => {
    let snackbarTimeOut: any;
    if (
      props.dataTotalCount > 0 &&
      location.pathname === "/dataset/new/upload"
    ) {
      setSnackbarState({ ...snackbarState, open: true });
      snackbarTimeOut = setTimeout(() => {
        setSnackbarState({ ...snackbarState, open: false });
      }, 5000);
    }
    return () => {
      clearTimeout(snackbarTimeOut);
    };
  }, [props.dataTotalCount]);

  React.useEffect(() => {
    let redirectTimeout: any;
    if (location.pathname === "/dataset/new/upload") {
      redirectTimeout = setTimeout(() => {
        history.push(`/dataset/${props.datasetId}/detail`);
      }, 8000);
    }
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div css={dataSetsCss}>
      <Link
        to={(() => {
          setDisplay("data");
          return location.search.includes("?fromHome=true") ? "/" : "/explore";
        })()}
        css={`
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #231d2c;
          text-decoration: none;
          margin-top: 16px;
          margin-bottom: 16px;
          column-gap: 8px;
        `}
        data-cy="dataset-back-to-library-btn"
      >
        <ArrowBack fontSize={"small"} /> Back to Data Library
      </Link>
      <div
        css={`
          width: 100%;
          color: #231d2c;
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          font-family: "GothamNarrow-Book";
        `}
      >
        <div
          css={`
            color: #231d2c;
            font-size: 16px;
            font-family: "GothamNarrow-Bold", sans-serif;
            line-height: 19px;
          `}
        >
          {props.description}
        </div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 12px;
            justify-content: space-between;
            margin-top: 34px;
          `}
        >
          <div
            css={`
              display: flex;
              column-gap: 13px;
              align-items: center;
            `}
          >
            <div
              css={`
                width: 40px;
                height: 40px;
                cursor: pointer;
                position: relative;
              `}
              onMouseOver={() => setOpenFullScreenTooltip(true)}
              onMouseLeave={() => setOpenFullScreenTooltip(false)}
              onClick={() => setOpenFullScreen(true)}
              data-cy="dataset-full-screen-btn"
            >
              <FullScreenIcon />
              <div
                css={`
                  background: #626262;
                  color: #fff;
                  font-size: 12px;
                  position: absolute;
                  top: 60%;
                  left: 110%;
                  width: max-content;
                  padding: 1px 8px;
                  border-radius: 4px;
                  user-select: none;
                `}
                hidden={!openFullScreenTooltip}
              >
                Full Screen
              </div>
            </div>

            <p
              css={`
                font-size: 16px;
                font-family: "GothamNarrow-Book", sans-serif;
                padding: 0;
                margin: 0;
              `}
            >
              {props.dataTotalCount} rows &{" "}
              {Object.keys(props.data[0] || {}).length} columns
            </p>
          </div>
          <Link
            to={{
              pathname: `/chart/new/chart-type`,
              search: "?loadataset=true",
            }}
            css={`
              pointer-events: ${props.canDatasetEditDelete ? "auto" : "none"};
            `}
          >
            <button
              disabled={
                props.canDatasetEditDelete ? !props.canDatasetEditDelete : false
              }
              css={`
                opacity: ${props.canDatasetEditDelete ? "1" : "0.5"};
                color: #fff;
                width: 100%;
                width: 200px;
                height: 41px;
                font-size: 14px;
                font-weight: 700;
                padding: 12px 27px;
                background: #231d2c;
                border-radius: 30px;
                text-transform: uppercase;
                font-family: "GothamNarrow-Bold";
                outline: none;
                border: none;
                display: flex;
                justify-content: center;
                align-items: center;

                :hover {
                  opacity: 0.8;
                  cursor: pointer;
                }
              `}
              onClick={handleCreateNewChart}
            >
              create new chart
            </button>
          </Link>
        </div>
        <DatasetDataTable
          data={props.data}
          stats={props.stats}
          dataTypes={props.dataTypes}
          datasetId={props.datasetId}
        />

        <div
          css={`
            background: rgba(0, 0, 0, 0.75);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100001;
            width: 100vw;
            height: 100vh;
            padding: 26px 100px 26px 108px;
          `}
          hidden={!openFullScreen}
          data-cy="dataset-full-screen-view"
        >
          <div
            css={`
              display: flex;
              column-gap: 13px;
              align-items: center;
            `}
          >
            <div
              css={`
                width: 40px;
                height: 40px;
                cursor: pointer;
                margin-bottom: 15px;
                position: relative;
              `}
              onMouseOver={() => setCloseFullScreenTooltip(true)}
              onMouseLeave={() => setCloseFullScreenTooltip(false)}
              onClick={() => setOpenFullScreen(false)}
              data-cy="dataset-close-full-screen-btn"
            >
              <CloseFullScreenIcon />

              <div
                css={`
                  background: #626262;
                  color: #fff;
                  font-size: 12px;
                  position: absolute;
                  top: 60%;
                  left: 110%;
                  width: max-content;
                  padding: 1px 8px;
                  border-radius: 4px;
                  user-select: none;
                `}
                hidden={!closeFullScreenTooltip}
              >
                Close Full Screen
              </div>
            </div>
          </div>
          <DatasetDataTable
            data={props.data}
            stats={props.stats}
            dataTypes={props.dataTypes}
            datasetId={props.datasetId}
            fullScreen
          />
        </div>
      </div>
      <CssSnackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={`${props.dataTotalCount} rows have been successfully parsed!`}
        key={snackbarState.vertical + snackbarState.horizontal}
      />
    </div>
  );
}
