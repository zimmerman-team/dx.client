/** third party */
import React from "react";
import axios from "axios";
import get from "lodash/get";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";
import { useRecoilState } from "recoil";
import useDebounce from "react-use/lib/useDebounce";
/** project */
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { HomepageTable } from "app/modules/home-module/components/Table";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import GridItem from "app/modules/home-module/components/Datasets/gridItem";
import DatasetAddnewCard from "app/modules/home-module/components/Datasets/datasetAddNewCard";
import CircleLoader from "app/modules/home-module/components/Loader";
import { loadedDatasetsAtom } from "app/state/recoil/atoms";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

interface Props {
  sortBy: string;
  searchStr: string;
  tableView: boolean;
  addCard?: boolean;
  inChartBuilder?: boolean;
  category?: string;
  onItemClick?: (v: string) => void;
  md?: GridSize;
  lg?: GridSize;
}

export default function DatasetsGrid(props: Readonly<Props>) {
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
      loadDatasets({
        token,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    } else {
      loadDatasets({
        token,
        nonAuthCall: !token,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    }
  };

  const reloadData = () => {
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

  const handleDuplicate = (index: number) => {
    const id = loadedDatasets[index].id;
    if (!id) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API}/dataset/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
      })
      .catch((error) => console.log(error));
  };

  const handleModal = (id: string) => {
    setCardId(id);
    setModalDisplay(true);
  };

  function deleteDataset(id: string) {
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
  const md = props.md ?? 4;
  const lg = props.lg ?? 3;
  return (
    <>
      {!props.tableView && (
        <Grid container spacing={!props.inChartBuilder ? 2 : 1}>
          {props.addCard && <DatasetAddnewCard />}
          {loadedDatasets?.map((data, index) => (
            <Grid
              item
              key={data.id}
              xs={12}
              sm={6}
              md={md}
              lg={lg}
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
                    >div{

                      width: 100%;
                    
                      &:hover {
                        cursor: pointer;
                        border: 1px solid #6061E5;
                      }
                    }
                  }
              `
                  : ""
              }
            >
              <GridItem
                path={`/dataset/${data.id}/edit`}
                title={data.name}
                date={data.createdDate}
                handleDelete={() => {
                  handleModal(data.id);
                }}
                descr={data.description}
                handleDuplicate={() => {
                  handleDuplicate(index);
                }}
                showMenu={!props.inChartBuilder}
                id={data.id}
                owner={data.owner}
                inChartBuilder={props.inChartBuilder as boolean}
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
          data={loadedDatasets?.map((data) => ({
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
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        setEnableButton={setEnableButton}
      />
    </>
  );
}
