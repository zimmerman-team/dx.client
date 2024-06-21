import { css } from "styled-components/macro";

export const styles = {
  container: (toolbarVisible: boolean) => css`
    left: 0;
    top: 48px;
    z-index: 100;
    width: 100vw;
    height: ${toolbarVisible ? "105px" : "50px"};
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    display: flex;
    position: fixed;
    background: #f4f4f4;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  innercontainer: css`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 1280px) {
      margin-left: 0;
      width: calc(100vw - 400px);
    }

    @media (max-width: 600px) {
      padding: 13px 16px 0 16px;
    }
  `,
  viewReportBtn: css`
    height: 24.3px;
    background: #231d2c;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5.5px 10px;
    gap: 5.959px;
    outline: none;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 8.43px;
    font-family: "Inter", sans-serif;
  `,
  sharePopup: css`
    width: 170px;
    display: flex;
    padding: 6px 13px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;

    * {
      margin: 0;
      color: #fff;
      font-size: 14px;
    }

    .MuiSwitch-track {
      background: #98a1aa;
    }

    .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
      background: #000;
    }

    hr {
      width: 100%;
      background: #cfd4da;
    }

    button {
      width: 100%;
      padding: 6px 0;
      text-align: start;
      justify-content: flex-start;

      span {
        text-transform: initial;
      }

      svg {
        margin-right: 10px;

        path {
          fill: #fff;
        }
      }
    }
  `,
  nameInput: css`
    color: #262c34;
    font-size: 24px;
    font-weight: 700;
    border-style: none;
    background: transparent;
    transition: background 0.2s ease-in-out;
    font-family: "Inter", sans-serif;
    position: relative;
    z-index: 2;
    padding-left: 0px;
    outline: none;
  `,
  endContainer: css`
    display: flex;
    gap: 22px;
    align-items: center;
    width: 30%;
    justify-content: flex-end;
    flex-shrink: 0;
  `,
  previewEndContainer: css`
    display: flex;
    gap: 0px;
    align-items: center;
    width: 30%;
    justify-content: flex-end;
    position: absolute;
    right: 2%;
  `,
  iconbtns: css`
    display: flex;
    flex-direction: row;
  `,

  autoResizeSpan: css`
    font-family: "Inter", sans-serif;
    font-size: 24px;
    position: absolute;
    z-index: 1;
    left: -5px;

    padding: 5px;
    white-space: pre;
    font-size: 24px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  highlightPicker: (active: boolean) => css`
    vertical-align: bottom;
    border: none;
    outline: none;
    color: #70777e;
    font-size: 18px;
    background: ${active ? "#f2f2f2" : "transparent"};
    width: 40px;
    height: 35px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: #f2f2f2;
    }
  `,
};
