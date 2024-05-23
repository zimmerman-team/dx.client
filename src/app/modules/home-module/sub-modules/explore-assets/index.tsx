/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Tab, Box, Grid, Tabs, Container, withStyles } from "@material-ui/core";
/* project */
import {
  chartFromReportAtom,
  homeDisplayAtom,
  persistedReportStateAtom,
  unSavedReportPreviewModeAtom,
} from "app/state/recoil/atoms";
import { featuredAssetsCss } from "app/modules/home-module/style";
import DatasetsGrid from "app/modules/home-module/components/Datasets/datasetsGrid";
import ChartsGrid from "app/modules/home-module/components/Charts/chartsGrid";
import ReportsGrid from "app/modules/home-module/components/Reports/reportsGrid";
import { datasetCategories } from "app/modules/dataset-upload-module/upload-steps/metaData";
import DatasetCategoryList from "app/modules/home-module/components/Datasets/datasetCategoryList";
import Filter from "app/modules/home-module/components/Filter";
import { useAuth0 } from "@auth0/auth0-react";
import EmpowerBlock from "../partners/components/empowerBlock";

const StyledTab = withStyles(() => ({
  root: {
    "&.MuiButtonBase-root": {
      "&.MuiTab-root": {
        width: "fit-content",
        minWidth: "fit-content",
        padding: "0px ",
        textTransform: "none",
      },
    },
    "&.MuiTab-textColorPrimary": {
      "&.Mui-selected": {
        "& .MuiTab-wrapper": {
          fontFamily: "GothamNarrow-Bold",
        },
      },
    },
  },
}))(Tab);

const StyledTabs = withStyles({
  root: {
    "& .MuiTabs-scroller": {
      "& .MuiTabs-flexContainer": {
        gap: "45px",
      },
    },
  },
})(Tabs);

export default function ExploreAssetsModule() {
  useTitle("DX DataXplorer - Explore");
  // clear persisted state
  const clearPersistedReportState = useResetRecoilState(
    persistedReportStateAtom
  );
  const clearChartFromReportState = useResetRecoilState(chartFromReportAtom);

  const [_, setReportPreviewMode] = useRecoilState(
    unSavedReportPreviewModeAtom
  );

  const { isAuthenticated } = useAuth0();

  React.useEffect(() => {
    clearPersistedReportState();
    clearChartFromReportState();
    setReportPreviewMode(false);
  }, []);
  const [categories, setCategories] = React.useState<string[]>([]);

  const [tableView, setTableView] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined
  );
  const [sortValue, setSortValue] = React.useState("updatedDate");
  const exploreViewRef = React.useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: "data" | "charts" | "reports"
  ) => {
    setDisplay(newValue);
  };

  React.useEffect(() => {
    setSearchValue(undefined);
  }, [display]);

  const descriptions = {
    data: "Explore the collection of Datasets used to create Charts",
    charts: "Explore the collection of Charts used in Reports",
    reports: "Explore the collection of Reports",
  };

  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
            categories={categories}
            addCard
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
            addCard
          />
        );
      case "reports":
        return (
          <ReportsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
            showMenuButton={false}
            addCard
          />
        );
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      {!isAuthenticated ? <EmpowerBlock view="explore" /> : <Box height={48} />}
      <Container
        maxWidth="lg"
        ref={exploreViewRef}
        css={`
          min-height: calc(100vh - 668px);
        `}
      >
        <Box height={58} />
        <Box css={featuredAssetsCss}>
          <Grid
            container
            alignContent="space-between"
            alignItems="center"
            css={`
              width: 100%;
            `}
          >
            <Grid item lg={6} md={6} sm={6}>
              <StyledTabs
                css={`
                  margin-left: 5px;
                `}
                TabIndicatorProps={{
                  style: {
                    bottom: "12px",
                    height: "2px",
                  },
                }}
                value={display}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                className="Home-MuiTabs-flexContainer"
              >
                <StyledTab disableTouchRipple label="Data" value="data" />
                <StyledTab disableTouchRipple label="Charts" value="charts" />
                <StyledTab disableTouchRipple label="Reports" value="reports" />
              </StyledTabs>
            </Grid>
            <Grid item lg={6} md={6} sm={6}>
              <Filter
                searchValue={searchValue as string}
                setSearchValue={setSearchValue}
                setSortValue={setSortValue}
                setTableView={setTableView}
                sortValue={sortValue}
                tableView={tableView}
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
              categories={categories}
              datasetCategories={datasetCategories}
              setCategories={setCategories}
            />
          ) : (
            <Box height={24} />
          )}
        </Box>

        <div>{displayGrid(searchValue as string, sortValue)}</div>
      </Container>
      <Box height={100} />
    </React.Fragment>
  );
}
