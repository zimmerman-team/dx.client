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
import { ReactComponent as SortIcon } from "app/modules/dataset-upload-module/assets/sort.svg";
import StatisticalTableToolBox, {
  ColumnDetailsProps,
} from "app/components/Table/Preview-table/StatisticalTableToolBox";

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
}

export default function PreviewTable(props: PreviewTableProps) {
  const [toolboxDisplay, setToolboxDisplay] = React.useState(false);
  return (
    <>
      <div
        css={`
          width: max-content;
        `}
      >
        <TableContainer
          css={`
            border-radius: 19px;
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
                {props.columns.map((val, index) => {
                  return (
                    <TableCell
                      key={val}
                      css={`
                        border-left: ${index == 0 ? "none" : "auto"};
                        border-top-left-radius: ${index == 0 ? "5px" : "0"};
                      `}
                    >
                      <div
                        css={`
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          gap: 1rem;
                        `}
                      >
                        <div
                          css={`
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                            padding: 3px;
                            justify-content: center;
                            display: flex;
                            align-items: center;
                            background: #ffffff;
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
                        <IconButton>
                          <SortIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                css={`
                  top: 54px;
                  position: sticky;
                  background: #f4f4f4;
                `}
              >
                {props.dataStats?.map((val) => (
                  <TableCell
                    key={val.name}
                    css={`
                      color: #000;
                      font-size: 12px;
                      // cursor: pointer;
                      background: #f4f4f4;
                    `}
                    // onClick={handleToolBoxDisplay}
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
              {props.dataStats.map((data, rowIndex) => (
                <TableRow
                  key={Object.values(data).join("-")}
                  css={`
                    background: #fff;
                  `}
                >
                  {props.columns.map((val, cellIndex) => (
                    <TableCell key={val}>
                      <p
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
                        {props.tableData?.[rowIndex]?.[val] ?? ""}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
