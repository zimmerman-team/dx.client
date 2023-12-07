import React from "react";
import { ReactComponent as GeomapChartPlaceholderImage } from "app/modules/chart-module/assets/geomapPlaceholder.svg";

export default function GeomapPlaceholder() {
  return (
    <>
      <div
        css={`
          svg {
            width: 100%;
            height: 100%;
          }
        `}
      >
        <div
          css={`
            height: 20px;
          `}
        />
        <div />
        <GeomapChartPlaceholderImage />
      </div>
    </>
  );
}
