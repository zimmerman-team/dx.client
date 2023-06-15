// cc:application base#;application routes

// base
import React, { Suspense, lazy } from "react";
import { Switch } from "react-router-dom";
import { useScrollToTop } from "app/hooks/useScrollToTop";
import { PageLoader } from "app/modules/common/page-loader";
import { RouteWithAppBar } from "app/utils/RouteWithAppBar";
import { NoMatchPage } from "app/modules/common/no-match-page";

const HomeModule = lazy(() => import("app/modules/home-module"));
const AboutModule = lazy(() => import("app/modules/about-module"));
const ChartModule = lazy(() => import("app/modules/chart-module"));
const ReportModule = lazy(() => import("app/modules/report-module"));
const DatasetUploadSteps = lazy(
  () => import("app/fragments/datasets-fragment/upload-steps")
);
const EditMetaData = lazy(
  () => import("app/modules/datasets-module/editMetaData")
);

export function MainRoutes() {
  useScrollToTop();

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <RouteWithAppBar exact path="/">
          <HomeModule />
        </RouteWithAppBar>
        <RouteWithAppBar exact path="/report/:page/:view?">
          <ReportModule />
        </RouteWithAppBar>
        <RouteWithAppBar exact path="/about">
          <AboutModule />
        </RouteWithAppBar>
        <RouteWithAppBar exact path="/chart/:page/:view?">
          <ChartModule />
        </RouteWithAppBar>
        <RouteWithAppBar exact path="/dataset/:id/edit">
          <EditMetaData />
        </RouteWithAppBar>
        <RouteWithAppBar exact path="/dataset-upload">
          <DatasetUploadSteps />
        </RouteWithAppBar>
        <RouteWithAppBar path="*">
          <NoMatchPage />
        </RouteWithAppBar>
      </Switch>
    </Suspense>
  );
}
