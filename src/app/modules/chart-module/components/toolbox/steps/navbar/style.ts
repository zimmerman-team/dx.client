import { css } from "styled-components";

export const stepcss = (activeStep: boolean) => css`
  width: 79px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  &:disabled {
    cursor: not-allowed;
  }
  svg {
    width: ${activeStep ? "32px" : "24px"};
    height: ${activeStep ? "32px" : "24px"};
    path {
      fill: ${activeStep ? "#262C34" : "#ADB5BD"};
    }
  }
`;
