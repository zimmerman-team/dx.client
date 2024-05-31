/* third party */
import React from "react";
import axios from "axios";
import get from "lodash/get";
import find from "lodash/find";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { useUpdateEffect } from "react-use";
/* project */
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import CircleLoader from "app/modules/home-module/components/Loader";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import { coloredEchartTypes } from "app/modules/chart-module/routes/chart-type/data";
import ChartAddnewCard from "app/modules/home-module/components/Charts/chartAddNewCard";
import ChartGridItem from "app/modules/home-module/components/Charts/gridItem";
import DatasetGridItem from "app/modules/home-module/components/Datasets/gridItem";
import ReportGridItem from "app/modules/home-module/components/Reports/gridItem";
import DatasetAddnewCard from "../Datasets/datasetAddNewCard";
import ReportAddnewCard from "../Reports/reportAddNewCard";
import ColoredReportIcon from "app/assets/icons/ColoredReportIcon";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import DeleteReportDialog from "app/components/Dialogs/deleteReportDialog";
import { HomepageTable } from "../Table";

interface Props {
  sortBy: string;
  searchStr: string;
  tableView: boolean;
  showMenuButton: boolean;
  inChartBuilder?: boolean;
  category?: string;
  onItemClick?: (v: string) => void;
  md?: GridSize;
  lg?: GridSize;
  fromHome?: boolean;
}
type assetType = "chart" | "dataset" | "report";

