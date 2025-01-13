import React from "react";
import { v4 } from "uuid";
import Box from "@material-ui/core/Box";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import Container from "@material-ui/core/Container";
import { EditorState, convertFromRaw } from "draft-js";
import { useTitle } from "react-use";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { StoryModel, emptyStory } from "app/modules/story-module/data";
import { StoryEditViewProps } from "app/modules/story-module/views/edit/data";
import HeaderBlock from "app/modules/story-module/components/headerBlock";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { ItemComponent } from "app/modules/story-module/components/order-container";
import { StoryElementsType } from "app/modules/story-module/components/right-panel-create-view";
import AddRowFrameButton from "app/modules/story-module/components/rowStructure/addRowFrameButton";
import { GridColumns } from "app/modules/story-module/components/grid-columns";

import {
  IRowFrameStructure,
  storyContentContainerWidth,
} from "app/state/recoil/atoms";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import RowFrame from "app/modules/story-module/components/rowStructure";
import TourGuide from "app/components/Dialogs/TourGuide";
import useCookie from "@devhammed/use-cookie";
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import { PageLoader } from "app/modules/common/page-loader";
import { handleDragOverScroll } from "app/utils/handleAutoScroll";
import {
  compareFramesArrayState,
  compareHeaderDetailsState,
} from "app/modules/story-module/views/edit/compareStates";
import PlaceHolder from "app/modules/story-module/components/placeholder";

