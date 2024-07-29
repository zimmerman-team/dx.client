import React from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

export default function NumberInput(props: {
  value: number;
  setValue: (value: number) => void;
  width?: string;
  height?: string;
  background?: string;
  component?: {
    incrementIcon: React.ReactNode;
    decrementIcon: React.ReactNode;
  };
}) {
  const increment = () => {
    props.setValue(props.value + 1);
  };
  const decrement = () => {
    props.setValue(props.value - 1);
  };
  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: ${props.width ?? "67px"};
        background: ${props.background ?? "#f5f5f5"};
        height: ${props.height ?? "32px"};
        box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.1);
        border-radius: 5px;
        position: relative;
      `}
    >
      <input
        type="number"
        value={props.value}
        onChange={(e) => props.setValue(Number(e.target.value))}
        css={`
          width: 90%;
          height: 100%;
          background: transparent;
          padding-left: 10px;
          border: none;
          outline: none;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
          }
        `}
      />
      <div
        css={`
          width: 10%;
          display: flex;
          flex-direction: column;
          position: absolute;
          right: 4px;
          top: 1.6px;
          align-items: center;
          height: 19px;
          button {
            background: transparent;
            border: none;
            outline: none;
            height: 14px;
            width: 14px;
            display: flex;
            justify-content: center;
            cursor: pointer;
          }
          svg {
            height: 14px;
            width: 14px;
          }
        `}
      >
        <button onClick={increment}>
          {props.component?.incrementIcon ?? (
            <ArrowDropUpIcon fontSize="small" />
          )}
        </button>
        <button onClick={decrement}>
          {props.component?.decrementIcon ?? (
            <ArrowDropDownIcon fontSize="small" />
          )}
        </button>
      </div>
    </div>
  );
}
