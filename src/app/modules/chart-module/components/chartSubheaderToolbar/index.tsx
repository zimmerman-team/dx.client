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
import CopyToClipboard from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { PageLoader } from "app/modules/common/page-loader";
import { Link, useHistory, useParams } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { styles } from "app/modules/chart-module/components/chartSubheaderToolbar/styles";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import DeleteReportDialog from "app/components/Dialogs/deleteReportDialog";
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

export function ChartSubheaderToolbar(props: Readonly<SubheaderToolbarProps>) {
  const history = useHistory();

  const { user, isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const { page, view } = useParams<{ page: string; view?: string }>();
  const [modalDisplay, setModalDisplay] = React.useState({
    report: false,
    chart: false,
  });

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
  const createChartData = useStoreState(
    (state) =>
      (state.charts.ChartCreate.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const createChartSuccess = useStoreState(
    (state) => state.charts.ChartCreate.success
  );
  const editChartSuccess = useStoreState(
    (state) => state.charts.ChartUpdate.success
  );
  const createOrEditChartLoading = useStoreState(
    (state) =>
      state.charts.ChartCreate.loading || state.charts.ChartUpdate.loading
  );

  const createChart = useStoreActions(
    (actions) => actions.charts.ChartCreate.post
  );
  const editChart = useStoreActions(
    (actions) => actions.charts.ChartUpdate.patch
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
  const onSave = () => {
    const chart = {
      name: props.name,
      authId: user?.sub,
      vizType: selectedChartType,
      mapping,
      datasetId: dataset,
      vizOptions: props.visualOptions || {},
      appliedFilters,
      enabledFilterOptionGroups,
    };
    if (view !== undefined && page !== "new") {
      editChart({
        token,
        patchId: page,
        values: chart,
      });
    } else {
      createChart({
        token,
        values: chart,
      });
    }
  };
  //handles what happens after chart is created or edited
  React.useEffect(() => {
    if ((editChartSuccess || createChartSuccess) && chartFromReport.state) {
      //returns back to persisted report view
      setRightPanelView("charts");
      history.push(`/report/${chartFromReport.page}/edit`);
    } else if (editChartSuccess && !chartFromReport.state) {
      //returns back to chart detail page
      history.push(`/chart/${page}`);
    } else if (
      createChartSuccess &&
      !chartFromReport.state &&
      createChartData.id
    ) {
      //shows snackbar
      setShowSnackbar(`Chart created successfully!`);
      //returns back to chart detail page
      history.push(`/chart/${createChartData.id}`);
    }
  }, [editChartSuccess, createChartSuccess, createChartData]);

  React.useEffect(() => {
    return () => {
      clearChart();
    };
  }, []);

  const isPreviewDisabled: boolean = React.useMemo(() => {
    const newValue =
      isEmpty(selectedChartType) || !isMappingValid || view === "preview";
    return newValue;
  }, [selectedChartType, mapping, view]);

  const isSavedDisabled: boolean = React.useMemo(() => {
    const newValue = isEmpty(selectedChartType) || !isMappingValid;
    // (view !== undefined && page !== "new" && props.name !== loadedChart.name);
    return newValue;
  }, [mapping, selectedChartType]);

  // console.log(loadedChart.name, props.name, "propsname");
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleModalDisplay = () => {
    setModalDisplay({
      ...modalDisplay,
      chart: true,
    });
  };

  const handleDelete = () => {
    setEnableButton(false);

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
          filterString: "filter[order]=createdDate desc",
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

  return (
    <div id="subheader-toolbar" css={styles.container}>
      {createOrEditChartLoading && <PageLoader />}
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
          <input
            value={props.name}
            placeholder="Title"
            css={styles.nameInput}
            onChange={onNameChange}
            onFocus={() => {
              props.setHasSubHeaderTitleFocused?.(true);
              props.setHasSubHeaderTitleBlurred?.(false);
            }}
            onBlur={() => props.setHasSubHeaderTitleBlurred?.(true)}
            onClick={(e) => {
              if (props.name === "Untitled Chart") {
                e.currentTarget.value = "";
              }
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
                        onClick={onSave}
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
