import React from "react";

export default function Stepper(
  props: Readonly<{
    tabs: string[];
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    index: number;
    tab: string;
  }>
) {
  return (
    <div
      css={`
        gap: 1rem;
        display: flex;
        align-items: center;
      `}
    >
      {props.index !== 0 && (
        <div
          css={`
            width: 80px;
            border: 1px solid
              ${props.index <= props.activeStep ? "#6061e5" : "#231D2C"};
          `}
        />
      )}
      <button
        type="button"
        onClick={() => {
          if (props.activeStep > 0) {
            props.setActiveStep(props.index);
          }
        }}
        css={`
          outline: none;
          border: none;
          height: 27px;
          display: flex;
          padding: 5px 16px;
          width: max-content;
          align-items: center;
          border-radius: 32px;
          justify-content: center;
          font-weight: ${props.index === props.activeStep && "bold"};
          border: ${props.index === props.activeStep && "1px solid #6061E5"};
          background: ${props.index <= props.activeStep
            ? "#dadaf8"
            : "#E4E4E4"};
        `}
      >
        {props.tab}
      </button>
    </div>
  );
}
