import styled from "styled-components/macro";

interface Props {
  bg: "light" | "dark";
  size: "big" | "small" | "xs";
}
const sizes = {
  big: {
    height: "48px",
    padding: "0 24px",
    radius: "12px",
  },
  small: {
    height: "35px",
    padding: "0 24px",
    radius: "12px",
  },
  xs: {
    height: "24px",
    padding: "0 16px",
    radius: "8px",
  },
};
export const PrimaryButton = styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => sizes[props.size].radius};
  background: ${(props) => (props.bg === "light" ? "#6061E5" : "#231d2c")};
  color: #fff;
  width: max-content;
  height: ${(props) => sizes[props.size].height};
  outline: none;
  border: none;
  font-family: "GothamNarrow-Bold", sans-serif;
  padding: ${(props) => sizes[props.size].padding};
  font-size: 14px;
  text-transform: capitalize;
  cursor: pointer;

  @media (max-width: 744px) {
    height: 35px;
  }
  @media (max-width: 425px) {
    width: 100%;
  }

  :disabled {
    background: #dfe3e6;
    pointer-events: none;
    color: #70777e;
  }
`;

export const TertiaryButton = styled(PrimaryButton)`
  background: #dfe3e5;
  color: #70777e;
`;

export const HomePrimaryButton = styled.button`
  padding: 9px 27px;
  height: 41px;
  border-radius: 30px;
  outline: none;
  border: none;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  white-space: nowrap;
  background: ${(props) => (props.color ? props.color : "inherit")};
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
