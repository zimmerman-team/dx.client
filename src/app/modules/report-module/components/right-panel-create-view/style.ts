import { css } from "styled-components";

export const elementItemcss = (
  disabled: boolean,
  isDragging: boolean,
  draggable?: boolean,
  dropDown?: boolean
) => css`
  cursor: ${disabled ? "not-allowed" : !draggable ? "pointer" : "grab"};
  ${isDragging && "cursor: grabbing;"}

  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
  background: #dfe3e5;
  border-radius: 8px;
  /* transform: translate(0, 0); */
  opacity: ${disabled ? 0.5 : 1};
  position: relative;
  padding: 0 8px 0 16px;

  p {
    margin: 0px;
    line-height: normal;
    font-size: 12px;
  }
  b {
    font-size: 14px;
    line-height: normal;
    margin: 0;
  }
  ${!disabled &&
  "&:hover {svg {path {fill: #fff;}}background: #252c34;b,p {color: #fff;}}"}
`;
