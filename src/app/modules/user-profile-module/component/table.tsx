import React from "react";
import Table from "@material-ui/core/Table";
import { ReactComponent as InfoIcon } from "app/modules/user-profile-module/asset/info-icon.svg";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { Checkbox, Tooltip } from "@material-ui/core";
import { SaveAlt } from "@material-ui/icons";
import { PrintIcon } from "./icons";
import { Tooltip as SpeechBubble } from "react-tooltip";
import { InfoSnackbar } from "app/modules/report-module/components/reportSubHeaderToolbar/infosnackbar";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";

interface IData {
  id: string;
  name: string;
  description?: string;
  createdDate: Date;
  type: string;
}
export function InvoiceTable() {
  const dataCols = [
    { key: "date", label: "Date" },
    { key: "fileName", label: "File Name" },
    { key: "plan", label: "Plan" },
  ];
  const date = "20/03/2021";
  const tableData = [
    {
      id: "1",
      // eslint-disable-next-line sonarjs/no-duplicate-string
      date,
      fileName: "Invoice 0112",
      plan: "Pro",
      checked: false,
    },
    {
      id: "2",
      date,
      fileName: "Invoice 0111",
      plan: "Pro",
      checked: false,
    },
    {
      id: "3",
      date,
      fileName: "Invoice 0110",
      plan: "Pro",
      checked: false,
    },
    {
      id: "4",
      date,
      fileName: "Invoice 0109",
      plan: "Pro",
      checked: false,
    },
    {
      id: "5",
      date,
      fileName: "Invoice 0108",
      plan: "Invoice 0108",
      checked: false,
    },
    {
      id: "6",
      date,
      fileName: "Invoice 0107",
      plan: "Invoice 0107",
      checked: false,
    },
  ];
  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const [tableDataState, setTableDataState] = React.useState(tableData);
  const [allChecked, setAllChecked] = React.useState(false);
  const handleCheckUncheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllChecked(e.target.checked);
    if (e.target.checked) {
      setTableDataState((prev) => {
        return prev.map((val) => ({
          ...val,
          checked: true,
        }));
      });
    } else {
      setTableDataState((prev) => {
        return prev.map((val) => ({
          ...val,
          checked: false,
        }));
      });
    }
  };
  const handleCheckUncheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.checked) {
      setAllChecked(false);
    }
    setTableDataState((prev) => {
      const updatedData = [...prev];
      updatedData[index].checked = !updatedData[index].checked;
      return updatedData;
    });
  };

  const handleDownload = () => {
    const isEveryItemUnchecked = tableDataState.every((val) => !val.checked);
    if (isEveryItemUnchecked) {
      setSnackbarState({ ...snackbarState, open: true });
    } else {
      console.log("Downloaded");
    }
  };

  console.log("tableDataState", tableDataState);

  return (
    <>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            gap: 28px;
            display: flex;
            align-items: center;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            a {
              display: flex;
              align-items: center;
            }
          `}
        >
          <p>Invoices</p>
          <a href="." className="report-panel-info">
            <InfoIcon />
          </a>
          <SpeechBubble
            anchorSelect=".report-panel-info"
            place="right"
            style={{
              background: "#231D2C",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "GothamNarrow-Medium, 'Helvetica Neue', sans-serif",
              width: "200px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            Quick access to your invoices.
          </SpeechBubble>
        </div>
        <div
          css={`
            gap: 28px;
            display: flex;
            align-items: center;
            button {
              flex: 0 1 auto;
              background: transparent !important;
            }
          `}
        >
          <button onClick={handleDownload}>
            <Tooltip title="Download">
              <SaveAlt htmlColor="#262c34" />
            </Tooltip>
          </button>
          <button>
            <Tooltip title="Print">
              <PrintIcon />
            </Tooltip>
          </button>
        </div>
      </div>
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
              padding: 0px 16px;
              height: 56px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &:nth-of-type(1) {
                /* width: 75px; */
              }
              &:nth-of-type(2) {
                width: 135px;
              }
              &:nth-of-type(3) {
                width: 352px;
              }
              &:nth-of-type(4) {
                width: 200px;
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
                padding: 0px 16px;
                height: 56px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              }
            `}
          >
            <TableRow>
              <TableCell>
                {" "}
                <Checkbox
                  color="primary"
                  checked={allChecked}
                  onChange={handleCheckUncheckAll}
                />
              </TableCell>
              {dataCols.map((val) => (
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
            {tableDataState.map((data, index) => (
              <TableRow
                key={data.id}
                css={`
                  &:hover {
                    cursor: pointer;
                    background: #f1f3f5;
                  }
                `}
              >
                <TableCell>
                  {" "}
                  <Checkbox
                    color="primary"
                    checked={data.checked}
                    onChange={(e) => handleCheckUncheck(e, index)}
                  />
                </TableCell>
                {dataCols.map((val) => (
                  <TableCell key={val.key}>
                    <p title={data[val.key as keyof typeof data] as string}>
                      {data[val.key as keyof typeof data]}
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        css={`
          height: 152px;
        `}
      />
      <InfoSnackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={`Please select the invoice you want to print!`}
        key={snackbarState.vertical + snackbarState.horizontal}
      />
    </>
  );
}
