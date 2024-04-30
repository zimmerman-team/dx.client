import React from "react";
import orderBy from "lodash/orderBy";
import { useUpdateEffect } from "react-use";
import { SortColumn } from "react-data-grid";
import PreviewTable from "app/components/Table/Preview-table";
import { tableToolBoxData } from "app/components/Table/Preview-table/data";
import { DataThemesDataTableProps } from "app/modules/dataset-upload-module/component/data-table/data";
import useGetDatasetContent from "app/hooks/useGetDatasetContent";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";

const getColumns = (
  data: {
    name: string;
    type: "percentage" | "bar" | "unique";
    data: {
      name: string;
      value: number;
    }[];
  }[]
) => {
  return data.map((d) => d.name);
};

export function DatasetDataTable(props: DataThemesDataTableProps) {
  const containerEl = React.useRef<HTMLDivElement>(null);
  const [columnDetails, _setColumnDetails] = React.useState(tableToolBoxData);
  const [sort, _setSort] = React.useState<SortColumn>({
    columnKey: "_id",
    direction: "ASC",
  });
  const [data, setData] = React.useState<
    { [key: string]: number | string | null | boolean }[]
  >([]);
  const observerTarget = React.useRef(null);
  const { isObserved } = useInfinityScroll(observerTarget);

  const {
    data: tableData,
    loading,
    refetch,
  } = useGetDatasetContent(props.datasetId, 10);

  React.useEffect(() => {
    //load data if intersection observer is triggered
    if (data.length > 0) {
      if (isObserved) {
        refetch(true);
      }
    }
  }, [isObserved]);

  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  useUpdateEffect(() => {
    setData(
      orderBy(data, sort.columnKey, sort.direction === "DESC" ? "desc" : "asc")
    );
  }, [sort]);

  return (
    <div ref={containerEl}>
      <PreviewTable
        tableData={data}
        placeUnderSubHeader
        dataStats={props.stats}
        columns={getColumns(props.stats)}
        columnDetails={columnDetails}
        dataTypes={props.dataTypes}
        observerTarget={observerTarget}
        fullScreen={props.fullScreen}
        loading={loading}
      />
    </div>
  );
}
