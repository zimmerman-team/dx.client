// cc:application base#;application index

import React from "react";
import Providers from "app/Providers";
import { MainRoutes } from "app/Routes";
import { AppDialogs } from "app/components/Dialogs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CookieDialog } from "app/components/Dialogs/CookieDialog";

export function App() {
  return (
    <Providers>
      <AppDialogs />
      <CookieDialog open data-testid="cookie-dialog" />
      <MainRoutes />
    </Providers>
  );
}
