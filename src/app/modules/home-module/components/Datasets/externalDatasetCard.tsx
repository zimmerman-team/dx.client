import React from "react";
import WHOLogo from "app/modules/home-module/assets/WHO-logo.svg";
import KaggleLogo from "app/modules/home-module/assets/kaggle-logo.svg";
import WorldBankLogo from "app/modules/home-module/assets/world-bank-logo.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";

import moment from "moment";
export default function ExternalDatasetCard(
  props: Readonly<{
    name: string;
    description: string;
    url: string;
    source: string;
    publishedDate: string;
  }>
) {
  const sourceLogo = (source: string) => {
    switch (source) {
      case "WHO":
        return <img src={WHOLogo} alt="WHO-logo" />;
      case "Kaggle":
        return <img src={KaggleLogo} alt="kaggle-logo" />;
      case "World Bank":
        return <img src={WorldBankLogo} alt="world-bank-logo" />;
      default:
        return <div />;
    }
  };

  return (
    <div
      css={`
        width: 296px;
        height: 162px;
        box-shadow: 0px 7px 16px 0px rgba(0, 0, 0, 0.05);
        padding-left: 11.7px;
        padding-top: 16.2px;
        background: #fff;
        position: relative;
        p:nth-of-type(1) {
          color: #262c34;
          font-family: "GothamNarrow-Bold", sans-serif;
          font-size: 14px;
          margin: 0;
          margin-bottom: 4.05px;
          line-height: normal;
        }
        p:nth-of-type(2) {
          color: #495057;
          font-family: "GothamNarrow-Book", sans-serif;
          font-size: 10px;
          margin: 0;
          height: 24px;
          //multi-line ellipses
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          line-height: normal;
        }
        p:nth-of-type(3) {
          color: #495057;
          font-family: "GothamNarrow-Book", sans-serif;
          font-size: 10px;
          text-decoration-line: underline;
          margin: 0;
          margin-top: 10px;
          margin-bottom: 10px;
          height: 12px;
          line-height: normal;
          a {
            text-decoration: none;
            color: inherit;
          }
        }
        img {
          object-fit: cover;
        }
        div {
          p:nth-of-type(1) {
            color: #231d2c;
            font-family: "GothamNarrow-Book";
            font-size: 8.814px;
          }
        }
      `}
    >
      <p>{props.name}</p>
      <p>{props.description}</p>
      <p>
        <a href={props.url} rel="noreferrer noopener" target="_blank">
          Link to data source.
        </a>
      </p>
      <p
        css={`
          height: 62px;
          margin: 0;
        `}
      >
        {sourceLogo(props.source)}
      </p>
      <div
        css={`
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 5px;
          position: absolute;
          right: 11.7px;
          bottom: 4.2px;
          svg {
            width: 12px;
            height: 12px;
          }
        `}
      >
        <ClockIcon />
        <p>{moment(props.publishedDate).format("MMMM YYYY")}</p>
      </div>
    </div>
  );
}
