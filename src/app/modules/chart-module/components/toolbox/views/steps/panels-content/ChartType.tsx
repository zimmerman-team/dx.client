/* third-party */
import React from "react";
import find from "lodash/find";
import { useStoreState } from "app/state/store/hooks";
/* project */
import {
  echartTypes,
  ChartTypeModel,
} from "app/modules/chart-module/routes/chart-type/data";
import ToolboxSubHeader from "../sub-header";
import { Box, Grid } from "@material-ui/core";

export function ChartToolBoxChartType() {
  const chartType = useStoreState((state) => state.charts.chartType.value);

  const fChartType = React.useMemo(() => {
    return find(
      echartTypes(false),
      (ct: ChartTypeModel) => ct.id === chartType
    );
  }, [chartType]);

  const topGap = React.useMemo(() => {
    return fChartType?.id === "echartsGeomap" ? 33 : 20;
  }, [fChartType]);

  const bottomGap = React.useMemo(() => {
    switch (fChartType?.id) {
      case "echartsGeomap":
        return 33;
      case "echartsSunburst":
      case "echartsLinechart":
      case "echartsTreemap":
        return 31;
      case "bigNumber":
        return 37;
      default:
        return 45;
    }
  }, [fChartType]);

  return (
    <>
      <ToolboxSubHeader name="Chart type" level={2} />
      <Box height={16} />

      <div
        css={`
          width: 90%;
          margin: auto;
          display: flex;
          flex-direction: column;
          ${!chartType && !fChartType && `height: 340px;`}
          align-items: ${chartType && fChartType ? "flex-start" : "center"};
          justify-content: ${chartType && fChartType ? "flex-start" : "center"};
        `}
      >
        {!chartType && (
          <div
            css={`
              color: #262c34;
              font-size: 14px;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              background: #dfe3e5;
              height: 349px;
              width: 98%;
              border-radius: 11px;
              justify-content: center;
              align-items: center;
              display: flex;
            `}
          >
            <b>Please select a chart type</b>
          </div>
        )}
        {chartType && fChartType && (
          <Grid container item spacing={2} direction="column">
            <Grid item xs={12} sm={12} md={12}>
              <div
                css={`
                  background: #dfe3e5;
                  width: 100%;
                  padding-left: 22px;
                  padding-right: 18px;
                  padding-top: 7px;
                  border-radius: 8px;
                  height: 349px;

                  color: #231d2c;
                `}
              >
                <div
                  css={`
                    height: 64px;
                    display: flex;
                    user-select: none;
                    flex-direction: row;
                    align-items: center;
                  `}
                >
                  {fChartType.icon}
                  <div
                    css={`
                      display: flex;
                      margin-left: 15px;
                      flex-direction: column;
                    `}
                  >
                    <p
                      css={`
                        font-size: 14px;
                        margin: 0px;
                        line-height: 20px;
                      `}
                    >
                      <b> {fChartType.label}</b>
                    </p>

                    <p
                      css={`
                        font-size: 12px;
                        font-family: "GothamNarrow-Book", "Helvetica Neue",
                          sans-serif;
                        margin: 0px;
                      `}
                    >
                      {fChartType.categories.join(", ")}
                    </p>
                  </div>
                </div>
                <div
                  css={`
                    height: ${topGap}px;
                  `}
                />

                <>
                  <div
                    css={`
                      height: 150px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    `}
                  >
                    {fChartType.preview}
                  </div>
                  <div
                    css={`
                      height: ${bottomGap}px;
                    `}
                  />
                  <p
                    css={`
                      font-family: "Gotham Narrow", sans-serif;
                      font-size: 10px;
                      line-height: normal;
                      padding-bottom: 17px;
                      margin-top: 10px;
                      color: #231d2c;
                    `}
                  >
                    {fChartType.description}
                  </p>
                </>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </>
  );
}
