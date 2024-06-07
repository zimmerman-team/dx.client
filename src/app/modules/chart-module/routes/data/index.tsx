/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useParams, useHistory } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
/* project */
import {
  iconButtonCss,
  rowFlexCss,
  searchInputCss,
  sortByItemCss,
} from "app/modules/home-module/style";
import { datasetCategories } from "app/modules/dataset-upload-module/upload-steps/metaData";
import DatasetsGrid from "app/modules/home-module/components/Datasets/datasetsGrid";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ReactComponent as SortIcon } from "app/modules/home-module/assets/sort-fill.svg";
import { ReactComponent as GridIcon } from "app/modules/home-module/assets/grid-fill.svg";
import { ReactComponent as CloseIcon } from "app/modules/home-module/assets/close-icon.svg";
import { ReactComponent as SearchIcon } from "app/modules/home-module/assets/search-fill.svg";
import DatasetCategoryList from "app/modules/home-module/components/Datasets/datasetCategoryList";
import { ChartRenderedItem } from "app/modules/chart-module/data";
import { ChartAPIModel, emptyChartAPI } from "../../data";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";

function ChartModuleDataView(
  props: Readonly<{
    loadDataset: (endpoint: string) => Promise<boolean>;
    toolboxOpen: boolean;
    setChartFromAPI: (
      value: React.SetStateAction<ChartRenderedItem | null>
    ) => void;
  }>
) {
  useTitle("DX DataXplorer - Select Data");

  const history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const { page } = useParams<{ page: string }>();

  const [categories, setCategories] = React.useState<string[]>([]);
  const [tableView, setTableView] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<undefined | string>(
    undefined
  );
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = React.useState("createdDate");
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const sortOptions = [
    { label: "Last updated", value: "updatedDate" },
    { label: "Created date", value: "createdDate" },
    { label: "Name", value: "name" },
  ];

  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCloseSortPopover = () => {
    setSortPopoverAnchorEl(null);
  };

  const openSortPopover = Boolean(sortPopoverAnchorEl);

  const handleItemClick = (id: string) => {
    setDataset(id);
    props.setChartFromAPI(null);
    props.loadDataset(id).then(() => {
      history.push(`/chart/${page}/preview-data`);
    });
  };

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  if (!canChartEditDelete && page !== "new") {
    return (
      <>
        <div css="width: 100%; height: 100px;" />
        <NotAuthorizedMessageModule asset="chart" action="edit" />
      </>
    );
  }

  return (
    <div css={commonStyles.innercontainer}>
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
              value={searchValue}
              placeholder="eg. Kenya"
              onChange={handleSearch}
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
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
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
      <DatasetCategoryList
        categories={categories}
        datasetCategories={datasetCategories}
        setCategories={setCategories}
        customCss={{ gap: "10px" }}
      />
      <DatasetsGrid
        inChartBuilder
        sortBy={sortValue}
        categories={categories}
        tableView={tableView}
        searchStr={searchValue as string}
        onItemClick={handleItemClick}
        md={props.toolboxOpen ? 4 : 6}
        lg={props.toolboxOpen ? 4 : 3}
      />
    </div>
  );
}

export default withAuthenticationRequired(ChartModuleDataView);
