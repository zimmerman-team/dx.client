import React from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import ShareIcon from "@material-ui/icons/Share";
import { LinkIcon } from "app/assets/icons/Link";
import Snackbar from "@material-ui/core/Snackbar";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import CopyToClipboard from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import { PageLoader } from "app/modules/common/page-loader";
import { createStyles, makeStyles, useMediaQuery } from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import DeleteReportDialog from "app/components/Dialogs/deleteReportDialog";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { ExportChartButton } from "app/modules/chart-module/components/chartSubheaderToolbar/exportButton";
import { ReportSubheaderToolbarProps } from "app/modules/chart-module/components/chartSubheaderToolbar/data";
import { ReactComponent as PlayIcon } from "app/modules/report-module/asset/play-icon.svg";
import { styles } from "app/modules/report-module/components/reportSubHeaderToolbar/styles";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";
import StaticToolbar from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import AutoSaveSwitch from "app/modules/report-module/components/reportSubHeaderToolbar/autoSaveSwitch";
import AutoResizeInput from "app/modules/report-module/components/reportSubHeaderToolbar/autoResizeInput";
import { InfoSnackbar } from "app/modules/report-module/components/reportSubHeaderToolbar/infosnackbar";
import ShareModal from "app/modules/dataset-module/component/shareModal";
import DuplicateMessage from "app/modules/common/mobile-duplicate-message";

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

