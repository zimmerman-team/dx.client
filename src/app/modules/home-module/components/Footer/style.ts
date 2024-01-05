import { css } from "styled-components/macro";

export const homeFootercss = (transparent?: boolean) => css`
  width: 100vw;
  background: ${transparent ? "transparent" : "#fff"};
  padding-top: 27px;

  ul {
    padding: 0;
    color: #000;

    font-family: "Inter", sans-serif;
  }

  li {
    list-style-type: none;

    a {
      color: #000;
      text-decoration: none;
    }
  }
`;
