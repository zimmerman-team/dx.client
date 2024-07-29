import React from "react";

export default function CopyButton(props: {
  handleCopyToClipboard: () => void;
  name: string;
}) {
  return (
    <button
      css={`
        margin-top: 16px;
        background: #6061e5;
        border-radius: 30px;
        height: 40px;
        width: 191px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-transform: uppercase;
        font-family: "Inter", sans-serif;
        font-size: 14px;
        font-weight: 700;
        border: none;
        outline: none;
        cursor: pointer;
      `}
      onClick={props.handleCopyToClipboard}
    >
      {props.name}
    </button>
  );
}