export function ReportSubheaderToolbar(
  props: Readonly<ReportSubheaderToolbarProps>
) {
  const history = useHistory();
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth0();
  const isMobile = useMediaQuery("(max-width: 599px)");
  const isTabletView = useMediaQuery("(min-width: 768px)"); //at this breakpoint, we limit user creation abilities
  const titleRef = React.useRef<HTMLDivElement>(null);
  const { page, view } = useParams<{ page: string; view?: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [inputSpanVisibiltiy, setInputSpanVisibility] = React.useState(true);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [duplicatedReportId, setDuplicatedReportId] = React.useState<
    string | null
  >(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const [isShareModalOpen, setIsShareModalOpen] =
    React.useState<boolean>(false);
  const [savedChanges, setSavedChanges] = React.useState<boolean>(false);

  const loadReports = useStoreActions(
    (actions) => actions.reports.ReportGetList.fetch
  );
  const loadedReport = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
  );
  const shareURL = `${window.location.origin}/report/${loadedReport.id}`;

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
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

  React.useEffect(() => {
    // handles saved changes state for autosave
    let timeout: NodeJS.Timeout;
    if (reportEditSuccess) {
      setSavedChanges(true);
      timeout = setTimeout(() => {
        setSavedChanges(false);
      }, 1000);
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

  const handleSharePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      setIsShareModalOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = (text: string, result: boolean) => {
    setOpenSnackbar(true);
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
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    setEnableButton(false);
    setShowDeleteDialog(false);

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
          filterString: "filter[order]=updatedDate desc",
        });
      })
      .catch((error) => console.log(error));

    history.replace("/");
  };

  const handleDuplicate = () => {
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
          filterString: "filter[order]=updatedDate desc",
        });
        setDuplicatedReportId(response.data.id);
        setSnackbarState({
          ...snackbarState,
          open: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleViewDuplocatedReport = () => {
    setSnackbarState({ ...snackbarState, open: false });
    history.push(`/report/${duplicatedReportId}`);
    setDuplicatedReportId(null);
  };

  const canReportEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedReport && loadedReport.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart, loadedReport]);

  const handleSignIn = () => {
    localStorage.setItem("duplicateReportAfterSignIn", page);
    history.push("/onboarding/login");
  };

  return (
    <div id="subheader-toolbar" css={styles.container(view !== undefined)}>
      {createOrEditChartLoading && <PageLoader />}

      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <div
            ref={titleRef}
            css={`
              display: flex;
              align-items: center;
              gap: 28px;
              position: relative;
              width: 70%;
              @media (min-width: 768px) {
                @media (max-width: 800px) {
                  width: 48%;
                }
              }
              @media (min-width: 801px) {
                @media (max-width: 1199px) {
                  width: 49%;
                }
              }
            `}
          >
            {isMobile && <ArrowBackIosIcon onClick={() => history.go(-1)} />}
            <AutoResizeInput
              name={props.name}
              setName={props.setName}
              placeholder="Title"
              autoResize={true}
              maxWidth={(titleRef.current?.offsetWidth ?? 1000) - 100}
              spanBuffer={isMobile ? 0 : 150}
              minWidth={200}
              spanVisibility={inputSpanVisibiltiy}
              setSpanVisibility={setInputSpanVisibility}
              onClick={(e) => {
                if (props.name === "Untitled report") {
                  e.currentTarget.value = "";
                }
              }}
              onBlur={() => {
                setInputSpanVisibility(true);
                props.setHasSubHeaderTitleBlurred?.(true);
              }}
              onFocus={() => {
                props.setHasSubHeaderTitleFocused?.(true);
                props.setHasSubHeaderTitleBlurred?.(false);
                setInputSpanVisibility(false);
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
            <div
              css={`
                display: flex;
                flex-shrink: 0;
                gap: 12px;
                @media (min-width: 768px) {
                  @media (max-width: 1200px) {
                    display: none;
                  }
                }
              `}
            >
              {view === "edit" && (
                <button
                  css={styles.viewReportBtn}
                  onClick={handleViewReport}
                  data-cy="view-report-button"
                  aria-label="view report button"
                >
                  <PlayIcon />
                  View Report
                </button>
              )}
            </div>
          </div>

          {view !== "initial" && (
            <>
              {(page === "new" || view) && (
                <div css={styles.endContainer}>
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
                          font-family: "GothamNarrow-Book", sans-serif;
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
                          font-family: "GothamNarrow-Book", sans-serif;
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

                        font-family: "GothamNarrow-Book", sans-serif;
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
                  {view === "edit" && (
                    <Tooltip title="view report">
                      <IconButton
                        onClick={handleViewReport}
                        css={`
                          padding: 0px;
                          :disabled {
                            opacity: 0.5;
                          }
                          display: none;
                          @media (min-width: 768px) {
                            @media (max-width: 1200px) {
                              display: block;
                            }
                          }
                        `}
                        data-cy="view-report-button"
                        aria-label="view report button"
                      >
                        <svg width="20" height="19" viewBox="0 0 20 19">
                          <rect width="20" height="19" rx="3" fill="#262C34" />
                          <path
                            fill="#EFEFEF"
                            d="M14 9L6.5 13.3301L6.5 4.66987L14 9Z"
                          />
                        </svg>
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Save">
                    <span>
                      <IconButton
                        onClick={onSave}
                        disabled={!props.isSaveEnabled}
                        aria-label="save button"
                        css={`
                          padding: 0px;
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                        data-cy="save-report-button"
                      >
                        <SaveIcon htmlColor="#262c34" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              )}
              {page !== "new" && !view && (
                <div css={styles.previewEndContainer}>
                  {isTabletView && <ExportChartButton filename={props.name} />}

                  <Tooltip title="Duplicate">
                    <IconButton
                      onClick={isAuthenticated ? handleDuplicate : handleSignIn}
                      data-testid="duplicate-button"
                    >
                      <FileCopyIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share">
                    <IconButton
                      onClick={handleSharePopup}
                      data-testid="share-button"
                    >
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
                  {canReportEditDelete && isTabletView && (
                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        to={`/report/${page}/edit`}
                        data-testid="edit-button"
                      >
                        <EditIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canReportEditDelete && isTabletView && (
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={handleModalDisplay}
                        data-testid="delete-button"
                      >
                        <DeleteIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
      {view === "edit" && (
        <Container maxWidth="lg">
          <StaticToolbar plugins={props.plugins} />
        </Container>
      )}
      <>
        {isMobile ? (
          <InfoSnackbar
            anchorOrigin={{
              vertical: snackbarState.vertical,
              horizontal: snackbarState.horizontal,
            }}
            open={snackbarState.open}
            autoHideDuration={6000}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            key={snackbarState.vertical + snackbarState.horizontal}
          >
            <DuplicateMessage
              action={handleViewDuplocatedReport}
              closeSnackbar={() =>
                setSnackbarState({ ...snackbarState, open: false })
              }
              name={loadedReport.name}
              type="report"
            />
          </InfoSnackbar>
        ) : (
          <InfoSnackbar
            anchorOrigin={{
              vertical: snackbarState.vertical,
              horizontal: snackbarState.horizontal,
            }}
            open={snackbarState.open}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            message={`Report has been duplicated successfully!`}
            key={snackbarState.vertical + snackbarState.horizontal}
            action={
              <button
                onClick={() => {
                  setSnackbarState({ ...snackbarState, open: false });
                  history.push(`/report/${duplicatedReportId}`);
                  setDuplicatedReportId(null);
                }}
              >
                GO TO REPORT
              </button>
            }
          />
        )}
      </>
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
      <ShareModal
        datasetDetails={loadedReport}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        handleCopy={handleCopy}
        url={shareURL}
      />
      <DeleteReportDialog
        modalDisplay={showDeleteDialog}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setShowDeleteDialog}
        handleInputChange={handleDeleteModalInputChange}
      />
    </div>
  );
}
