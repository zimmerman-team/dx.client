import styled from "styled-components/macro";

interface Props {
  bg: "light" | "dark";
  size: "big" | "small";
}
export const PrimaryButton = styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${(props) => (props.bg === "light" ? "#6061E5" : "#231d2c")};
  color: #fff;
  width: max-content;
  height: ${(props) => (props.size === "big" ? "48px" : "35px")};
  outline: none;
  border: none;
  font-family: "GothamNarrow-Bold", sans-serif;
  padding: 0 24px;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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
