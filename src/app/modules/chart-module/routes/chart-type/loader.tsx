import React from "react";

const ProcessingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 160 160">
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      from="0"
      to="360"
      dur="2s"
      repeatCount="indefinite"
    />
    <circle
      r="70"
      cx="80"
      cy="80"
      fill="transparent"
      stroke="#DADAF8"
      strokeWidth="2px"
    ></circle>
    <circle
      r="70"
      cx="80"
      cy="80"
      fill="transparent"
      stroke="#6061E5"
      strokeLinecap="round"
      strokeWidth="20px"
      strokeDasharray="239.6px"
      strokeDashoffset="109.9px"
    ></circle>
  </svg>
);
export default function AILoader() {
  return (
    <div
      css={`
        margin-top: 4px;
      `}
    >
      <ProcessingIcon />
    </div>
  );
}