export default function AssetsGrid(props: Props) {
  const observerTarget = React.useRef(null);
  const [cardId, setCardId] = React.useState<string>("");
  const [loadedAssets, setLoadedAssets] = React.useState<any[]>([]);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [activeAssetType, setActiveAssetType] =
    React.useState<assetType | null>(null);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const token = useStoreState((state) => state.AuthToken.value);

  const limit = 15;
  const [offset, setOffset] = React.useState(0);

  const { isObserved } = useInfinityScroll(observerTarget);

  const assets = useStoreState(
    (state) => (state.assets.AssetGetList.crudData ?? []) as any[]
  );
  const loadAssetsCount = useStoreActions(
    (actions) => actions.assets.AssetsCount.fetch
  );
  const assetsCount = useStoreState(
    (state) => get(state, "assets.AssetsCount.data.count", 0) as number
  );

  const loadAssets = useStoreActions(
    (actions) => actions.assets.AssetGetList.fetch
  );

  const loading = useStoreState((state) => state.assets.AssetGetList.loading);

  const assetsLoadSuccess = useStoreState(
    (state) => state.assets.AssetGetList.success
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
      loadAssets({
        token,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    } else {
      loadAssets({
        nonAuthCall: true,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    }
  };

  const reloadData = () => {
    if (token) {
      loadAssetsCount({ token, filterString: getWhereString() });
    } else {
      loadAssetsCount({ nonAuthCall: true, filterString: getWhereString() });
    }
    setLoadedAssets([]);
    setOffset(0);

    loadData(true);
  };

  React.useEffect(() => {
    //load data if intersection observer is triggered
    if (assetsCount > limit) {
      if (isObserved && assetsLoadSuccess) {
        if (loadedAssets.length !== assetsCount) {
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

  const handleDelete = (id: string) => {
    setModalDisplay(false);
    setEnableButton(false);

    console.log(activeAssetType);

    if (!id) {
      return;
    }

    const url = {
      chart: `${process.env.REACT_APP_API}/chart/${id}`,
      dataset: `${process.env.REACT_APP_API}/datasets/${id}`,
      report: `${process.env.REACT_APP_API}/report/${id}`,
    }[activeAssetType as assetType];

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
        setActiveAssetType(null);
      })
      .catch((error) => console.log(error));
  };

  const handleDuplicate = (id: string, assettype: assetType) => {
    if (!id) {
      return;
    }
    const url = {
      chart: `${process.env.REACT_APP_API}/chart/duplicate/${id}`,
      dataset: `${process.env.REACT_APP_API}/dataset/duplicate/${id}`,
      report: `${process.env.REACT_APP_API}/report/duplicate/${id}`,
    }[assettype];
    axios
      .get(url, {
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

  const handleModal = (id: string) => {
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
    if (!assetsLoadSuccess) {
      return;
    }
    //update the loaded reports
    setLoadedAssets((prevAssets) => {
      const prevAssetsIds = prevAssets.map((c) => c.id);
      const f = assets.filter((asset) => !prevAssetsIds.includes(asset.id));
      return [...prevAssets, ...f];
    });
  }, [assetsLoadSuccess]);

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
      {props.tableView ? (
        <HomepageTable
          fromHome={props.fromHome}
          onItemClick={props.onItemClick}
          inChartBuilder={props.inChartBuilder}
          data={loadedAssets.map((data) => {
            if (data.assetType === "chart") {
              return {
                id: data.id,
                name: data.name,
                description: data.title,
                createdDate: data.createdDate,
                type: data.assetType,
              };
            } else if (data.assetType === "dataset") {
              return {
                id: data.id,
                name: data.name,
                description: data.description,
                createdDate: data.createdDate,
                type: data.assetType,
              };
            }

            return {
              id: data.id,
              name: data.name,
              description: data.title,
              createdDate: data.createdDate,
              type: data.assetType,
            };
          })}
        />
      ) : (
        <Grid container spacing={2}>
          {loadedAssets.map((d, index) => (
            <Grid item key={d.id} xs={12} sm={6} md={4} lg={3}>
              {
                {
                  chart: (
                    <ChartGridItem
                      id={d.id}
                      title={d.name}
                      public={d.public}
                      date={d.createdDate}
                      path={`/chart/${d.id}`}
                      viz={getIcon(d.vizType)}
                      vizType={d.vizType}
                      isMappingValid={d.isMappingValid}
                      handleDelete={() => {
                        setActiveAssetType(d.assetType as assetType);
                        handleModal(d.id);
                      }}
                      handleDuplicate={() =>
                        handleDuplicate(d.id, d.assetType as assetType)
                      }
                      owner={d.owner}
                      isAIAssisted={d.isAIAssisted}
                    />
                  ),
                  dataset: (
                    <DatasetGridItem
                      path={`/dataset/${d.id}/edit`}
                      title={d.name}
                      date={d.createdDate}
                      handleDelete={() => {
                        setActiveAssetType(d.assetType as assetType);
                        handleModal(d.id);
                      }}
                      descr={d.description}
                      handleDuplicate={() => {
                        handleDuplicate(d.id, d.assetType as assetType);
                      }}
                      showMenu={!props.inChartBuilder}
                      id={d.id}
                      owner={d.owner}
                      inChartBuilder={props.inChartBuilder as boolean}
                      fromHome={props.fromHome}
                    />
                  ),
                  report: (
                    <ReportGridItem
                      id={d.id}
                      key={d.id}
                      descr={d.name}
                      public={d.public}
                      date={d.createdDate}
                      viz={<ColoredReportIcon />}
                      color={d.backgroundColor}
                      showMenuButton={props.showMenuButton}
                      handleDelete={() => {
                        setActiveAssetType(d.assetType as assetType);
                        handleModal(d.id);
                      }}
                      handleDuplicate={() =>
                        handleDuplicate(d.id, d.assetType as assetType)
                      }
                      title={d.title || d.name}
                      owner={d.owner}
                    />
                  ),
                }[d.assetType as assetType]
              }

              <Box height={16} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box height={80} />

      <div ref={observerTarget} />
      {loading && <CircleLoader />}

      {
        {
          chart: (
            <DeleteChartDialog
              cardId={cardId}
              modalDisplay={modalDisplay}
              enableButton={enableButton}
              handleDelete={handleDelete}
              setModalDisplay={setModalDisplay}
              handleInputChange={handleInputChange}
            />
          ),
          dataset: (
            <DeleteDatasetDialog
              cardId={cardId}
              enableButton={enableButton}
              handleDelete={handleDelete}
              modalDisplay={modalDisplay}
              setModalDisplay={setModalDisplay}
              setEnableButton={setEnableButton}
            />
          ),
          report: (
            <DeleteReportDialog
              cardId={cardId}
              modalDisplay={modalDisplay}
              enableButton={enableButton}
              handleDelete={handleDelete}
              setModalDisplay={setModalDisplay}
              handleInputChange={handleInputChange}
            />
          ),
        }[activeAssetType as assetType]
      }
    </>
  );
}
