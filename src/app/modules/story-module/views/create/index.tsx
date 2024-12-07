import React from "react";
import { v4 } from "uuid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import useResizeObserver from "use-resize-observer";
import { useRecoilState } from "recoil";
import { GridColumns } from "app/modules/story-module/components/grid-columns";
import HeaderBlock from "app/modules/story-module/components/headerBlock";
import { ItemComponent } from "app/modules/story-module/components/order-container";
import AddRowFrameButton from "app/modules/story-module/components/rowStructure/addRowFrameButton";
import RowFrame from "app/modules/story-module/components/rowStructure";
import { StoryCreateViewProps } from "app/modules/story-module/views/create/data";
import {
  IRowFrameStructure,
  storyContentContainerWidth,
} from "app/state/recoil/atoms";
import TourGuide from "app/components/Dialogs/TourGuide";
import { useTitle } from "react-use";
import PlaceHolder from "app/modules/story-module/components/placeholder";

function StoryCreateView(props: Readonly<StoryCreateViewProps>) {
  useTitle("DX Dataxplorer - Create Story");

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const [containerWidth, setContainerWidth] = useRecoilState(
    storyContentContainerWidth
  );
  const [rowStructureType, setRowStructuretype] =
    React.useState<IRowFrameStructure>({
      index: 0,
      rowType: "",
      disableAddRowStructureButton: false,
    });

  React.useEffect(() => {
    if (props.storyType === "advanced") {
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
  }, [props.storyType]);

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
        isToolboxOpen={props.rightPanelOpen}
        previewMode={false}
        headerDetails={{ ...props.headerDetails }}
        setHeaderDetails={props.setHeaderDetails}
        setStoryName={props.setStoryName}
        storyName={props.storyName}
        hasStoryNameFocused={props.hasStoryNameFocused}
        setPlugins={props.setPlugins}
        handleRightPanelOpen={props.handleRightPanelOpen}
      />
      <Container maxWidth="lg">
        <div
          ref={ref}
          id="content-container"
          css={`
            position: relative;
            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            width: ${props.rightPanelOpen
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};

            @media (max-width: 1280px) {
              width: calc(100vw - 400px);
            }
          `}
        >
          <Box height={50} />
          <TourGuide
            storyType={props.storyType ?? "basic"}
            toolBoxOpen={props.rightPanelOpen}
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
                    endStoryTour={() => {}}
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

export default StoryCreateView;
