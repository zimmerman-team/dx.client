/* third-party */
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useTitle from "react-use/lib/useTitle";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Box, Grid, Container, IconButton, Popover } from "@material-ui/core";
/* project */
import { Tab } from "app/components/Styled/tabs";
import HomeFooter from "app/modules/home-module/components/Footer";
import ChartsGrid from "app/modules/home-module/components/Charts/chartsGrid";
import ReportsGrid from "app/modules/home-module/components/Reports/reportsGrid";
import DatasetsGrid from "app/modules/home-module/components/Datasets/datasetsGrid";
import { ReactComponent as SortIcon } from "app/modules/home-module/assets/sort-fill.svg";
import { ReactComponent as GridIcon } from "app/modules/home-module/assets/grid-fill.svg";
import { ReactComponent as CloseIcon } from "app/modules/home-module/assets/close-icon.svg";
import { ReactComponent as SearchIcon } from "app/modules/home-module/assets/search-fill.svg";
import {
  homeDisplayAtom,
  persistedReportStateAtom,
  chartFromReportAtom,
  unSavedReportPreviewModeAtom,
} from "app/state/recoil/atoms";
import {
  featuredAssetsCss,
  iconButtonCss,
  rowFlexCss,
  searchInputCss,
  sortByItemCss,
  turnsDataCss,
} from "app/modules/home-module/style";
import DatasetCategoryList from "./components/Datasets/datasetCategoryList";
import { datasetCategories } from "../dataset-upload-module/upload-steps/metaData";
import AssetsGrid from "./components/All/assetsGrid";
import BreadCrumbs from "./components/Breadcrumbs";
import SmallFooter from "./components/Footer/smallFooter";

export default function HomeModule() {
  useTitle("DX DataXplorer");

  const { isAuthenticated, user } = useAuth0();

  // clear persisted states
  const clearPersistedReportState = useResetRecoilState(
    persistedReportStateAtom
  );
  const clearChartFromReportState = useResetRecoilState(chartFromReportAtom);

  const setReportPreviewMode = useRecoilState(unSavedReportPreviewModeAtom)[1];

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
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = React.useState("updatedDate");
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const exploreViewRef = React.useRef<HTMLDivElement>(null);

  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const [tabPrevPosition, setTabPrevPosition] = React.useState("");

  const sortOptions = [
    { label: "Last updated", value: "updatedDate" },
    { label: "Created date", value: "createdDate" },
    { label: "Name", value: "name" },
  ];

  const handleChange = (newValue: "all" | "data" | "charts" | "reports") => {
    setDisplay(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  React.useEffect(() => {
    setSearchValue(undefined);
  }, [display]);

  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
            categories={categories}
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
          />
        );
      case "reports":
        return (
          <ReportsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
            showMenuButton={false}
          />
        );
      case "all":
        return (
          <AssetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={tableView}
            showMenuButton={false}
          />
        );
      default:
        break;
    }
  };

  const exploreReportClick = () => {
    setDisplay("reports");
    exploreViewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCloseSortPopover = () => {
    setSortPopoverAnchorEl(null);
  };

  const openSortPopover = Boolean(sortPopoverAnchorEl);

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
    <div
      css={`
        margin-top: 48px;
        padding-top: 32px;
      `}
    >
      <Container
        maxWidth="lg"
        ref={exploreViewRef}
        css={`
          min-height: calc(100vh - 133px);
        `}
      >
        <div css={turnsDataCss}>
          {isAuthenticated ? (
            <h1>Welcome {user?.given_name ?? user?.name?.split(" ")[0]}</h1>
          ) : (
            <div />
          )}

          <div
            css={`
              ${rowFlexCss} gap: 8px;
              /* width: 100%; */
            `}
          >
            <Link
              to="/dataset/new/upload"
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
              <div
                css={`
                  ${rowFlexCss}
                  justify-content: flex-end;
                  gap: 8px;
                `}
              >
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  `}
                >
                  <div css={searchInputCss(openSearch)}>
                    <input
                      type="text"
                      ref={inputRef}
                      value={searchValue ?? ""}
                      placeholder="eg. Kenya"
                      onChange={handleSearch}
                      data-cy="home-search-input"
                    />
                    <IconButton
                      onClick={() => {
                        setSearchValue("");
                        setOpenSearch(false);
                      }}
                      css={`
                        &:hover {
                          background: transparent;
                        }
                      `}
                    >
                      <CloseIcon
                        css={`
                          margin-top: 1px;
                        `}
                      />
                    </IconButton>
                  </div>
                  <IconButton
                    onClick={() => {
                      setOpenSearch(true);
                      inputRef.current?.focus();
                    }}
                    css={iconButtonCss(openSearch)}
                    data-cy="home-search-button"
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    setSortPopoverAnchorEl(
                      sortPopoverAnchorEl ? null : event.currentTarget
                    );
                  }}
                  css={iconButtonCss(openSortPopover)}
                >
                  <SortIcon />
                </IconButton>
                <Popover
                  open={openSortPopover}
                  anchorEl={sortPopoverAnchorEl}
                  onClose={handleCloseSortPopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  css={`
                    .MuiPaper-root {
                      border-radius: 5px;
                    }
                  `}
                >
                  <div
                    css={`
                      color: #fff;
                      font-size: 12px;
                      padding: 8px 22px;
                      background: #231d2c;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                    `}
                  >
                    Sort by
                  </div>
                  {sortOptions.map((option) => (
                    <div
                      key={option.label}
                      css={sortByItemCss(sortValue === option.value)}
                      onClick={() => {
                        setSortValue(option.value);
                        handleCloseSortPopover();
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </Popover>
                <IconButton
                  onClick={() => {
                    setTableView(!tableView);
                  }}
                  css={iconButtonCss(tableView)}
                >
                  <GridIcon />
                </IconButton>
              </div>
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
      <SmallFooter />
    </div>
  );
}
