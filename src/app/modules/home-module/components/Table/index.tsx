import React from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import { useHistory } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import _ from "lodash";
import { EditorState } from "draft-js";

interface IData {
  id: string;
  name: string;
  description?: string;
  heading?: EditorState;
  createdDate: Date;
  type: string;
}
export function HomepageTable(props: {
  data: IData[];
  inChartBuilder?: boolean;
  onItemClick?: (v: string) => void;
  all?: boolean;
}) {
  const history = useHistory();

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
            <TableCell width="171px">Name</TableCell>
            {props.all && <TableCell width="55px">Type</TableCell>}
            <TableCell width="650px">Description</TableCell>
            <TableCell width="200px">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          css={`
            background: #fff;
          `}
        >
          {props.data.map((data, index) => (
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
              <TableCell>{data.name}</TableCell>
              {props.all && <TableCell>{_.capitalize(data.type)}</TableCell>}
              <TableCell>{data.description}</TableCell>
              <TableCell>
                {moment(data.createdDate).format("MMMM YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
