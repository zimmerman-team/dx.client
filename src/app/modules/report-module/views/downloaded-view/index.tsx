import React from "react";
import { ReportPreviewView } from "app/modules/report-module/views/preview/";
import { ReactComponent as LogoIcon } from "app/modules/home-module/components/Footer/asset/logo.svg";
import { exportPage } from "app/utils/exportPage";
import { Link, useLocation } from "react-router-dom";
import { useStoreState } from "app/state/store/hooks";
import { emptyReport, ReportModel } from "app/modules/report-module/data";
import { useRecoilValue } from "recoil";
import { loadedChartsInReportAtom } from "app/state/recoil/atoms";

export default function DownloadedView(props: {
  setIsPreviewView: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
}) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reportData = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
  );
  const loadedChartsInReport = useRecoilValue(loadedChartsInReportAtom);

  const getNumberOfRequests = () => {
    let numberOfRequests = 0;
    if (reportData.id) {
      reportData.rows.forEach((row) => {
        row.items.forEach((item) => {
          if (item && typeof item === "string" && item !== "divider") {
            console.log("item: ", item, numberOfRequests);
            numberOfRequests++;
          }
        });
      });
      return numberOfRequests;
    }
  };

  React.useEffect(() => {
    document.getElementById("app-bar-desktop")?.remove(); // Remove the app bar
    if (!reportData.id) return;
    let timeout: NodeJS.Timeout;
    console.log("count ", loadedChartsInReport.length, getNumberOfRequests());
    if (loadedChartsInReport.length === getNumberOfRequests()) {
      if (getNumberOfRequests() === 0) {
        timeout = setTimeout(() => {
          exportPage(
            queryParams.get("type") ?? "",
            "",
            queryParams.get("filename") ?? ""
          );
        }, 500);
      } else {
        exportPage(
          queryParams.get("type") ?? "",
          "",
          queryParams.get("filename") ?? ""
        );
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [reportData.id, loadedChartsInReport]);

  return (
    <div
      id="export-container"
      css={`
        background: #fff;
      `}
    >
      {" "}
      <Link
        to="/"
        css={`
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 38px;
          text-decoration: none;
        `}
      >
        <LogoIcon />
      </Link>
      <ReportPreviewView
        setIsPreviewView={props.setIsPreviewView}
        setAutoSave={props.setAutoSave}
      />
      <Link
        to="/"
        css={`
          height: 32px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 38px;
          text-decoration: none;
        `}
      >
        <LogoIcon />
      </Link>
    </div>
  );
}
