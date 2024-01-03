/* third-party */
import React from "react";
import moment from "moment";
/* project */
import { ReactComponent as ClockIcon } from "app/modules/report-module/asset/clock-img.svg";
import { ReactComponent as ExpandIcon } from "app/modules/report-module/asset/expand-icon.svg";
import { IconButton } from "@material-ui/core";
import { ReportChartWrapper } from "../chart-wrapper";

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
}

export default function GridItem(props: Props) {
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

          {props.added ? (
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
                font-family: "GothamNarrow", sans-serif;
              `}
            >
              Added
            </p>
          ) : (
            <IconButton
              onClick={() => props.setChartPreview(!props.chartPreview)}
              css={`
                padding: 4px;
                &:hover {
                  background: transparent;
                }
              `}
            >
              <ExpandIcon />
            </IconButton>
          )}
        </div>

        {props.chartPreview ? (
          <ReportChartWrapper
            id={props.id}
            width={"100"}
            chartPreviewInReport={true}
          />
        ) : (
          <div>{props.viz}</div>
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
