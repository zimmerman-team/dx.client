import React from "react";
import { useTitle } from "react-use";
import BgEllipses from "app/modules/home-module/assets/full-bg-ellipses.svg";
import { Box, Container } from "@material-ui/core";
import PlanCard from "./components/plan-card";

import HomeFooter from "../../components/Footer";
import Features from "./components/features";
import MFALogo from "./assets/mfa-logo";
import TGFLogo from "./assets/tgf-logo";
import IATILogo from "./assets/iati-logo";
import FAQ from "./components/faq";

export default function PricingModule() {
  useTitle("DX DataXplorer - Pricing");

  const [activeView, setActiveView] = React.useState("monthly");

  const views = [
    {
      name: "Monthly Plan",
      key: "monthly",
    },
    {
      name: (
        <div
          css={`
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          `}
        >
          Yearly Plan
          <p
            css={`
              margin: 0;
              padding: 0;
              font-size: 10px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            (Save 15% Annually )
          </p>
        </div>
      ),
      key: "yearly",
    },
  ];

  const plans = [
    {
      name: "Free Plan",
      yearlyPrice: "FREE",
      monthlyPrice: "FREE",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      current: true,
      recommended: false,
      buttonText: "Start",
      key: "free",
    },
    {
      name: "Pro",
      yearlyPrice: "€749.25",
      monthlyPrice: "€83.25",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      current: false,
      recommended: false,
      buttonText: "Start a free trial",
      key: "pro",
    },
    {
      name: "Team",
      yearlyPrice: "€2,247.75",
      monthlyPrice: "€249.75",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      current: false,
      recommended: true,
      buttonText: "Get a demo",
      key: "team",
    },
    {
      name: "Enterprise",
      yearlyPrice: "Custom",
      monthlyPrice: "Custom",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      current: false,
      recommended: false,
      buttonText: "Get a demo",
      key: "enterprise",
    },
  ];

  return (
    <section
      css={`
        background: url(${BgEllipses});
        background-size: 100%;
        background-position: center 72px;
        background-repeat: no-repeat;
        padding-top: 48px; // AppBar height
      `}
    >
      <Container maxWidth="lg">
        <h1
          css={`
            margin: 0;
            padding: 0;
            margin-top: 124px;
            font-size: 55px;
            font-weight: 400;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            line-height: normal;
            color: #231d2c;
            text-align: center;
          `}
        >
          Create reports that aren't a pain to build
        </h1>
        <p
          css={`
            margin: 0;
            padding: 0;
            font-size: 14px;
            font-weight: 325;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            line-height: normal;
            letter-spacing: 0.5px;
            color: #231d2c;
            text-align: center;
            margin-top: 10px;
          `}
        >
          DATAXPLORER simplifies and empowers visual data reporting for all.
          Free for all.
        </p>
        <Box height={65} />
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            column-gap: 20px;
          `}
        >
          <p
            css={`
              margin: 0;
              padding: 0;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #231d2c;
              font-size: 20px;
              font-weight: 400;
              line-height: normal;
            `}
          >
            Choose Your Subscription
          </p>
          <div
            css={`
              border-radius: 51px;
              background: #f1f1f1;
              padding: 7px 9px;
              display: flex;
              align-items: center;
              button {
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                display: flex;
                width: 105px;
                height: 32px;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
            `}
          >
            {views.map((view) => (
              <button
                key={view.key}
                css={`
                  ${activeView === view.key
                    ? `
                border-radius: 51px;
             
                background: #FFF;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);`
                    : ""}
                  border: none;
                `}
                onClick={() => setActiveView(view.key)}
              >
                {view.name}
              </button>
            ))}
          </div>
        </div>
        <Box height={65} />

        <div
          css={`
            display: flex;
            justify-content: flex-end;
            column-gap: 24px;
          `}
        >
          {plans.map((plan) => (
            <PlanCard plan={plan} activeView={activeView} />
          ))}
        </div>

        <Features />

        <Box height={100} />
        <div>
          <h2
            css={`
              font-size: 18px;
              font-style: normal;
              font-weight: 400;
              line-height: 160%;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #262c34;
              text-align: center;
            `}
          >
            Trusted by
          </h2>
          <div
            css={`
              margin-top: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              column-gap: 85px;
            `}
          >
            <MFALogo /> <TGFLogo /> <IATILogo />
          </div>
        </div>
        <Box height={100} />
        {/* <FAQ />
        <Box height={100} /> */}
      </Container>
      <HomeFooter />
    </section>
  );
}
