import React from "react";
import ShareContent from "./shareContent";
import CopyButton from "./copyButton";
import { ReactComponent as FacebookIcon } from "app/components/Dialogs/EmbedChartDialog/assets/facebook.svg";
import { ReactComponent as TwitterIcon } from "app/components/Dialogs/EmbedChartDialog/assets/twitter.svg";
import { ReactComponent as LinkedinIcon } from "app/components/Dialogs/EmbedChartDialog/assets/linkedIn.svg";

export default function LinkOptions(props: {
  chartId: string;
  datasetId: string;
  handleCopyToClipboard: () => void;
}) {
  const url = `${window.location.origin}/chart/${props.chartId}`;
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
          font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
          font-size: 14px;
        }
      `}
    >
      <p>Copy the following link to share it</p>
      <ShareContent height="48px" content={url} />
      <CopyButton
        handleCopyToClipboard={props.handleCopyToClipboard}
        name="copy share link"
      />
      <p>Share with a single click</p>
      <div
        css={`
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          a {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #3d5a96;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a:nth-of-type(2) {
            background: #000000;
          }
        `}
      >
        <a
          href={`https://www.facebook.com/sharer.php?u=${url}`}
          target="_blank"
          rel="noreferrer"
        >
          <FacebookIcon />
        </a>

        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&quote=${encodeURIComponent("")}`}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon />
        </a>

        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinIcon />
        </a>
      </div>
    </div>
  );
}
