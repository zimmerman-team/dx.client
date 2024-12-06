/* third-party */
import React from "react";
import moment from "moment";
/* project */
import { ReactComponent as ClockIcon } from "app/modules/report-module/asset/clock-img.svg";
import { ReactComponent as ExpandIcon } from "app/modules/report-module/asset/expand-icon.svg";
import { IconButton } from "@material-ui/core";
import { ReportChartWrapper } from "app/modules/report-module/components/chart-wrapper/";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";

interface Props {
  id: string;
  path: string;
  title: string;
  descr: string;
  date: string;
  viz: React.ReactNode;
  added?: boolean;
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  chartPreview: boolean;
  setChartPreview: React.Dispatch<React.SetStateAction<boolean>>;
  isAIAssistedChart: boolean;
}

export default function GridItem(props: Props) {
  const [chartError, setChartError] = React.useState(false);

  return (
    <div
      css={`
        width: 296px;
        height: ${props.chartPreview ? "259px" : "125px"};
        transition: height 0.2s ease-in-out;
        color: #262c34;
        position: relative;
        padding: 12px 16px;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          > div:nth-of-type(1) {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 17px;

            > p:first-child {
              color: inherit;
              text-decoration: none;
              width: calc(100% - 70px);
            }
          }
          > div:nth-of-type(2) {
            display: flex;
            ${props.chartPreview &&
            "flex-direction:column; justify-content: end;"}
          }
        `}
      >
        <div>
          <p
            title={props.title}
            css={`
              margin: 0;
              font-size: 14px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}
          >
            <b>{props.title}</b>
          </p>
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <div
              css={`
                display: ${props.isAIAssistedChart ? "block" : "none"};
                margin-top: 6px;
              `}
            >
              <AIIcon />
            </div>
            {props.added && (
              <p
                css={`
                  margin: 0;
                  width: 57px;
                  height: 17px;
                  display: flex;
                  font-size: 12px;
                  border-radius: 10px;
                  align-items: center;
                  border: 1px solid #000;
                  justify-content: center;
                  font-family: "GothamNarrow", "Helvetica Neue", sans-serif;
                `}
              >
                Added
              </p>
            )}
            <IconButton
              onClick={() => props.setChartPreview(!props.chartPreview)}
              data-testid="expand-chart-button"
              css={`
                padding: 4px;
                &:hover {
                  background: transparent;
                }
              `}
            >
              <ExpandIcon />
            </IconButton>
          </div>
        </div>

        {props.chartPreview ? (
          <ReportChartWrapper
            id={props.id}
            width={"100"}
            chartPreviewInReport={true}
            error={chartError}
            setError={setChartError}
          />
        ) : (
          <div data-testid="closed-chart">{props.viz}</div>
        )}
      </div>
      <div
        css={`
          display: ${props.chartPreview ? "none" : "flex"};
          font-size: 12px;
          gap: 4.4px;
          align-items: center;
          align-self: flex-end;
          margin-top: -2px;
          position: absolute;
          bottom: 12px;
          right: 10px;
          > p {
            margin: 0;
          }
          svg {
            width: 15px;
            height: 15px;
            path {
              fill: #231d2c;
            }
          }
        `}
      >
        <ClockIcon />
        <p>{moment(props.date).format("MMMM  YYYY")}</p>
      </div>
    </div>
  );
}
