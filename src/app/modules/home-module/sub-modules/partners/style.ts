import { css } from "styled-components/macro";
import styled from "styled-components/macro";

export const empowercss = (view: string) => css`
  height: ${view === "landing" ? "533px" : "418px"};
  position: relative;
  margin-top: 48px;
  padding: 78px 0 55px 0;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
  background-repeat: no-repeat;
  background-size: 100% 100%, auto;
  overflow-x: hidden;
  z-index: 0;
  @media (max-width: 641px) {
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      #f2f7fd 100%
    );
  }
  a {
    text-decoration: none;
  }

  h1 {
    margin-top: 0;
    color: #231d2c;
    font-size: 48px;
    line-height: 57.6px;
    white-space: pre-line;
    text-align: center;
    margin-bottom: ${view === "landing" ? "14px" : "26px"};
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    @media (max-width: 1024px) {
      font-size: 40px;
      line-height: 48px;
    }
  }
  p {
    margin: 0;
    color: #495057;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  }
  div {
    gap: 34px;
    display: flex;
    margin-top: ${view === "landing" ? "28px" : "50px"};
    align-items: center;
    justify-content: center;
    @media (max-width: 768px) {
      gap: 20px;
    }
  }
  #auth-buttons {
    button,
    a {
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
      text-decoration: none;

      :hover {
        opacity: 0.8;
        cursor: pointer;
      }
      @media (max-width: 500px) {
        font-size: 13px;
        padding: 8px 16px;
        width: 185px;
      }
    }
  }
`;

export const TabCardEllipseCss = css`
  top: 7%;
  right: 25%;
  z-index: -1;
  position: absolute;
  @media (max-width: 500px) {
    top: 7%;
    right: -180px;
    width: 100%;
  }
`;

export const quotesEllipseCss = css`
  top: 0%;
  left: -8.1%;
  z-index: -1;
  position: absolute;
  @media (max-width: 500px) {
    width: 100%;
    height: 100%;
    left: -51%;
  }
`;

export const useDXcss = css`
  color: #231d2c;
  width: 100%;
  margin-top: 40px;
  p:nth-of-type(1) {
    font-size: 40px;
    line-height: 48px;
    text-align: center;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    margin-top: 0;
    @media (max-width: 1024px) {
      font-family: "GothamNarrow-Bold", sans-serif;
    }
    @media (max-width: 600px) {
      font-size: 32px;
      line-height: 38.4px;
    }
  }
  h3 {
    font-size: 24px;
    line-height: 29px;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    text-align: center;
    margin-bottom: 0;
    margin-top: 48px;
  }
  p {
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    width: 85%;
    margin: 16px auto 0 auto;
    @media (max-width: 1024px) {
      font-size: 16px;
      line-height: 19.24px;
      width: 67%;
      font-family: "GothamNarrow-Book", sans-serif;
      @media (max-width: 600px) {
        width: 97%;
      }
    }
  }
`;

export const quotecss = css`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 78%;
  p {
    font-size: 40px;
    line-height: 48px;
    text-align: center;
<<<<<<< HEAD
    font-family: "GothamNarrow-Medium", sans-serif;
=======
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;

>>>>>>> db32d54e69ebec5355e034485b0f6fbce32a5cef
    margin: 0;
    @media (max-width: 1024px) {
      font-size: 34px;
      line-height: 40.8px;
    }
    @media (max-width: 1024px) {
      font-size: 24px;
      line-height: 28.8px;
    }
  }
  img {
    margin-bottom: 15px;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 28px;
    b {
      color: #6061e5;
      margin: 0;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
<<<<<<< HEAD
      font-family: "GothamNarrow-Bold", sans-serif;
      @media (max-width: 1024px) {
        font-size: 14px;
        line-height: 16.8px;
      }
=======
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
>>>>>>> db32d54e69ebec5355e034485b0f6fbce32a5cef
    }
  }
`;

export const bestDecisioncss = css`
  h4 {
    font-size: 48px;
    line-height: 58px;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    color: #231d2c;
    margin: 0;
    margin-bottom: 36px;
    @media (max-width: 1024px) {
      font-size: 34px;
      line-height: 40.8px;
    }
  }
  div {
    button {
      gap: 10px;
      color: #231d2c;
      display: flex;
      padding: 9px 18px;
      background: #fff;
      font-weight: 700;
      font-family: "Inter", sans-serif;
      font-size: 14px;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      border: none;
      outline: none;
      border-radius: 30px;
      :hover {
        opacity: 0.95;
        cursor: pointer;
      }
      > svg {
        transform: scale(0.8);
      }
    }
  }
  a {
    button {
      outline: none;
      border: none;
      background: #ffffff;
      border-radius: 30px;
      height: 41px;
      color: #231d2c;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      white-space: nowrap;
      padding: 12px 27px;
      gap: 10px;
      p {
        text-transform: uppercase;
        font-family: "Inter", sans-serif;
        font-weight: 700;
        font-size: 14px;
        color: #231d2c;
        white-space: nowrap;
      }
      :hover {
        opacity: 0.95;
        cursor: pointer;
      }
    }
  }
`;

export const ClimateButton = styled.button`
  padding: 12px 27px;
  border-radius: 30px;
  outline: none;
  border: none;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  background: ${(props) => (props.color ? props.color : "inherit")};
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
