import React from "react";
// @ts-ignore
import domtoimage from "dom-to-image";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Tooltip as SpeechBubble } from "react-tooltip";
import TableContainer from "@material-ui/core/TableContainer";
import { PrintIcon } from "app/modules/user-profile-module/component/icons";
import { ReactComponent as InfoIcon } from "app/modules/user-profile-module/asset/info-icon.svg";
import { InfoSnackbar } from "app/modules/story-module/components/storySubHeaderToolbar/infosnackbar";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";

const dataCols = [
  { key: "date", label: "Date" },
  { key: "name", label: "File Name" },
  { key: "plan", label: "Plan" },
];

interface InvoiceTableProps {
  tableData: {
    id: string;
    date: string;
    url: string;
    hostedUrl: string;
    checked?: boolean;
  }[];
}

export function InvoiceTable(props: InvoiceTableProps) {
  const { tableData } = props;

  const [tableDataState, setTableDataState] = React.useState<
    InvoiceTableProps["tableData"]
  >([]);
  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const handleCheckUncheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked, "checked");
    setTableDataState((prev) => {
      return prev.map((val) => ({
        ...val,
        checked: e.target.checked,
      }));
    });
  };

  console.log(tableDataState, "tableDataState");

  const handleCheckUncheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setTableDataState((prev) => {
      const updatedData = [...prev];
      updatedData[index].checked = !updatedData[index].checked;
      return updatedData;
    });
  };

  const handleRowClick = (url: string) => (e: any) => {
    if (e.target.tagName !== "INPUT") window.open(url, "_blank");
  };

  const downloadInvoice = (invoice: any) => {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = invoice.url;
    link.download = invoice.name;
    link.target = "_blank";
    link.click();
    link.remove();
  };

  const onDownloadClick = () => {
    const isEveryItemUnchecked = tableDataState.every((val) => !val.checked);
    if (isEveryItemUnchecked) {
      setSnackbarState({ ...snackbarState, open: true });
      return;
    }
    const selectedInvoices = tableDataState.filter((val) => val.checked);
    selectedInvoices.forEach((invoice) => downloadInvoice(invoice));
  };

  const onPrintClick = () => {
    const t = document.getElementById("invoice-table");
    if (t) {
      domtoimage
        .toPng(t, {
          bgcolor: "#fff",
          filename: "dataxplorer-invoices",
        })
        .then((dataUrl: any) => {
          const link = document.createElement("a");
          link.download = "dataxplorer-invoices.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error: any) => {
          console.error("oops, something went wrong", error);
        });
    }
  };

  const isEveryItemChecked = React.useMemo(() => {
    if (tableDataState.length === 0) return false;
    return tableDataState.every((val) => val.checked);
  }, [tableDataState]);

  const table = React.useMemo(() => {
    return (
      <Table
        id="invoice-table"
        data-cy="homepage-table"
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
              width: 75px;
            }
            &:nth-of-type(2) {
              width: 105px;
            }
            &:nth-of-type(3) {
              width: 352px;
            }
            &:nth-of-type(4) {
              width: 200px;
            }
          }
        `}
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
              <Checkbox
                color="primary"
                checked={isEveryItemChecked}
                onChange={handleCheckUncheckAll}
                defaultChecked={false}
                data-cy="checkAllInvoice"
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
              onClick={handleRowClick(data.hostedUrl)}
              css={`
                &:hover {
                  cursor: pointer;
                  background: #f1f3f5;
                }
              `}
            >
              <TableCell>
                <Checkbox
                  color="primary"
                  checked={data.checked}
                  onChange={(e) => handleCheckUncheck(e, index)}
                  defaultChecked={false}
                  data-cy="check-invoice"
                />
              </TableCell>
              {dataCols.map((val) => (
                <TableCell key={val.key}>
                  <p title={val.key}>{data[val.key as keyof typeof data]}</p>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [
    isEveryItemChecked,
    handleCheckUncheckAll,
    handleCheckUncheck,
    handleRowClick,
    tableDataState,
  ]);

  React.useEffect(() => {
    setTableDataState(tableData.map((d) => ({ ...d, checked: false })));
  }, [tableData]);

  return (
    <React.Fragment>
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
            span {
              display: flex;
              align-items: center;
            }
          `}
        >
          <p>Invoices</p>
          <span className="invoice-info">
            <InfoIcon />
          </span>
          <SpeechBubble
            anchorSelect=".invoice-info"
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
          <Tooltip title="Download">
            <button onClick={onDownloadClick}>
              <SaveAlt htmlColor="#262c34" />
            </button>
          </Tooltip>
          <Tooltip title="Print">
            <button onClick={onPrintClick}>
              <PrintIcon />
            </button>
          </Tooltip>
        </div>
      </div>
      <TableContainer
        css={`
          border-radius: 8px;
        `}
      >
        {table}
      </TableContainer>
      <div
        css={`
          height: 152px;
        `}
      />
      <InfoSnackbar
        open={snackbarState.open}
        key={snackbarState.vertical + snackbarState.horizontal}
        message="Please select the invoice you want to download!"
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
      />
    </React.Fragment>
  );
}
