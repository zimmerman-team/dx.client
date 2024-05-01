import React from "react";
import { ReactComponent as ErrorICon } from "app/modules/dataset-upload-module/assets/error-icon.svg";

export interface ProcessingMetaDataProps {
  setProcessingError: React.Dispatch<React.SetStateAction<string | null>>;
  processingError: string | null;
  fileName: string;
  loaded: string;
  percentageLoaded: number;
  estimatedUploadTime: number;
  tryAgain: () => void;
}

export default function Processing(props: ProcessingMetaDataProps) {
  const getTimeInHoursnMins = (time: number) => {
    const mft = Math.floor(time / 60);
    const se = " seconds (estimated)";
    let ret = mft + se;
    if (mft <= 0) ret = "Finishing up...";
    if (mft > 60) ret = mft + " minutes and " + Math.floor(time % 60) + se;
    return ret;
  };

  return (
    <>
      {props.processingError ? (
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #e75656;
            margin-top: 151px;
          `}
        >
          <ErrorICon />

          <p
            css={`
              font-size: 18px;
              text-align: center;
              margin: 0;
              padding: 0;
              margin-top: 16px;
              width: 365px;
              text-align: center;
            `}
            data-testid="error-message"
          >
            <b>{props.processingError}</b>
          </p>

          <p
            css={`
              margin: 0;
              padding: 0;
              margin-top: 16px;
            `}
          >
            Error{" "}
          </p>
          <button
            type="button"
            onClick={props.tryAgain}
            data-cy="dataset-processing-try-again"
            css={`
              color: #231d2c;
              text-transform: uppercase;
              background: #231d2c;
              color: #fff;
              margin-top: 58px;
              padding: 12px 27px;
              border: none;
              outline: none;
              border-radius: 30px;
              font-weight: 500;
              font-size: 14px;
              font-family: "Inter";
              cursor: pointer;
              :hover {
                opacity: 0.8;
              }
            `}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          `}
        >
          <div>
            <p
              css={`
                font-size: 18px;
                color: #231d2c;
                text-align: center;
                margin-bottom: 45px;
              `}
            >
              Data is being processed...
            </p>

            <div>
              <p
                css={`
                  color: #000;
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-size: 14px;
                `}
              >
                {props.fileName}
              </p>
              <div
                data-testid="progress-bar"
                css={`
                  display: flex;
                  flex-wrap: wrap;
                  width: 399.71px;
                  justify-content: space-between;
                  align-items: center;
                  p {
                    font-family: "GothamNarrow-Book", sans-serif;
                    font-size: 12px;
                    color: #adb5bd;
                    margin-top: 0;
                  }
                `}
              >
                <div
                  css={`
                    width: 100%;
                    height: 6.42px;
                    border-radius: 3px;
                    background-color: #dfe3e5;

                    border-radius: 3.211px;
                    position: relative;
                  `}
                >
                  <div
                    css={`
                      width: ${props.percentageLoaded}%;
                      height: 100%;
                      background: linear-gradient(
                        90deg,
                        #6466f1 7.48%,
                        #cea8bc 92.2%
                      );
                    `}
                  />
                </div>
                <p>{props.loaded}</p>
                <p data-testid="estimated-time">
                  {getTimeInHoursnMins(props.estimatedUploadTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
