import React from "react";
import get from "lodash/get";
import Toolbar from "@material-ui/core/Toolbar";
import MUIAppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconChevronLeft from "@material-ui/icons/ChevronLeft";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { MobileAppbarSearch } from "app/components/Mobile/AppBarSearch";
import { Dropdown } from "app/components/Dropdown";

const TextHeader = (label: string) => (
  <h2
    css={`
      font-size: 18px;
      font-weight: bold;
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    `}
  >
    {label}
  </h2>
);

function MobileHeader() {
  const history = useHistory();

  return (
    <React.Fragment>
      <IconButton
        onClick={() => history.goBack()}
        css={`
          padding-left: 0;
        `}
      >
        <IconChevronLeft htmlColor="#fff" />
      </IconButton>
      <MobileAppbarSearch />
    </React.Fragment>
  );
}

export function AppBar() {
  const location = useLocation();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 767px)");
  // DataSourceState maintains which of the datasources is currently active.
  const datasource = useStoreState((state) => state.DataSourceState.value);
  const changeDatasource = useStoreActions((store) => store.DataSourceState.setValue);
  // We use the DataSourceMappingState to track in-app which datasets to display
  const changeDatasourceMapping = useStoreActions((store) => store.DataSourceMappingState.setValue);
  // The datasetMapping is a string[] indicating the mapped datasets, e.g. ["results", "grants"], fetched and accessed through DataSetList
  const getDatasetMapping = useStoreActions((store) => store.DataSetList.fetch);
  const datasetMapping = useStoreState(
    (state) => get(state.DataSetList.data, "data", []) as string[]
  );
  // We use the DataSourceList to track the available datasources, eg TGF, IATI and HXL.
  const getDataSourceList = useStoreActions((store) => store.DataSourceList.fetch);
  const dataSourceList = useStoreState(
    (state) => get(state.DataSourceList.data, "data", ["TGFOData"]) as string[] // Default to TGFOData original datasource
  );

  const changeDatasourceOnClick = (value: string) => {
    changeDatasource(value);
    history.push("/datasets");
  }
  
  // Retrieve the updated datasource list
  React.useEffect(() => {
    getDataSourceList({});
  }, []);

  // When a change in active datasource is detected, retrieve the available datasets for the new datasource
  React.useEffect(() => {
    getDatasetMapping({ filterString: `datasource=${datasource}` })
  }, [datasource]);

  // When the available datasets have been updated, update the datasourceMapping
  React.useEffect(() => {
    changeDatasourceMapping(datasetMapping);
  }, [datasetMapping]);

  React.useEffect(() => {
    // REVIEW: @stefanos: This updates the data source list every time the user navigates
    // is this acceptable? Otherwise, the fetch could be automatically triggered every minute.
    getDataSourceList({});
  }, [history.location]);

  // disabled to show dataset selection dropdown on home page
  // if (location.pathname === "/") {
  //   return <React.Fragment />;
  // }

  function getMobilePageHeader() {
    switch (location.pathname) {
      case "/about":
        return TextHeader("About");
      case "/datasets":
        return TextHeader("Datasets");
      default:
        return <MobileHeader />;
    }
  }

  return (
    <MUIAppBar position="fixed" color="primary">
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          variant="dense"
          css={`
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          {isMobile && getMobilePageHeader()}
          {!isMobile && (
            <React.Fragment>
              <NavLink to="/" css="display: flex;">
                <img
                  src="/gflogo.png"
                  width={295}
                  height={24}
                  alt="TGF Data Explorer logo"
                />
              </NavLink>
              <div>
                <Dropdown
                  options={dataSourceList}
                  value={datasource}
                  handleChange={(value: string) => changeDatasourceOnClick(value)}
                />
                <NavLink
                  to="/about"
                  css={`
                    color: #fff;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                    text-decoration: none;
                  `}
                >
                  About
                </NavLink>
              </div>
            </React.Fragment>
          )}
        </Toolbar>
      </Container>
    </MUIAppBar>
  );
}
