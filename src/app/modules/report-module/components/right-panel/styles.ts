import { css } from "styled-components/macro";

export const styles = {
  container: (isToolbarVisisble: boolean) => css`
    right: 0;
    top: ${isToolbarVisisble ? "153px" : "98px"};
    z-index: 99;
    width: 400px;
    display: flex;
    position: fixed;
    background: #f1f3f5;
    flex-direction: column;
    height: calc(100vh - ${isToolbarVisisble ? "153px" : "98px"});
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  `,
  initial: css`
    display: flex;
    color: #98a1aa;
    padding: 100px;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    text-align: center;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `,
};
