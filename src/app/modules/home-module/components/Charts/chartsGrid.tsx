/* third party */
import React from "react";
import axios from "axios";
import get from "lodash/get";
import find from "lodash/find";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { useUpdateEffect } from "react-use";
/* project */
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import CircleLoader from "app/modules/home-module/components/Loader";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import { HomepageTable } from "app/modules/home-module/components/Table";
import { coloredEchartTypes } from "app/modules/chart-module/routes/chart-type/data";
import ChartAddnewCard from "app/modules/home-module/components/Charts/chartAddNewCard";
import GridItem from "app/modules/home-module/components/Charts/gridItem";

interface Props {
  sortBy: string;
  searchStr: string;
  tableView: boolean;
  addCard?: boolean;
}

export default function ChartsGrid(props: Props) {
  const observerTarget = React.useRef(null);
  const [cardId, setCardId] = React.useState<number>(0);
  const [loadedCharts, setLoadedCharts] = React.useState<any[]>([]);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const token = useStoreState((state) => state.AuthToken.value);

  const limit = 15;
  const [offset, setOffset] = React.useState(0);

  const { isObserved } = useInfinityScroll(observerTarget);

  const charts = useStoreState(
    (state) => (state.charts.ChartGetList.crudData ?? []) as any[]
  );
  const loadChartsCount = useStoreActions(
    (actions) => actions.charts.ChartsCount.fetch
  );
  const chartsCount = useStoreState(
    (state) => get(state, "charts.ChartsCount.data.count", 0) as number
  );

  const loadCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );

  const loading = useStoreState((state) => state.charts.ChartGetList.loading);

  const chartsLoadSuccess = useStoreState(
    (state) => state.charts.ChartGetList.success
  );

  const getFilterString = (fromZeroOffset?: boolean) => {
    const value =
      props.searchStr?.length > 0
        ? `"where":{"name":{"like":"${props.searchStr}.*","options":"i"}},`
        : "";
    return `filter={${value}"order":"${
      props.sortBy
    } desc","limit":${limit},"offset":${fromZeroOffset ? 0 : offset}}`;
  };

  const getWhereString = () => {
    return props.searchStr?.length > 0
      ? `where={"name":{"like":"${props.searchStr}.*","options":"i"}}`
      : "";
  };

  const loadData = (fromZeroOffset?: boolean) => {
    if (token) {
      loadCharts({
        token,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    } else {
      loadCharts({
        nonAuthCall: true,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    }
  };

  const reloadData = () => {
    if (token) {
      loadChartsCount({ token, filterString: getWhereString() });
    } else {
      loadChartsCount({ nonAuthCall: true, filterString: getWhereString() });
    }
    setLoadedCharts([]);
    setOffset(0);

    loadData(true);
  };

  React.useEffect(() => {
    //load data if intersection observer is triggered
    if (chartsCount > limit) {
      if (isObserved && chartsLoadSuccess) {
        if (loadedCharts.length !== chartsCount) {
          //update the offset value for the next load
          setOffset(offset + limit);
        }
      }
    }
  }, [isObserved]);

  useUpdateEffect(() => {
    if (offset === 0) {
      return;
    }
    loadData();
  }, [offset, token]);

  const handleDelete = (index?: number) => {
    setModalDisplay(false);
    setEnableButton(false);
    const id = loadedCharts[index as number].id;
    if (!id) {
      return;
    }
    axios
      .delete(`${process.env.REACT_APP_API}/chart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
      })
      .catch((error) => console.log(error));
  };

  const handleDuplicate = (index: number) => {
    const id = loadedCharts[index].id;
    if (!id) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API}/chart/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
      })
      .catch((error) => console.log(error));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleModal = (id: number) => {
    setCardId(id);
    setModalDisplay(true);
  };

  const getIcon = (vizType: string) => {
    const type = find(coloredEchartTypes(), { id: vizType });
    if (type) {
      return type.icon;
    }
    return coloredEchartTypes()[0].icon;
  };

  React.useEffect(() => {
    if (!chartsLoadSuccess) {
      return;
    }
    //update the loaded reports
    setLoadedCharts((prevCharts) => {
      const prevChartsIds = prevCharts.map((c) => c.id);
      const f = charts.filter((chart) => !prevChartsIds.includes(chart.id));
      return [...prevCharts, ...f];
    });
  }, [chartsLoadSuccess]);

  React.useEffect(() => {
    reloadData();
  }, [props.sortBy, token]);

  const [,] = useDebounce(
    () => {
      if (props.searchStr !== undefined) {
        reloadData();
      }
    },
    500,
    [props.searchStr]
  );

  return (
    <>
      {!props.tableView && (
        <Grid container spacing={2}>
          {props.addCard && <ChartAddnewCard />}
          {loadedCharts.map((c, index) => (
            <Grid item key={c.id} xs={12} sm={6} md={6} lg={3}>
              <GridItem
                id={c.id}
                title={c.name}
                public={c.public}
                date={c.createdDate}
                path={`/chart/${c.id}`}
                viz={getIcon(c.vizType)}
                vizType={c.vizType}
                handleDelete={() => handleModal(index)}
                handleDuplicate={() => handleDuplicate(index)}
              />
              <Box height={16} />
            </Grid>
          ))}
        </Grid>
      )}
      {props.tableView && (
        <HomepageTable
          data={loadedCharts.map((data) => ({
            id: data.id,
            name: data.name,
            description: data.title,
            createdDate: data.createdDate,
          }))}
        />
      )}
      <Box height={100} />

      <div ref={observerTarget} />
      {loading && <CircleLoader />}

      <DeleteChartDialog
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
