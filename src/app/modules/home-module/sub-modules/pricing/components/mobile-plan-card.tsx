/* eslint-disable sonarjs/no-duplicate-string */
/* eslint no-use-before-define: 0 */
import React from "react";
import GoodIcon from "app/modules/home-module/sub-modules/pricing/assets/good-icon";

export default function MobilePlanCard() {
  const planList = [
    {
      type: "Free Plan",
      subName: "Free forever",
      description: `For individuals or teams just getting started in Dataxplorer.`,
      currentPlan: true,
      custom: false,
      recommended: false,
      offers: [
        "Max 5 datasets / 1 GB",
        "Max 10 search results",
        "180 days availability",
        "Connect data",
        "Max 10 charts",
        "Basic charting",
        "Advanced story templates",
        "Max 5 stories",
        "Basic story templets",
        "1 user management",
        "Pricing management",
        "Access to the Chartbuilder",
        "Share chart powered by Dataxplorer",
      ],
    },
    {
      type: "Pro",
      subName: "€75",
      description: `per month / per user\nOr €720 / yr (Save 20%)\nFor individual users.`,
      currentPlan: false,
      custom: false,
      recommended: false,
      offers: [
        "Unlimited availability",
        "Connect data",
        "Data export (CSV)",
        "Max 500 charts",
        "Basic charting",
        "Advanced charting",
        "Custom charting",
        "Max 100 stories",
        "Basic story templets",
        "Story AI chart",
        "Story AI builder",
        "Advanced story templets",
        "Access to the Chartbuilder",
        "Share chart powered by Dataxplorer",
        "Pricing management",
        "AI agent",
        "Media/video support",
        "1 user management",
        "Team management",
        "Ticketing support",
        "Webinars",
        "Live chart",
        "Max 100 datasets / 10 GB",
        "Unlimited search results",
        "Connect your own data source",
        "Google Drive data connect",
        "Microsoft Drive data connect",
      ],
    },
    {
      type: "Team",
      subName: "€60",
      description: `per month / per user\nOr €576 / yr (Save 20%)\nScale up to 50 users and connect your team.`,
      currentPlan: false,
      custom: false,
      recommended: true,
      offers: [
        "Unlimited availability",
        "Connect data",
        "Data export (CSV)",
        "Max 500 charts",
        "Basic charting",
        "Advanced charting",
        "AI agent",
        "Custom charting",
        "Max 1.000 stories",
        "Basic story templets",
        "Media/video support",
        "Advanced story templets",
        "Share chart powered by Dataxplorer",
        "Access to the Chartbuilder",
        "5 user management",
        "Pricing management",
        "Team management",
        "Story AI chart",
        "Story AI builder",
        "Ticketing support",
        "Webinars",
        "Live chart",
        "Max 1.000 datasets / 25 GB",
        "Unlimited search results",
        "Connect your own data source",
        "Google Drive data connect",
        "Microsoft Drive data connect",
      ],
    },
    {
      type: "Enterprise",
      subName: "Custom",
      description: `For organizations looking to more powerful data visualization, with full support and security.`,
      currentPlan: false,
      custom: true,
      recommended: false,
      offers: [
        "Unlimited availability",
        "Connect data",
        "Data export (CSV)",
        "Max 50.000 charts",
        "Basic charting",
        "Advanced charting",
        "AI agent",
        "Custom charting",
        "Max 10.000 stories",
        "Basic story templets",
        "Advanced story templets",
        "100 user management",
        "5/8 CET dedicated support",
        "5/8 CET service level agreement",
        "Share chart powered by Dataxplorer",
        "Media/video support",
        "Story AI chart",
        "Story AI builder",
        "Pricing management",
        "Team management",
        "Ticketing support",
        "Webinars",
        "Live chart",
        "Max 10.000 datasets / 100 GB",
        "Unlimited search results",
        "Connect your own data source",
        "Google Drive data connect",
        "Microsoft Drive data connect",
        "Access to the Chartbuilder",
      ],
    },
  ];

  return (
    <>
      {planList.map((plan) => {
        const firstHalf = plan.offers.slice(
          0,
          Math.round(plan.offers.length / 2)
        );
        let buttonText = "Activate trial";
        if (plan.currentPlan) {
          buttonText = "Current plan";
        } else if (plan.custom) {
          buttonText = "Contact us";
        }

        return (
          <div
            key={plan.type}
            css={`
              box-shadow: 0px 0px 10px 0px #00000026;
              border-radius: 20px;
              background: ${plan.recommended ? "#6061E5" : "#fff"};
              padding: 19px 21px;
              margin-bottom: 40px;
              p {
                margin: 0;
                color: ${plan.recommended ? "#fff" : "#252c34"};
              }
              > div:nth-of-type(1) {
                /* display: flex;
                justify-content: space-between;
                align-items: flex-start; */
                position: relative;
                div {
                  > p:nth-of-type(1) {
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 24px;
                    line-height: 28px;
                  }
                  > p:nth-of-type(2) {
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 40px;
                    line-height: 48px;
                  }
                  > p:nth-of-type(3) {
                    margin-top: ${plan.type === "Enterprise" ||
                    plan.type === "Free Plan"
                      ? "24px"
                      : "0px"};
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    font-size: 16px;
                    white-space: pre-line;
                  }
                }
                > button {
                  border-radius: 30px;
                  background: var(--Secondary-White-1, #fff);
                  border: none;
                  outline: none;
                  color: #6061e5;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 10px;
                  text-transform: uppercase;
                  width: 88px;
                  height: 13.568px;
                  position: absolute;
                  right: 0px;
                  top: 0px;
                }
              }
              > button {
                margin-top: 40px;
                margin-bottom: 48px;
                border-radius: 50px;
                width: 100%;
                outline: none;
                background: transparent;
                color: #262c34;
                border: 1px solid #262c34;
                ${plan.currentPlan &&
                "background:#000000; color: #ffffff;  border: none;"}
                ${plan.recommended &&
                "background: #2C2C79; color: #F5F5F7;  border: none;"}
                height: 41px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 16px;
              }
              > div:nth-of-type(2) {
                > p {
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                }
                hr {
                  width: 100%;
                  height: 1px;
                  background: ${plan.recommended ? "#fff" : "#252c34"};
                }
                > div:nth-of-type(1) {
                  display: flex;
                  gap: 5px;
                  div {
                    /* display: flex; */
                    flex-basis: 50%;
                  }
                  p {
                    display: flex;
                    align-items: start;
                    flex-shrink: 0;
                    line-height: normal;
                    margin-top: 8px;
                    font-size: 16px;
                    svg {
                      display: flex;
                      flex-shrink: 0;
                      path {
                        fill: ${plan.recommended ? "#fff" : "#6061E5"};
                      }
                      /* margin-top: 2.5px; */
                    }
                    span {
                      line-height: normal;
                    }
                    @media (max-width: 400px) {
                      font-size: 15px;
                    }
                  }
                }
              }
            `}
          >
            <div>
              <div>
                <p>{plan.type}</p>
                <p>{plan.subName}</p>
                <p>{plan.description}</p>
              </div>
              {plan.recommended && <button>Recommended</button>}
            </div>

            <button disabled={plan.currentPlan}>{buttonText}</button>
            <div>
              <hr />
              <p>Includes:</p>
              <div>
                <div>
                  {firstHalf.map((offer) => (
                    <p key={offer}>
                      <GoodIcon /> {offer}
                    </p>
                  ))}
                </div>
                <div>
                  {plan.offers
                    .slice(firstHalf.length, plan.offers.length)
                    .map((offer) => (
                      <p key={offer}>
                        <GoodIcon /> {offer}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
