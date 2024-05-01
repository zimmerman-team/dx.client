import FinishedFragment from "app/modules/dataset-upload-module/upload-steps/finishedFragment";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import React from "react";
import DatasetSubHeaderToolbar from "../../component/datasetSubHeaderToolbar";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { find } from "lodash";
import { Container } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "app/modules/common/page-loader";

export default function DatasetDetail() {
  const { page } = useParams<{ page: string }>();
  const { user, isAuthenticated } = useAuth0();

  const token = useStoreState((state) => state.AuthToken.value);
  const dataset = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );

  const loadDatasetLoading = useStoreState(
    (state) => state.dataThemes.DatasetGet.loading
  );

  const canDatasetEditDelete = React.useMemo(() => {
    return isAuthenticated && dataset && dataset?.owner === user?.sub;
  }, [user, isAuthenticated, dataset]);

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
    loadSampleDataset(`chart/sample-data/${page}`);
  }, []);

  React.useEffect(() => {
    if (token) {
      loadDataset({
        token,
        getId: page,
      });
    }
  }, [token, page]);

  return (
    <Container maxWidth="lg">
      <DatasetSubHeaderToolbar name={dataset.name} />
      <div
        css={`
          height: 98px;
        `}
      />
      {loadDatasetLoading ? <PageLoader /> : null}
      <FinishedFragment
        data={sampleData}
        stats={dataStats}
        dataTypes={dataTypes}
        datasetId={page}
        dataTotalCount={dataTotalCount}
        description={dataset.description}
        canDatasetEditDelete={canDatasetEditDelete}
      />
    </Container>
  );
}
