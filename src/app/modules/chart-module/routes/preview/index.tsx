/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { PageLoader } from "app/modules/common/page-loader";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { DatasetDataTable } from "app/fragments/datasets-fragment/component/data-table";
import { useHistory, useParams } from "react-router-dom";

interface ChartBuilderPreviewProps {
  loading: boolean;
  data: {
    [key: string]: string | number | null;
  }[];
  stats: {
    name: string;
    type: "percentage" | "bar" | "unique";
    data: { name: string; value: number }[];
  }[];
  filterOptionGroups: FilterGroupModel[];
  loadDataset: (endpoint: string) => Promise<boolean>;
}

export function ChartBuilderPreview(props: ChartBuilderPreviewProps) {
  useTitle("DX DataXplorer - Data");
  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const dataset = useStoreState((state) => state.charts.dataset.value);

  React.useEffect(() => {
    if (dataset === null && !props.loading) {
      history.push(`/chart/${page}/data`);
    } else {
      props.loadDataset(`chart/sample-data/${dataset}`);
    }
  }, [dataset]);

  return (
    <div css={commonStyles.container}>
      {props.loading && <PageLoader />}
      <div css={commonStyles.innercontainer}>
        <DatasetDataTable data={props.data} stats={props.stats} />
      </div>
    </div>
  );
}
