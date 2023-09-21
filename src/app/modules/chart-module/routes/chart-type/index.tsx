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
  ChartBuilderChartTypeProps,
} from "app/modules/chart-module/routes/chart-type/data";
import { useRecoilState } from "recoil";
import { automateChartCreationAtom } from "app/state/recoil/atoms";

export function ChartBuilderChartType(props: ChartBuilderChartTypeProps) {
  useTitle("DX DataXplorer - Chart Type");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const [automateChartCreation, setAutomateChartCreation] = useRecoilState(
    automateChartCreationAtom
  );
  const chartType = useStoreState((state) => state.charts.chartType.value);

  const getSuggestedChartType = () => {
    return props.suggestedChartTypeArray.map((chart) => chart.chartType);
  };

  const dataset = useStoreState((state) => state.charts.dataset.value);
  const setChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );
  const clearMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );
  const setActivePanels = useStoreActions(
    (state) => state.charts.activePanels.setValue
  );

  React.useEffect(() => {
    // When the Chart Type component is rendered, we are at step 2.
    setActivePanels(2);
  }, []);

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
            width: calc(100% - 24px);
            max-height: calc(100vh - 225px);
          `}
        >
          <Grid container item spacing={2}>
            {echartTypes(false).map((ct) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={ct.id}>
                  <div
                    onClick={
                      ct.label === "" ? () => {} : onChartTypeChange(ct.id)
                    }
                    css={`
                      position: relative;
                      width: 100%;
                      height: 64px;
                      display: flex;
                      padding: 0 15px;
                      user-select: none;
                      border-radius: 8px;
                      flex-direction: row;
                      align-items: center;
                      background: ${chartType === ct.id
                        ? "#cfd4da"
                        : "#dfe3e6"};
                      border: 1px solid
                        ${(() => {
                          if (
                            chartType === ct.id &&
                            getSuggestedChartType().includes(ct.subId)
                          ) {
                            return "#6061E5";
                          } else if (chartType === ct.id) {
                            return "#262c34";
                          } else {
                            return "#dfe3e6";
                          }
                        })()};

                      ${automateChartCreation &&
                      getSuggestedChartType().includes(ct.subId) &&
                      `background: #359C96; color: white; svg{path{fill: white;}}`}

                      ${ct.label === "" &&
                      `pointer-events: none;background: #f1f3f5;`}

                    &:hover {
                        cursor: ${ct.label !== "" ? "pointer" : "auto"};
                        background: #cfd4da;
                        border-color: #262c34;

                        ${automateChartCreation &&
                        getSuggestedChartType().includes(ct.subId) &&
                        `background: #359C96; color: white; border-color:#6061E5; svg{path{fill: white; }}`}
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
                    {automateChartCreation &&
                      getSuggestedChartType().includes(ct.subId) && (
                        <p
                          css={`
                            position: absolute;
                            top: 8px;
                            right: 7px;
                            width: 104px;
                            height: 17px;
                            border-radius: 10px;
                            background-color: #daf5f3;
                            color: #231d2c;
                            text-align: center;
                            justify-content: center;
                            display: flex;
                            align-items: center;
                            font-family: "Gotham Narrow", sans-serif;
                            font-size: 12px;
                            margin: 0;
                          `}
                        >
                          Recommended
                        </p>
                      )}
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
