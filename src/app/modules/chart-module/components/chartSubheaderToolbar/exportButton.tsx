import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import SaveAlt from "@material-ui/icons/SaveAlt";
import { exportPage } from "app/utils/exportPage";
import IconButton from "@material-ui/core/IconButton";
import {
  StyledMenu,
  StyledMenuItem,
} from "app/modules/chart-module/components/exporter";

export function ExportChartButton(props: { filename: string }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

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

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Export">
        <IconButton onClick={handleClick} aria-label="export-button">
          <SaveAlt htmlColor="#262c34" />
        </IconButton>
      </Tooltip>
      <StyledMenu
        keepMounted
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <StyledMenuItem
          onClick={() => handleTypeChange(".pdf", props.filename)}
        >
          .pdf
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => handleTypeChange(".png", props.filename)}
        >
          .png
        </StyledMenuItem>

        <StyledMenuItem
          onClick={() => handleTypeChange(".svg", props.filename)}
        >
          .svg
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
}
