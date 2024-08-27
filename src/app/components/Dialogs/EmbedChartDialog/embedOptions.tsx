import NumberInput from "app/components/Inputs/NumberInput";
import React from "react";
import ShareLinkContent from "./shareContent";
import CopyButton from "./copyButton";

export default function EmbedOptions(props: {
  chartId: string;
  datasetId: string;
  displayMode: string;
  handleDisplayModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  displayModes: { value: string; label: string }[];
  widthValue: number;
  setWidthValue: React.Dispatch<React.SetStateAction<number>>;
  heightValue: number;
  setHeightValue: React.Dispatch<React.SetStateAction<number>>;
  handleCopyToClipboard: () => void;
}) {
  return (
    <>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding-top: 16px;
          border-top: 0.5px solid #b49696;
        `}
      >
        <p
          css={`
            color: #231d2c;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 16px;
            margin: 0;
            margin-bottom: 14px;
          `}
        >
          Choose dimensions
        </p>
        <div
          css={`
            display: flex;
            gap: 24px;
            align-items: center;
            justify-content: center;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 151px;
            `}
          >
            <p
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
                font-size: 14px;
              `}
            >
              Width (px)
            </p>
            <div>
              <NumberInput
                value={props.widthValue}
                setValue={props.setWidthValue}
              />
            </div>
          </div>

          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 151px;
            `}
          >
            <p
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
                font-size: 14px;
              `}
            >
              Height (px)
            </p>
            <div>
              <NumberInput
                value={props.heightValue}
                setValue={props.setHeightValue}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <p
          css={`
            height: 41px;
            display: flex;
            align-items: end;
            font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
            font-size: 14px;
          `}
        >
          Copy the following link to embed this chart
        </p>
        <ShareLinkContent
          height="66px"
          content={`<iframe src="${window.location.origin}/chart-embed/${props.chartId}/${props.datasetId}" width="${props.widthValue}" height="${props.heightValue}"></iframe>`}
        />

        <CopyButton
          handleCopyToClipboard={props.handleCopyToClipboard}
          name="copy embed code"
        />
      </div>
    </>
  );
}