function StoryEditView(props: Readonly<StoryEditViewProps>) {
  useTitle("DX Dataxplorer - Edit Story");

  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const { isAuthenticated, user } = useAuth0();
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const [tourCookie, setTourCookie] = useCookie("tourGuide", "true");
  const [openTour, setOpenTour] = React.useState(
    tourCookie && !props.isSaveEnabled
  );
  const [containerWidth, setContainerWidth] = useRecoilState(
    storyContentContainerWidth
  );
  const [isStoryHeadingModified, setIsStoryHeadingModified] =
    React.useState(false);
  const [rowStructureType, setRowStructuretype] =
    React.useState<IRowFrameStructure>({
      index: 0,
      rowType: "",
      disableAddRowStructureButton: false,
    });

  const fetchStoryData = useStoreActions(
    (actions) => actions.stories.StoryGet.fetch
  );

  const [isStoryLoading, setIsStoryLoading] = React.useState<boolean | null>(
    null
  );

  const loadingStoryData = useStoreState(
    (state) => state.stories.StoryGet.loading
  );

  const clearStoryData = useStoreActions(
    (actions) => actions.stories.StoryGet.clear
  );
  const storyData = useStoreState(
    (state) => (state.stories.StoryGet.crudData ?? emptyStory) as StoryModel
  );

  const storyError401 = useStoreState(
    (state) =>
      get(state.stories.StoryGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.stories.StoryGet.crudData, "error", "") === "Unauthorized"
  );

  const errorStoryName = useStoreState((state) =>
    get(state.stories.StoryGet.crudData, "name", "")
  );

  function deleteFrame(id: string) {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === id);

      draft.splice(frameId, 1);
    });
  }

  React.useEffect(() => {
    if (token) {
      fetchStoryData({ token, getId: page });
    }
    return () => {
      clearStoryData();
    };
  }, [page, token]);

  React.useEffect(() => {
    if (storyData.id !== page) {
      return;
    }
    const items = storyData.rows.map((rowFrame, index) =>
      rowFrame.items.filter((item) => typeof item === "string")
    ) as string[][];
    let pickedItems: string[] = [];

    for (const element of items) {
      pickedItems = [...pickedItems, ...element];
    }
  }, [storyData]);

  React.useEffect(() => {
    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [width]);

  function handleEndStoryTour() {
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

  const getContentType = (item: string | object) => {
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
  };

  const framesArrayFromStoryData = (): IFramesArray[] => {
    return storyData.rows?.map((rowFrame, index) => {
      const contentTypes = rowFrame.items.map(getContentType);
      const content = rowFrame.items.map((item, index) => {
        return contentTypes[index] === "text"
          ? EditorState.createWithContent(convertFromRaw(item as any))
          : item;
      });
      const isDivider =
        content &&
        content.length === 1 &&
        content[0] === StoryElementsType.DIVIDER;
      const id = v4();

      return {
        id,
        structure: rowFrame.structure,
        frame: {
          rowIndex: index,
          rowId: id,
          type: isDivider ? "divider" : "rowFrame",
          forceSelectedType: rowFrame.structure ?? undefined,
          previewItems: content,
        },
        content,
        contentWidths: [...rowFrame.contentWidths?.widths],
        contentHeights: [...rowFrame.contentHeights?.heights],
        contentTypes,
      };
    });
  };

  const headerDetailsFromStoryData = () => {
    return {
      title: storyData.title,
      showHeader: storyData.showHeader,
      heading: storyData?.heading
        ? EditorState.moveFocusToEnd(
            EditorState.createWithContent(convertFromRaw(storyData?.heading))
          )
        : EditorState.moveFocusToEnd(EditorState.createEmpty()),
      description: storyData?.description
        ? EditorState.createWithContent(convertFromRaw(storyData?.description))
        : EditorState.createEmpty(),
      backgroundColor: storyData.backgroundColor,
      titleColor: storyData.titleColor,
      descriptionColor: storyData.descriptionColor,
      dateColor: storyData.dateColor,
      isUpdated: true,
    };
  };

  const hasChangesBeenMadeCheck = () => {
    if (storyData.id !== page) {
      return;
    }
    const areHeaderDetailsStatesEqual = compareHeaderDetailsState(
      props.headerDetails,
      headerDetailsFromStoryData()
    );
    const areFramesArrayStatesEqual = compareFramesArrayState(
      props.framesArray,
      framesArrayFromStoryData()
    );

    if (
      !areFramesArrayStatesEqual ||
      !areHeaderDetailsStatesEqual ||
      storyData.name !== props.storyName
    ) {
      props.setHasChangesBeenMade(true);
    }
    if (
      !isEqual(
        props.headerDetails.heading.getCurrentContent().getPlainText(),
        headerDetailsFromStoryData().heading.getCurrentContent().getPlainText()
      )
    ) {
      setIsStoryHeadingModified(true);
    }
  };

  React.useEffect(() => {
    hasChangesBeenMadeCheck();
    return () => {
      props.setHasChangesBeenMade(false);
      setIsStoryHeadingModified(false);
    };
  }, [props.framesArray, props.storyName, props.headerDetails, props.autoSave]);

  const updateStoryStatesWithStoryData = async () => {
    if (storyData.id !== page) {
      return;
    }
    props.setHasStoryNameFocused(storyData.name !== "Untitled story");
    props.setStoryName(storyData.name);
    props.setHeaderDetails(headerDetailsFromStoryData());
    props.updateFramesArray(framesArrayFromStoryData());
  };

  React.useEffect(() => {
    updateStoryStatesWithStoryData().finally(() => {
      props.setAutoSave({ isAutoSaveEnabled: true });
    });
  }, [storyData]);

  React.useEffect(() => {
    if (!loadingStoryData && isStoryLoading === null) {
      return;
    }
    setIsStoryLoading(loadingStoryData);
  }, [loadingStoryData]);

  const canEditDeleteStory = React.useMemo(() => {
    return isAuthenticated && storyData?.owner === user?.sub;
  }, [user, isAuthenticated, storyData]);

  if (loadingStoryData || isStoryLoading === null) {
    return <PageLoader />;
  }

  if (storyError401) {
    return (
      <>
        <Box height={48} />
        <NotAuthorizedMessageModule
          asset="story"
          action="edit"
          name={errorStoryName}
        />
      </>
    );
  }

  if (!canEditDeleteStory && !loadingStoryData) {
    return (
      <>
        <Box height={48} />
        <NotAuthorizedMessageModule
          asset="story"
          action="edit"
          name={storyData?.name}
        />
        ;
      </>
    );
  }

  return (
    <div onDragOver={handleDragOverScroll}>
      <div
        css={`
          height: 55px;
          transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        `}
      />
      <HeaderBlock
        previewMode={false}
        headerDetails={{
          ...props.headerDetails,
        }}
        storyName={storyData.name}
        setStoryName={props.setStoryName}
        hasStoryNameFocused={props.hasStoryNameFocused}
        sethasStoryNameFocused={props.setHasStoryNameFocused}
        setHeaderDetails={props.setHeaderDetails}
        setPlugins={props.setPlugins}
        isToolboxOpen={props.rightPanelOpen}
        handleRightPanelOpen={props.handleRightPanelOpen}
        isStoryHeadingModified={isStoryHeadingModified}
      />
      <Container maxWidth="lg">
        <div
          ref={ref}
          id="content-container"
          css={`
            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            width: ${props.rightPanelOpen
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};
            position: relative;
          `}
        >
          <Box height={50} />
          <TourGuide
            storyType={props.storyType ?? "basic"}
            toolBoxOpen={props.rightPanelOpen}
            handleClose={handleEndStoryTour}
            open={openTour}
          />

          {props.framesArray?.map((frame, index) => {
            return (
              <div key={frame.id} data-cy={`row-frame-container`}>
                {index === 0 && (
                  <PlaceHolder
                    index={index}
                    rowId={frame.id}
                    deleteFrame={deleteFrame}
                    framesArray={props.framesArray}
                    updateFramesArray={props.updateFramesArray}
                  />
                )}
                <Box height={8} />
                <ItemComponent
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
                      framesArray={props.framesArray}
                      updateFramesArray={props.updateFramesArray}
                      view={props.view}
                      rowContentHeights={frame.contentHeights}
                      rowContentWidths={frame.contentWidths}
                      setPlugins={props.setPlugins}
                      onSave={props.onSave}
                      endStoryTour={handleEndStoryTour}
                    />
                  </div>
                </ItemComponent>
                <div
                  css={`
                    height: 20px;
                  `}
                />

                <PlaceHolder
                  rowId={frame.id}
                  deleteFrame={deleteFrame}
                  framesArray={props.framesArray}
                  updateFramesArray={props.updateFramesArray}
                />
              </div>
            );
          })}

          <Box height={8} />
          <AddRowFrameButton
            framesArray={props.framesArray}
            rowStructureType={rowStructureType}
            updateFramesArray={props.updateFramesArray}
            setRowStructureType={setRowStructuretype}
            endTour={handleEndStoryTour}
          />
          <Box height={45} />
          <GridColumns />
        </div>
      </Container>
    </div>
  );
}

export default StoryEditView;
