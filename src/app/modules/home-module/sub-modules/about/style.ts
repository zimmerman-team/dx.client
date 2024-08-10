import { css } from "styled-components/macro";

export const subParagraphcss = css`
  color: #231d2c;
  > div:nth-of-type(1) {
    display: flex;
    column-gap: 97px;
    align-items: start;
    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
  #ab-mobile {
    margin: 0;
    font-size: 36px;
    font-style: normal;
    font-weight: 350;
    line-height: normal;
    font-family: "GothamNarrow-Medium", sans-serif;
    display: none;
    @media (max-width: 1024px) {
      display: block;
      margin: 37px;
    }
    @media (max-width: 500px) {
      display: block;
      margin: 0px;
      margin-bottom: 32px;
    }
  }
  #ab-desktop {
    margin: 0;
    font-size: 36px;
    font-style: normal;
    font-weight: 350;
    line-height: normal;
    font-family: "GothamNarrow-Medium", sans-serif;
    display: block;
    @media (max-width: 1024px) {
      display: none;
    }
  }
  p {
    margin: 0;
    font-family: "GothamNarrow-Medium", sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 350;
    line-height: 30px; /* 150% */
    letter-spacing: 0.5px;
    @media (max-width: 1024px) {
      font-size: 24px;
      font-family: "GothamNarrow-Book", sans-serif;
      line-height: 28.5px; /* 150% */
    }
    @media (max-width: 500px) {
      font-size: 14px;
      font-family: "GothamNarrow-Book", sans-serif;
      line-height: 16.8px; /* 150% */
    }
  }
  svg {
    @media (max-width: 1024px) {
      width: 100%;
      height: 100%;
    }
  }
`;
