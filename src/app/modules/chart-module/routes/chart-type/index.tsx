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
  chartTypesFromMiddleWare,
} from "app/modules/chart-module/routes/chart-type/data";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import AISwitch from "../../components/switch/AISwitch";
import { useRecoilState } from "recoil";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import axios from "axios";
import { get } from "lodash";

function ChartBuilderChartType(props: ChartBuilderChartTypeProps) {
  useTitle("DX DataXplorer - Chart Type");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);

  const [isAiActive, setIsAiActive] = useRecoilState(isChartAIAgentActive);
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const loadChartTypesSuggestions = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.fetch
  );
  const chartTypeSuggestions = useStoreState((state) =>
    get(state.charts.ChartTypesSuggest, "crudData", [])
  ) as { chartType: keyof typeof chartTypesFromMiddleWare }[] | null;
  const setChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );
  const clearMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );
  console.log(chartTypeSuggestions, "chartTypeSuggestions");

  const onChartTypeChange =
    (chartTypeId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
      clearMapping();
      setChartType(chartType === chartTypeId ? null : chartTypeId);
    };

  React.useEffect(() => {
    //if dataset is empty and not loading, redirect to data page
    if (dataset === null && !props.loading) {
      history.push(`/chart/${page}/data`);
    } else {
      // load chart type suggestions
      loadChartTypesSuggestions({
        token,
        filterString: `id=${dataset as string}`,
        storeInCrudData: true,
      });

      props.loadDataset(`chart/sample-data/${dataset}`);
    }
  }, [dataset]);

  const aIChartSuggestions = (ct: string) => {
    if (!chartTypeSuggestions) return [];

    return (
      chartTypeSuggestions.length &&
      chartTypeSuggestions?.findIndex(
        (c: { chartType: keyof typeof chartTypesFromMiddleWare }) =>
          chartTypesFromMiddleWare[c.chartType] === ct
      ) > -1
    );
  };

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        <div
          css={`
            display: flex;
            flex-direction: column;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: end;
              gap: 5px;
              span {
                color: #000000;
                font-size: 12px;
                font-family: "GothamNarrow-Book", sans-serif;
              }
            `}
          >
            <span>AI Agent</span>
            <AISwitch checked={isAiActive} setIsAiActive={setIsAiActive} />
          </div>
          <p
            css={`
              font-family: "GothamNarrow-Bold", sans-serif;
              font-size: 18px;
              color: #231d2c;
              margin-bottom: 0px;
              span {
                color: #359c96;
              }
            `}
          >
            Our <span>AI agent</span> has provided you with a suggested chart to
            communicate your dataset. <br />
            If you decide to go with any other chart, no worries it’s up to you!
            Make your pick and tap “Next”.
          </p>
          <div
            css={`
              height: 40px;
            `}
          />
        </div>
        <Grid
          container
          spacing={2}
          css={`
            max-height: calc(100vh - 225px);
          `}
        >
          <Grid container item spacing={2}>
            {echartTypes(false).map((ct: ChartTypeModel) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={ct.id}>
                  <div
                    onClick={
                      ct.label === "" ? () => {} : onChartTypeChange(ct.id)
                    }
                    data-cy="chart-type-item"
                    css={`
                      width: 100%;
                      height: 64px;
                      display: flex;
                      padding: 0 15px;
                      user-select: none;
                      border-radius: 8px;
                      flex-direction: row;
                      align-items: center;
                      background: ${aIChartSuggestions(ct.id)
                        ? "#359C96"
                        : chartType === ct.id
                        ? "#cfd4da"
                        : "#dfe3e6"};
                      border: 1px solid
                        ${aIChartSuggestions(ct.id)
                          ? "#359C96"
                          : chartType === ct.id
                          ? "#6061E5"
                          : "#dfe3e6"};

                      ${ct.label === "" &&
                      `pointer-events: none;background: #f1f3f5;`}

                      &:hover {
                        cursor: ${ct.label !== "" ? "pointer" : "auto"};
                        background: #cfd4da;
                        border-color: #262c34;
                      }
                      svg {
                        path {
                          fill: ${aIChartSuggestions(ct.id)
                            ? "#fff"
                            : "#262C34"};
                        }
                        circle {
                          fill: ${aIChartSuggestions(ct.id)
                            ? "#fff"
                            : "#262C34"};
                        }
                      }
                    `}
                    data-testid={ct.id}
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
                          color: ${aIChartSuggestions(ct.id)
                            ? "#fff"
                            : "#262C34"};
                        `}
                      >
                        <b>{ct.label}</b>
                      </div>
                      <div
                        css={`
                          font-size: 12px;
                          font-family: "GothamNarrow-Book", "Helvetica Neue",
                            sans-serif;
                          color: ${aIChartSuggestions(ct.id)
                            ? "#fff"
                            : "#262C34"};
                        `}
                      >
                        {ct.categories.join(", ")}
                      </div>
                    </div>
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

export default ChartBuilderChartType;
