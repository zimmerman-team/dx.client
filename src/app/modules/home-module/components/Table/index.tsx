import React from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import { useHistory, useLocation } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { isValidDate } from "app/utils/isValidDate";

interface IData {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  type: string;
}
export function HomepageTable(props: {
  inChartBuilder?: boolean;
  onItemClick?: (v: string) => void;
  all?: boolean;
  tableData: {
    columns: { key: string; label: string; icon?: React.ReactNode }[];
    data: any[];
  };
}) {
  const history = useHistory();

  const location = useLocation();

  const getDestinationPath = (data: IData) => {
    let destinationPath = `/${data.type}/${data.id}`;
    if (data.type === "dataset") {
      destinationPath = `/${data.type}/${data.id}/detail?${
        location.pathname === "/" ? "fromHome=true" : ""
      }`;
    }
    return destinationPath;
  };

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
            &:nth-of-type(1) {
              max-width: 50px;
            }
            &:nth-of-type(2) {
              max-width: 400px;
            }
            &:nth-of-type(3) {
              max-width: 550px;
            }
            &:nth-of-type(4) {
              max-width: 200px;
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
              font-family: "GothamNarrow-Bold", sans-serif;
            }
          `}
        >
          <TableRow>
            <TableCell width="50px"></TableCell>
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
              key={data.id}
              onClick={() => {
                if (!props.inChartBuilder) {
                  history.push(getDestinationPath(data));
                } else if (props.inChartBuilder && props.onItemClick) {
                  props.onItemClick(data.id);
                }
              }}
              css={`
                &:hover {
                  cursor: pointer;
                  background: #f1f3f5;
                }
              `}
              data-cy={`table-row-${data.type}`}
            >
              <TableCell>{index + 1}</TableCell>
              {props.tableData.columns.map((val) => (
                <TableCell key={val.key}>
                  <p
                    title={data[val.key] as string}
                    css={`
                      margin: 0;
                      overflow: clip;
                      max-width: 220px;
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
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
