/** third-party */
import {
  Container,
  IconButton,
  Popover,
  Snackbar,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
/** Project */
import { LinkIcon } from "app/assets/icons/Link";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { styles } from "app/modules/dataset-module/component/styles";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";
import { InfoSnackbar } from "app/modules/report-module/components/reportSubHeaderToolbar/infosnackbar";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { useSetRecoilState } from "recoil";
import { planDialogAtom } from "app/state/recoil/atoms";
import ShareModal from "./shareModal";
import DuplicateMessage from "app/modules/common/mobile-duplicate-message";

export default function DatasetSubHeaderToolbar(
  props: Readonly<{ name: string }>
) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 599px)");
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [isShareModalOpen, setIsShareModalOpen] =
    React.useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [duplicatedDatasetId, setDuplicatedDatasetId] = React.useState<
    string | null
  >(null);
  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;
  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  const shareURL = `${window.location.origin}/dataset/${datasetDetails.id}/detail`;
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const canDatasetEditDelete = React.useMemo(() => {
    return isAuthenticated && datasetDetails?.owner === user?.sub;
  }, [user, isAuthenticated, datasetDetails]);

  React.useEffect(() => {
    if (token) {
      loadDataset({
        token,
        getId: page as string,
      });
    } else {
      loadDataset({
        token,
        getId: page as string,
        nonAuthCall: !token,
      });
    }
  }, [token, page]);

  const handleBackToDataset = () => {
    setSnackbarState({ ...snackbarState, open: false });
    history.push(`/dataset/${duplicatedDatasetId}/detail`);
    setDuplicatedDatasetId(null);
  };

  const handleDuplicate = () => {
    axios
      .get(`${process.env.REACT_APP_API}/dataset/duplicate/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        setDuplicatedDatasetId(response.data.id);
        setSnackbarState({
          ...snackbarState,
          open: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSharePopup = () => {
    setAnchorEl(null);
  };

  const handleSharePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      setIsShareModalOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCopy = (text: string, result: boolean) => {
    setOpenSnackbar(result);
  };

  const handleModal = () => {
    setModalDisplay(true);
  };

  function handleDelete() {
    axios
      .delete(`${process.env.REACT_APP_API}/datasets/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async () => {
        loadDatasets({
          token,
          storeInCrudData: true,
          filterString: "filter[order]=updatedDate desc",
        });
      })
      .catch((error) => console.log(error));
    history.replace("/");
  }

  return (
    <div id="subheader-toolbar" css={styles.container}>
      <Snackbar
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "left",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />
      <DeleteDatasetDialog
        cardId={page}
        enableButton={enableButton}
        handleDelete={handleDelete}
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        setEnableButton={setEnableButton}
      />
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
            action={handleBackToDataset}
            closeSnackbar={() =>
              setSnackbarState({ ...snackbarState, open: false })
            }
            name={datasetDetails.name}
            type="data"
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
          message={`Dataset has been duplicated successfully!`}
          key={snackbarState.vertical + snackbarState.horizontal}
          action={<button onClick={handleBackToDataset}>GO TO Dataset</button>}
        />
      )}
      <ShareModal
        datasetDetails={datasetDetails}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        handleCopy={handleCopy}
        url={shareURL}
      />

      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <p
            title={props.name}
            css={`
              ${styles.nameInput}
              display: block;
              max-width: 1000px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}
          >
            {props.name}
          </p>

          <div css={styles.endContainer}>
            <div css={styles.iconbtns}>
              {isAuthenticated && (
                <Tooltip title="Duplicate">
                  <IconButton onClick={handleDuplicate}>
                    <FileCopyIcon htmlColor="#262c34" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Share">
                <IconButton onClick={handleSharePopup}>
                  <ShareIcon htmlColor="#262c34" />
                </IconButton>
              </Tooltip>
              <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseSharePopup}
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
              {canDatasetEditDelete && !isMobile && (
                <Tooltip title="Edit">
                  <IconButton component={Link} to={`/dataset/${page}/edit`}>
                    <EditIcon htmlColor="#262c34" />
                  </IconButton>
                </Tooltip>
              )}
              {canDatasetEditDelete && !isMobile && (
                <Tooltip title="Delete">
                  <IconButton onClick={handleModal}>
                    <DeleteIcon htmlColor="#262c34" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
