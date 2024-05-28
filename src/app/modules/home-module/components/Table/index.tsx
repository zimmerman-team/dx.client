import React from "react";
import moment from "moment";
import { useRecoilState } from "recoil";
import Table from "@material-ui/core/Table";
import { useHistory } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { homeDisplayAtom } from "app/state/recoil/atoms";
import TableContainer from "@material-ui/core/TableContainer";

export function HomepageTable(props: {
  data: {
    id: string;
    name: string;
    description: string;
    createdDate: Date;
  }[];
  inChartBuilder?: boolean;
  onItemClick?: (v: string) => void;
  fromHome?: boolean;
}) {
  const history = useHistory();
  const display = useRecoilState(homeDisplayAtom)[0];
  const pathBase = {
    all: "all",
    data: "dataset",
    charts: "chart",
    reports: "report",
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
            <TableCell width="400px">Name</TableCell>
            <TableCell width="550px">Description</TableCell>
            <TableCell width="200px">Creation date</TableCell>
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
                  history.push(
                    `/${pathBase[display]}/${data.id}${
                      display === "data"
                        ? `/detail?fromHome=${props.fromHome}`
                        : ""
                    }`
                  );
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
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{data.name}</TableCell>
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
