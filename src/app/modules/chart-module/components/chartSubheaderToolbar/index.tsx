import React from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import ShareIcon from "@material-ui/icons/Share";
import { LinkIcon } from "app/assets/icons/Link";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import CopyToClipboard from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { PageLoader } from "app/modules/common/page-loader";
import { Link, useHistory, useParams } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { styles } from "app/modules/chart-module/components/chartSubheaderToolbar/styles";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { SubheaderToolbarProps } from "app/modules/chart-module/components/chartSubheaderToolbar/data";
import { ExportChartButton } from "app/modules/chart-module/components/chartSubheaderToolbar/exportButton";
import { ISnackbarState } from "app/modules/dataset-upload-module/upload-steps/previewFragment";
import {
  homeDisplayAtom,
  chartFromReportAtom,
  reportRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { InfoSnackbar } from "app/modules/chart-module/components/chartSubheaderToolbar/infoSnackbar";
import { getRequiredFieldsAndErrors } from "../../routes/mapping/utils";
import AutoSaveSwitch from "app/modules/report-module/components/reportSubHeaderToolbar/autoSaveSwitch";
import useAutosave from "app/hooks/useAutoSave";
import { useStyles } from "app/modules/report-module/components/reportSubHeaderToolbar";
import AutoResizeInput from "app/modules/report-module/components/reportSubHeaderToolbar/autoResizeInput";

export function ChartSubheaderToolbar(props: Readonly<SubheaderToolbarProps>) {
  const classes = useStyles();
  const history = useHistory();

  const { user, isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const { page, view } = useParams<{ page: string; view?: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const setHomeTab = useRecoilState(homeDisplayAtom)[1];
  const [chartFromReport, _setChartFromReport] =
    useRecoilState(chartFromReportAtom);
  const setRightPanelView = useRecoilState(reportRightPanelViewAtom)[1];
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState<string | null>(null);
  const [duplicatedChartId, setDuplicatedChartId] = React.useState<
    string | null
  >(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const mapping = useStoreState((state) => state.charts.mapping.value);
  const { updRequiredFields, updMinValuesFields } = getRequiredFieldsAndErrors(
    mapping,
    props.dimensions
  );
  const isMappingValid =
    updRequiredFields.length === 0 && updMinValuesFields.length === 0;

  const dataset = useStoreState((state) => state.charts.dataset.value);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const enabledFilterOptionGroups = useStoreState(
    (state) => state.charts.enabledFilterOptionGroups.value
  );
  const activePanels = useStoreState(
    (state) => state.charts.activePanels.value
  );
  const selectedChartType = useStoreState(
    (state) => state.charts.chartType.value
  );

  const loadCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  const createChartLoading = useStoreState(
    (state) => state.charts.ChartCreate.loading
  );
  const editChartLoading = useStoreState(
    (state) => state.charts.ChartUpdate.loading
  );
  const createChartClear = useStoreActions(
    (actions) => actions.charts.ChartCreate.clear
  );
  const editChartClear = useStoreActions(
    (actions) => actions.charts.ChartUpdate.clear
  );

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

  const clearChart = () => {
    editChartClear();
    createChartClear();
  };
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setName(event.target.value);
  };
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

  React.useEffect(() => {
    return () => {
      clearChart();
    };
  }, []);

  useAutosave(
    () => {
      props.onSave();
    },
    2 * 1000,
    props.autoSave,
    [
      props.name,
      selectedChartType,
      mapping,
      dataset,
      props.visualOptions,
      appliedFilters,
    ]
  );

  const isPreviewDisabled: boolean = React.useMemo(() => {
    const newValue =
      isEmpty(selectedChartType) || !isMappingValid || view === "preview";
    return newValue;
  }, [selectedChartType, mapping, view]);

  const isSavedDisabled: boolean = React.useMemo(() => {
    const newValue = isEmpty(selectedChartType) || !isMappingValid;
    return newValue;
  }, [mapping, selectedChartType]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleModalDisplay = () => {
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    setEnableButton(false);

    setShowDeleteDialog(false);
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
          filterString: "filter[order]=updatedDate desc",
        });
      })
      .catch((error) => console.log(error));
    setHomeTab("charts");

    history.replace("/");
  };

  const handleDuplicate = () => {
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
          filterString: "filter[order]=updatedDate desc",
        });
        setDuplicatedChartId(response.data.id);
        setSnackbarState({
          ...snackbarState,
          open: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handlePreviewMode = () => {
    history.push(`/chart/${page}/preview`);
  };

  const handleBackToEdit = () => {
    history.goBack();
  };

  console.log(props.showAutoSaveSwitch, "showswitch");

  return (
    <div id="subheader-toolbar" css={styles.container}>
      {createChartLoading && <PageLoader />}
      <InfoSnackbar
        gap={location.pathname.includes("report")}
        data-testid="create-chart-snackbar"
        onClose={() => setShowSnackbar(null)}
        open={showSnackbar !== null && showSnackbar !== ""}
      >
        <SnackbarContent
          message={showSnackbar}
          aria-describedby="create-chart-snackbar-content"
          action={
            <>
              {!location.pathname.includes("report") && (
                <button
                  onClick={() => {
                    setShowSnackbar(null);
                    setHomeTab("reports");
                    history.push("/report/new/initial");
                  }}
                >
                  CREATE NEW REPORT
                </button>
              )}
            </>
          }
        />
      </InfoSnackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
        data-testid="copied-link-snackbar"
      />
      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 12px;
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
                autoResize={true}
                maxWidth={500}
                minWidth={100}
                onClick={(e) => {
                  if (props.name === "Untitled Chart") {
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

            {editChartLoading && (
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
            {props.savedChanges && (
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
          </div>

          <div css={styles.endContainer}>
            {view === "preview" && (
              <button
                onClick={handleBackToEdit}
                css={styles.backToEdit}
                type="button"
              >
                <EditIcon htmlColor="#fff" />
                Go back to editing
              </button>
            )}
            <div css={styles.iconbtns}>
              {(page === "new" || view) && (
                <React.Fragment>
                  {props.showAutoSaveSwitch && (
                    <div
                      css={`
                        display: flex;
                        gap: 14px;
                        align-items: center;
                        margin-right: 17px;
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
                        setAutoSave={
                          props.setAutoSaveState as React.Dispatch<
                            React.SetStateAction<{
                              isAutoSaveEnabled: boolean;
                              showAutoSaveSwitch?: boolean;
                            }>
                          >
                        }
                      />
                    </div>
                  )}
                  <Tooltip title="Preview">
                    <span>
                      <IconButton
                        onClick={handlePreviewMode}
                        aria-label="preview-button"
                        disabled={isPreviewDisabled}
                        css={`
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                      >
                        <svg width="20" height="19" viewBox="0 0 20 19">
                          <rect width="20" height="19" rx="3" fill="#262C34" />
                          <path
                            fill="#EFEFEF"
                            d="M14 9L6.5 13.3301L6.5 4.66987L14 9Z"
                          />
                        </svg>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Save">
                    <span>
                      <IconButton
                        onClick={props.onSave}
                        aria-label="save-button"
                        disabled={isSavedDisabled}
                        css={`
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                      >
                        <SaveIcon htmlColor="#262c34" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </React.Fragment>
              )}
              {page !== "new" && !view && (
                <React.Fragment>
                  <ExportChartButton />
                  {isAuthenticated && (
                    <Tooltip title="Duplicate">
                      <IconButton
                        onClick={handleDuplicate}
                        aria-label="duplicate-button"
                      >
                        <FileCopyIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Share">
                    <IconButton onClick={handleClick} aria-label="share-button">
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
                    aria-label="copy-link-popover"
                  >
                    <div css={styles.sharePopup} data-testid="copy-link-action">
                      <CopyToClipboard
                        text={window.location.href}
                        onCopy={handleCopy}
                      >
                        <Button startIcon={<LinkIcon />}>Copy link</Button>
                      </CopyToClipboard>
                    </div>
                  </Popover>
                  {canChartEditDelete && (
                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        to={`/chart/${page}/customize`}
                        aria-label="edit-button"
                      >
                        <EditIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canChartEditDelete && (
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={handleModalDisplay}
                        aria-label="delete-button"
                      >
                        <DeleteIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </Container>
      <InfoSnackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        data-testid="duplicated-chart-snackbar"
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={`Chart has been duplicated successfully!`}
        key={snackbarState.vertical + snackbarState.horizontal}
        action={
          <button
            onClick={() => {
              setSnackbarState({ ...snackbarState, open: false });

              history.push(`/chart/${duplicatedChartId}`);
              setDuplicatedChartId(null);
            }}
          >
            GO TO CHART
          </button>
        }
      />

      <DeleteChartDialog
        modalDisplay={showDeleteDialog}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setShowDeleteDialog}
        handleInputChange={handleDeleteModalInputChange}
      />
    </div>
  );
}
