import React from "react";
import axios from "axios";
import { useTitle } from "react-use";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
import BgEllipses from "app/modules/home-module/assets/full-bg-ellipses.svg";
import { Box, Container, useMediaQuery } from "@material-ui/core";
import PlanCard from "./components/plan-card";

import HomeFooter from "app/modules/home-module/components/Footer";
import Features from "./components/features";
import MFALogo from "./assets/mfa-logo";
import TGFLogo from "./assets/tgf-logo";
import IATILogo from "./assets/iati-logo";
import { useHistory } from "react-router-dom";
import MobilePlanCard from "./components/mobile-plan-card";

const views = [
  {
    name: "Monthly Plan",
    key: "monthly",
  },
  {
    name: "Annual Plan",
    key: "yearly",
  },
];

export default function PricingModule() {
  useTitle("DX Dataxplorer - Pricing");

  const { user, isAuthenticated } = useAuth0();
  const isMobile = useMediaQuery("(max-width: 1030px)");

  const [subscriptionPlan, setSubscriptionPlan] = React.useState("monthly");

  const token = useStoreState((state) => state.AuthToken.value);

  const history = useHistory();

  const createNewStripeCustomer = async () => {
    const customerCreationResponse = await axios.post(
      `${process.env.REACT_APP_API}/stripe/new-customer`,
      {
        name: user?.name,
        email: user?.email,
        authUserId: user?.sub,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return customerCreationResponse.data.data;
  };

  const plans = [
    {
      name: "Free Plan",
      yearlyPrice: "Free forever",
      monthlyPrice: "Free forever",
      text: "For individuals or teams just getting started in Dataxplorer",
      current: isAuthenticated ? true : false,
      recommended: isAuthenticated ? false : true,
      buttonText: "Activate",
      discount: "",
      key: "free",
      available: true,
    },
    {
      name: "Pro",
      yearlyPrice: "€720",
      monthlyPrice: "€75",
      text: "For individual users.",
      current: false,
      recommended: false,
      buttonText: "Activate a free trial",
      discount: "(Save 20%)",
      key: "pro",
      available: false,
    },
    {
      name: "Team",
      yearlyPrice: "€576",
      monthlyPrice: "€60",
      text: "Scale up to 100 users and connect your team.",
      current: false,
      recommended: false,
      buttonText: "Activate free trial",
      discount: "(Save 20%)",
      key: "team",
      available: false,
    },
    {
      name: "Enterprise",
      yearlyPrice: "Custom",
      monthlyPrice: "Custom",
      text: "For organisations looking scale into powerful data visualization, with full support and security",
      current: false,
      recommended: false,
      buttonText: "Contact us",
      discount: "",
      key: "enterprise",
      available: false,
    },
  ];

  const createStripeCheckoutSession = async (
    customerId: string,
    planName: string
  ) => {
    const checkoutSessionResponse = await axios.post(
      `${process.env.REACT_APP_API}/stripe/checkout-session`,
      {
        planName,
        customerId,
        licensesNumber: 1,
        recurrence: subscriptionPlan,
        domainURL: `${window.location.origin}/payment`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return checkoutSessionResponse.data.data;
  };

  const handlePlanButtonClick = async (key: string) => {
    if (!isAuthenticated) {
      return history.replace(
        `/onboarding/signin?to=${window.location.pathname}${window.location.search}`
      );
    }
    switch (key) {
      case plans[0].key:
        const customerId = await createNewStripeCustomer();
        if (customerId) {
          const sessionUrl = await createStripeCheckoutSession(customerId, key);
          if (sessionUrl) window.location.href = sessionUrl;
        }
        break;
      case plans[1].key:
      case plans[2].key:
      case plans[3].key:
      default:
        break;
    }
  };

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
            @media (max-width: 1300px) {
              font-size: 40px;
            }
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
            @media (max-width: 1300px) {
              font-size: 18px;
            }
            @media (max-width: 600px) {
              font-size: 16px;
              b {
                font-weight: 350;
              }
            }
          `}
        >
          DATAXPLORER simplifies and empowers visual data reporting for all.
          <b> Free for all.</b>
        </p>
        <Box height={65} />
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            column-gap: 20px;
            @media (max-width: 600px) {
              flex-direction: column;
              row-gap: 8px;
            }
          `}
        >
          <div>
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
            <p
              css={`
                margin: 0;
                padding: 0;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 325;
                line-height: normal;
                letter-spacing: 0.5px;
                text-align: center;
              `}
            >
              Save 20% for annual plans
            </p>
          </div>
          <div
            css={`
              border-radius: 51px;
              background: #f1f1f1;
              padding: 5px 8px;
              display: flex;
              align-items: center;
              button {
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                display: flex;
                width: 99px;
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
                  ${subscriptionPlan === view.key
                    ? `
                border-radius: 51px;
             
                background: #FFF;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);`
                    : ""}
                  border: none;
                `}
                onClick={() => setSubscriptionPlan(view.key)}
              >
                {view.name}
              </button>
            ))}
          </div>
        </div>
        <Box height={65} />
        {isMobile ? (
          <>
            <MobilePlanCard />
          </>
        ) : (
          <>
            <div
              css={`
                display: flex;
                justify-content: flex-end;
                column-gap: 24px;
              `}
            >
              {plans.map((plan) => (
                <PlanCard
                  key={plan.key}
                  plan={plan}
                  activeView={subscriptionPlan}
                  onButtonClick={handlePlanButtonClick}
                />
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
                  column-gap: 200px;
                `}
              >
                <MFALogo /> <TGFLogo /> <IATILogo />
              </div>
            </div>
          </>
        )}

        <Box height={100} />
      </Container>
      <HomeFooter />
    </section>
  );
}
