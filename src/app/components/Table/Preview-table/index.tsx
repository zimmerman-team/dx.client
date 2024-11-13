/** third party */
import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
/** project */
import { previewTablecss } from "app/components/Table/Preview-table/style";
import StatisticDisplay from "app/components/Table/Preview-table/statisticDisplay";
import { ReactComponent as SortIcon } from "app/modules/dataset-module/routes/upload-module/assets/sort.svg";
import StatisticalTableToolBox, {
  ColumnDetailsProps,
} from "app/components/Table/Preview-table/StatisticalTableToolBox";
import CircleLoader from "app/modules/home-module/components/Loader";

interface PreviewTableProps {
  placeUnderSubHeader?: boolean;
  columnDetails: ColumnDetailsProps;
  columns: string[];
  tableData: { [key: string]: number | string | null | boolean }[];
  dataStats: {
    name: string;
    type: "bar" | "percentage" | "unique";
    data: { name: string; value: number }[];
  }[];
  dataTypes: any;
  fullScreen?: boolean;
  observerTarget: React.MutableRefObject<null>;
  loading: boolean;
}
type IdatasStats = {
  name: string;
  type: "bar" | "percentage" | "unique";
  data: { name: string; value: number }[];
};
export default function PreviewTable(props: PreviewTableProps) {
  const [toolboxDisplay, setToolboxDisplay] = React.useState(false);
  let columns: string[] = [];
  let dataStats: IdatasStats[] = [];
  let tableData: { [key: string]: number | string | null | boolean }[] = [];

  if (props.columns.length > 0 && props.dataStats.length > 0) {
    if (props.columns.length < 5) {
      columns = [...props.columns, ...Array(5).fill("")];
      dataStats = [...props.dataStats, ...Array(5).fill("")];
    } else {
      columns = [...props.columns, ...Array(2).fill("")];
      dataStats = [...props.dataStats, ...Array(2).fill("")];
    }
  }
  if (props.tableData.length > 0 && props.tableData.length < 10) {
    tableData = [...props.tableData, ...Array(10).fill("")];
  } else {
    tableData = props.tableData;
  }

  return (
    <>
      <TableContainer
        css={`
          padding-bottom: 10px;
          padding-right: 10px;
          height: ${props.fullScreen ? "90vh" : "593px"};
          &::-webkit-scrollbar {
            height: 12px;
            border-radius: 23px;
            width: 12px;
          }
          &::-webkit-scrollbar-track {
            background: ${props.fullScreen ? "#262C34" : "#f9f9f9"};
            border-radius: 23px;

            /* padding: 0 0.5rem; */
          }
          &::-webkit-scrollbar-track:horizontal {
            /* border-right: none; */
          }
          &::-webkit-scrollbar-thumb {
            background: ${props.fullScreen ? "#f9f9f9" : "#231d2c"};
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
              outline: none !important;
            }
          }
        `}
      >
        <Table css={previewTablecss}>
          <TableHead
            css={`
              top: 0;
              position: sticky;
              background: #dadaf8;
            `}
          >
            <TableRow
              css={`
                padding: 0rem 0.4rem;
              `}
            >
              {columns.map((val, index) => {
                return (
                  <TableCell key={val + `${index}`}>
                    <div
                      title={val}
                      css={`
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 1rem;
                        width: ${val ? "auto" : "192px"};
                      `}
                    >
                      <div
                        css={`
                          width: 25px;
                          height: 25px;
                          border-radius: 50%;
                          padding: 3px;
                          justify-content: center;
                          align-items: center;
                          background: #ffffff;
                          display: ${val ? "flex" : "none"};
                        `}
                      >
                        {props.dataTypes?.[val] === "string" ? "Aa" : "#"}
                      </div>
                      <p
                        css={`
                          margin: 0;
                          overflow: clip;
                          max-width: 220px;
                          text-align: left;
                          line-height: 17px;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        `}
                      >
                        <b>{val}</b>
                      </p>
                      {val && (
                        <IconButton>
                          <SortIcon />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              {dataStats?.map((val, i) => (
                <TableCell
                  key={val.name + `${i}`}
                  css={`
                    color: #000;
                    font-size: 12px;
                    background: #f4f4f4;
                  `}
                >
                  {val.name !== "ID" && (
                    <div
                      css={`
                        background: #f4f4f4;
                      `}
                    >
                      <StatisticDisplay type={val.type} data={val.data} />
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((data, rowIndex) => (
              <TableRow
                key={Object.values(data).join("-") + `${rowIndex}`}
                css={`
                  background: #fff;
                `}
              >
                {columns.map((val, cellIndex) => (
                  <TableCell key={val + `${cellIndex}`}>
                    <p
                      title={data?.[val] as string}
                      css={`
                        margin: 0;
                        overflow: clip;
                        max-width: 220px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        min-width: ${cellIndex === 0 ? "30px" : "auto"};
                        text-align: ${cellIndex === 0 ? "center" : "left"};
                      `}
                    >
                      {data?.[val] ?? ""}
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <tr
          ref={props.observerTarget}
          css={`
            height: 1px;
          `}
        ></tr>
        <div>{props.loading ? <CircleLoader /> : null}</div>
      </TableContainer>

      {toolboxDisplay && (
        <StatisticalTableToolBox
          {...props.columnDetails}
          position={2}
          handleClose={() => setToolboxDisplay(false)}
          placeUnderSubHeader={props.placeUnderSubHeader as boolean}
        />
      )}
    </>
  );
}
