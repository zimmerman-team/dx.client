import FinishedFragment from "app/fragments/datasets-fragment/upload-steps/finishedFragment";
import { useChartsRawData } from "app/hooks/useChartsRawData";
import React from "react";
import DatasetSubHeaderToolbar from "../../component/datasetSubHeaderToolbar";
import { useStoreState } from "app/state/store/hooks";
import { find } from "lodash";
import { Container } from "@material-ui/core";
import { useParams } from "react-router-dom";

export default function DatasetDetail() {
  const { page, view } = useParams<{ page: string; view?: string }>();

  const { loadDataset, sampleData, dataTotalCount, dataStats } =
    useChartsRawData({
      visualOptions: () => {},
      setVisualOptions: () => {},
      setChartFromAPI: () => {},
      chartFromAPI: null,
    });
  const dataset = useStoreState((state) => state.charts.dataset.value);

  React.useEffect(() => {
    loadDataset(`chart/sample-data/${page}`);
  }, []);

  const datasets = useStoreState(
    (state) => state.dataThemes.DatasetGetList.crudData as any[]
  );

  const name = find(datasets, (d: any) => d.id === page)?.name;
  const description = find(datasets, (d: any) => d.id === page)?.description;

  return (
    <Container maxWidth="lg">
      <DatasetSubHeaderToolbar name={name} />
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
        description={description}
      />
    </Container>
  );
}
