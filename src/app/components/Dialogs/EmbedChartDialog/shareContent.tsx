import React from "react";

export default function ShareContent(props: {
  content: string;
  height: string;
}) {
  return (
    <div
      css={`
        display: flex;
        padding: 16px 0px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: ${props.height};
        width: 100%;
        align-items: center;
        text-align: center;
        border-radius: 8px;
        line-height: 16px;
        background: #f5f5f7;
        font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
        color: #000;
        font-size: 14px;
        @media (max-width: 768px) {
          height: 100%;
          word-break: break-all;
          padding: 16px 4px;
        }
      `}
      id="shared-link"
    >
      {props.content}
    </div>
  );
}
