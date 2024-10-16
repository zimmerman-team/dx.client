import { Snackbar } from "@material-ui/core";
import styled, { css } from "styled-components/macro";

export const InfoSnackbar = styled((props) => <Snackbar {...props} />)`
  && {
    bottom: 8px;
    @media (max-width: 900px) {
      width: 80%;
    }
    @media (max-width: 660px) {
      width: 90%;
    }
    @media (max-width: 599px) {
      width: 100%;
      left: auto;
      right: auto;
      bottom: 0px;
    }
  }

  & [class*="MuiSnackbarContent-root"] {
    width: 100%;
    display: flex;
    padding: 0 78px;
    background: #fff;
    flex-wrap: nowrap;
    border-radius: 12px;
    gap: ${(props) => (props.gap ? "0px" : "84px")};
    justify-content: center;
    box-shadow: 0 8px 17px -4px rgba(130, 142, 148, 0.35),
      0 0 4px 0 rgba(130, 142, 148, 0.16), 0 0 2px 0 rgba(130, 142, 148, 0.12);
    @media (max-width: 880px) {
      gap: 24px;
    }
    @media (max-width: 599px) {
      height: 280px;
      border-radius: 20px 20px 0px 0px;
    }
  }

  & [class*="MuiSnackbarContent-message"] {
    color: #000;
    font-size: 18px;
    padding: 16px 0;
    font-weight: 700;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    white-space: nowrap;
  }

  & [class*="MuiSnackbarContent-action"] {
    > button {
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      border-style: none;
      padding: 12px 27px;
      background: #262c34;
      border-radius: 20px;
      white-space: nowrap;
    }
  }

  & [class*="MuiSnackbarContent-action"] {
    padding: 16px 0;
  }
`;

export const shareModalcss = css`
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  width: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  color: #231d2c;
  > p:nth-of-type(1) {
    margin: 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    span:nth-child(1) {
      color: #231d2c;
      font-family: "GothamNarrow-Bold", sans-serif;
      font-size: 24px;
      font-weight: 400;
      display: -webkit-box;
      max-width: 90%;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  > p:nth-of-type(2) {
    margin: 0px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  > div:nth-of-type(1) {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: center;
    a {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #3d5a96;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    a:nth-of-type(2) {
      background: #000000;
    }
  }
  > div:nth-of-type(2) {
    width: 100%;
    div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
      }
      button {
        outline: none;
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        /* width: 100%;
        height: 100%; */
      }
    }
    div:nth-child(2) {
      padding: 13px;
    }
  }
  > div:nth-of-type(3) {
    width: 100%;
    p {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #231d2c;
      font-family: "GothamNarrow-Book", sans-serif;
    }
    div {
      display: flex;
      gap: 16px;
      margin-top: 10.5px;
      button {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 8px;
        border: none;
        outline: none;
        background: #dfe3e5;
        color: #000;
        font-family: "GothamNarrow-Book", sans-serif;
        text-transform: uppercase;
        border-radius: 10px;
        width: 115.3px;
        height: 37px;
        cursor: pointer;
        @media (max-width: 425px) {
          flex-basis: 33.3%;
          width: auto;
        }
      }
    }
  }
`;
export const InfoSnackbarDuplicateContentcss = css`
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  height: 224px;
  width: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  p:nth-of-type(1) {
    margin: 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    span:nth-child(1) {
      color: #231d2c;
      font-family: "GothamNarrow-Bold", sans-serif;
      font-size: 24px;
      font-weight: 400;
      display: -webkit-box;
      max-width: 90%;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  p:nth-of-type(2) {
    color: #231d2c;
    margin: 0px;
    font-family: "GothamNarrow-Book", sans-serif;
  }
  button {
    border: none;
    outline: none;
    display: flex;
    width: 100%;
    height: 46px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: #231d2c;
    color: #fff;
    text-align: right;
    font-family: "GothamNarrow-Medium", sans-serif;
    font-size: 14px;
    text-transform: uppercase;
  }
`;
