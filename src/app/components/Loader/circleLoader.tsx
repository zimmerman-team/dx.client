import React from "react";

const ProcessingIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 160 160"
    style={{ transform: "rotate(-90deg)" }}
  >
    <circle
      r="70"
      cx="80"
      cy="80"
      fill="transparent"
      stroke="#DADAF8"
      stroke-width="8px"
    ></circle>
    <circle
      r="70"
      cx="80"
      cy="80"
      fill="transparent"
      stroke="#6061E5"
      stroke-linecap="round"
      stroke-width="12px"
      stroke-dasharray="439.6px"
      stroke-dashoffset="109.9px"
    ></circle>
  </svg>
);
export default function CircleLoader() {
  return (
    <div
      css={`
        width: 100%;
        display: flex;
        justify-content: center;
        padding-bottom: 40px;
        svg {
          -webkit-animation: rotate 2s linear infinite;
          animation: rotate 2s linear infinite;
          /* height: 100%; */
          /* -webkit-transform-origin: center center;
          -ms-transform-origin: center center;
          transform-origin: center center; */
          width: 100%;
          /* position: absolute; */
          top: 0;
          left: 0;
          margin: auto;
          @keyframes rotate {
            100% {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }
        }
      `}
    >
      <ProcessingIcon />
    </div>
  );
}
