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
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MenuItems from "app/modules/home-module/components/AssetCollection/Datasets/menuItems";
import { IconButton } from "@material-ui/core";
import { assetType } from "app/modules/home-module/components/AssetCollection/All/assetsGrid";

interface IData {
  id: string;
  name: string;
  description?: string;
  createdDate: Date;
  type: string;
  isMappingValid?: boolean;
}
export function HomepageTable(
  props: Readonly<{
    inChartBuilder?: boolean;
    onItemClick?: (v: string) => void;
    all?: boolean;
    tableData: {
      columns: { key: string; label: string; icon?: React.ReactNode }[];
      data: any[];
    };
    handleDelete?: (id: string) => void;
    handleDuplicate?: (id: string, type: assetType) => void;
    setActiveAssetType?: React.Dispatch<React.SetStateAction<assetType | null>>;
  }>
) {
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

  const getEditDetailPath = (data: IData) => {
    let editDetailPath = `/${data.type}/${data.id}/edit`;
    if (data.type === "chart") {
      editDetailPath = data.isMappingValid
        ? `/${data.type}/${data.id}/customize`
        : `/${data.type}/${data.id}/mapping`;
    }
    return editDetailPath;
  };

  const [tableData, setTableData] = React.useState<any>([]);

  React.useEffect(() => {
    setTableData(
      props.tableData.data.map((data) => ({ ...data, isModalOpen: false }))
    );
  }, [props.tableData.data]);
  const handleCloseModal = (id: string) => {
    setTableData((prev: any) => {
      return prev.map((item: any) => {
        if (item.id === id) {
          return { ...item, isModalOpen: !item.isModalOpen };
        }
        return item;
      });
    });
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
            padding: 0 16px;
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
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              height: 54px;
              padding: 0 16px;
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
            <TableCell width="50px"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          css={`
            background: #fff;
          `}
        >
          {tableData.map((data: any, index: any) => (
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
                      max-width: ${props.tableData.columns.some(
                        (column) =>
                          column.key === "type" && column.label === "Type"
                      )
                        ? "300px"
                        : "500px"};

                      min-width: 100px;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      min-width: ${val.key === "id" ? "30px" : "auto"};
                      text-align: ${val.key === "id" ? "center" : "left"};
                    `}
                  >
                    {isValidDate(data[val.key])
                      ? moment(data[val.key]).format("DD/MM/YYYY HH:mm")
                      : data[val.key] ?? ""}
                  </p>
                </TableCell>
              ))}
              <TableCell
                css={`
                  position: relative;
                `}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseModal(data.id);
                  }}
                >
                  <MoreHorizIcon htmlColor="#231D2C" />
                </IconButton>
                {tableData.find(
                  (d: any) => d.isModalOpen && d.id === data.id
                ) && (
                  <MenuItems
                    type={data.type}
                    handleClose={() => handleCloseModal(data.id)}
                    handleDelete={() => {
                      props.setActiveAssetType?.(data.type);
                      props.handleDelete?.(data.id as string);
                    }}
                    handleDuplicate={() =>
                      props.handleDuplicate?.(data.id as string, data.type)
                    }
                    id={data.id}
                    owner={data.owner}
                    path={getEditDetailPath(data)}
                    top="30px"
                    right="50px"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
