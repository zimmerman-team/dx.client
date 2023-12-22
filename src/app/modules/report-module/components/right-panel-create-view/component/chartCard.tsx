import React from "react";

import moment from "moment";
import { Link } from "react-router-dom";
import { ReactComponent as ClockIcon } from "app/modules/report-module/asset/clock-img.svg";

interface Props {
  id: string;
  title: string;
  date: string;
  viz: React.ReactNode;
  added?: boolean;
}

export default function ChartCard(props: Props) {
  return (
    <div
      css={`
        width: 354px;
        color: #231d2c;
        background: #fff;
        position: relative;
        padding: 16px 25px 13px;

        justify-content: space-between;
      `}
    >
      <div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;

            a {
              color: inherit;
              text-decoration: none;
              width: calc(100% - 70px);
            }
          `}
        >
          <Link to={`/chart/${props.id}`}>
            <p
              css={`
                margin: 0;
                font-family: "Gotham Narrow", sans-serif;
                font-size: 14px;
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
            >
              <b>{props.title}</b>
            </p>
          </Link>
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
                font-family: "GothamNarrow", sans-serif;
              `}
            >
              Added
            </p>
          )}
        </div>
      </div>

      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: end;
        `}
      >
        <div
          css={`
            height: 90px;
            display: flex;
            align-items: end;
          `}
        >
          {props.viz}
        </div>

        <div
          css={`
            display: flex;
            align-items: center;
            font-family: "Gotham Narrow", sans-serif;
            font-size: 8.814px;
            font-weight: 325;
            column-gap: 5px;
            svg {
              path {
                fill: #231d2c;
              }
            }
          `}
        >
          <ClockIcon height={"12.75px"} width={"12.75px"} />

          <p
            css={`
              margin: 0;
              padding: 0;
            `}
          >
            {moment(props.date).format("DD-MM-YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
}
