/* third-party */
import React from "react";
import isEmpty from "lodash/isEmpty";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useParams } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { CHART_DEFAULT_WIDTH } from "app/modules/chart-module/data";
import { useUpdateEffectOnce } from "app/hooks/useUpdateEffectOnce";
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderFiltersProps } from "app/modules/chart-module/routes/filters/data";

function ChartBuilderFilters(props: Readonly<ChartBuilderFiltersProps>) {
  useTitle("DX DataXplorer - Filters");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();

  const dataset = useStoreState((state) => state.charts.dataset.value);

  React.useEffect(() => {
    //if dataset is empty and not loading, redirect to data page
    if (dataset === null && !props.loading) {
      history.push(`/chart/${page}/data`);
    }
  }, [dataset]);

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
      </div>
    </div>
  );
}

export default withAuthenticationRequired(ChartBuilderFilters);
