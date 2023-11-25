import { css } from "styled-components/macro";

export const headerBlockcss = {
  container: (backgroundColor: string) => css`
    width: 100%;
    height: 215px;
    padding: 35px 0;
    position: relative;
    background: ${backgroundColor};
  `,
  inputStyle: (titleColor: string) => css`
    width: 60%;
    color: ${titleColor};
    font-size: 28.9px;
    font-weight: 700;
    line-height: 48px;
    background: inherit;
    overflow-y: hidden;
    max-height: 90px;

    > div {
      padding: 0;
      > div {
        > div {
          > div {
            min-height: 20px !important;
          }
        }
      }
    }

    &:focus {
      &::placeholder {
        opacity: 0.5;
      }
    }

    ::placeholder {
      color: ${titleColor};
    }
  `,
  innerContainer: css`
    width: 100%;
  `,
  date: (dateColor: string) => css`
    gap: 0.7rem;
    display: flex;
    font-size: 8.66898px;
    line-height: 14px;
    color: ${dateColor};
    align-items: center;

    svg {
      path {
        fill: ${dateColor};
      }
    }
  `,
};
