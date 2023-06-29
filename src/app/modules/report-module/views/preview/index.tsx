import React from "react";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { EditorState, convertFromRaw } from "draft-js";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import RowFrame from "app/modules/report-module/sub-module/rowStructure/rowFrame";
import HeaderBlock from "app/modules/report-module/sub-module/components/headerBlock";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import {
  reportContentWidthsAtom,
  reportContentHeightsAtom,
  persistedReportStateAtom,
  unSavedReportPreviewModeAtom,
} from "app/state/recoil/atoms";

export function ReportPreviewView() {
  const { page } = useParams<{ page: string }>();
  const [persistedReportState, __] = useRecoilState(persistedReportStateAtom);
  const [reportPreviewMode] = useRecoilState(unSavedReportPreviewModeAtom);

  const setReportContentWidths = useRecoilState(reportContentWidthsAtom)[1];
  const setReportContentHeights = useRecoilState(reportContentHeightsAtom)[1];

  const reportData = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
  );

  const fetchReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.fetch
  );

  const reportEditClear = useStoreActions(
    (actions) => actions.reports.ReportUpdate.clear
  );

  const reportCreateClear = useStoreActions(
    (actions) => actions.reports.ReportCreate.clear
  );

  const reportGetClear = useStoreActions(
    (actions) => actions.reports.ReportGet.clear
  );

  const [reportPreviewData, setReportPreviewData] = React.useState(reportData);

  React.useEffect(() => {
    fetchReportData({ getId: page });
  }, [page]);

  React.useEffect(() => {
    if (!reportPreviewMode) {
      setReportPreviewData(reportData);
    }
  }, [reportData]);

  React.useEffect(() => {
    if (reportData.contentWidths) {
      setReportContentWidths(reportData.contentWidths);
    }
  }, [reportData.contentWidths]);

  React.useEffect(() => {
    if (reportData.contentHeights) {
      setReportContentHeights(reportData.contentHeights);
    }
  }, [reportData.contentWidths]);

  React.useEffect(() => {
    return () => {
      reportGetClear();
      reportEditClear();
      reportCreateClear();
    };
  }, []);

  React.useEffect(() => {
    if (reportPreviewMode) {
      setReportPreviewData({
        ...reportPreviewData,

        title: persistedReportState.headerDetails.title,
        showHeader: persistedReportState.headerDetails.showHeader,
        backgroundColor: persistedReportState.headerDetails.backgroundColor,
        titleColor: persistedReportState.headerDetails.titleColor,
        descriptionColor: persistedReportState.headerDetails.descriptionColor,
        dateColor: persistedReportState.headerDetails.dateColor,
        rows: JSON.parse(persistedReportState.framesArray || "[]"),
        subTitle: JSON.parse(persistedReportState.headerDetails.description),
      });
    }
  }, [persistedReportState]);

  return (
    <div id="export-container">
      <HeaderBlock
        previewMode
        headerDetails={{
          title: reportPreviewData.title,
          showHeader: reportPreviewData.showHeader,
          description: EditorState.createWithContent(
            convertFromRaw(reportPreviewData.subTitle)
          ),
          backgroundColor: reportPreviewData.backgroundColor,
          titleColor: reportPreviewData.titleColor,
          descriptionColor: reportPreviewData.descriptionColor,
          dateColor: reportPreviewData.dateColor,
          createdDate: reportPreviewData.createdDate,
        }}
        setHeaderDetails={() => {}}
      />
      <Container id="content-container" maxWidth="lg">
        <Box height={45} />
        {reportPreviewData.rows.map((rowFrame, index) => {
          if (
            rowFrame.items &&
            rowFrame.items.length === 1 &&
            rowFrame.items[0] === ReportElementsType.DIVIDER
          ) {
            return (
              <hr
                key={index}
                css={`
                  margin: 0 0 50px 0;
                  border: 2px solid #cfd4da;
                `}
              />
            );
          }
          return (
            <RowFrame
              key={index}
              rowId={reportPreviewData.id}
              rowIndex={index}
              deleteFrame={() => {}}
              forceSelectedType={rowFrame.structure ?? undefined}
              handleRowFrameItemRemoval={() => {}}
              handleRowFrameItemAddition={() => {}}
              handleRowFrameStructureTypeSelection={() => {}}
              previewItems={rowFrame.items}
              handlePersistReportState={() => {}}
              handleRowFrameItemResize={() => {}}
            />
          );
        })}
        <Box height={45} />
      </Container>
    </div>
  );
}
