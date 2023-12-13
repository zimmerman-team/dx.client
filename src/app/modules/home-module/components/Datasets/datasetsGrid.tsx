import React from "react";
import axios from "axios";
import get from "lodash/get";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { HomepageTable } from "app/modules/home-module/components/Table";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import { DatasetListItemAPIModel } from "app/modules/data-themes-module/sub-modules/list";
import ReformedGridItem from "app/modules/home-module/components/Datasets/gridItem";
import DatasetAddnewCard from "app/modules/home-module/components/Datasets/datasetAddNewCard";
import CircleLoader from "../Loader";
import { useRecoilState } from "recoil";
import { loadedDatasetsAtom } from "app/state/recoil/atoms";

interface Props {
  sortBy: string;
  searchStr: string;
  tableView: boolean;
  addCard?: boolean;
  inChartBuilder?: boolean;
  category?: string;
  onItemClick?: (v: string) => void;
}

export default function DatasetsGrid(props: Props) {
  const observerTarget = React.useRef(null);
  const [cardId, setCardId] = React.useState<string>("");
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const limit = 15;
  const [offset, setOffset] = React.useState(0);
  const { isObserved } = useInfinityScroll(observerTarget);
  const [loadedDatasets, setLoadedDatasets] =
    useRecoilState(loadedDatasetsAtom);

  const token = useStoreState((state) => state.AuthToken.value);
  const datasets = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGetList.crudData ??
        []) as DatasetListItemAPIModel[]
  );
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const loading = useStoreState(
    (state) => state.dataThemes.DatasetGetList.loading
  );

  const loadDatasetCount = useStoreActions(
    (actions) => actions.dataThemes.DatasetCount.fetch
  );
  const datasetCount = useStoreState(
    (state) => get(state, "dataThemes.DatasetCount.data.count", 0) as number
  );
  const datasetLoadSuccess = useStoreState(
    (state) => state.dataThemes.DatasetGetList.success
  );
  const getFilterString = (reload?: boolean) => {
    const value =
      props.searchStr?.length > 0
        ? `"where":{"name":{"like":"${props.searchStr}.*","options":"i"}},`
        : "";

    return `filter={${value}"order":"${
      props.sortBy
    } desc","limit":${limit},"offset":${reload ? 0 : offset}}`;
  };

  const getWhereString = () => {
    return props.searchStr?.length > 0
      ? `where={"name":{"like":"${props.searchStr}.*","options":"i"}}`
      : "";
  };

  const loadData = async (reload?: boolean) => {
    //refrain from loading data if all the data is loaded
    if (token) {
      await loadDatasets({
        token,
        storeInCrudData: true,
        filterString: getFilterString(reload),
      });
    } else {
      await loadDatasets({
        token,
        nonAuthCall: !token,
        storeInCrudData: true,
        filterString: getFilterString(reload),
      });
    }
  };

  const reloadData = async () => {
    if (token) {
      loadDatasetCount({ token, filterString: getWhereString() });
    } else {
      loadDatasetCount({ nonAuthCall: true, filterString: getWhereString() });
    }
    setLoadedDatasets([]);
    setOffset(0);
    loadData(true);
  };

  React.useEffect(() => {
    if (token) {
      loadDatasetCount({
        token,
      });
    } else {
      loadDatasetCount({ nonAuthCall: true, filterString: getWhereString() });
    }
  }, [token]);

  React.useEffect(() => {
    //load data if intersection observer is triggered
    if (datasetCount > limit) {
      if (isObserved && datasetLoadSuccess) {
        if (loadedDatasets.length !== datasetCount) {
          //update the offset value for the next load
          setOffset(offset + limit);
        }
      }
    }
  }, [isObserved]);

  // console.log("loadedDatasets", loadedDatasets);
  // console.log(offset, "offset");
  // console.log(datasets, "datasets");
  // console.log(isObserved, "isObserved");
  // console.log(datasetLoadSuccess, "datasetLoadSuccess");

  React.useEffect(() => {
    if (offset === 0) {
      return;
    }
    loadData();
  }, [offset, token]);

  const handleDelete = (id: string) => {
    deleteDataset(id);
    setModalDisplay(false);
    setEnableButton(false);
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

  async function deleteDataset(id: string) {
    axios
      .delete(`${process.env.REACT_APP_API}/datasets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
      })
      .catch((error) => console.log(error));
  }

  React.useEffect(() => {
    if (!datasetLoadSuccess) {
      return;
    }
    //update the loaded datasets
    setLoadedDatasets((prevDatasets) => {
      const prevDatasetsIds = prevDatasets.map((d) => d.id);
      const f = datasets.filter(
        (dataset) => !prevDatasetsIds.includes(dataset.id)
      );
      if (props.category && props.category.length > 0) {
        return [...prevDatasets, ...f].filter(
          (d) => d.category === props.category
        );
      } else {
        return [...prevDatasets, ...f];
      }
    });
  }, [datasetLoadSuccess, datasets]);

  React.useEffect(() => {
    reloadData();
  }, [props.sortBy, token, props.category]);

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
        <Grid container spacing={!props.inChartBuilder ? 2 : 1}>
          {props.addCard && <DatasetAddnewCard />}
          {loadedDatasets.map((data, index) => (
            <Grid
              item
              key={data.id}
              xs={12}
              sm={6}
              md={!props.inChartBuilder ? 4 : 6}
              lg={!props.inChartBuilder ? 3 : 4}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (props.onItemClick) {
                  props.onItemClick(data.id);
                }
              }}
              css={
                props.inChartBuilder
                  ? `
                  cursor: pointer;
                  a{
                    pointer-events: none;
                  }
                  > div {
                    width: 100%;
                  
                    &:hover {
                      cursor: pointer;
                      border: 1px solid #6061E5;
                    }
                  }
              `
                  : ""
              }
            >
              <ReformedGridItem
                path={"#"}
                title={data.name}
                date={data.createdDate}
                handleDelete={() => {}}
                descr={data.description}
                handleDuplicate={() => {}}
                showMenu={!props.inChartBuilder}
                id={data.id}
              />

              {!props.inChartBuilder && <Box height={16} />}
            </Grid>
          ))}
        </Grid>
      )}

      {props.tableView && (
        <HomepageTable
          onItemClick={props.onItemClick}
          inChartBuilder={props.inChartBuilder}
          data={loadedDatasets.map((data) => ({
            id: data.id,
            name: data.name,
            description: data.description,
            createdDate: data.createdDate,
          }))}
        />
      )}
      <Box height={100} />

      <div
        ref={observerTarget}
        css={`
          height: 10px;
        `}
      />
      {loading && <CircleLoader />}
      <DeleteDatasetDialog
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
