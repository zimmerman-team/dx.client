import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Slider } from "./style";

interface Props {
  leftLabel: string;
  rightLabel: string;
}
export default function SplitBar(props: Props) {
  const history = useHistory();
  const location = useLocation();
  const handleClick = (value: "signin" | "signup") => {
    history.push(`/onboarding/${value}`);
  };
  return (
    <div
      css={`
        /* margin-top: 30px; */
      `}
    >
      <Slider.Container
        css={`
          padding: 0;
          margin: 0;
          margin-top: 29px;
        `}
      >
        <Slider.Left
          active={location.pathname.includes("signin") ? "#6061E5" : "#ADB5BD"}
          onClick={() => handleClick("signin")}
        >
          <div className="title">
            <div
              css={`
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              `}
            >
              {props.leftLabel}
            </div>
          </div>
        </Slider.Left>

        <Slider.Right
          className="hot"
          onClick={() => handleClick("signup")}
          blue={location.pathname.includes("signup") ? " #6061E5 " : "#ADB5BD"}
        >
          <div className="title">
            <div
              css={`
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              `}
            >
              {props.rightLabel}
            </div>
          </div>
        </Slider.Right>
      </Slider.Container>
    </div>
  );
}
