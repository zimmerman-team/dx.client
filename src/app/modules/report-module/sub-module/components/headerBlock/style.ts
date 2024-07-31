import { css } from "styled-components/macro";

export const headerBlockcss = {
  container: (backgroundColor: string, istoolboxOpen: boolean) => css`
    width: 100%;
    transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    height: 215px;
    padding: 35px 0;
    position: relative;
    background: ${backgroundColor};
  `,
  inputStyle: (titleColor: string) => css`
    width: 100%;
    color: ${titleColor};
    height: 100%;
    border: none;
    outline: none;
    font-size: 28.9px;
    font-weight: 400;
    font-family: "GothamNarrow-Bold", sans-serif;
    line-height: 48px;
    background: inherit;
    padding-left: 0px;
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
