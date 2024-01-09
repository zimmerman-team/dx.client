import { Container, IconButton, Popover, Tooltip } from "@material-ui/core";
import { LinkIcon } from "app/assets/icons/Link";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link, useParams } from "react-router-dom";
import { styles } from "./styles";
import { useAuth0 } from "@auth0/auth0-react";

export default function datasetSubHeaderToolbar(props: { name: string }) {
  const { user, isAuthenticated } = useAuth0();
  const { page, view } = useParams<{ page: string; view?: string }>();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleDuplicate = () => {};
  const handleClick = () => {};
  const handleClose = () => {};
  const handleCopy = () => {};

  return (
    <div id="subheader-toolbar" css={styles.container}>
      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <p css={styles.nameInput}>{props.name}</p>

          <div css={styles.endContainer}>
            <div css={styles.iconbtns}>
              <React.Fragment>
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
                  <IconButton component={Link} to={`/dataset/${page}/edit`}>
                    <EditIcon htmlColor="#262c34" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <span>
                    <IconButton disabled>
                      <DeleteIcon htmlColor="#E4E4E4" />
                    </IconButton>
                  </span>
                </Tooltip>
              </React.Fragment>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
