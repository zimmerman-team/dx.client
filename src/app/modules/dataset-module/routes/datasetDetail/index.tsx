import FinishedFragment from "app/modules/dataset-upload-module/upload-steps/finishedFragment";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import React from "react";
import DatasetSubHeaderToolbar from "../../component/datasetSubHeaderToolbar";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { find } from "lodash";
import { Container } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

export default function DatasetDetail() {
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const datasets = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGetList.crudData ??
        []) as DatasetListItemAPIModel[]
  );
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );

  const { loadDataset, sampleData, dataTotalCount, dataStats } =
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
        datasetId={page}
        dataTotalCount={dataTotalCount}
        description={description as string}
      />
    </Container>
  );
}
