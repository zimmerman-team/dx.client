import Grid from "@material-ui/core/Grid";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import { PageLoader } from "app/modules/common/page-loader";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

import React from "react";
import { v4 } from "uuid";
import ChartAddnewCard from "./chartAddNewCard";
import { datasetsData } from "./data";
import GridItem from "./gridItem";
import { BarIcon, MapIcon, SankeyIcon, TableIcon } from "./vizIcons";

export default function ChartsGrid() {
  const [cardId, setCardId] = React.useState<string>("");
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const [data, setData] = React.useState(
    datasetsData.map((data) => ({ ...data, id: "63dd016c20ff974becd6330b" }))
  );

  const loadedCharts = useStoreState(
    (state) => state.charts.ChartsGet.crudData ?? []
  ) as any;
  const isLoadingCharts = useStoreState(
    (state) => state.charts.ChartsGet.loading
  );
  const loadCharts = useStoreActions(
    (actions) => actions.charts.ChartsGet.fetch
  );

  const deleteChart = useStoreActions(
    (actions) => actions.charts.ChartDelete.delete
  );
  const clearDeleteChart = useStoreActions(
    (actions) => actions.charts.ChartDelete.clear
  );
  const deleteChartSuccess = useStoreState(
    (state) => state.charts.ChartDelete.success
  );

  const handleDelete = (id: string) => {
    deleteChart({ deleteId: id });
    setModalDisplay(false);
    setEnableButton(false);
  };

  React.useEffect(() => {
    if (deleteChartSuccess) {
      clearDeleteChart();
    }
  }, [deleteChartSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

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
    loadCharts({ filterString: "" });
  }, [loadCharts]);

  const setViz = (vizType: "bar" | "sankey" | "map" | "table") => {
    switch (vizType) {
      case "sankey":
        return <SankeyIcon />;

      case "bar":
        return <BarIcon />;
      case "map":
        return <MapIcon />;
      case "table":
        return <TableIcon />;
      default:
        return <TableIcon />;
    }
  };
  if (isLoadingCharts) {
    return <PageLoader />;
  }

  return (
    <>
      <Grid container spacing={2}>
        <ChartAddnewCard />
        {loadedCharts.map((data: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <GridItem
              key={index}
              date={data.date}
              descr={data.desc}
              path={data.path}
              title={data.title}
              viz={setViz(data.viz)}
              handleDelete={() => handleModal(data.id as string)}
              id={data.id}
            />
          </Grid>
        ))}
      </Grid>
      <DeleteChartDialog
        cardId={cardId}
        enableButton={enableButton}
        handleDelete={handleDelete}
        handleInputChange={handleInputChange}
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
      />
    </>
  );
}
