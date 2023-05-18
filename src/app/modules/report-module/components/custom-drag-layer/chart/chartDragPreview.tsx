import React from "react";
import { ChartGridItemProps } from "app/modules/home-module/components/Charts/gridItem";
import moment from "moment";

export default function ChartDragPreview(props: ChartGridItemProps) {
  return (
    <div>
      <div
        css={`
          width: 354px;
          display: flex;
          height: 125px;
          color: #262c34;
          background: rgba(255, 255, 255, 0.088);
          position: relative;
          padding: 0rem 1.2rem;
          padding-bottom: 0.5rem;
          opacity: 40%;
          border: 1px solid #6061e5;
          transform: rotate(-2.4deg);
          flex-direction: column;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;

            a {
              color: inherit;
              text-decoration: none;
            }
          `}
        >
          <div
            css={`
              width: 60%;
              margin-top: -7px;
            `}
          >
            <p
              css={`
                font-size: 14px;
                margin-top: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 0;
              `}
            >
              <b>{props.title}</b>
            </p>

            <p
              css={`
                font-size: 10px;
                line-height: 12px;
                margin-top: 1px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
            >
              {props.descr}
            </p>
          </div>
          <div
            css={`
              margin-top: 12px;
              width: 74px;
              height: 74px;
              path {
                fill: #868a9d;
              }
            `}
          >
            {props.viz}
          </div>
        </div>
        <div
          css={`
            display: flex;
            font-size: 12px;
            justify-content: space-between;

            > p {
              margin: 0;
            }
          `}
        >
          <p>Creation date</p>
          <p>{moment(props.date).format("DD-MM-YYYY")}</p>
        </div>
      </div>
    </div>
  );
}
