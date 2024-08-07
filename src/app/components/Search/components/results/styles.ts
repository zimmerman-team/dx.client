import { css } from "styled-components/macro";

export const container = css`
  left: 0;
  top: 52px;
  z-index: 1;
  width: 100%;
  display: flex;
  background: #fff;
  position: absolute;
  border-radius: 20px;
  flex-direction: column;
  box-shadow: 0px 0px 10px rgba(152, 161, 170, 0.6);

  @media (max-width: 767px) {
    box-shadow: none;
    padding: 0 0 20px 0;
  }
`;

export const results = css`
  width: 100%;
  height: 368px;
  display: flex;
  overflow-y: auto;
  min-height: 368px;
  max-height: 368px;
  flex-direction: column;

  @media (max-width: 767px) {
    height: calc(100vh - 150px);
    min-height: calc(100vh - 150px);
    max-height: calc(100vh - 150px);
  }
`;

export const result = css`
  width: 100%;
  display: flex;
  cursor: pointer;
  padding: 12px 37px;
  flex-direction: row;
  text-decoration: none;
  border-top: 1px solid #e4e4e4;

  @media (max-width: 767px) {
    padding: 12px;
  }

  &:hover {
    background: #f2f7fd;
  }

  &:first-of-type {
    border-top-style: none;
    border-radius: 20px 20px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 20px 20px;
  }

  > div {
    color: #231d2c;
    font-size: 14px;
    width: calc(100% - 37px - 24px - 40px);
  }

  > svg {
    margin-right: 40px;
  }
`;

export const noresults = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
