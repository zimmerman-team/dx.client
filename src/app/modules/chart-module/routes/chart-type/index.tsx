/* third-party */
import React from "react";
import Grid from "@material-ui/core/Grid";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { get } from "lodash";
/* project */
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import {
  echartTypes,
  ChartTypeModel,
  ChartBuilderChartTypeProps,
  chartTypesFromMiddleWare,
} from "app/modules/chart-module/routes/chart-type/data";
import AISwitch from "app/modules/chart-module/components/switch/AISwitch";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  chartFromReportAtom,
  isChartAIAgentActive,
  isChartAutoMappedAtom,
} from "app/state/recoil/atoms";
import { charts } from "app/modules/chart-module/data";
import AILoader from "app/modules/chart-module/routes/chart-type/loader";
import { handleValidityCheckOfDimensionsToBeMapped } from "app/modules/chart-module/components/toolbox/steps/panels-content/Mapping";
import { IChartType } from "app/state/api/action-reducers/sync/charts";

function ChartBuilderChartType(props: Readonly<ChartBuilderChartTypeProps>) {
  useTitle("DX Dataxplorer - Chart Type");

  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const location = useLocation();
  const [isAiActive, setIsAiActive] = useRecoilState(isChartAIAgentActive);
  const datasetId = useStoreState((state) => state.charts.dataset.value);
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const loadChartTypesSuggestions = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.fetch
  );
  const chartTypesSuggestionsLoading = useStoreState(
    (state) => state.charts.ChartTypesSuggest.loading
  );
  const resetIsChartAutoMapped = useResetRecoilState(isChartAutoMappedAtom);
  const chartTypeSuggestions = useStoreState((state) =>
    get(state.charts.ChartTypesSuggest, "crudData", [])
  ) as { charttype: keyof typeof chartTypesFromMiddleWare }[] | null;

  const setSelectedAIChart = useStoreActions(
    (actions) => actions.charts.SelectedAIChartState.setValue
  );
  const setChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );
  const clearMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );
  // access query parameters
  const queryParams = new URLSearchParams(location.search);
  const loadDatasetParamValue = queryParams.get("loadataset");
  const fromReportParamValue = queryParams.get("fromreport");
  const reportPage = queryParams.get("page") as string;

  const [chartFromReport, setChartFromReport] =
    useRecoilState(chartFromReportAtom);

  React.useEffect(() => {
    //if dataset is empty and not loading, redirect to data page
    if (datasetId === null && !props.loading && page === "new") {
      history.push(`/chart/${page}/data`);
    } else if (loadDatasetParamValue) {
      //when landing in chart type step from outside the chart module,
      //load the sample data as data step is skipped
      props.loadDataset(datasetId!);
      if (isAiActive) {
        loadChartTypesSuggestions({
          token,
          filterString: `id=${datasetId as string}`,
          storeInCrudData: true,
        });
      }
    } else if (isAiActive) {
      // load chart type suggestions
      loadChartTypesSuggestions({
        token,
        filterString: `id=${datasetId as string}`,
        storeInCrudData: true,
      });
    }
  }, [datasetId]);

  React.useEffect(() => {
    if (fromReportParamValue === "true") {
      setChartFromReport((prev) => ({
        ...chartFromReport,
        state: true,
        action: "create",
        page: reportPage,
        chartId: "new",
      }));
    }
  }, []);

  const validAiSuggestions = () => {
    try {
      const validSuggestions:
        | {
            charttype: keyof typeof chartTypesFromMiddleWare;
          }[]
        | null = [];

      const chartTypeSuggestionsArr: any = chartTypeSuggestions;
      // check if the dimensions are valid for each chart type
      chartTypeSuggestionsArr?.forEach((cts: any) => {
        const chartDimensions = get(
          charts,
          `[${
            chartTypesFromMiddleWare[
              cts.charttype as keyof typeof chartTypesFromMiddleWare
            ]
          }].dimensions`,
          []
        );

        const dimensionsValidObj: any = {};
        chartDimensions.forEach((d: any) => {
          const { isValid, selectedDataTypes } =
            handleValidityCheckOfDimensionsToBeMapped(
              cts[d.id as any],
              d,
              props.dataTypes
            );

          dimensionsValidObj[d.id] = isValid();
        });
        const isDimensionsValid = Object.values(dimensionsValidObj).every(
          (v) => v === true
        );
        // if all dimensions are valid, add the chart type to the valid suggestions
        if (isDimensionsValid) {
          validSuggestions.push(cts);
        }
      });
      return validSuggestions;
    } catch (e) {
      console.log(e);
    }
  };

  const aIChartSuggestions = (ctId: string) => {
    try {
      if (!chartTypeSuggestions) return false;

      return validAiSuggestions()?.find(
        (c: { charttype: keyof typeof chartTypesFromMiddleWare }) =>
          chartTypesFromMiddleWare[c.charttype] === ctId
      );
    } catch (e) {
      console.log(e);
    }
  };

  function getColor(ctId: string) {
    let background, border;

    if (aIChartSuggestions(ctId) && chartType === ctId) {
      background = "#359C96";
      border = "#6061E5";
    } else if (aIChartSuggestions(ctId)) {
      background = "#359C96";
      border = "#359C96";
    } else if (chartType === ctId) {
      background = "#cfd4da";
      border = "#6061E5";
    } else {
      background = "#dfe3e6";
      border = "#dfe3e6";
    }

    return { background, border };
  }

  const onChartTypeChange =
    (chartTypeId: IChartType) => (e: React.MouseEvent<HTMLButtonElement>) => {
      sessionStorage.setItem("visualOptions", JSON.stringify({}));
      props.setVisualOptionsOnChange(
        chartType === chartTypeId ? null : chartTypeId
      );
      clearMapping();
      resetIsChartAutoMapped();
      props.setChartFromAPI(null);
      setChartType(chartType === chartTypeId ? null : chartTypeId);
      setSelectedAIChart(Boolean(aIChartSuggestions(chartTypeId)));
    };

  return (
    <div css={commonStyles.container}>
      <div
        css={`
          ${commonStyles.innercontainer}
          padding: 40px 0px 0 0;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          {chartTypesSuggestionsLoading ? (
            <div
              css={`
                height: 44px;
              `}
            />
          ) : (
            <>
              {isAiActive ? (
                <p
                  css={`
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 18px;
                    color: #231d2c;
                    margin-bottom: 0px;
                    span {
                      color: #359c96;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                    }
                  `}
                >
                  {validAiSuggestions() === undefined ||
                  validAiSuggestions()?.length === 0 ? (
                    <>
                      Our <span>AI agent</span> is unable to recommend a
                      specific chart for your dataset. Feel free to choose any
                      chart <br /> that best suits your needs. Your selection is
                      entirely up to you! Simply make your choice and click
                      "Next."{" "}
                    </>
                  ) : (
                    <>
                      Our <span>AI agent</span> is providing you with one or
                      more suggested charts to communicate your dataset. <br />{" "}
                      Feel free to pick another chart type.
                    </>
                  )}
                </p>
              ) : (
                <div></div>
              )}
            </>
          )}
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: end;
              gap: 5px;
              flex-shrink: 0;
              span {
                color: #000000;
                font-size: 12px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              }
            `}
          >
            {chartTypesSuggestionsLoading && <AILoader />}

            <span>AI Agent</span>
            <AISwitch
              checked={isAiActive}
              setIsAiActive={setIsAiActive}
              dataset={datasetId as string}
            />
          </div>
        </div>
        <div
          css={`
            height: 40px;
          `}
        />
        <div>
          <p
            css={`
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 24px;
              margin: 0;
              margin-bottom: 15px;
            `}
          >
            Basic
          </p>
          <Grid
            container
            spacing={2}
            css={`
              max-height: calc(100vh - 225px);
            `}
          >
            <Grid container item spacing={2}>
              {echartTypes(false)
                .filter((c) => c.class === "basic")
                .map((ct: ChartTypeModel) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={ct.id}>
                      <button
                        onClick={
                          ct.label === "" ? () => {} : onChartTypeChange(ct.id)
                        }
                        data-cy="chart-type-item"
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
                          background: ${getColor(ct.id).background};
                          border: 1px solid ${getColor(ct.id).border};

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
                            align-items: flex-start;
                            gap: 3px;
                          `}
                        >
                          <div
                            css={`
                              font-size: 14px;
                              color: ${aIChartSuggestions(ct.id)
                                ? "#fff"
                                : "#262C34"};
                              b {
                                margin: 0;
                              }
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
                        <div
                          css={`
                            display: ${aIChartSuggestions(ct.id)
                              ? "flex"
                              : "none"};
                            position: absolute;
                            top: 6px;
                            right: 6px;
                            background: #daf5f3;
                            border-radius: 4px;
                            justify-content: center;
                            align-items: center;
                            width: 20px;
                            height: 16px;
                            color: #373d43;
                            font-size: 10px;
                            font-family: "GothamNarrow-Book", "Helvetica Neue",
                              sans-serif;
                          `}
                          data-cy="ai-suggestion-icon"
                        >
                          AI
                        </div>
                      </button>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </div>
        <div
          css={`
            height: 40px;
          `}
        />
        <div>
          <p
            css={`
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;

              font-size: 24px;
              margin: 0;
              margin-bottom: 15px;
            `}
          >
            Advanced
          </p>
          <Grid
            container
            spacing={2}
            css={`
              max-height: calc(100vh - 225px);
            `}
          >
            <Grid container item spacing={2}>
              {echartTypes(false)
                .filter((c) => c.class === "advanced")
                .map((ct: ChartTypeModel) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={ct.id}>
                      <button
                        onClick={
                          ct.label === "" ? () => {} : onChartTypeChange(ct.id)
                        }
                        data-cy="chart-type-item"
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
                          background: ${getColor(ct.id).background};
                          border: 1px solid ${getColor(ct.id).border};

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
                            align-items: flex-start;
                            gap: 3px;
                          `}
                        >
                          <div
                            css={`
                              font-size: 14px;
                              color: ${aIChartSuggestions(ct.id)
                                ? "#fff"
                                : "#262C34"};
                              b {
                                margin: 0;
                              }
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
                        <div
                          css={`
                            display: ${aIChartSuggestions(ct.id)
                              ? "flex"
                              : "none"};
                            position: absolute;
                            top: 6px;
                            right: 6px;
                            background: #daf5f3;
                            border-radius: 4px;
                            justify-content: center;
                            align-items: center;
                            width: 20px;
                            height: 16px;
                            color: #373d43;
                            font-size: 10px;
                            font-family: "GothamNarrow-Book", "Helvetica Neue",
                              sans-serif;
                          `}
                          data-cy="ai-suggestion-icon"
                        >
                          AI
                        </div>
                      </button>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </div>
        <div
          css={`
            height: 40px;
          `}
        />

        <div>
          <p
            css={`
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 24px;
              margin: 0;
              margin-bottom: 15px;
            `}
          >
            Compound
          </p>
          <Grid
            container
            spacing={2}
            css={`
              max-height: calc(100vh - 225px);
            `}
          >
            <Grid container item spacing={2}>
              {echartTypes(false)
                .filter((c) => c.class === "compound")
                .map((ct: ChartTypeModel) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={ct.id}>
                      <button
                        onClick={
                          ct.label === "" ? () => {} : onChartTypeChange(ct.id)
                        }
                        data-cy="chart-type-item"
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
                          background: ${getColor(ct.id).background};
                          border: 1px solid ${getColor(ct.id).border};

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
                            gap: 3px;
                            align-items: flex-start;
                          `}
                        >
                          <div
                            css={`
                              font-size: 14px;
                              color: ${aIChartSuggestions(ct.id)
                                ? "#fff"
                                : "#262C34"};
                              b {
                                margin: 0;
                              }
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
                        <div
                          css={`
                            display: ${aIChartSuggestions(ct.id)
                              ? "flex"
                              : "none"};
                            position: absolute;
                            top: 6px;
                            right: 6px;
                            background: #daf5f3;
                            border-radius: 4px;
                            justify-content: center;
                            align-items: center;
                            width: 20px;
                            height: 16px;
                            color: #373d43;
                            font-size: 10px;
                            font-family: "GothamNarrow-Book", "Helvetica Neue",
                              sans-serif;
                          `}
                          data-cy="ai-suggestion-icon"
                        >
                          AI
                        </div>
                      </button>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </div>
        <div
          css={`
            height: 40px;
          `}
        />
      </div>
    </div>
  );
}

export default ChartBuilderChartType;
