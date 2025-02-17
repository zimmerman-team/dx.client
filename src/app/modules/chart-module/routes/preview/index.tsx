/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { PageLoader } from "app/modules/common/page-loader";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { DatasetDataTable } from "app/modules/dataset-module/routes/upload-module/component/table/data-table";
import { useHistory, useParams } from "react-router-dom";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";

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
  dataTypes: never[];
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
  datasetId: string;
}

export function ChartBuilderPreview(props: ChartBuilderPreviewProps) {
  useTitle("DX Dataxplorer - Preview Data");
  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const datasetId = useStoreState((state) => state.charts.dataset.value);

  React.useEffect(() => {
    if (datasetId === null && !props.loading && page === "new") {
      history.push(`/chart/${page}/data`);
    } else {
      //loads table data
      props.loadDataset(datasetId!);
    }
  }, [datasetId]);

  if (props.dataError) {
    return (
      <>
        <ErrorComponent
          chartErrorMessage={props.chartErrorMessage}
          dataError={props.dataError}
          chartError={props.chartError}
          page={page}
          view="preview-data"
          selectDataProps={{
            datasetId: props.datasetId,
            loadDataset: props.loadDataset,
          }}
        />
      </>
    );
  }

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        <DatasetDataTable
          data={props.data}
          stats={props.stats}
          dataTypes={props.dataTypes}
          datasetId={datasetId!}
        />
      </div>
    </div>
  );
}
