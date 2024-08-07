// cc:application base#;application index

import React from "react";
import Providers from "app/Providers";
import { MainRoutes } from "app/Routes";
import { AppDialogs } from "app/components/Dialogs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CookieDialog } from "app/components/Dialogs/CookieDialog";
import { MobileBottomNavigation } from "app/components/Mobile/BottomNavigation";
import { PlanDialog } from "./components/Dialogs/PlanDialog";
import { matchPath } from "react-router-dom";

export function App() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const match = matchPath(location.pathname, {
    path: "/chart-embed/:chartId/:datasetId",
    exact: true,
    strict: true,
  });

  return (
    <Providers>
      <AppDialogs />
      <CookieDialog open data-testid="cookie-dialog" />
      <PlanDialog />
      <MainRoutes />
      {isMobile && match === null && <MobileBottomNavigation />}
    </Providers>
  );
}
