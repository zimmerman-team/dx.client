import React from "react";
import { v4 } from "uuid";
import { useDrop } from "react-dnd";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import useResizeObserver from "use-resize-observer";
import { useRecoilState, useRecoilValue } from "recoil";
import { GridColumns } from "app/modules/report-module/components/grid-columns";
import HeaderBlock from "app/modules/report-module/sub-module/components/headerBlock";
import { ItemComponent } from "app/modules/report-module/components/order-container";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import AddRowFrameButton from "app/modules/report-module/sub-module/rowStructure/addRowFrameButton";
import RowFrame from "app/modules/report-module/sub-module/rowStructure";
import {
  ReportCreateViewProps,
  PlaceholderProps,
} from "app/modules/report-module/views/create/data";
import {
  IRowFrameStructure,
  reportContentContainerWidth,
  isDividerOrRowFrameDraggingAtom,
} from "app/state/recoil/atoms";
import TourGuide from "app/components/Dialogs/TourGuide";
import { useTitle } from "react-use";

function ReportCreateView(props: Readonly<ReportCreateViewProps>) {
  useTitle("DX Dataxplorer - Create Report");

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const [containerWidth, setContainerWidth] = useRecoilState(
    reportContentContainerWidth
  );
  const [rowStructureType, setRowStructuretype] =
    React.useState<IRowFrameStructure>({
      index: 0,
      rowType: "",
      disableAddRowStructureButton: false,
    });

  React.useEffect(() => {
    if (props.reportType === "advanced") {
      const rowOne = v4();
      const rowTwo = v4();

      const rowFive = v4();
      props.updateFramesArray([
        {
          id: rowOne,
          frame: {
            rowId: rowOne,
            rowIndex: 0,
            forceSelectedType: "oneByFive",
            type: "rowFrame",
          },
          content: [null, null, null, null, null],
          contentWidths: [20, 20, 20, 20, 20],
          contentHeights: [121, 121, 121, 121, 121],
          contentTypes: [null, null, null, null, null],
          structure: "oneByFive",
        },
        {
          id: rowTwo,
          frame: {
            rowId: rowTwo,
            rowIndex: 1,
            forceSelectedType: "oneByOne",
            type: "rowFrame",
          },
          content: [null],
          contentWidths: [100],
          contentHeights: [400],
          contentTypes: [null],
          structure: "oneByOne",
        },

        {
          id: rowFive,
          frame: {
            rowId: rowFive,
            rowIndex: 2,
            forceSelectedType: "oneByThree",
            type: "rowFrame",
          },
          content: [null, null, null],
          contentWidths: [33, 33, 33],
          contentHeights: [460, 460, 460],
          contentTypes: [null, null, null],
          structure: "oneByThree",
        },
      ]);
    }
  }, [props.reportType]);

  React.useEffect(() => {
    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [width]);

  return (
    <div>
      <div
        css={`
          height: 55px;
        `}
      />
      <HeaderBlock
        previewMode={false}
        headerDetails={{ ...props.headerDetails }}
        setHeaderDetails={props.setHeaderDetails}
        setReportName={props.setReportName}
        reportName={props.reportName}
        hasSubHeaderTitleFocused={props.hasSubHeaderTitleFocused}
        setPlugins={props.setPlugins}
      />
      <Container maxWidth="lg">
        <div
          ref={ref}
          id="content-container"
          css={`
            position: relative;
            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            width: ${props.open
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};

            @media (max-width: 1280px) {
              width: calc(100vw - 400px);
            }
          `}
        >
          <Box height={50} />
          <TourGuide
            reportType={props.reportType ?? "basic"}
            toolBoxOpen={props.open}
            handleClose={() => {}}
            open
          />

          {props.framesArray.map((frame, index) => {
            return (
              <ItemComponent
                key={frame.id}
                id={frame.id}
                index={index}
                childrenData={props.framesArray}
              >
                <div
                  css={`
                    position: relative;
                  `}
                >
                  <RowFrame
                    {...frame.frame}
                    updateFramesArray={props.updateFramesArray}
                    framesArray={props.framesArray}
                    view={props.view}
                    rowContentHeights={frame.contentHeights}
                    rowContentWidths={frame.contentWidths}
                    previewItems={
                      frame.frame.previewItems as (string | object)[]
                    }
                    onSave={props.onSave}
                    setPlugins={props.setPlugins}
                    endReportTour={() => {}}
                  />
                </div>
                <Box height={38} />
                <PlaceHolder
                  rowId={frame.id}
                  deleteFrame={props.deleteFrame}
                  framesArray={props.framesArray}
                  updateFramesArray={props.updateFramesArray}
                />
              </ItemComponent>
            );
          })}

          {
            <AddRowFrameButton
              framesArray={props.framesArray}
              rowStructureType={rowStructureType}
              updateFramesArray={props.updateFramesArray}
              setRowStructureType={setRowStructuretype}
              endTour={() => {}}
            />
          }
          <Box height={45} />
          <GridColumns />
        </div>
      </Container>
    </div>
  );
}

export default ReportCreateView;

export const PlaceHolder = (props: PlaceholderProps) => {
  const moveCard = React.useCallback((itemId: string) => {
    props.updateFramesArray((draft) => {
      const dragIndex = draft.findIndex((frame) => frame.id === itemId);

      const dropIndex =
        props.index ?? draft.findIndex((frame) => frame.id === props.rowId) + 1;

      const fakeId = v4();
      const tempItem = draft[dragIndex];
      draft[dragIndex].id = fakeId;

      draft.splice(dropIndex, 0, tempItem);
      const fakeIndex = draft.findIndex((frame) => frame.id === fakeId);
      draft.splice(fakeIndex, 1);
    });
  }, []);
  const [{ isOver, handlerId, item: dragItem }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: [
      ReportElementsType.DIVIDER,
      ReportElementsType.ROWFRAME,
      ReportElementsType.ROW,
    ],
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
      handlerId: monitor.getHandlerId(),
    }),
    drop: (item: any, monitor) => {
      if (item.type === ReportElementsType.ROW) {
        moveCard(item.id);
      } else {
        props.updateFramesArray((draft) => {
          const tempIndex =
            props.index ??
            draft.findIndex((frame) => frame.id === props.rowId) + 1;

          const id = v4();
          draft.splice(tempIndex, 0, {
            id,
            frame: {
              rowId: id,
              rowIndex: tempIndex,

              type: item.type,
            },
            content:
              item.type === ReportElementsType.ROWFRAME ? [] : ["divider"],
            contentWidths: [],
            contentHeights: [],
            contentTypes:
              item.type === ReportElementsType.ROWFRAME ? [] : ["divider"],
            structure: null,
          });
        });
      }
    },
  }));

  const isItemDragging = useRecoilValue(isDividerOrRowFrameDraggingAtom);

  const itemDragIndex = props.framesArray.findIndex(
    (frame) => frame.id === isItemDragging.rowId
  );

  const placeholderIndex =
    props.index ??
    props.framesArray.findIndex((frame) => frame.id === props.rowId) + 1;

  const dragIndex = props.framesArray.findIndex(
    (frame) => frame.id === (dragItem as any)?.id
  );

  const placeholderActive = () => {
    if (isOver) {
      if (dragIndex === -1) {
        return true;
      }
      if (placeholderIndex === dragIndex) {
        return false;
      }
      if (placeholderIndex - 1 === dragIndex) {
        return false;
      }
      return true;
    }
    return false;
  };

  const isDroppable = () => {
    if (isItemDragging.state) {
      if (itemDragIndex === -1) {
        return true;
      }
      if (placeholderIndex === itemDragIndex) {
        return false;
      }
      if (placeholderIndex - 1 === itemDragIndex) {
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <div
      data-cy="report-row-placeholder"
      data-handler-id={handlerId}
      ref={drop}
      css={`
        width: 100%;
        height: 4px;
        display: ${isItemDragging.state ? "block" : "none"};
        background-color: ${placeholderActive() ? "#6061E5" : "#262c34"};
        opacity: ${isDroppable() ? 1 : 0.5};
      `}
    />
  );
};
