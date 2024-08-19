import {
  ChartType,
  CommonChart,
} from "app/modules/chart-module/components/common-chart";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { ChartRenderedItem } from "app/modules/chart-module/data";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import React from "react";

export default function ChartContainer(props: {
  chartId: string;
  chartName: string;
  visualOptions: any;
  withHeader?: boolean;
  renderedChart: string;
  renderedChartSsr: boolean;
  renderedChartMappedData: any;
  setRawViz?: React.Dispatch<any>;
  setVisualOptions: (value: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  setChartError: React.Dispatch<React.SetStateAction<boolean>>;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  renderedChartType?: ChartType;
  inChartWrapper?: boolean;
  chartPreviewInReport?: boolean;
  mapping?: any;
  datasetDetails?: DatasetListItemAPIModel;
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  chartFromAPI: ChartRenderedItem;
  notFound: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}) {
  return (
    <>
      {props.dataError || props.notFound ? (
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;
            width: 100%;

            svg {
              width: 48px;
              height: 48px;
            }
            p:nth-of-type(1) {
              color: #e75656;
              text-align: center;
              font-family: "GothamNarrow-Bold", sans-serif;
              font-size: 18px;
              margin-top: 16px;
              margin-bottom: 0;
              @media (max-width: 599px) {
                font-size: 16px;
              }
            }
            p:nth-of-type(2) {
              color: #e75656;
              text-align: center;
              font-family: "GothamNarrow-Book", sans-serif;
              font-size: 14px;
              margin-top: 16px;
            }
          `}
        >
          <ErrorOutlineIcon htmlColor="#E75656" fontSize="large" />
          <p>
            Data could not be processed, please try again <br /> or contact your
            administrator.
          </p>
          <p>{props.chartErrorMessage}</p>
        </div>
      ) : (
        <div
          ref={props.containerRef}
          css={`
            width: 100%;
            height: 100%;
            position: relative;

            > div {
              margin: 0 !important;
              overflow: hidden !important;

              :nth-of-type(2) {
                #extra-loader {
                  display: none !important;
                }
              }
            }
          `}
        >
          <CommonChart
            chartId={props.chartId}
            containerRef={props.containerRef}
            renderedChart={props.renderedChart}
            visualOptions={props.visualOptions}
            renderedChartSsr={props.renderedChartSsr}
            setVisualOptions={props.setVisualOptions}
            renderedChartType={props.renderedChartType}
            renderedChartMappedData={props.renderedChartMappedData}
            setChartErrorMessage={props.setChartErrorMessage}
            setChartError={props.setNotFound}
            inChartWrapper={true}
            mapping={props.chartFromAPI?.mapping}
            datasetDetails={props.datasetDetails}
            hideChartSource
          />
        </div>
      )}
    </>
  );
}
