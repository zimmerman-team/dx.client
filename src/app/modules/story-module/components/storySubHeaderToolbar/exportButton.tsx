import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import SaveAlt from "@material-ui/icons/SaveAlt";
import { exportPage } from "app/utils/exportPage";
import IconButton from "@material-ui/core/IconButton";
import {
  StyledMenu,
  StyledMenuItem,
} from "app/modules/chart-module/components/exporter";
import { Link, useParams } from "react-router-dom";

export function ExportStoryButton(props: { filename: string }) {
  const { page } = useParams<{
    page: string;
  }>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleTypeChange(value: ".svg" | ".png" | ".pdf", filename: string) {
    if (value === ".png") {
      exportPage("png", "#f2f7fd", filename);
    }
    if (value === ".svg") {
      exportPage("svg", "#f2f7fd", filename);
    }
    if (value === ".pdf") {
      exportPage("pdf", "", filename);
    }

    handleClose();
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="export-button"
        data-cy="export-report"
      >
        <Tooltip title="Export">
          <SaveAlt htmlColor="#262c34" />
        </Tooltip>
      </IconButton>
      <StyledMenu
        keepMounted
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <StyledMenuItem
          onClick={() => handleTypeChange(".pdf", props.filename)}
        >
          <Link
            target="_blank"
            to={`/story/${page}/downloaded-view?type=pdf&filename=${props.filename}`}
            data-cy="export-report-pdf"
            css={`
              text-decoration: none;
              color: #262c34;
              width: 100%;
              height: 100%;
              &:hover {
                color: #fff;
              }
            `}
          >
            .pdf
          </Link>
        </StyledMenuItem>
        <StyledMenuItem>
          <Link
            target="_blank"
            to={`/story/${page}/downloaded-view?type=png&filename=${props.filename}`}
            data-cy="export-report-png"
            css={`
              text-decoration: none;
              color: #262c34;
              width: 100%;
              height: 100%;
              &:hover {
                color: #fff;
              }
            `}
          >
            .png
          </Link>
        </StyledMenuItem>

        <StyledMenuItem>
          <Link
            target="_blank"
            to={`/story/${page}/downloaded-view?type=svg&filename=${props.filename}`}
            data-cy="export-report-svg"
            css={`
              text-decoration: none;
              color: #262c34;
              width: 100%;
              height: 100%;
              &:hover {
                color: #fff;
              }
            `}
          >
            .svg
          </Link>
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
}
