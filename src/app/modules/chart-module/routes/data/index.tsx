/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useStoreActions } from "app/state/store/hooks";
import { useParams, useHistory } from "react-router-dom";
/* project */
import { datasetCategories } from "app/modules/dataset-module/routes/upload-module/upload-steps/metaData";
import DatasetsGrid from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import DatasetCategoryList from "app/modules/home-module/components/AssetCollection/Datasets/datasetCategoryList";
import { ChartRenderedItem } from "app/modules/chart-module/data";
import Filter from "app/modules/home-module/components/Filter";

function ChartModuleDataView(
  props: Readonly<{
    loadDataset: (endpoint: string) => Promise<boolean>;
    toolboxOpen: boolean;
    setChartFromAPI: (
      value: React.SetStateAction<ChartRenderedItem | null>
    ) => void;
  }>
) {
  useTitle("DX Dataxplorer - Select Data");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [datasetsView, setDatasetsView] = React.useState<"table" | "grid">(
    "grid"
  );
  const [searchValue, setSearchValue] = React.useState<undefined | string>(
    undefined
  );
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = React.useState("updatedDate");
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  const handleItemClick = (id: string) => {
    setDataset(id);
    props.setChartFromAPI(null);
    props.loadDataset(id).then(() => {
      history.push(`/chart/${page}/preview-data`);
    });
  };

  return (
    <div css={commonStyles.innercontainer}>
      <Filter
        searchValue={searchValue as string}
        setSearchValue={setSearchValue}
        setSortValue={setSortValue}
        setAssetsView={setDatasetsView}
        sortValue={sortValue}
        assetsView={datasetsView}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        searchIconCypressId="open-search-button"
      />
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
        view={datasetsView}
        searchStr={searchValue as string}
        onItemClick={handleItemClick}
        md={props.toolboxOpen ? 4 : 6}
        lg={props.toolboxOpen ? 4 : 3}
      />
    </div>
  );
}

export default ChartModuleDataView;
