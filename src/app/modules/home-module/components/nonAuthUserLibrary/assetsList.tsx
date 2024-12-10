import React from "react";
import ClimateReportImg from "app/modules/home-module/assets/climate-report.png";
import IATICountryImg from "app/modules/home-module/assets/iati-country-chart.png";
import BudgetChartImg from "app/modules/home-module/assets/budget-chart.png";
import MalariaReportImg from "app/modules/home-module/assets/malaria-report.png";
import GenderReportImg from "app/modules/home-module/assets/gender-report.png";
import BudgetDataImg from "app/modules/home-module/assets/budget-data.png";
import InfoCard from "./infoCard";
import { style } from "./style";

export default function AssetsList() {
  return (
    <div
      css={`
        display: flex;
        gap: 40px;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          gap: 48px;
        `}
      >
        <a href="/report/664f406b82350800ca942b92" css={style.assetCard}>
          <img
            src={ClimateReportImg}
            alt="Climate Report"
            width={384}
            height={310}
            css={"border-radius: 23px!important;"}
          />
          <p>Climate data report</p>
          <p>Report</p>
        </a>
        <a href="/chart/66031cead6b19700d9e2a8ac" css={style.assetCard}>
          <img
            src={IATICountryImg}
            alt="IATI Country Chart"
            width={384}
            height={227.8}
          />
          <p>IATI Country Incoming Funds 2024</p>
          <p>Chart</p>
        </a>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          gap: 40px;
        `}
      >
        <a href="/chart/66031b319b11a300b870c800" css={style.assetCard}>
          <img
            src={BudgetChartImg}
            alt="Budget Chart"
            width={384}
            height={204.34}
          />
          <p>Budget Flow</p>
          <p>Chart</p>
        </a>
        <div>
          <InfoCard />
        </div>

        <a href="/report/6603b021d6b19700d9e2a8ae" css={style.assetCard}>
          <img
            src={MalariaReportImg}
            alt="Malaria Report"
            width={384}
            height={339.6}
          />
          <p>
            Malaria Eradication by 2030: A Challenge that Requires Urgent Action
          </p>
          <p>Report</p>
        </a>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          gap: 40px;
        `}
      >
        <a href="/report/6603d2cb5c200a009889ea05" css={style.assetCard}>
          <img
            src={GenderReportImg}
            alt="gender Report"
            width={384}
            height={342}
          />
          <p>Gender based violence</p>
          <p>Report</p>
        </a>
        <a
          href="/dataset/6603136cab07ef3d7c7ff9be/detail?fromHome=true"
          css={style.assetCard}
        >
          <img src={BudgetDataImg} alt="Budget Data" width={384} height={245} />
          <p>Budget 2011</p>
          <p>Data</p>
        </a>
      </div>
    </div>
  );
}
