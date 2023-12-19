import React from "react";
import { useTitle } from "react-use";
import DatasetUploadSteps from "app/fragments/datasets-fragment/upload-steps";
import { Route, Switch } from "react-router-dom";
import DatasetDetail from "app/modules/dataset-module/routes/datasetDetail";
import EditMetaData from "app/modules/dataset-module/routes/edit";

export default function DatasetDetailModule() {
  useTitle("Dataxplorer - Datasets");
  const [datasetId, setDatasetId] = React.useState("");

  return (
    <Switch>
      <Route path="/dataset/:page/detail">
        <DatasetDetail />
      </Route>
      <Route path="/dataset/new/upload">
        <DatasetUploadSteps datasetId={datasetId} setDatasetId={setDatasetId} />
      </Route>
      <Route path="/dataset/:page/edit">
        <EditMetaData />
      </Route>
    </Switch>
  );
}
