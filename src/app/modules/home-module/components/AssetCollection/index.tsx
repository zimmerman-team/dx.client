import React from "react";

/* third-party */
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
/* project */
import { Tab } from "app/components/Styled/tabs";
import ChartsGrid from "app/modules/home-module/components/AssetCollection/Charts/chartsGrid";
import StoriesGrid from "app/modules/home-module/components/AssetCollection/Stories/storiesGrid";
import DatasetsGrid from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import {
  homeDisplayAtom,
  allAssetsViewAtom,
  allAssetsSortBy,
} from "app/state/recoil/atoms";
import {
  featuredAssetsCss,
  rowFlexCss,
  turnsDataCss,
} from "app/modules/home-module/style";
import DatasetCategoryList from "app/modules/home-module/components/AssetCollection/Datasets/datasetCategoryList";
import { datasetCategories } from "app/modules/dataset-module/routes/upload-module/upload-steps/metaData";
import AssetsGrid from "app/modules/home-module/components/AssetCollection/All/assetsGrid";
import BreadCrumbs from "app/modules/home-module/components/Breadcrumbs";
import Filter from "app/modules/home-module/components/Filter";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";

function AssetsCollection() {
  const { isAuthenticated, user } = useAuth0();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [assetsView, setAssetsView] = useRecoilState(allAssetsViewAtom);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = useRecoilState(allAssetsSortBy);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const [tabPrevPosition, setTabPrevPosition] = React.useState("");

  const { handleClick } = useCheckUserPlan();

  const history = useHistory();

  const handleChange = (newValue: "all" | "data" | "charts" | "stories") => {
    setDisplay(newValue);
  };

  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            categories={categories}
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
          />
        );
      case "stories":
        return (
          <StoriesGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
          />
        );
      case "all":
        return (
          <AssetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
          />
        );
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (display === "all" || display === "data") {
      setTabPrevPosition("left");
    } else {
      setTabPrevPosition("right");
    }
  }, [display]);

  const descriptions = {
    all: "Explore stories collection of Assets",
    data: "Explore stories collection of Datasets ",
    charts: "Explore stories collection of Charts ",
    stories: "Explore stories collection of Stories",
  };

  const shareData = {
    title: "MDN",
    text: "Best Seller Book chart",
    url: "http://localhost:3000/chart/6796530b8f00e1006902376d",
  };

  return (
    <Container maxWidth="lg">
      <div css={turnsDataCss}>
        {isAuthenticated ? (
          <Grid container>
            <Grid item lg={5} md={5} sm={12} xs={11}>
              <h2>Welcome {user?.given_name ?? user?.name?.split(" ")[0]}</h2>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              sm={12}
              xs={1}
              css={`
                @media (max-width: 965px) {
                  margin-top: 16px;
                  @media (max-width: 767px) {
                    display: none;
                  }
                }
              `}
            >
              <div
                css={`
                  display: flex;
                  width: 100%;
                  justify-content: flex-end;
                  align-items: center;
                  gap: 8px;
                  a,
                  button {
                    padding: 8px 24px;
                    white-space: nowrap;
                    @media (max-width: 700px) {
                      font-size: 12px;
                      padding: 8px 19px;
                    }
                  }
                `}
              >
                <button
                  css={`
                    background: #e492bd;
                  `}
                  data-cy="home-connect-dataset-button"
                  onClick={() =>
                    handleClick("dataset", () =>
                      history.push(
                        `/dataset/new/upload${
                          window.location.pathname === "/"
                            ? "?fromHome=true"
                            : ""
                        }`
                      )
                    )
                  }
                >
                  CONNECT DATASET
                </button>
                <button
                  css={`
                    background: #64afaa;
                  `}
                  data-cy="home-create-chart-button"
                  onClick={() =>
                    handleClick("chart", () => history.push("/chart/new/data"))
                  }
                >
                  CREATE CHART
                </button>
                <button
                  css={`
                    background: #6061e5;
                  `}
                  data-cy="home-create-story-button"
                  onClick={() =>
                    handleClick("story", () =>
                      history.push("/story/new/initial")
                    )
                  }
                >
                  CREATE STORY
                </button>
              </div>
            </Grid>
          </Grid>
        ) : (
          <div />
        )}
      </div>
      <Box height={24} />
      <Box css={featuredAssetsCss}>
        <BreadCrumbs items={[{ title: "Library" }]} />
        <Box height={24} />
        <Grid
          container
          alignContent="space-between"
          alignItems="center"
          css={`
            width: 100%;
            @media (max-width: 599px) {
              flex-flow: wrap-reverse;
            }
          `}
        >
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Tab.Container>
              <Tab.Left
                active={display === "all"}
                onClick={() => handleChange("all")}
                data-cy="home-all-tab"
              >
                All
              </Tab.Left>
              <Tab.Center
                active={display === "data"}
                onClick={() => handleChange("data")}
                position={tabPrevPosition}
                data-cy="home-data-tab"
              >
                Data
              </Tab.Center>
              <Tab.Center
                active={display === "charts"}
                onClick={() => handleChange("charts")}
                position={tabPrevPosition}
                data-cy="home-charts-tab"
              >
                Charts
              </Tab.Center>

              <Tab.Right
                active={display === "stories"}
                onClick={() => handleChange("stories")}
                data-cy="home-stories-tab"
              >
                Stories
              </Tab.Right>
            </Tab.Container>
          </Grid>

          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Filter
              searchValue={searchValue as string}
              setSearchValue={setSearchValue}
              setSortValue={setSortValue}
              setAssetsView={setAssetsView}
              sortValue={sortValue}
              assetsView={assetsView}
              openSearch={openSearch}
              setOpenSearch={setOpenSearch}
              searchIconCypressId="home-search-button"
            />
            <div
              css={`
                display: none;
                @media (max-width: 599px) {
                  height: 20px;
                  display: block;
                }
              `}
            />
          </Grid>
        </Grid>
        <div
          css={`
            padding-top: 24px;
            font-size: 14px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            color: #000000;
          `}
        >
          {descriptions[display]}
        </div>
        {display === "data" ? (
          <DatasetCategoryList
            datasetCategories={datasetCategories}
            setCategories={setCategories}
            categories={categories}
          />
        ) : (
          <Box height={24} />
        )}
      </Box>
      <div
        id="scrollableDiv"
        css={`
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}
      >
        {displayGrid(searchValue as string, sortValue)}
      </div>
    </Container>
  );
}

export default AssetsCollection;
