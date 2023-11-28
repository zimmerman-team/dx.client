import React from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components/macro";
import Button from "@material-ui/core/Button";
import { useSessionStorage } from "react-use";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import ShareIcon from "@material-ui/icons/Share";
import { LinkIcon } from "app/assets/icons/Link";
import Snackbar from "@material-ui/core/Snackbar";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import CopyToClipboard from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { PageLoader } from "app/modules/common/page-loader";
import { Link, useHistory, useParams } from "react-router-dom";
import { styles } from "app/modules/report-module/components/reportSubHeaderToolbar/styles";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import DeleteReportDialog from "app/components/Dialogs/deleteReportDialog";
import { ReportSubheaderToolbarProps } from "app/modules/common/subheader-toolbar/data";
import { ExportChartButton } from "app/modules/common/subheader-toolbar/exportButton";
import { ISnackbarState } from "app/fragments/datasets-fragment/upload-steps/previewFragment";
import { ReactComponent as PlayIcon } from "app/modules/report-module/asset/play-icon.svg";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import { homeDisplayAtom } from "app/state/recoil/atoms";
import StaticToolbar from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import AutoSaveSwitch from "./autoSaveSwitch";
import AutoResizeInput from "./autoResizeInput";
import { createStyles, makeStyles } from "@material-ui/core";

export const InfoSnackbar = styled((props) => <Snackbar {...props} />)`
  && {
    bottom: 40px;
  }

  & [class*="MuiSnackbarContent-root"] {
    width: 100%;
    display: flex;
    padding: 0 78px;
    background: #fff;
    flex-wrap: nowrap;
    border-radius: 12px;
    gap: ${(props) => (props.gap ? "0px" : "84px")};
    justify-content: center;
    box-shadow: 0 8px 17px -4px rgba(130, 142, 148, 0.35),
      0 0 4px 0 rgba(130, 142, 148, 0.16), 0 0 2px 0 rgba(130, 142, 148, 0.12);

    @media (max-width: 550px) {
      width: calc(100% - 16px);
    }
  }

  & [class*="MuiSnackbarContent-message"] {
    color: #000;
    font-size: 18px;
    padding: 16px 0;
    font-weight: 700;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  }

  & [class*="MuiSnackbarContent-action"] {
    > button {
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      border-style: none;
      padding: 12px 27px;
      background: #262c34;
      border-radius: 20px;
    }
  }

  & [class*="MuiSnackbarContent-action"] {
    padding: 16px 0;
  }
`;

export const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      animation: "$spin 2s linear infinite",
    },
    "@keyframes spin": {
      "0%": {
        transform: "rotate(360deg)",
      },
      "100%": {
        transform: "rotate(0deg)",
      },
    },
  })
);

