/** third party */
import React from "react";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
/** project */
import WHOLogo from "app/modules/home-module/assets/WHO-logo.svg";
import KaggleLogo from "app/modules/home-module/assets/kaggle-logo.svg";
import WorldBankLogo from "app/modules/home-module/assets/world-bank-logo.svg";
import HDXLogo from "app/modules/home-module/assets/hdx-logo.svg";
import TGFLogo from "app/modules/home-module/assets/tgf-logo.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";

import moment from "moment";
import { IExternalDataset } from "app/modules/dataset-upload-module/upload-steps/externalSearch";
export default function IExternalDatasetCard(
  props: Readonly<{
    name: string;
    description: string;
    url: string;
    source: string;
    publishedDate: string;
    handleDownload: (dataset: IExternalDataset) => void;
    dataset: IExternalDataset;
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
      case "HDX":
        return <img src={HDXLogo} alt="hdx-logo" />;
      case "TGF":
        return <img src={TGFLogo} alt="tgf-logo" />;
      default:
        return <div />;
    }
  };
  const [showButton, setShowButton] = React.useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      data-cy={`external-search-card-${props.source}`}
      css={`
        width: 296px;
        height: 162px;
        box-shadow: 0px 7px 16px 0px rgba(0, 0, 0, 0.05);
        padding-left: 11.7px;
        padding-right: 12px;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        div {
          height: 62px;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            object-fit: cover;
          }
          button {
            outline: none;
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5.959px;
            padding: 7.15px 10px;
            border-radius: 17.876px;
            background: #231d2c;
            text-transform: uppercase;
            color: #fff;
            font-family: "GothamNarrow-Bold";
            font-size: 12px;
            svg {
              width: 9px;
              height: 9px;
            }
          }
        }
        p:nth-of-type(4) {
          color: #231d2c;
          font-family: "GothamNarrow-Book";
          font-size: 8.814px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 5px;
          position: absolute;
          right: 11.7px;
          bottom: 0px;
          margin: 0;
          svg {
            width: 12px;
            height: 12px;
          }
        }
      `}
    >
      <p title={props.name}>{props.name}</p>
      <p title={props.description}>{props.description}</p>
      <p>
        <a href={props.url} rel="noreferrer noopener" target="_blank">
          Link to data source.
        </a>
      </p>
      <div
        css={`
          height: 62px;
          margin: 0;
          display: flex;
          align-items: center;
        `}
      >
        {sourceLogo(props.source)}
        {showButton && (
          <button
            onClick={() => props.handleDownload(props.dataset)}
            data-cy="import-to-dx-button"
          >
            import to dx <ArrowRightAltIcon color="inherit" />
          </button>
        )}
      </div>

      <p>
        {" "}
        <ClockIcon />
        {moment(props.publishedDate).format("MMMM YYYY")}
      </p>
    </div>
  );
}
