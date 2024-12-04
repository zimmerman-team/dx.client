import { css } from "styled-components";

export const style = {
  assetCard: css`
    > p:nth-of-type(1) {
      color: #231d2c;
      font-family: "GothamNarrow-Bold", sans-serif;
      font-size: 24px;
      margin: 0px;
    }
    > p:nth-of-type(2) {
      color: #231d2c;
      font-family: "GothamNarrow-Book", sans-serif;
      margin: 0px;
    }
    > img {
      border-radius: 16px;
      border: 8px solid var(--Secondary-Grey-Grey-7, #dfe3e5);
      background: #fff;
    }
    &:hover {
      cursor: pointer;
      > p:nth-of-type(1) {
        text-decoration: underline;
      }
      > img {
        border-color: #231d2c;
      }
    }
  `,
};
