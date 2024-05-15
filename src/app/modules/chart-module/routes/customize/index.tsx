/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
/* project */
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderCustomizeProps } from "app/modules/chart-module/routes/customize/data";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";
import { useParams } from "react-router-dom";

function ChartBuilderCustomize(props: Readonly<ChartBuilderCustomizeProps>) {
  useTitle("DX DataXplorer - Customize");

  const { isAuthenticated, user } = useAuth0();
  const { page, view } = useParams<{ page: string; view?: string }>();

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  const mapping = useStoreState((state) => state.charts.mapping.value);

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  if (!canChartEditDelete) {
    return (
      <>
        <div css="width: 100%; height: 100px;" />
        <NotAuthorizedMessageModule asset="chart" action="edit" />
      </>
    );
  }
  if (props.dataError || props.chartError) {
    return (
      <>
        <ErrorComponent
          chartErrorMessage={props.chartErrorMessage}
          dataError={props.dataError}
          chartError={props.chartError}
          page={page}
        />
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
            setChartError={props.setChartError}
            renderedChartType={props.renderedChartType}
            mapping={mapping}
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

export default withAuthenticationRequired(ChartBuilderCustomize);
