import React from "react";

export const PageTopSpacer = () => (
  <div
    css={`
      width: 100%;
      height: 98px;

      @media (max-width: 767px) {
        height: 60px;
      }
    `}
  />
);
