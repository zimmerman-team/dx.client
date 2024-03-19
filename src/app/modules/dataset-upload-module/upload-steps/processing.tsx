import React from "react";
import { ReactComponent as ErrorICon } from "app/modules/dataset-upload-module/assets/error-icon.svg";

export interface ProcessingMetaDataProps {
  setProcessingError: React.Dispatch<React.SetStateAction<boolean>>;
  processingError: boolean;
  fileName: string;
  loaded: string;
  percentageLoaded: number;
  estimatedUploadTime: number;
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
            margin-top: 13rem;
          `}
        >
          <ErrorICon />
          <div
            css={`
              height: 1.2rem;
            `}
          />
          <p
            css={`
              font-size: 18px;
              text-align: center;
            `}
            data-testid="error-message"
          >
            <b>
              Data could not be processed, please try again <br /> or contact
              your administrator
            </b>
          </p>

          <p
            css={`
              margin-top: -10px;
            `}
          >
            Error{" "}
          </p>
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
                  font-family: "Gotham Narrow", sans-serif;
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
                    font-family: "Gotham Narrow", sans-serif;
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
