import { css } from "styled-components/macro";

export const stepcss = css`
  left: 0;
  top: 47px;
  z-index: 10;
  width: 100vw;
  height: 50px;

  display: flex;
  align-items: center;
  position: fixed;
  justify-content: center;
  background: #f4f4f4;
  gap: 1rem;
  @media (min-width: 768px) {
    height: 50px;
  }
`;
export const uploadDatasetcss = css`
  div:nth-child(1) {
    background: #dadaf8;
    height: 55px;
    width: 100%;
    color: #231d2c;
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    margin-top: 5rem;
  }
`;

export const uploadAreacss = css`
  height: 529px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    text-align: center;
  }
  background: #ffffff;
  button,
  label {
    border: none;
    outline: none;
    background: #231d2c;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 27px;
    gap: 10px;
    height: 43px;
    /* width: 191px; */
    cursor: pointer;
    color: #ffffff;
    p {
      font-weight: 500;
      font-size: 14px;
      font-family: "Inter";
      text-transform: uppercase;
    }
    :hover {
      opacity: 0.9;
    }
  }
`;

export const metaDatacss = css`
  width: 100%;
  h1 {
    font-weight: 500;
    font-size: 48px;
    font-family: "Inter";
    margin-top: 6rem;

    margin-bottom: 4.5rem;
  }
  button {
    background: #e4e4e4;
    border-radius: 30px;
    padding: 12px 27px;
    height: 41px;
    font-weight: 500;
    font-size: 14px;
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 125px;
    cursor: pointer;
  }
`;
