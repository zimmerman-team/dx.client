import React from "react";
import { useTitle } from "react-use";
import DatasetUploadSteps from "app/modules/dataset-module/routes/upload-module/upload-steps";
import { Route, Switch } from "react-router-dom";
import DatasetDetail from "app/modules/dataset-module/routes/datasetDetail";
import EditMetaData from "app/modules/dataset-module/routes/edit";
import { NoMatchPage } from "app/modules/common/no-match-page";

export default function DatasetDetailModule() {
  useTitle("Dataxplorer - Datasets");
  const [datasetId, setDatasetId] = React.useState("");

  return (
    <Switch>
      <Route exact path="/dataset/:page/detail">
        <DatasetDetail />
      </Route>
      <Route exact path="/dataset/new/upload">
        <DatasetUploadSteps datasetId={datasetId} setDatasetId={setDatasetId} />
      </Route>
      <Route exact path="/dataset/:page/edit">
        <EditMetaData />
      </Route>
      <Route path="*">
        <NoMatchPage />
      </Route>
    </Switch>
  );
}
