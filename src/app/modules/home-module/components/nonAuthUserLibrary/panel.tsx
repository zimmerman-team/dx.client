import React from "react";
import Box from "@material-ui/core/Box";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Tooltip } from "react-tooltip";

export default function Panel(props: {
  isOpen: boolean;
  setIsOpen: (
    isOpen: "coreFeaturesPanel" | "extraFeaturesPanel" | null
  ) => void;
  type: "coreFeaturesPanel" | "extraFeaturesPanel";
  title: string;
  description: string;
  tooltip: string;
}) {
  const togglePanel = () => {
    props.setIsOpen(props.isOpen ? null : props.type);
  };

  return (
    <div
      css={`
        > div {
          p:nth-of-type(1) {
            color: #fff;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 18px;
            margin: 0px;
          }
          p:nth-of-type(2) {
            color: #fff;
            font-family: "GothamNarrow-Book", sans-serif;
            font-size: 14px;
            font-style: normal;
            font-weight: 325;
            line-height: 20px;
            margin: 0px;
          }
          button {
            border: none;
            background: none;
            width: max-content;
            height: max-content;
            cursor: pointer;
            color: #fff;
          }
        }
      `}
    >
      <Box
        height={"85.343px"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gridColumnGap={"11px"}
        bgcolor={props.isOpen ? "#231d2c" : "#6061E5"}
        color={"#fff"}
        borderRadius={"16px"}
        padding={"10px 16px"}
      >
        <Box>
          <p>{props.title}</p>
          <p>{props.description}</p>
        </Box>
        {props.isOpen ? (
          <button
            onClick={togglePanel}
            css={`
              transform: rotate(${props.isOpen ? "180deg" : "0deg"});
              transition: transform 0.3s;
            `}
          >
            <KeyboardArrowDownIcon />
          </button>
        ) : (
          <button
            className={
              props.isOpen ? "noclass" : props.tooltip.replace(/\s/g, "-")
            }
            onClick={togglePanel}
            css={`
              transform: rotate(${props.isOpen ? "180deg" : "0deg"});
              transition: transform 0.3s;
            `}
          >
            <KeyboardArrowDownIcon />
          </button>
        )}

        <Tooltip
          anchorSelect={"." + props.tooltip.replace(/\s/g, "-")}
          place="bottom"
          style={{
            background: "#231D2C",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "12px",
            fontFamily: '"GothamNarrow-Medium", "Helvetica Neue", sans-serif',
            lineHeight: "16px",
          }}
        >
          {props.tooltip}
        </Tooltip>
      </Box>
    </div>
  );
}
