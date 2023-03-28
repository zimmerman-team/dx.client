import Grid from "@material-ui/core/Grid";
import { ReactComponent as ReportIcon } from "../../assets/reports-img.svg";
import React from "react";

import GridItem from "./gridItem";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import ReportAddnewCard from "./reportAddNewCard";
import { PageLoader } from "app/modules/common/page-loader";

export default function ReportsGrid() {
  const loadedReports = useStoreState(
    (state) => state.reports.ReportsGet.crudData ?? []
  ) as any;
  const isLoadingReports = useStoreState(
    (state) => state.reports.ReportsGet.loading
  );
  const loadReports = useStoreActions(
    (actions) => actions.reports.ReportsGet.fetch
  );

  React.useEffect(() => {
    loadReports({ filterString: `` });
  }, []);
  if (isLoadingReports) {
    return <PageLoader />;
  }

  return (
    <Grid container spacing={2}>
      <ReportAddnewCard />
      {loadedReports?.map((data: any) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <GridItem
            key={data.id}
            id={data.id}
            date={data.createdDate}
            title={data.title}
            descr={data.subTitle}
            viz={<ReportIcon />}
          />
        </Grid>
      ))}
    </Grid>
  );
}
