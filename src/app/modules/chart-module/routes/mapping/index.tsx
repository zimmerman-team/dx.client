/* third-party */
import React from "react";
import isEmpty from "lodash/isEmpty";
import useTitle from "react-use/lib/useTitle";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { getRequiredFieldsAndErrors } from "app/modules/chart-module/routes/mapping/utils";
import {
  ChartBuilderMappingMessageProps,
  ChartBuilderMappingProps,
} from "app/modules/chart-module/routes/mapping/data";
import ChartPlaceholder from "app/modules/chart-module/components/placeholder";
import { useRecoilState } from "recoil";
import { chartFromStoryAtom } from "app/state/recoil/atoms";
import { useLocation, useParams } from "react-router-dom";
import MappingErrorComponent from "app/modules/chart-module/routes/mapping/error";
import AIIcon from "app/assets/icons/AIIcon";

function ChartBuilderMapping(props: Readonly<ChartBuilderMappingProps>) {
  useTitle("DX Dataxplorer - Mapping");
  const { page, view } = useParams<{ page: string; view?: string }>();

  const location = useLocation();

  const mapping = useStoreState((state) => state.charts.mapping.value);

  const [requiredFields, setRequiredFields] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [minValuesFields, setMinValuesFields] = React.useState<
    { id: string; name: string; minValues: number }[]
  >([]);

  const [chartFromStory, setChartFromStory] =
    useRecoilState(chartFromStoryAtom);
  // access query parameters
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("fromstory");
  const storyPage = queryParams.get("page") as string;

  React.useEffect(() => {
    const { updRequiredFields, updMinValuesFields } =
      getRequiredFieldsAndErrors(mapping, props.dimensions);

    setRequiredFields(updRequiredFields);

    setMinValuesFields(updMinValuesFields);
  }, [mapping, props.dimensions]);

  React.useEffect(() => {
    if (paramValue === "true") {
      setChartFromStory((prev) => ({
        ...chartFromStory,
        state: true,
        action: "create",
        page: storyPage,
        chartId: page,
      }));
    }
  }, []);

  if (props.dataError || props.chartError) {
    return (
      <>
        <MappingErrorComponent
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
        {isEmpty(props.renderedChartMappedData) ? (
          <ChartPlaceholder
            loading={props.loading}
            css={`
              width: calc(100% - 24px);
            `}
          />
        ) : (
          <div
            ref={props.containerRef}
            css={`
              width: calc(100% - 24px);
            `}
          >
            {requiredFields.length === 0 && minValuesFields.length === 0 && (
              <CommonChart
                containerRef={props.containerRef}
                renderedChart={props.renderedChart}
                visualOptions={props.visualOptions}
                setVisualOptions={props.setVisualOptions}
                renderedChartMappedData={props.renderedChartMappedData}
                setChartErrorMessage={props.setChartErrorMessage}
                setChartError={props.setChartError}
                renderedChartType={props.renderedChartType}
                mapping={mapping}
              />
            )}
          </div>
        )}
        <ChartBuilderMappingMessage
          requiredFields={requiredFields}
          minValuesFields={minValuesFields}
          dimensions={props.dimensions}
        />
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

function ChartBuilderMappingMessage(
  props: Readonly<ChartBuilderMappingMessageProps>
) {
  const { requiredFields, minValuesFields } = props;

  return (
    <div
      css={`
        width: 100%;
        font-size: 14px;
        font-weight: 400;
        min-height: 56px;
        position: absolute;
        bottom: 5%;
        padding: 10px 20px;
        border-radius: 43px;
        color: #262c34;
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
        display: ${requiredFields.length > 0 || minValuesFields.length > 0
          ? "flex"
          : "none"};
        align-items: center;
        gap: 4px;
      `}
    >
      {requiredFields.length > 0 && (
        <React.Fragment>
          Required chart variables: you need to map{" "}
          <b>
            {requiredFields
              .map((f: { id: string; name: string }) => f.name)
              .join(", ")}
            .
          </b>
        </React.Fragment>
      )}
      {minValuesFields.length > 0 && (
        <React.Fragment>
          {minValuesFields.map(
            (f: { id: string; name: string; minValues: number }) => (
              <div key={f.id}>
                Please map at least <b>{f.minValues}</b> dimensions on{" "}
                <b>{f.name}</b>
              </div>
            )
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default ChartBuilderMapping;
