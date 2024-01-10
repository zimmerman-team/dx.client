/** third-party */
import {
  Container,
  IconButton,
  Popover,
  Snackbar,
  Tooltip,
} from "@material-ui/core";
import { LinkIcon } from "app/assets/icons/Link";
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
import { useStoreActions, useStoreState } from "app/state/store/hooks";
/** Project */
import { styles } from "app/modules/dataset-module/component/styles";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import { ISnackbarState } from "app/fragments/datasets-fragment/upload-steps/previewFragment";
import { InfoSnackbar } from "app/modules/report-module/components/reportSubHeaderToolbar";
import { homeDisplayAtom } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";

export default function DatasetSubHeaderToolbar(
  props: Readonly<{ name: string }>
) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const setHomeTab = useRecoilState(homeDisplayAtom)[1];
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
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

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );

  const handleDuplicate = () => {
    axios
      .get(`${process.env.REACT_APP_API}/dataset/duplicate/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
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

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
          filterString: "filter[order]=createdDate desc",
        });
      })
      .catch((error) => console.log(error));
    setHomeTab("data");
    history.replace("/");
  }

  return (
    <div id="subheader-toolbar" css={styles.container}>
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
      <DeleteDatasetDialog
        cardId={page}
        enableButton={enableButton}
        handleDelete={handleDelete}
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        setEnableButton={setEnableButton}
      />
      <InfoSnackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={`Dataset has been duplicated successfully!`}
        key={snackbarState.vertical + snackbarState.horizontal}
        action={
          <button
            onClick={() => {
              setSnackbarState({ ...snackbarState, open: false });
              history.push(`/dataset/${duplicatedDatasetId}/detail`);
              setDuplicatedDatasetId(null);
            }}
          >
            GO TO Dataset
          </button>
        }
      />
      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <p css={styles.nameInput}>{props.name}</p>

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
                <IconButton onClick={handleClick}>
                  <ShareIcon htmlColor="#262c34" />
                </IconButton>
              </Tooltip>
              <Popover
                id={popoverId}
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
                <IconButton component={Link} to={`/dataset/${page}/edit`}>
                  <EditIcon htmlColor="#262c34" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleModal}>
                  <DeleteIcon htmlColor="#262c34" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
