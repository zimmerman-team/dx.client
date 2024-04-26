/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useParams } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderFiltersProps } from "app/modules/chart-module/routes/filters/data";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";

function ChartBuilderFilters(props: Readonly<ChartBuilderFiltersProps>) {
  useTitle("DX DataXplorer - Filters");

  const history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const { page } = useParams<{ page: string }>();

  const dataset = useStoreState((state) => state.charts.dataset.value);

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  React.useEffect(() => {
    //if dataset is empty and not loading, redirect to data page
    if (dataset === null && !props.loading) {
      history.push(`/chart/${page}/data`);
    }
  }, [dataset]);

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  if (!canChartEditDelete && page !== "new") {
    return (
      <>
        <div css="width: 100%; height: 100px;" />
        <NotAuthorizedMessageModule asset="chart" action="edit" />
      </>
    );
  }

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        <div
          ref={props.containerRef}
          css={`
            width: calc(100% - 24px);
          `}
        >
          <CommonChart
            containerRef={props.containerRef}
            renderedChart={props.renderedChart}
            visualOptions={props.visualOptions}
            setVisualOptions={props.setVisualOptions}
            renderedChartSsr={props.renderedChartSsr}
            renderedChartMappedData={props.renderedChartMappedData}
            setChartErrorMessage={props.setChartErrorMessage}
            setNotFound={props.setNotFound}
            renderedChartType={props.renderedChartType}
          />
        </div>
        <div
          css={`
            position: absolute;
            right: 0%;
            top: 4%;
            display: ${props.isAIAssistedChart ? "block" : "none"};
          `}
        >
          <AIIcon />
        </div>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(ChartBuilderFilters);
