import React from "react";
import orderBy from "lodash/orderBy";
import { useUpdateEffect } from "react-use";
import { SortColumn } from "react-data-grid";
import PreviewTable from "app/components/Table/Preview-table";
import { tableToolBoxData } from "app/components/Table/Preview-table/data";
import { DataThemesDataTableProps } from "app/modules/dataset-upload-module/component/data-table/data";

const getColumns = (
  data: { [key: string]: number | string | null | boolean }[]
) => {
  let columns = [];
  for (let key in data?.[0]) {
    columns.push({ key: key, type: typeof data[0][key] });
  }
  return columns;
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

  React.useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useUpdateEffect(() => {
    setData(
      orderBy(data, sort.columnKey, sort.direction === "DESC" ? "desc" : "asc")
    );
  }, [sort]);

  return (
    <div
      ref={containerEl}
      css={`
        max-width: 100%;

        height: 593px;
        overflow: auto;
        overflow-x: scroll;
        padding-right: 20px;
        padding-bottom: 10px;
        &::-webkit-scrollbar {
          height: 12px;
          border-radius: 23px;
          width: 12px;

          background: #231d2c;
        }
        &::-webkit-scrollbar-track {
          background: #f9f9f9;

          padding: 0 0.5rem;
        }
        &::-webkit-scrollbar-track:horizontal {
          /* border-right: none; */
        }
        &::-webkit-scrollbar-thumb {
          background: #231d2c;
          border-radius: 23px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        &::-webkit-scrollbar-corner {
          background: transparent;
        }

        > div {
          border-style: none;

          * {
            border-color: rgba(0, 0, 0, 0.12);
            outline: none !important;
          }
        }
      `}
    >
      <PreviewTable
        tableData={data}
        placeUnderSubHeader
        dataStats={props.stats}
        columns={getColumns(data)}
        columnDetails={columnDetails}
      />
    </div>
  );
}
