import { css } from "styled-components/macro";

export const socialloginbuttoncss = css`
  gap: 15px;
  width: 100%;
  height: 56px;
  display: flex;
  color: #2e4063;
  padding: 6px 0;
  font-size: 14px;
  cursor: pointer;
  font-family: "GothamNarrow-Book";
  line-height: 20px;
  border: 1px solid #231d2c;
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
  background: transparent;

  &:hover {
    background: #a1aebd;
  }
`;

export const termsOfServiceCss = css`
  width: 100%;
  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;

  > span {
    font-size: 12px;
  }
`;
