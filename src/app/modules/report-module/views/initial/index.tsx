import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {
  templates,
  TemplateItem,
  ReportInitialViewProps,
  ReportTemplateModel,
} from "app/modules/report-module/views/initial/data";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import ReportsGrid from "app/modules/home-module/components/AssetCollection/Reports/reportsGrid";
import { persistedReportStateAtom } from "app/state/recoil/atoms";
import { useResetRecoilState } from "recoil";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useMount, useTitle, useUpdateEffect } from "react-use";
import { isEmpty } from "lodash";
import Filter from "app/modules/home-module/components/Filter";
import { useMediaQuery } from "@material-ui/core";

function ReportInitialView(props: Readonly<ReportInitialViewProps>) {
  useTitle("DX Dataxplorer - New Report");

  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 599px)");
  const [reportsView, setReportsView] = React.useState<"grid" | "table">(
    "grid"
  );
  const [searchValue, setSearchValue] = React.useState<undefined | string>(
    undefined
  );
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = React.useState("updatedDate");

  const reportCreateSuccess = useStoreState(
    (state) => state.reports.ReportCreate.success
  );

  const reportCreateData = useStoreState(
    (state) =>
      (state.reports.ReportCreate.crudData ?? emptyReport) as ReportModel
  );
  const clearReportEdit = useStoreActions(
    (actions) => actions.reports.ReportUpdate.clear
  );
  const clearReportCreate = useStoreActions(
    (actions) => actions.reports.ReportCreate.clear
  );
  const handleTemplateSelected = (option: ReportTemplateModel) => {
    props.handleSetButtonActive(option.value);
  };

  const clearPersistedReportState = useResetRecoilState(
    persistedReportStateAtom
  );

  React.useEffect(() => {
    clearPersistedReportState();
    props.resetReport();
  }, []);

  useMount(() => {
    clearReportCreate();
    clearReportEdit();
  });

  useUpdateEffect(() => {
    if (reportCreateSuccess && !isEmpty(reportCreateData?.id)) {
      const id = reportCreateData.id;
      history.push(`/report/${id}/edit`);
    }
  }, [reportCreateSuccess, reportCreateData]);

  return (
    <Container maxWidth="lg">
      <div>
        <h4
          css={`
            font-family: "Inter", sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #231d2c;
            margin: 0;
          `}
        >
          Select your report template
        </h4>
      </div>
      <div
        css={`
          height: 48px;
        `}
      />
      <Grid container spacing={isMobile ? 4 : 7} justifyContent="space-between">
        {templates.map((option) => (
          <Grid key={option.value} item lg={"auto"} md={4} sm={6} xs={12}>
            <TemplateItem
              name={option.name}
              value={option.value}
              available={option.available}
              description={option.description}
              templateImg={option.templateImg}
              handleClick={() => handleTemplateSelected(option)}
            />
          </Grid>
        ))}
      </Grid>
      <div
        css={`
          height: 114px;
        `}
      />
      <hr
        css={`
          border: 0.1px solid #adb5bd;
        `}
      />
      <div
        css={`
          height: 81px;
        `}
      />
      <Grid
        container
        alignContent="space-between"
        alignItems="center"
        css={`
          width: 100%;
          margin-bottom: 44px;
        `}
      >
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <h4
            css={`
              font-size: 18px;
              line-height: 22px;
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            Explore or duplicate reports
          </h4>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <Filter
            searchValue={searchValue as string}
            setSearchValue={setSearchValue}
            setSortValue={setSortValue}
            setAssetsView={setReportsView}
            sortValue={sortValue}
            assetsView={reportsView}
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
            searchIconCypressId="open-search-button"
          />
        </Grid>
      </Grid>
      <ReportsGrid
        sortBy={sortValue}
        searchStr={searchValue as string}
        view={reportsView}
        showMenuButton
      />
    </Container>
  );
}

export default ReportInitialView;
