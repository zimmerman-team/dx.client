import React from "react";
import { withStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import zIndex from "@material-ui/core/styles/zIndex";

export interface ISnackbarState {
  open: boolean;
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
  message: string;
}

export const CssSnackbar = withStyles({
  root: {
    "  &&": {
      zIndex: 1102,
    },
    "& .MuiSnackbarContent-message": {
      fontSize: "18px",
      fontFamily: "'GothamNarrow-Bold', 'Helvetica Neue', sans-serif",
    },
    "& .MuiSnackbarContent-root": {
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      width: "1232px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "@media (max-width: 1257px)": {
        width: "94vw",
      },
    },
  },
})(Snackbar);
