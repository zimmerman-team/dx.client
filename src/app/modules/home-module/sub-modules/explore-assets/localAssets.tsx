import React from "react";
import ChartsGrid from "app/modules/home-module/components/AssetCollection/Charts/chartsGrid";
import DatasetsGrid from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import ReportsGrid from "app/modules/home-module/components/AssetCollection/Reports/reportsGrid";

export default function LocalAssets(props: {
  display: "data" | "charts" | "reports";
  searchValue: string;
  sortValue: string;
  view: "table" | "grid";
  categories: string[];
}) {
  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (props.display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={props.view}
            categories={props.categories}
            addCard
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={props.view}
            addCard
          />
        );
      case "reports":
        return (
          <ReportsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={props.view}
            showMenuButton={false}
            addCard
          />
        );
      default:
        break;
    }
  };
  return (
    <>
      <div>{displayGrid(props.searchValue as string, props.sortValue)}</div>
    </>
  );
}
