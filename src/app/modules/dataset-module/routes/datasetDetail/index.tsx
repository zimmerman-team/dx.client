import FinishedFragment from "app/modules/dataset-module/routes/upload-module/upload-steps/finishedFragment";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import React from "react";
import DatasetSubHeaderToolbar from "app/modules/dataset-module/component/datasetSubHeaderToolbar";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import get from "lodash/get";
import { Container } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "app/modules/common/page-loader";
import { useTitle } from "react-use";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";

export default function DatasetDetail() {
  useTitle("DX Dataxplorer - Dataset Detail");

  const { page } = useParams<{ page: string }>();
  const { user, isAuthenticated } = useAuth0();

  const token = useStoreState((state) => state.AuthToken.value);
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );

  const datasetError401 = useStoreState(
    (state) =>
      get(state.dataThemes.DatasetGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.dataThemes.DatasetGet.crudData, "error", "") === "Unauthorized"
  );

  const errorDatasetName = useStoreState((state) =>
    get(state.dataThemes.DatasetGet.crudData, "name", "")
  );

  const loadDatasetLoading = useStoreState(
    (state) => state.dataThemes.DatasetGet.loading
  );

  const canDatasetEditDelete = React.useMemo(() => {
    return (
      isAuthenticated && datasetDetails && datasetDetails?.owner === user?.sub
    );
  }, [user, isAuthenticated, datasetDetails]);

  const {
    loadDataset: loadSampleDataset,
    sampleData,
    dataTotalCount,
    dataStats,
    dataTypes,
  } = useChartsRawData({
    visualOptions: () => {},
    setVisualOptions: () => {},
    setChartFromAPI: () => {},
    chartFromAPI: null,
  });

  React.useEffect(() => {
    loadSampleDataset(page);
    reloadDataset();
  }, [token, page]);

  const reloadDataset = () => {
    if (token) {
      loadDataset({
        token,
        getId: page,
      });
    } else {
      loadDataset({
        token,
        getId: page,
        nonAuthCall: !token,
      });
    }
  };

  if (datasetError401) {
    return (
      <>
        <div css="width: 100%; height: 48px;" />
        <NotAuthorizedMessageModule
          asset="dataset"
          action="view"
          name={errorDatasetName}
          handleRetry={reloadDataset}
        />
      </>
    );
  }
  return (
    <Container maxWidth="lg">
      <DatasetSubHeaderToolbar name={datasetDetails.name} />
      <div
        css={`
          height: 98px;
          @media (max-width: 881px) {
            height: 116px;
          }
        `}
      />
      {loadDatasetLoading ? <PageLoader /> : null}
      <FinishedFragment
        data={sampleData}
        stats={dataStats}
        dataTypes={dataTypes}
        datasetId={page}
        dataTotalCount={dataTotalCount}
        canDatasetEditDelete={canDatasetEditDelete}
        datasetDetails={datasetDetails}
      />
    </Container>
  );
}