export function ReportSubheaderToolbar(props: ReportSubheaderToolbarProps) {
  const history = useHistory();
  const classes = useStyles();
  const { page, view } = useParams<{ page: string; view?: string }>();
  const token = useSessionStorage("authToken", "")[0];
  const [modalDisplay, setModalDisplay] = React.useState({
    report: false,
    chart: false,
  });
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const setHomeTab = useRecoilState(homeDisplayAtom)[1];

  const [autoResizeInput, _setAutoResizeInput] = React.useState<boolean>(true);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [isSavedEnabled, _setIsSavedEnabled] = React.useState(false);
  const [duplicatedReportId, setDuplicatedReportId] = React.useState<
    string | null
  >(null);
  const [duplicatedChartId, setDuplicatedChartId] = React.useState<
    string | null
  >(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const loadReports = useStoreActions(
    (actions) => actions.reports.ReportGetList.fetch
  );

  const loadCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );

  const createOrEditChartLoading = useStoreState(
    (state) =>
      state.charts.ChartCreate.loading || state.charts.ChartUpdate.loading
  );

  const createChartClear = useStoreActions(
    (actions) => actions.charts.ChartCreate.clear
  );
  const editChartClear = useStoreActions(
    (actions) => actions.charts.ChartUpdate.clear
  );

  const reportEditSuccess = useStoreState(
    (state) => state.reports.ReportUpdate.success
  );
  const reportEditLoading = useStoreState(
    (state) => state.reports.ReportUpdate.loading
  );

  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

  const [savedChanges, setSavedChanges] = React.useState<boolean>(false);

  React.useEffect(() => {
    // handles saved changes state for autosave
    let timeout: NodeJS.Timeout;
    if (reportEditSuccess) {
      setSavedChanges(true);
      timeout = setTimeout(() => {
        setSavedChanges(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [reportEditSuccess]);

  const handleDeleteModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = (text: string, result: boolean) => {
    setOpenSnackbar(result);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onSave = () => {
    props.onReportSave("edit");
  };

  const handleViewReport = () => {
    props.onReportSave("edit").then(() => {
      history.push(`/report/${page}`);
    });
  };

  React.useEffect(() => {
    return () => {
      createChartClear();
      editChartClear();
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleModalDisplay = () => {
    if (props.pageType === "chart") {
      setModalDisplay({
        ...modalDisplay,
        chart: true,
      });
    } else {
      setModalDisplay({
        ...modalDisplay,
        report: true,
      });
    }
  };

  const handleDelete = () => {
    setEnableButton(false);
    if (props.pageType === "report") {
      setModalDisplay({
        ...modalDisplay,
        report: false,
      });
      axios
        .delete(`${process.env.REACT_APP_API}/report/${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async () => {
          loadReports({
            token,
            storeInCrudData: true,
            filterString: "filter[order]=createdDate desc",
          });
        })
        .catch((error) => console.log(error));
      setHomeTab("reports");
    } else {
      setModalDisplay({
        ...modalDisplay,
        chart: false,
      });
      axios
        .delete(`${process.env.REACT_APP_API}/chart/${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async () => {
          loadCharts({
            token,
            storeInCrudData: true,
            filterString: "filter[order]=createdDate desc",
          });
        })
        .catch((error) => console.log(error));
      setHomeTab("charts");
    }
    history.replace("/");
  };

  const handleDuplicate = () => {
    if (props.pageType === "report") {
      axios
        .get(`${process.env.REACT_APP_API}/report/duplicate/${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          loadReports({
            token,
            storeInCrudData: true,
            filterString: "filter[order]=createdDate desc",
          });
          setDuplicatedReportId(response.data.id);
          setSnackbarState({
            ...snackbarState,
            open: true,
          });
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(`${process.env.REACT_APP_API}/chart/duplicate/${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          loadCharts({
            token,
            storeInCrudData: true,
            filterString: "filter[order]=createdDate desc",
          });
          setDuplicatedChartId(response.data.id);
          setSnackbarState({
            ...snackbarState,
            open: true,
          });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div id="subheader-toolbar" css={styles.container(props.isEditorFocused)}>
      {createOrEditChartLoading && <PageLoader />}

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />
      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 28px;
            `}
          >
            <div
              css={`
                overflow-x: visible;
              `}
            >
              <AutoResizeInput
                name={props.name}
                setName={props.setName}
                placeholder="Title"
                autoResize={autoResizeInput}
                maxWidth={500}
                minWidth={100}
                onClick={(e) => {
                  if (props.name === "Untitled report") {
                    e.currentTarget.value = "";
                  }
                }}
                onBlur={() => {
                  props.setHasSubHeaderTitleBlurred?.(true);
                }}
                onFocus={() => {
                  props.setHasSubHeaderTitleFocused?.(true);
                  props.setHasSubHeaderTitleBlurred?.(false);
                }}
                disabled={props.isPreviewView}
                style={
                  page !== "new" && !view
                    ? {
                        pointerEvents: "none",
                      }
                    : {}
                }
              />
            </div>
            {view === "edit" && (
              <button css={styles.viewReportBtn} onClick={handleViewReport}>
                <PlayIcon />
                View Report
              </button>
            )}
            {reportEditLoading && (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  span {
                    margin-bottom: -4px;
                  }
                `}
              >
                <span>
                  <AutorenewIcon
                    htmlColor="#70777E"
                    className={classes.rotateIcon}
                  />
                </span>
                <p
                  css={`
                    color: #70777e;
                    font-family: "Gotham Narrow", sans-serif;
                    font-size: 12px;
                    font-weight: 325;
                    margin: 0px;
                  `}
                >
                  saving changes{" "}
                </p>
              </div>
            )}
            {savedChanges && (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  span {
                    margin-bottom: -7px;
                  }
                `}
              >
                <span>
                  <CloudDoneIcon htmlColor="#70777E" />
                </span>
                <p
                  css={`
                    color: #70777e;
                    font-family: "Gotham Narrow", sans-serif;
                    font-size: 12px;
                    font-weight: 325;
                    margin: 0px;
                    margin-top: 2px;
                  `}
                >
                  All changes saved{" "}
                </p>
              </div>
            )}
          </div>

          {view !== "initial" && (
            <>
              {(page === "new" || view) && (
                <div css={styles.endContainer}>
                  <div
                    css={`
                      display: flex;
                      gap: 14px;
                      align-items: center;
                    `}
                  >
                    <span
                      css={`
                        color: #000;

                        font-family: "Gotham Narrow", sans-serif;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 325;
                        margin-right: 10px;
                      `}
                    >
                      AutoSave
                    </span>
                    <AutoSaveSwitch
                      checked={props.autoSave}
                      setAutoSave={props.setAutoSave}
                    />
                  </div>
                  <Tooltip title="Save">
                    <span>
                      <IconButton
                        onClick={onSave}
                        disabled={
                          props.forceEnablePreviewSave
                            ? !props.forceEnablePreviewSave
                            : !isSavedEnabled
                        }
                        css={`
                          padding: 4px;
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                      >
                        <SaveIcon htmlColor="#262c34" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              )}
              {page !== "new" && !view && (
                <div css={styles.previewEndContainer}>
                  <ExportChartButton />
                  <Tooltip title="Duplicate">
                    <IconButton onClick={handleDuplicate}>
                      <FileCopyIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={handleClick}>
                      <ShareIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    css={`
                      .MuiPaper-root {
                        border-radius: 10px;
                        background: #495057;
                      }
                    `}
                  >
                    <div css={styles.sharePopup}>
                      <CopyToClipboard
                        text={window.location.href}
                        onCopy={handleCopy}
                      >
                        <Button startIcon={<LinkIcon />}>Copy link</Button>
                      </CopyToClipboard>
                    </div>
                  </Popover>
                  <Tooltip title="Edit">
                    <IconButton
                      component={Link}
                      to={`/${props.pageType}/${page}/${
                        props.pageType === "chart" ? "customize" : "edit"
                      }`}
                    >
                      <EditIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={handleModalDisplay}>
                      <DeleteIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
      {view === "edit" && (
        <Container maxWidth="lg">
          <StaticToolbar
            isEditorFocused={props.isEditorFocused}
            plugins={props.plugins}
          />
        </Container>
      )}

      <InfoSnackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={`${
          props.pageType === "report" ? "Report" : "Chart"
        } has been duplicated successfully!`}
        key={snackbarState.vertical + snackbarState.horizontal}
        action={
          <button
            onClick={() => {
              setSnackbarState({ ...snackbarState, open: false });
              if (props.pageType === "report") {
                history.push(`/report/${duplicatedReportId}`);
                setDuplicatedReportId(null);
              } else {
                history.push(`/chart/${duplicatedChartId}`);
                setDuplicatedChartId(null);
              }
            }}
          >
            GO TO {props.pageType === "report" ? "REPORT" : "CHART"}
          </button>
        }
      />
      <DeleteReportDialog
        modalDisplay={modalDisplay.report}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setModalDisplay}
        handleInputChange={handleDeleteModalInputChange}
      />
      <DeleteChartDialog
        modalDisplay={modalDisplay.chart}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setModalDisplay}
        handleInputChange={handleDeleteModalInputChange}
      />
    </div>
  );
}
