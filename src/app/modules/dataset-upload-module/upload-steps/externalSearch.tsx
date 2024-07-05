import React, { useEffect } from "react";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Filter from "app/modules/home-module/components/Filter";
import ExternalDatasetCard from "app/modules/home-module/components/Datasets/externalDatasetCard";
import { useStoreState } from "app/state/store/hooks";
import useDebounce from "react-use/lib/useDebounce";
import axios from "axios";
import CircleLoader from "app/modules/home-module/components/Loader";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import SourceCategoryList from "../component/externalSourcesList";

export interface IExternalDataset {
  name: string;
  description: string;
  url: string;
  source: string;
  datePublished: string;
}

export default function ExternalSearch(props: {
  setFormDetails: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      category: string;
      public: boolean;
      source: string;
      sourceUrl: string;
    }>
  >;
  handleDownload: (dataset: IExternalDataset) => void;
  setProcessingError: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  searchValue: string | undefined;
  setSearchValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  sources: string[];
  setSources: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const observerTarget = React.useRef(null);
  const [tableView, setTableView] = React.useState(false);

  const [sortValue, setSortValue] = React.useState("createdDate");
  const token = useStoreState((state) => state.AuthToken.value);
  const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const limit = 20;
  const [datasets, setDatasets] = React.useState<IExternalDataset[]>([]);

  const baseSources = [
    { name: "Kaggle", value: "Kaggle" },
    { name: "World Bank", value: "World Bank" },
    { name: "WHO", value: "WHO" },
    { name: "HDX", value: "HDX" },
    { name: "The Global Fund", value: "TGF" },
  ];

  const { isObserved } = useInfinityScroll(observerTarget);

  const abortControllerRef = React.useRef<AbortController>(
    new AbortController()
  );
  const terminateSearch = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setOffset(0);
  };

  // Pagination on scroll
  React.useEffect(() => {
    if (isObserved && datasets.length > 0) {
      loadSearch(true);
    }
  }, [isObserved]);

  const loadSearch = async (nextPage: boolean = false) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/external-sources/search?q=${
          props.searchValue
        }&source=${
          props.sources.length
            ? props.sources.join(",")
            : "Kaggle,World Bank,WHO,HDX,TGF"
        }&offset=${offset}&limit=${limit}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      if (response.data.error) {
        console.log(response.data.error);
        return;
      }
      if (nextPage) {
        setDatasets([...datasets, ...response.data]);
        setOffset(offset + limit);
      } else {
        setDatasets(response.data);
        setOffset(limit);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  React.useEffect(() => {
    const controller = abortControllerRef.current;
    return () => {
      controller.abort();
    };
  }, []);

  const firstTimeRef = React.useRef(true);

  useEffect(() => {
    if (token && firstTimeRef.current) {
      setDatasets([]);
      loadSearch();
    }
  }, [token]);

  const [,] = useDebounce(
    () => {
      if (token) {
        if (firstTimeRef.current) {
          firstTimeRef.current = false;
          return;
        }
        setDatasets([]);
        loadSearch();
      }
    },
    500,
    [props.searchValue, token, props.sources]
  );
  return (
    <>
      <div
        css={`
          h1 {
            font-family: "Inter", sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #231d2c;
            margin: 0px;
          }
          p {
            color: #231d2c;
            font-family: "GothamNarrow-Book";
            font-size: 14px;
            font-weight: 325;
            line-height: 20px;
            letter-spacing: 0.5px;
            margin: 0px;
            padding: 0px;
          }
        `}
      >
        <h1>Federated Search</h1>
        <Box height={22} />
        <p>
          Connect to your favourite data sources effortlessly in Dataxplorer,
          and with just a few clicks, import datasets without the hassle of
          downloading,
          <br /> enabling you to visualize and analyse diverse data like never
          before.
        </p>
      </div>
      <Box height={32} />
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        wrap={"nowrap"}
      >
        <SourceCategoryList
          sources={props.sources}
          setSources={props.setSources}
          baseSources={baseSources}
          terminateSearch={terminateSearch}
        />

        <Filter
          searchValue={props.searchValue as string}
          setSearchValue={props.setSearchValue}
          setSortValue={setSortValue}
          setTableView={setTableView}
          sortValue={sortValue}
          tableView={tableView}
          terminateSearch={terminateSearch}
          searchInputWidth="249px"
          openSearch={props.openSearch}
          setOpenSearch={props.setOpenSearch}
        />
      </Grid>

      <Box height={32} />
      {datasets?.length ? (
        <Grid container spacing={2}>
          {datasets &&
            datasets?.map((dataset, index) => (
              <Grid
                item
                lg={3}
                md={4}
                sm={6}
                xs={12}
                key={`${dataset.name}-${index}`}
              >
                <ExternalDatasetCard
                  description={dataset.description}
                  name={dataset.name}
                  publishedDate={dataset.datePublished}
                  source={dataset.source}
                  url={dataset.url}
                  handleDownload={() => props.handleDownload(dataset)}
                  dataset={dataset}
                />
                <Box height={16} />
              </Grid>
            ))}
        </Grid>
      ) : !loading ? (
        <div
          css={`
            text-align: center;
            height: 221px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 325;
            line-height: normal;
            letter-spacing: 0.5px;
            font-family: "GothamNarrow-Book", sans-serif;
          `}
        >
          No datasets were found using federated search. Please consider trying
          a different search description.
        </div>
      ) : null}

      <div
        ref={observerTarget}
        css={`
          height: 1px;
        `}
      />

      <Box display={"flex"} justifyContent={"center"}>
        {loading && <CircleLoader />}
      </Box>
    </>
  );
}
