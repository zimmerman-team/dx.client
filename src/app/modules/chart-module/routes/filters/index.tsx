/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useParams } from "react-router-dom";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderFiltersProps } from "app/modules/chart-module/routes/filters/data";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";

function ChartBuilderFilters(props: Readonly<ChartBuilderFiltersProps>) {
  useTitle("DX Dataxplorer - Filters");
  const { page } = useParams<{ page: string }>();
  const mapping = useStoreState((state) => state.charts.mapping.value);

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

export default ChartBuilderFilters;
