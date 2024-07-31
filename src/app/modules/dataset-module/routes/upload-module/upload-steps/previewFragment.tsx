import React from "react";
import { withStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";

export interface ISnackbarState {
  open: boolean;
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

export const CssSnackbar = withStyles({
  root: {
    "& .MuiSnackbarContent-root": {
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      letterSpacing: "0.5px",
    },
  },
})(Snackbar);
