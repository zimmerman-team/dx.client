import React from "react";

/* third-party */
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
/* project */
import { Tab } from "app/components/Styled/tabs";
import ChartsGrid from "app/modules/home-module/components/AssetCollection/Charts/chartsGrid";
import ReportsGrid from "app/modules/home-module/components/AssetCollection/Reports/reportsGrid";
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

function AssetsCollection() {
  const { isAuthenticated, user } = useAuth0();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [assetsView, setAssetsView] = useRecoilState(allAssetsViewAtom);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = useRecoilState(allAssetsSortBy);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const [tabPrevPosition, setTabPrevPosition] = React.useState("");

  const handleChange = (newValue: "all" | "data" | "charts" | "reports") => {
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
      case "reports":
        return (
          <ReportsGrid
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
    all: "Explore the collection of Assets",
    data: "Explore the collection of Datasets used to create Charts",
    charts: "Explore the collection of Charts used in Reports",
    reports: "Explore the collection of Reports",
  };

  return (
    <Container maxWidth="lg">
      <div css={turnsDataCss}>
        {isAuthenticated ? (
          <h2>Welcome {user?.given_name ?? user?.name?.split(" ")[0]}</h2>
        ) : (
          <div />
        )}

        <div
          css={`
            ${rowFlexCss} gap: 8px;
            a {
              padding: 8px 24px;
            }
          `}
        >
          <Link
            to={`/dataset/new/upload${
              location.pathname === "/" ? "?fromHome=true" : ""
            }`}
            css={`
              background: #e492bd;
            `}
            data-cy="home-connect-dataset-button"
          >
            CONNECT DATASET
          </Link>
          <Link
            to="/chart/new/data"
            css={`
              background: #64afaa;
            `}
            data-cy="home-create-chart-button"
          >
            CREATE CHART
          </Link>
          <Link
            to="/report/new/initial"
            css={`
              background: #6061e5;
            `}
            data-cy="home-create-report-button"
          >
            CREATE REPORT
          </Link>
        </div>
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
          `}
        >
          <Grid item lg={6} md={6} sm={6}>
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
                active={display === "reports"}
                onClick={() => handleChange("reports")}
                data-cy="home-reports-tab"
              >
                Reports
              </Tab.Right>
            </Tab.Container>
          </Grid>
          <Grid item lg={6} md={6} sm={6}>
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
          </Grid>
        </Grid>
        <div
          css={`
            padding-top: 24px;
            font-size: 14px;
            font-family: GothamNarrow-Book;
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
