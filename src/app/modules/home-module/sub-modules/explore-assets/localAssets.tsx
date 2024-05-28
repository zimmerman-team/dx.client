import React from "react";
import ChartsGrid from "app/modules/home-module/components/Charts/chartsGrid";
import DatasetsGrid from "app/modules/home-module/components/Datasets/datasetsGrid";
import ReportsGrid from "app/modules/home-module/components/Reports/reportsGrid";

export default function LocalAssets(props: {
  display: "data" | "charts" | "reports";
  searchValue: string;
  sortValue: string;
  tableView: boolean;
  categories: string[];
}) {
  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (props.display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={props.tableView}
            categories={props.categories}
            addCard
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={props.tableView}
            addCard
          />
        );
      case "reports":
        return (
          <ReportsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            tableView={props.tableView}
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
