import React from "react";
import get from "lodash/get";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import { useLocation, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useResizeObserver from "use-resize-observer";
import Container from "@material-ui/core/Container";
import { EditorState, convertFromRaw } from "draft-js";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { StoryModel, emptyStory } from "app/modules/story-module/data";
import RowFrame from "app/modules/story-module/components/rowStructure";
import HeaderBlock from "app/modules/story-module/components/headerBlock";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { StoryElementsType } from "app/modules/story-module/components/right-panel-create-view";
import { storyContentContainerWidth } from "app/state/recoil/atoms";
import { linkDecorator } from "app/modules/common/RichEditor/decorators";
import { useTitle } from "react-use";
import StoryUsePanel from "app/modules/story-module/components/use-story-panel";
import { PageLoader } from "app/modules/common/page-loader";

export function StoryPreviewView(
  props: Readonly<{
    setIsPreviewView: React.Dispatch<React.SetStateAction<boolean>>;
    setAutoSave: React.Dispatch<
      React.SetStateAction<{
        isAutoSaveEnabled: boolean;
      }>
    >;
  }>
) {
  useTitle(`DX DataXplorer - Story View`);

  const { page } = useParams<{ page: string }>();

  const { isLoading, isAuthenticated } = useAuth0();

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const [containerWidth, setContainerWidth] = useRecoilState(
    storyContentContainerWidth
  );

  const token = useStoreState((state) => state.AuthToken.value);

  const storyData = useStoreState(
    (state) => (state.stories.StoryGet.crudData ?? emptyStory) as StoryModel
  );

  const [isStoryLoading, setIsStoryLoading] = React.useState<boolean | null>(
    null
  );
  const loadingStoryData = useStoreState(
    (state) => state.stories.StoryGet.loading
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

  const fetchStoryData = useStoreActions(
    (actions) => actions.stories.StoryGet.fetch
  );
  const clearStoryData = useStoreActions(
    (actions) => actions.stories.StoryGet.clear
  );

  const storyEditClear = useStoreActions(
    (actions) => actions.stories.StoryUpdate.clear
  );

  const storyCreateClear = useStoreActions(
    (actions) => actions.stories.StoryCreate.clear
  );

  const storyGetClear = useStoreActions(
    (actions) => actions.stories.StoryGet.clear
  );

  React.useEffect(() => {
    props.setAutoSave({ isAutoSaveEnabled: false });

    if (isLoading) {
      return;
    }
    if (token) {
      fetchStoryData({ token, getId: page });
    } else if (!isAuthenticated) {
      fetchStoryData({ nonAuthCall: true, getId: page });
    }

    return () => {
      clearStoryData();
    };
  }, [page, token, isLoading, isAuthenticated]);

  React.useEffect(() => {
    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [width]);

  React.useEffect(() => {
    props.setIsPreviewView(true);
    return () => {
      storyGetClear();
      storyEditClear();
      storyCreateClear();
      props.setIsPreviewView(false);
    };
  }, []);

  React.useEffect(() => {
    if (!loadingStoryData && isStoryLoading === null) {
      return;
    }
    setIsStoryLoading(loadingStoryData);
  }, [loadingStoryData]);

  if (loadingStoryData || isStoryLoading === null) {
    return <PageLoader />;
  }

  if (storyError401) {
    return (
      <>
        <Box height={48} />
        <NotAuthorizedMessageModule
          asset="story"
          action="view"
          name={errorStoryName}
        />
      </>
    );
  }

  return (
    <div
      css={`
        background: white;
      `}
    >
      <HeaderBlock
        isToolboxOpen={false}
        previewMode={true}
        headerDetails={{
          title: storyData.title,
          showHeader: storyData.showHeader,
          heading: EditorState.createWithContent(
            convertFromRaw(storyData.heading ?? emptyStory.heading)
          ),
          description: EditorState.createWithContent(
            convertFromRaw(storyData.description ?? emptyStory.description)
          ),
          backgroundColor: storyData.backgroundColor,
          titleColor: storyData.titleColor,
          descriptionColor: storyData.descriptionColor,
          dateColor: storyData.dateColor,
        }}
        setPlugins={() => {}}
        setHeaderDetails={() => {}}
        handleRightPanelOpen={() => {}}
      />
      <Container id="content-container" maxWidth="lg" ref={ref}>
        <Box height={45} />

        {!storyError401 &&
          get(storyData, "rows", []).map((rowFrame, index) => {
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
            if (
              rowFrame.items &&
              rowFrame.items.length === 1 &&
              rowFrame.items[0] === StoryElementsType.DIVIDER
            ) {
              return (
                <div
                  key={`divider${index}`}
                  css={`
                    margin: 0 0 16px 0;
                    height: 2px;
                    width: 100%;
                    background-color: #cfd4da;
                  `}
                />
              );
            }

            return (
              <RowFrame
                rowId=""
                view="preview"
                type="rowFrame"
                rowIndex={index}
                framesArray={[]}
                setPlugins={() => {}}
                updateFramesArray={() => {}}
                key={`rowframe${index}`}
                endStoryTour={() => {}}
                onSave={async () => {}}
                forceSelectedType={rowFrame.structure ?? undefined}
                previewItems={rowFrame.items.map((item, index) => {
                  return contentTypes[index] === "text"
                    ? EditorState.createWithContent(
                        convertFromRaw(item as any),
                        linkDecorator
                      )
                    : item;
                })}
                rowContentHeights={
                  rowFrame.contentHeights?.heights ?? rowFrame.contentHeights
                }
                rowContentWidths={
                  rowFrame.contentWidths?.widths ?? rowFrame.contentWidths
                }
              />
            );
          })}
        <Box height={16} />
      </Container>
      {window.location.search.includes("?fromLanding=true") &&
      !isAuthenticated ? (
        <StoryUsePanel />
      ) : null}
    </div>
  );
}
