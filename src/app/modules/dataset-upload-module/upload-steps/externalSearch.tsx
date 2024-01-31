import React from "react";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Filter from "app/modules/home-module/components/Filter";
import ExternalDatasetCard from "app/modules/home-module/components/Datasets/externalDatasetCard";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useHistory } from "react-router-dom";
import useDebounce from "react-use/lib/useDebounce";
import CircleLoader from "app/modules/home-module/components/Loader";

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
  setProcessingError: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const defautlSearchTerms = ["climate", "air", "woman", "animal", "money"];
  const randomSearchTerm =
    defautlSearchTerms[Math.floor(Math.random() * defautlSearchTerms.length)];
  const [tableView, setTableView] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [sortValue, setSortValue] = React.useState("createdDate");
  const token = useStoreState((state) => state.AuthToken.value);
  const history = useHistory();
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.ExternalDatasetGet.fetch
  );
  const datasetDownload = useStoreActions(
    (actions) => actions.dataThemes.ExternalDatasetDownload.post
  );
  const datasets = useStoreState(
    (state) =>
      (state.dataThemes.ExternalDatasetGet.crudData ?? []) as IExternalDataset[]
  );

  const loading = useStoreState(
    (state) => state.dataThemes.ExternalDatasetGet.loading
  );

  const [,] = useDebounce(
    () => {
      if (token) {
        loadDatasets({
          filterString: `q=${searchValue || randomSearchTerm}`,
          token,
          storeInCrudData: true,
        });
      }
    },
    500,
    [searchValue, token]
  );
  return (
    <>
      <Container maxWidth="lg">
        <div
          css={`
            display: flex;
            gap: 80px;
            align-items: start;
            padding-top: 97px;
            button {
              cursor: pointer;
              padding: 0px;
              &:hover {
                background-color: transparent;
              }
            }
          `}
        >
          <IconButton onClick={() => history.goBack()}>
            <ArrowBackIcon htmlColor="#000" />
          </IconButton>
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
              }
            `}
          >
            <h1>External Search</h1>
            <p>
              Connect to your favourite data sources effortlessly in
              DataXplorer, and with just a few clicks, import datasets without
              the hassle of downloading, enabling you to visualize and analyse
              diverse data like never before.
            </p>
          </div>
        </div>
        <Grid container justifyContent="flex-end">
          <Grid item lg={6} md={6} sm={6}>
            <Filter
              searchValue={searchValue as string}
              setSearchValue={setSearchValue}
              setSortValue={setSortValue}
              setTableView={setTableView}
              sortValue={sortValue}
              tableView={tableView}
            />
          </Grid>
        </Grid>
        <Box height={62} />
        {loading ? (
          <CircleLoader />
        ) : (
          <Grid container spacing={2}>
            {datasets?.map((dataset, index) => (
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
        )}
      </Container>
    </>
  );
}
