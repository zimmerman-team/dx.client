/* third-party */
import React from "react";
import isEmpty from "lodash/isEmpty";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useParams } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { getRequiredFieldsAndErrors } from "app/modules/chart-module/routes/mapping/utils";
import {
  ChartBuilderMappingMessageProps,
  ChartBuilderMappingProps,
} from "app/modules/chart-module/routes/mapping/data";
import ChartPlaceholder from "../../components/placeholder";

function ChartBuilderMapping(props: Readonly<ChartBuilderMappingProps>) {
  useTitle("DX DataXplorer - Mapping");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const dataset = useStoreState((state) => state.charts.dataset.value);
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const [requiredFields, setRequiredFields] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [minValuesFields, setMinValuesFields] = React.useState<
    { id: string; name: string; minValues: number }[]
  >([]);

  React.useEffect(() => {
    const { updRequiredFields, updMinValuesFields } =
      getRequiredFieldsAndErrors(mapping, props.dimensions);

    setRequiredFields(updRequiredFields);

    setMinValuesFields(updMinValuesFields);
  }, [mapping, props.dimensions]);

  React.useEffect(() => {
    if (dataset === null && !props.loading) {
      history.push(`/chart/${page}/data`);
    }
  }, [dataset]);

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        {isEmpty(props.renderedChartMappedData) ? (
          <ChartPlaceholder loading={props.loading} />
        ) : (
          <div
            ref={containerRef}
            css={`
              width: calc(100% - 24px);
              height: calc(100vh - 225px);
            `}
          >
            {requiredFields.length === 0 && minValuesFields.length === 0 && (
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
            )}
          </div>
        )}
        <ChartBuilderMappingMessage
          requiredFields={requiredFields}
          minValuesFields={minValuesFields}
          dimensions={props.dimensions}
        />
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

export default withAuthenticationRequired(ChartBuilderMapping);
