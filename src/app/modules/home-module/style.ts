import { css } from "styled-components/macro";

export const turnsDataCss = css`
  @media (max-width: 1276px) {
    justify-content: center;
    align-items: center;
    gap: 45px;
  }
  @media (max-width: 700px) {
    justify-content: center;
    align-items: center;
    gap: 40px;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-family: "GothamNarrow-Bold", sans-serif;
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    text-align: center;
    color: #231d2c;
    margin: 0;
    padding: 0;
  }
  h2 {
    font-family: "GothamNarrow-Bold", sans-serif;
    font-weight: 400;
    font-size: 34px;
    line-height: 42px;
    color: #2b3674;
    margin: 0;
    padding: 0;
    @media (max-width: 700px) {
      font-size: 29px;
    }
  }

  p {
    color: #495057;
    font-family: "GothamNarrow-Bold", sans-serif;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  button,
  a {
    padding: 8px 27px;
    height: 41px;
    border-radius: 25px;
    outline: none;
    border: none;
    color: #ffffff;
    font-family: "GothamNarrow-Bold", sans-serif;
    font-weight: 400;
    font-size: 14px;
    text-transform: uppercase;
    text-decoration: none;
    font-size: 14px;
    font-style: normal;
    line-height: 24px; /* 171.429% */
    letter-spacing: -0.28px;
    white-space: nowrap;

    :hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
`;

export const featuredAssetsCss = css`
  h3 {
    font-size: 24px;
    font-family: "GothamNarrow-Bold", sans-serif;
    line-height: 29px;
    color: #000000;
    margin: 0;
  }
`;

export const datsetDetailImgcss = css`
  width: 710px;
  height: 428px;
  border-radius: 14px;
  @media (max-width: 1240px) {
    width: 70%;
    object-fit: contain;
    height: 100%;
  }
  @media (max-width: 700px) {
    width: 95%;
    object-fit: contain;
    height: 100%;
  }
`;

export const rowFlexCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const searchInputCss = (
  openSearch: boolean,
  width: string = "385px"
) => css`
  background: #dadaf8;
  display: flex;
  align-items: center;
  width: ${openSearch ? width ?? "385px" : "0px"};
  height: 32px;
  border-radius: 20px;
  opacity: ${openSearch ? 1 : 0};
  transition: opacity 0.5s ease-in-out 0s;
  overflow: hidden;
  input {
    outline: none;
    height: 100%;
    width: 92%;
    color: #231d2c;
    font-size: 14px;
    background: inherit;
    border-style: none;
    border-radius: 20px;

    padding: 6px 16px !important;
  }
  @media (min-width: 768px) {
    @media (max-width: 900px) {
      width: ${openSearch ? "250px" : "0px"};
    }
  }
  @media (max-width: 599px) {
    width: ${openSearch ? "100%" : "0px"};
  }
`;

export const iconButtonCss = (active?: boolean) => css`
  padding: 3px;
  ${active
    ? ` svg > circle {
      fill:  #231d2c;
    }
    svg > path,
    svg > g > path,
    svg > g > rect {
      fill: #fff;
    }`
    : ""}

  &:hover {
    background: transparent;
    padding: none;

    svg > circle {
      fill: #231d2c;
    }
    svg > path,
    svg > g > path,
    svg > g > rect {
      fill: #fff;
    }
  }
`;

export const sortByItemCss = (active: boolean) => css`
  color: #231d2c;
  font-size: 12px;
  padding: 8px 22px;
  font-family: "GothamNarrow-Book", sans-serif;
  background: ${active ? "#f1f3f5" : "transparent"};

  &:hover {
    cursor: pointer;
    background: #f1f3f5;
  }
`;
