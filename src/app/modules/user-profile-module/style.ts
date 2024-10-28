import { css } from "styled-components";

export const layoutcss = css`
  margin-top: 3rem;
`;
export const tabcss = (active: boolean, disabled: boolean) => css`
  width: 224px;
  height: 48px;
  border: 1px solid #231d2c;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  pointer-events: ${disabled ? "none" : "auto"};
  opacity: ${disabled ? "0.25" : "1"};
  cursor: pointer;
  p {
    text-transform: capitalize;
    color: ${active ? "#6061E5" : "#231D2C"};
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;
export const profilecss = css`
  font-style: normal;
  width: 72%;
  h4 {
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #6061e5;
  }
  p {
    width: 11vw;
    font-weight: 400;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
  }
  @media (max-width: 800px) {
    @media (min-width: 600px) {
      width: 100%;
    }
  }
`;

export const billingcss = css`
  h4 {
    color: #6061e5;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-size: 24px;
    height: 38px;
  }
  button {
    display: flex;
    width: 100%;
    height: 28.3px;
    justify-content: center;
    align-items: center;
    gap: 5.959px;
    border-radius: 17.876px;
    background: #231d2c;
    border: none;
    outline: none;
    color: #ffffff;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-size: 12px;
    cursor: pointer;
  }
  & > div:nth-of-type(1),
  & > div:nth-of-type(3),
  & > div:nth-of-type(5) {
    display: flex;
    gap: 123px;
    align-items: center;
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    p:nth-child(1) {
      width: 134px;
    }
    p:nth-child(2) {
      color: #231d2c;
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
      font-size: 14px;
    }
  }
  & > div:nth-of-type(2) {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 48px;

    button:nth-child(1) {
      width: 124px;
    }
    button:nth-child(2) {
      width: 133px;
    }
    button:nth-child(3) {
      width: 130px;
    }
  }
  & > div:nth-of-type(4) {
    button {
      width: 195px;
    }
    margin-bottom: 48px;
  }
  & > div:nth-of-type(6) {
    button {
      width: 167px;
    }
  }
`;

export const flexContainercss = css`
  display: grid;
  grid-template-columns: 31% auto;
  align-items: center;
  margin-bottom: 24px;
  @media (max-width: 428px) {
    grid-template-columns: 45% auto;
  }
`;
export const bigAvicss = css`
  width: 223px;
  height: 223px;
  background: #dadaf8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-weight: 500;
    font-size: 96px;
    color: #231d2c;
  }
`;
export const avicss = css`
  width: 52px;
  height: 52px;
  background: #dadaf8;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  justify-self: flex-start;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  font-size: 22.0606px;
  line-height: 32px;
  b {
  }
`;
export const inputcss = css`
  border: 1px solid #231d2c;
  border-radius: 10px;
  background: #ffffff;

  width: 100%;
  height: 48px;
  color: #231d2c;
  padding-left: 20px;
`;
