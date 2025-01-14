import React from "react";
import axios from "axios";
import get from "lodash/get";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { StoryModel } from "app/modules/story-module/data";
import ColoredStoryIcon from "app/assets/icons/ColoredStoryIcon";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { HomepageTable } from "app/modules/home-module/components/Table";
import DeleteStoryDialog from "app/components/Dialogs/deleteStoryDialog";
import ReformedGridItem from "app/modules/home-module/components/AssetCollection/Stories/gridItem";
import StoryAddnewCard from "./storyAddNewCard";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import { EditorState, convertFromRaw } from "draft-js";
import { useSetRecoilState } from "recoil";
import { planDialogAtom } from "app/state/recoil/atoms";
import CircleLoader from "app/modules/home-module/components/Loader";
import { getLimit } from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";

interface Props {
  sortBy: string;
  searchStr: string;
  view: "grid" | "table";
  showMenuButton?: boolean;
  addCard?: boolean;
}

export default function StoriesGrid(props: Readonly<Props>) {
  const observerTarget = React.useRef(null);
  const [cardId, setCardId] = React.useState<string>("");
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [loadedStories, setLoadedStories] = React.useState<StoryModel[]>([]);
  const limit = getLimit();
  const initialRender = React.useRef(true);
  const [offset, setOffset] = React.useState(0);
  const { isObserved } = useInfinityScroll(observerTarget);
  const token = useStoreState((state) => state.AuthToken.value);

  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const stories = useStoreState(
    (state) => (state.stories.StoryGetList.crudData ?? []) as StoryModel[]
  );
  const loadStoriesCount = useStoreActions(
    (actions) => actions.stories.StoriesCount.fetch
  );
  const storiesCount = useStoreState(
    (state) => get(state, "stories.StoriesCount.data.count", 0) as number
  );

  const loadStories = useStoreActions(
    (actions) => actions.stories.StoryGetList.fetch
  );
  const loading = useStoreState((state) => state.stories.StoryGetList.loading);
  const storiesLoadSuccess = useStoreState(
    (state) => state.stories.StoryGetList.success
  );

  const getFilterString = (fromZeroOffset?: boolean) => {
    const value =
      props.searchStr?.length > 0
        ? `"where":{"name":{"like":"${props.searchStr}.*","options":"i"}},`
        : "";
    return `filter={${value}"order":"${props.sortBy} ${
      props.sortBy === "name" ? "asc" : "desc"
    }","limit":${limit},"offset":${fromZeroOffset ? 0 : offset}}`;
  };

  const getWhereString = () => {
    return props.searchStr?.length > 0
      ? `where={"name":{"like":"${props.searchStr}.*","options":"i"}}`
      : "";
  };

  const loadData = (fromZeroOffset?: boolean) => {
    if (token) {
      loadStories({
        token,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    } else {
      loadStories({
        token,
        nonAuthCall: !token,
        storeInCrudData: true,
        filterString: getFilterString(),
      });
    }
  };

  const reloadData = () => {
    if (token) {
      loadStoriesCount({ token, filterString: getWhereString() });
    } else {
      loadStoriesCount({ nonAuthCall: true, filterString: getWhereString() });
    }
    setLoadedStories([]);
    setOffset(0);
    loadData(true);
  };

  React.useEffect(() => {
    //load data if intersection observer is triggered
    if (
      storiesCount > limit &&
      isObserved &&
      storiesLoadSuccess &&
      loadedStories.length !== storiesCount
    ) {
      //update the offset value for the next load
      setOffset(offset + limit);
    }
  }, [isObserved]);

  React.useEffect(() => {
    if (offset === 0) {
      return;
    }
    loadData();
  }, [offset, token]);

  const handleDelete = (id?: string) => {
    setModalDisplay(false);
    setEnableButton(false);
    if (!id) {
      return;
    }
    axios
      .delete(`${process.env.REACT_APP_API}/story/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
      })
      .catch((error) => {
        //TODO: handle error
      });
  };

  const handleDuplicate = (id: string) => {
    if (!id) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API}/story/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        if (response.data.planWarning) {
          setPlanDialog({
            open: true,
            message: response.data.planWarning,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        reloadData();
      })
      .catch(() => {
        //TODO: handle error
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleModal = (id: string) => {
    setCardId(id);
    setModalDisplay(true);
  };

  React.useEffect(() => {
    if (!storiesLoadSuccess) {
      return;
    }
    //update the loaded stories
    setLoadedStories((prevStories) => {
      const prevStoriesIds = prevStories.map((r) => r.id);
      const f = stories.filter((story) => !prevStoriesIds.includes(story.id));
      return [...prevStories, ...f];
    });
  }, [storiesLoadSuccess]);

  React.useEffect(() => {
    reloadData();
  }, [props.sortBy, token]);

  const [,] = useDebounce(
    () => {
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      reloadData();
    },
    500,
    [props.searchStr]
  );

  return (
    <>
      {props.view === "grid" && (
        <Grid container spacing={2}>
          {props.addCard ? <StoryAddnewCard /> : null}
          {loadedStories.map((data, index) => (
            <Grid item key={data.id} xs={12} sm={6} md={4} lg={3}>
              <ReformedGridItem
                id={data.id}
                key={data.id}
                name={data.name}
                date={data.updatedDate}
                viz={<ColoredStoryIcon />}
                color={data.backgroundColor}
                showMenuButton={props.showMenuButton}
                handleDelete={() => handleModal(data.id)}
                handleDuplicate={() => handleDuplicate(data.id)}
                heading={
                  data.heading
                    ? EditorState.createWithContent(
                        convertFromRaw(data.heading)
                      )
                    : EditorState.createEmpty()
                }
                owner={data.owner}
              />
              <Box height={16} />
            </Grid>
          ))}
        </Grid>
      )}
      {props.view === "table" && (
        <HomepageTable
          handleDelete={handleModal}
          handleDuplicate={handleDuplicate}
          tableData={{
            columns: [
              { key: "name", label: "Name" },
              { key: "title", label: "Description" },
              { key: "updatedDate", label: "Last modified" },
            ],
            data: loadedStories.map((data) => ({
              ...data,
              description: data.heading
                ? EditorState.createWithContent(convertFromRaw(data.heading))
                    .getCurrentContent()
                    .getPlainText()
                : "",
              type: "story",
            })),
          }}
        />
      )}
      <Box height={80} />
      <div ref={observerTarget} />
      {loading && <CircleLoader />}
      <DeleteStoryDialog
        cardId={cardId}
        modalDisplay={modalDisplay}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setModalDisplay}
        handleInputChange={handleInputChange}
      />
    </>
  );
}
