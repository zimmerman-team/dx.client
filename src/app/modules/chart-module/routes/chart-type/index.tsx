/* third-party */
import React from "react";
import Grid from "@material-ui/core/Grid";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useParams } from "react-router-dom";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
/* project */
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import {
  echartTypes,
  ChartTypeModel,
  ChartBuilderChartTypeProps,
} from "app/modules/chart-module/routes/chart-type/data";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function ChartBuilderChartType(props: ChartBuilderChartTypeProps) {
  useTitle("DX DataXplorer - Chart Type");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();

  const chartType = useStoreState((state) => state.charts.chartType.value);
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const setChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );
  const clearMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );

  const onChartTypeChange =
    (chartTypeId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
      clearMapping();
      setChartType(chartType === chartTypeId ? null : chartTypeId);
    };

  if (dataset === null && !props.loading) {
    history.push(`/chart/${page}/data`);
  }

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        <Grid
          container
          spacing={2}
          css={`
            max-height: calc(100vh - 225px);
          `}
        >
          <Grid container item spacing={2}>
            {echartTypes(false).map((ct: ChartTypeModel) => (
              <Grid item xs={12} sm={6} md={4} key={ct.id}>
                <div
                  onClick={
                    ct.label === "" ? () => {} : onChartTypeChange(ct.id)
                  }
                  css={`
                    width: 100%;
                    height: 64px;
                    display: flex;
                    padding: 0 15px;
                    user-select: none;
                    border-radius: 8px;
                    flex-direction: row;
                    align-items: center;
                    background: ${chartType === ct.id ? "#cfd4da" : "#dfe3e6"};
                    border: 1px solid
                      ${chartType === ct.id ? "#262c34" : "#dfe3e6"};

                    ${ct.label === "" &&
                    `pointer-events: none;background: #f1f3f5;`}

                    &:hover {
                      cursor: ${ct.label !== "" ? "pointer" : "auto"};
                      background: #cfd4da;
                      border-color: #262c34;
                    }
                  `}
                >
                  {ct.icon}
                  <div
                    css={`
                      display: flex;
                      margin-left: 15px;
                      flex-direction: column;
                    `}
                  >
                    <div
                      css={`
                        font-size: 14px;
                      `}
                    >
                      <b>{ct.label}</b>
                    </div>
                    <div
                      css={`
                        font-size: 12px;
                        font-family: "GothamNarrow-Book", "Helvetica Neue",
                          sans-serif;
                      `}
                    >
                      {ct.categories.join(", ")}
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(ChartBuilderChartType);
