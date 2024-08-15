import React from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import { useHistory } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { isValidDate } from "app/utils/isValidDate";
import { IExternalDataset } from "app/modules/dataset-module/routes/upload-module/upload-steps/externalSearch";

interface IData {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  type: string;
}
export default function ExternalSearchTable(props: {
  onItemClick: (dataset: IExternalDataset) => void;
  tableData: {
    columns: { key: string; label: string; icon?: React.ReactNode }[];
    data: any[];
  };
}) {
  return (
    <TableContainer
      css={`
        border-radius: 8px;
      `}
    >
      <Table
        css={`
          border-spacing: 0;
          border-style: hidden;
          border-collapse: collapse;

          tr > td {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            border-right: 1px solid #e4e4e4;

            &:nth-of-type(1) {
              max-width: 204px;
            }
            &:nth-of-type(2) {
              max-width: 473px;
            }
            &:nth-of-type(3) {
              max-width: 103px;
            }
            &:nth-of-type(4) {
              width: 184px;
            }
          }
        `}
        data-cy="homepage-table"
      >
        <TableHead
          css={`
            background: #dadaf8;

            > tr > th {
              font-size: 14px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              border-right: 1px solid #e4e4e4;
            }
          `}
        >
          <TableRow>
            {props.tableData.columns.map((val) => (
              <TableCell key={val.key} css={``}>
                {val.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          css={`
            background: #fff;
          `}
        >
          {props.tableData.data.map((data, index) => (
            <TableRow
              key={`${data.id}-${index}`}
              onClick={() => {
                props.onItemClick(data);
              }}
              css={`
                &:hover {
                  cursor: pointer;
                  background: #f1f3f5;
                }
              `}
              data-cy={`table-row-${data.type}`}
            >
              {props.tableData.columns.map((val) => (
                <TableCell key={val.key}>
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                    `}
                  >
                    <p
                      title={data[val.key] as string}
                      css={`
                        margin: 0;
                        overflow: hidden;
                        max-width: 99%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        min-width: ${val.key === "id" ? "30px" : "auto"};
                        text-align: ${val.key === "id" ? "center" : "left"};
                      `}
                    >
                      {isValidDate(data[val.key])
                        ? moment(data[val.key]).format("MMMM YYYY")
                        : data[val.key] ?? ""}
                    </p>
                    {val.icon}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
