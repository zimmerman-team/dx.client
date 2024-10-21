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
import {
  coloredEchartTypes,
  echartTypes,
} from "app/modules/chart-module/routes/chart-type/data";
import ChartAddnewCard from "app/modules/home-module/components/AssetCollection/Charts/chartAddNewCard";
import GridItem from "app/modules/home-module/components/AssetCollection/Charts/gridItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useSetRecoilState } from "recoil";
import { planDialogAtom } from "app/state/recoil/atoms";

interface Props {
  sortBy: string;
  searchStr: string;
  view: "grid" | "table";
  addCard?: boolean;
}

export interface IChartAsset {
  id: string;
  name: string;
  createdDate: Date;
  vizType: string;
  isMappingValid: boolean;
  owner: string;
  isAIAssisted: boolean;
}

export default function ChartsGrid(props: Props) {
  const observerTarget = React.useRef(null);
  const [chartId, setChartId] = React.useState<string>("");
  const [loadedCharts, setLoadedCharts] = React.useState<any[]>([]);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const token = useStoreState((state) => state.AuthToken.value);
  const initialRender = React.useRef(true);
  const limit = 15;
  const [offset, setOffset] = React.useState(0);

  const { isObserved } = useInfinityScroll(observerTarget);

  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const charts = useStoreState(
    (state) => (state.charts.ChartGetList.crudData ?? []) as IChartAsset[]
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
    return `filter={${value}"order":"${props.sortBy} ${
      props.sortBy === "name" ? "asc" : "desc"
    }","limit":${limit},"offset":${fromZeroOffset ? 0 : offset}}`;
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
    if (
      chartsCount > limit &&
      isObserved &&
      chartsLoadSuccess &&
      loadedCharts.length !== chartsCount
    ) {
      //update the offset value for the next load
      setOffset(offset + limit);
    }
  }, [isObserved]);

  useUpdateEffect(() => {
    if (offset === 0) {
      return;
    }
    loadData();
  }, [offset, token]);

  const handleDelete = (id: string) => {
    setModalDisplay(false);
    setEnableButton(false);

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

  const handleDuplicate = (id: string) => {
    if (!id) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API}/chart/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        if (response.data.planWarning) {
          setPlanDialog({
            open: true,
            message: response.data.planWarning,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
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

  const handleModal = (id: string) => {
    setChartId(id);
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
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      reloadData();
    },
    500,
    [props.searchStr]
  );

  return (
    <>
      {props.view === "grid" && (
        <Grid container spacing={2}>
          {props.addCard ? <ChartAddnewCard /> : null}
          {loadedCharts.map((c, index) => (
            <Grid item key={c.id} xs={12} sm={6} md={4} lg={3}>
              <GridItem
                id={c.id}
                title={c.name}
                date={c.updatedDate}
                viz={getIcon(c.vizType)}
                vizType={c.vizType}
                isMappingValid={c.isMappingValid}
                handleDelete={() => handleModal(c.id)}
                handleDuplicate={() => handleDuplicate(c.id)}
                owner={c.owner}
                isAIAssisted={c.isAIAssisted}
              />
              <div
                css={`
                  height: 16px;
                  @media (max-width: 600px) {
                    height: 8px;
                  }
                `}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {props.view === "table" && (
        <HomepageTable
          handleDelete={handleModal}
          handleDuplicate={handleDuplicate}
          tableData={{
            columns: [
              { key: "name", label: "Name" },
              { key: "vizType", label: "Chart Type" },
              { key: "updatedDate", label: "Last modified" },
            ],
            data: loadedCharts.map((data) => ({
              ...data,
              type: "chart",
              vizType: echartTypes(false).find((e) => e.id === data.vizType)
                ?.label,
            })),
          }}
        />
      )}
      <Box height={80} />

      <div ref={observerTarget} />
      {loading && <CircleLoader />}

      <DeleteChartDialog
        cardId={chartId}
        modalDisplay={modalDisplay}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setModalDisplay}
        handleInputChange={handleInputChange}
      />
    </>
  );
}
