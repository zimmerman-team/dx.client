import React from "react";
import { v4 } from "uuid";
import Box from "@material-ui/core/Box";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import Container from "@material-ui/core/Container";
import { EditorState, RawDraftContentState, convertFromRaw } from "draft-js";
import { useUpdateEffect } from "react-use";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { PlaceHolder } from "app/modules/report-module/views/create";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import { ReportEditViewProps } from "app/modules/report-module/views/edit/data";
import HeaderBlock from "app/modules/report-module/sub-module/components/headerBlock";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { ReportOrderContainer } from "app/modules/report-module/components/order-container";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import AddRowFrameButton from "app/modules/report-module/sub-module/rowStructure/addRowFrameButton";
import { GridColumns } from "app/modules/report-module/components/grid-columns";

import {
  IRowFrameStructure,
  persistedReportStateAtom,
  reportContentContainerWidth,
  reportCreationTourStepAtom,
} from "app/state/recoil/atoms";
import { IFramesArray } from "../create/data";
import RowFrame from "../../sub-module/rowStructure";
import TourGuide from "app/components/Dialogs/TourGuide";
import useCookie from "@devhammed/use-cookie";
import { get } from "lodash";

function ReportEditView(props: ReportEditViewProps) {
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const [tourCookie, setTourCookie] = useCookie("tourGuide", "true");
  const [openTour, setOpenTour] = React.useState(
    tourCookie && !props.isSaveEnabled
  );

  const [containerWidth, setContainerWidth] = useRecoilState(
    reportContentContainerWidth
  );

  const [persistedReportState] = useRecoilState(persistedReportStateAtom);
  const [rowStructureType, setRowStructuretype] =
    React.useState<IRowFrameStructure>({
      index: 0,
      rowType: "",
      disableAddRowStructureButton: false,
    });

  const fetchReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.fetch
  );

  const clearReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.clear
  );
  const reportData = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
  );

  const reportError401 = useStoreState(
    (state) => state.reports.ReportGet.errorData
  );

  function deleteFrame(id: string) {
    props.setFramesArray((prev) => {
      let tempPrev = prev.map((item) => ({ ...item }));
      const frameId = prev.findIndex((frame) => frame.id === id);

      tempPrev.splice(frameId, 1);
      return [...tempPrev];
    });
  }

  React.useEffect(() => {
    if (token) {
      fetchReportData({ token, getId: page });
    }
    props.setAutoSave(true);
    return () => {
      clearReportData();
    };
  }, [page, token]);

  React.useEffect(() => {
    if (props.localPickedCharts.length === 0) {
      const items = reportData.rows.map((rowFrame, index) =>
        rowFrame.items.filter((item) => typeof item === "string")
      ) as string[][];
      let pickedItems: string[] = [];

      for (const element of items) {
        pickedItems = [...pickedItems, ...element];
      }
    }
  }, []);

  React.useEffect(() => {
    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [width]);

  function handleEndReportTour() {
    setTourCookie("false", {
      expires: 31536000 * 20,
      domain: "",
      path: "",
      secure: false,
      httpOnly: false,
      maxAge: 0,
      sameSite: "",
    });
    setOpenTour(false);
  }

  useUpdateEffect(() => {
    if (JSON.parse(persistedReportState.framesArray || "[]").length < 1) {
      props.setHasSubHeaderTitleFocused(reportData.name !== "Untitled report");
      props.setReportName(reportData.name);
      props.setHeaderDetails({
        title: reportData.title,
        showHeader: reportData.showHeader,
        description: reportData?.subTitle
          ? EditorState.createWithContent(
              convertFromRaw(reportData?.subTitle as RawDraftContentState)
            )
          : EditorState.createEmpty(),
        backgroundColor: reportData.backgroundColor,
        titleColor: reportData.titleColor,
        descriptionColor: reportData.descriptionColor,
        dateColor: reportData.dateColor,
      });

      const newFrameArray: IFramesArray[] = reportData.rows?.map(
        (rowFrame, index) => {
          const contentTypes = rowFrame.items.map((item) => {
            if (item === null) {
              return null;
            }
            if (get(item, "embedUrl", null)) {
              return "video";
            } else if (get(item, "imageUrl", null)) {
              return "image";
            } else if (typeof item === "object") {
              return "text";
            } else {
              return "chart";
            }
          });
          const content = rowFrame.items.map((item, index) => {
            return contentTypes[index] === "text"
              ? EditorState.createWithContent(convertFromRaw(item as any))
              : item;
          });
          const isDivider =
            content &&
            content.length === 1 &&
            content[0] === ReportElementsType.DIVIDER;
          const id = v4();

          return {
            id,
            structure: rowFrame.structure,
            frame: {
              rowIndex: index,
              rowId: id,
              handlePersistReportState: props.handlePersistReportState,
              handleRowFrameItemResize: props.handleRowFrameItemResize,
              type: isDivider ? "divider" : "rowFrame",
              forceSelectedType: rowFrame.structure ?? undefined,
              previewItems: content,
            },
            content,
            contentWidths: rowFrame.contentWidths?.widths ?? [],
            contentHeights: rowFrame.contentHeights?.heights ?? [],
            contentTypes,
          };
        }
      );
      props.setFramesArray(newFrameArray);
    }
  }, [reportData]);

  // console.log(reportError401, "reportError401");
  if (reportError401) {
    return <NotAuthorizedMessageModule asset="report" />;
  }

  return (
    <div>
      <div
        css={`
          height: ${props.isEditorFocused ? "55px" : "0px"};
          transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        `}
      />
      <HeaderBlock
        previewMode={false}
        headerDetails={{
          ...props.headerDetails,
          createdDate: reportData.createdDate,
        }}
        reportName={reportData.name}
        setReportName={props.setReportName}
        hasSubHeaderTitleFocused={props.hasSubHeaderTitleFocused}
        setHasSubHeaderTitleFocused={props.setHasSubHeaderTitleFocused}
        setHeaderDetails={props.setHeaderDetails}
        isEditorFocused={props.isEditorFocused}
        setIsEditorFocused={props.setIsEditorFocused}
        setPlugins={props.setPlugins}
      />
      <Container maxWidth="lg">
        <div
          ref={ref}
          id="content-container"
          css={`
            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            width: ${props.open
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};
            position: relative;
            @media (max-width: 1280px) {
              width: calc(100vw - 400px);
            }
          `}
        >
          <Box height={50} />
          <TourGuide
            reportType={props.reportType ?? "basic"}
            toolBoxOpen={props.open}
            handleClose={handleEndReportTour}
            open={openTour}
          />
          <ReportOrderContainer
            enabled
            childrenData={props.framesArray}
            setFramesArray={props.setFramesArray}
          >
            {props.framesArray?.map((frame, index) => {
              return (
                <div key={frame.id}>
                  {index === 0 && (
                    <PlaceHolder
                      index={index}
                      rowId={frame.id}
                      deleteFrame={deleteFrame}
                      framesArray={props.framesArray}
                      setFramesArray={props.setFramesArray}
                      handlePersistReportState={props.handlePersistReportState}
                      handleRowFrameItemResize={props.handleRowFrameItemResize}
                    />
                  )}
                  <RowFrame
                    {...frame.frame}
                    framesArray={props.framesArray}
                    setFramesArray={props.setFramesArray}
                    view={props.view}
                    rowContentHeights={frame.contentHeights}
                    rowContentWidths={frame.contentWidths}
                    isEditorFocused={props.isEditorFocused}
                    setIsEditorFocused={props.setIsEditorFocused}
                    setPlugins={props.setPlugins}
                    endReportTour={handleEndReportTour}
                  />
                  <Box height={38} />

                  <PlaceHolder
                    rowId={frame.id}
                    deleteFrame={deleteFrame}
                    framesArray={props.framesArray}
                    setFramesArray={props.setFramesArray}
                    handlePersistReportState={props.handlePersistReportState}
                    handleRowFrameItemResize={props.handleRowFrameItemResize}
                  />
                </div>
              );
            })}
          </ReportOrderContainer>
          <AddRowFrameButton
            framesArray={props.framesArray}
            rowStructureType={rowStructureType}
            setFramesArray={props.setFramesArray}
            setRowStructureType={setRowStructuretype}
            handlePersistReportState={props.handlePersistReportState}
            handleRowFrameItemResize={props.handleRowFrameItemResize}
            endTour={handleEndReportTour}
          />
          <Box height={45} />
          <GridColumns />
        </div>
      </Container>
    </div>
  );
}

export default withAuthenticationRequired(ReportEditView);
