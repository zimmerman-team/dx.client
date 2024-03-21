import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { dataSetsCss } from "app/modules/dataset-upload-module/style";
import { PageTopSpacer } from "app/modules/common/page-top-spacer";
import { useStoreActions } from "app/state/store/hooks";
import { DatasetDataTable } from "app/modules/dataset-upload-module/component/data-table";
import { CssSnackbar, ISnackbarState } from "./previewFragment";

interface Props {
  data: any[];
  stats: any[];
  datasetId: string;
  dataTotalCount: number;
  description: string;
}

export default function FinishedFragment(props: Props) {
  const history = useHistory();
  const location = useLocation();
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  function handleCreateNewChart() {
    setDataset(props.datasetId);
  }

  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

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
      <PageTopSpacer />
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
            margin-bottom: 17px;
          `}
        >
          {props.description}
        </div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 12px;
            justify-content: flex-end;
          `}
        >
          <Link to={`/chart/new/chart-type`}>
            <button
              css={`
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
        <DatasetDataTable data={props.data} stats={props.stats} />
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
