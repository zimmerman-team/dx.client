import React from "react";
import { checkLists } from "app/modules/chart-module/routes/customize/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";

const GeomapLegend = ({
  data,
  visualOptions,
  mapping,
}: {
  data: any;
  visualOptions: any;
  mapping: any;
}) => {
  const colors =
    checkLists.find((item) => item.label === visualOptions.palette)?.value ??
    checkLists[0].value;

  const sizes = data?.results?.map((d: any) => d.value) ?? [];

  const title = `${mapping?.country?.value?.[0] ?? ""} | ${
    mapping?.size?.value?.[0] ?? ""
  }`;
  const unit = mapping?.size?.value?.[0]?.slice(0, 3) ?? "";
  const min = visualOptions.isMonetaryValue
    ? formatFinancialValue(Math.min(...sizes), true)
    : Math.min(...sizes);
  const max = visualOptions.isMonetaryValue
    ? formatFinancialValue(Math.max(...sizes), true)
    : Math.max(...sizes);

  return (
    <div>
      <p
        css={`
          margin: 0;
          padding: 0;
          font-family: Inter, "Helvetica Neue", sans-serif;
          font-size: 10.047px;
          font-weight: bold;
          line-height: 12.558px; /* 125% */
          letter-spacing: 0.419px;
        `}
      >
        {title}
      </p>

      <div
        css={`
          margin-top: 6.2px;
          display: flex;
          column-gap: 16.74px;
          align-items: center;
        `}
      >
        <div>
          <div
            css={`
              display: flex;

              column-gap: 3.35px;
              align-items: center;
            `}
          >
            {colors?.map((color) => (
              <div
                key={color}
                css={`
                  height: 5.023px;
                  width: 37.674px;
                  background-color: ${color};
                  border-radius: 16.744px;
                `}
              />
            ))}
          </div>
          <div
            css={`
              margin-top: 5.86px;
              display: flex;
              justify-content: space-between;
              font-family: Inter, "Helvetica Neue", sans-serif;
              font-size: 10.047px;
              font-style: normal;
              font-weight: 100;
              line-height: 12.558px; /* 125% */
              letter-spacing: 0.419px;
              text-transform: uppercase;
            `}
          >
            <span>
              {min} {unit}
            </span>
            <span>
              {max} {unit}
            </span>
          </div>
        </div>
        <div>
          <div
            css={`
              height: 5.023px;
              width: 37.674px;
              background-color: white;
              border-radius: 16.744px;
              border: 0.419px solid #cfd4da;
            `}
          />
          <div
            css={`
              margin-top: 5.86px;
              display: flex;
              justify-content: center;
              font-family: Inter, "Helvetica Neue", sans-serif;
              font-size: 10.047px;
              font-style: normal;
              font-weight: 100;
              line-height: 12.558px; /* 125% */
              letter-spacing: 0.419px;
            `}
          >
            N/A
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeomapLegend;
