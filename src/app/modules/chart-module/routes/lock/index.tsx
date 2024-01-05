/* third-party */
import React from "react";
import isEmpty from "lodash/isEmpty";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useParams } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
/* project */
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { ChartBuilderLockProps } from "app/modules/chart-module/routes/lock/data";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";

function ChartBuilderLock(props: Readonly<ChartBuilderLockProps>) {
  useTitle("DX DataXplorer - Lock");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const mapping = useStoreState((state) => state.charts.mapping.value);
  const dataset = useStoreState((state) => state.charts.dataset.value);

  React.useEffect(() => {
    if ((dataset === null && !props.loading) || isEmpty(mapping)) {
      history.push(`/chart/${page}/data`);
    }
  }, []);

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        <div
          ref={containerRef}
          css={`
            width: calc(100% - 24px);
            height: calc(100vh - 225px);
          `}
        >
          <CommonChart
            containerRef={containerRef}
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

export default withAuthenticationRequired(ChartBuilderLock);
