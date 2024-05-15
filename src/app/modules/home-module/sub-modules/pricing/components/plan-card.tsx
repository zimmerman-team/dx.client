import { Box } from "@material-ui/core";
import React from "react";

interface PlanCardProps {
  activeView: string;
  plan: {
    name: string;
    yearlyPrice: string;
    monthlyPrice: string;
    text: string;
    current: boolean;
    recommended: boolean;
    buttonText: string;
    key: string;
  };
}

function PlanCard({ activeView, plan }: PlanCardProps) {
  return (
    <div
      css={`
        width: 224px;
        background: rgba(202, 202, 202, 0.1);
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
      `}
    >
      <div
        key={plan.name}
        css={`
          width: 100%;
          padding: 0 13px 26px 22px;
          border-radius: 20px;
          background: ${plan.recommended ? "#6061E5" : "#FFFFFF"};
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
          color: ${plan.recommended ? "#FFFFFF" : "#231D2C"};
          position: relative;
        `}
      >
        <p
          css={`
            margin: 0;
            padding: 0;
            padding-top: 42.37px;
            font-size: 24px;
            font-weight: 400;
            line-height: normal;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          `}
        >
          {plan.name}
        </p>
        <p
          css={`
            margin: 0;
            padding: 0;
            margin-top: 8.3px;
            font-size: 40px;
            font-weight: 400;
            line-height: normal;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          `}
        >
          {activeView === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
        </p>
        {plan.key === "free" || plan.key === "enterprise" ? (
          <Box height={48 + 15.08} />
        ) : (
          <>
            <p
              css={`
                margin: 0;
                padding: 0;
                font-size: 16px;
                font-weight: 325;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              `}
            >
              per {activeView === "monthly" ? "month" : "year"}
            </p>
            <p
              css={`
                margin: 0;
                padding: 0;
                margin-top: 15.08px;
                font-size: 14px;
                font-weight: 325;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
                font-style: normal;
              `}
            >
              Or{" "}
              {activeView === "monthly"
                ? `${plan.yearlyPrice}/year ${
                    plan.name === "Team" ? "(Save 15%)" : ""
                  }`
                : `${plan.monthlyPrice}/month`}
            </p>
          </>
        )}

        <p
          css={`
            margin: 0;
            padding: 0;
            margin-top: 18.08px;
            font-size: 16px;
            font-weight: 325;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            white-space: pre-line;
            line-height: normal;
          `}
        >
          {plan.text}
        </p>

        <button
          css={`
            border-radius: 50px;
            border: 1px solid ${plan.recommended ? "transparent" : "#262C34"};
            line-height: normal;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            color: ${plan.recommended ? "#FFFFFF" : "#262C34"};
            background: ${plan.recommended ? "#2C2C79" : "#FFFFFF"};
            padding: 11px 0px;
            width: 175px;
            margin: 0 auto;
            margin-top: 34px;
            display: block;
            cursor: pointer;
            :disabled {
              border: 1px solid transparent;
              color: #868d96;
              background: #f4f4f4;
              cursor: not-allowed;
            }
          `}
          disabled={plan.current}
        >
          {plan.current ? "Current Plan" : plan.buttonText}
        </button>
        {plan.recommended ? (
          <div
            css={`
              color: #6061e5;
              position: absolute;
              font-size: 10px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-weight: 400;
              line-height: normal;
              background: #ffffff;
              border-radius: 30px;
              padding: 1.63px 7.8px 3.33px 8.2px;
              text-transform: uppercase;
              top: 19.79px;
              right: 15.5px;
            `}
          >
            recommended{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PlanCard;
