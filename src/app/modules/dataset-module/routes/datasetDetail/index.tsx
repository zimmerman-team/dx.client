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

export default function DatasetDetail() {
  const { page } = useParams<{ page: string }>();
  const { user, isAuthenticated } = useAuth0();

  const token = useStoreState((state) => state.AuthToken.value);
  const datasets = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGetList.crudData ??
        []) as DatasetListItemAPIModel[]
  );
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const loadedDatasets = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGetList.crudData ??
        []) as DatasetListItemAPIModel[]
  );
  const loadedDataset = loadedDatasets.find((d) => d.id === page);

  const canDatasetEditDelete = React.useMemo(() => {
    return (
      isAuthenticated && loadedDatasets && loadedDataset?.owner === user?.sub
    );
  }, [user, isAuthenticated, loadedDatasets]);

  const { loadDataset, sampleData, dataTotalCount, dataStats, dataTypes } =
    useChartsRawData({
      visualOptions: () => {},
      setVisualOptions: () => {},
      setChartFromAPI: () => {},
      chartFromAPI: null,
    });

  React.useEffect(() => {
    loadDataset(`chart/sample-data/${page}`);
  }, []);

  React.useEffect(() => {
    if (token) {
      loadDatasets({
        token,
        storeInCrudData: true,
        filterString: "filter[order]=createdDate desc",
      });
    }
  }, [token, page]);

  const name = find(datasets, (d: any) => d.id === page)?.name;
  const description = find(datasets, (d: any) => d.id === page)?.description;

  return (
    <Container maxWidth="lg">
      <DatasetSubHeaderToolbar name={name as string} />
      <div
        css={`
          height: 60px;
        `}
      />
      <FinishedFragment
        data={sampleData}
        stats={dataStats}
        dataTypes={dataTypes}
        datasetId={page}
        dataTotalCount={dataTotalCount}
        description={description as string}
        canDatasetEditDelete={canDatasetEditDelete}
      />
    </Container>
  );
}
