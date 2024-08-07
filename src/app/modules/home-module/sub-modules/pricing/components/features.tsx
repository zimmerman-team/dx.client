import React from "react";
import BackupIcon from "app/modules/home-module/sub-modules/pricing/assets/backup";
import AddChartIcon from "app/modules/home-module/sub-modules/pricing/assets/add-chart";
import GoodIcon from "app/modules/home-module/sub-modules/pricing/assets/good-icon";
import ReportIcon from "app/modules/home-module/sub-modules/pricing/assets/report";
import UserShieldIcon from "app/modules/home-module/sub-modules/pricing/assets/user-shied";
import SupportIcon from "app/modules/home-module/sub-modules/pricing/assets/support";

const Features = () => {
  const features = [
    {
      title: "Connect Data",
      subtitle:
        "Effortlessly integrate your data from multiple sources with our comprehensive data connection features.",
      color: "#73D3CD",
      icon: BackupIcon,
      options: [
        {
          name: "Number of  datasets or data size",
          values: [
            "5 datasets / 1GB",
            "100 datasets / 10GB",
            "1.000 datasets / 25GB",
            "10.000 datasets / 100GB",
          ],
        },
        {
          name: "Federated search",
          values: ["Max 10 results", ">", "Unlimited", "<"],
        },
        {
          name: "Data export (CSV)",
          values: ["Max 100 lines", ">", "Unlimited", "<"],
        },
        {
          name: "Availability",
          values: ["180 days", ">", "Unlimited", "<"],
        },
        {
          name: "Local Data Upload",
          values: [true, true, true, true],
        },
        {
          name: "Connect to 3rd Party services ",
          values: [false, true, true, true],
        },
      ],
    },
    {
      title: "Create charts",
      subtitle:
        "Create charts for impact with ease using our comprehensive Chartbuilder..",
      color: "rgba(223, 227, 229, 0.50)",
      icon: AddChartIcon,
      options: [
        {
          name: "Number of charts",
          values: [10, 100, "5.000", "50.000"],
        },
        {
          name: "Access to the Chartbuilder",
          values: [true, true, true, true],
        },
        {
          name: "Share Chart Powered by Dataxplorer",
          values: [true, true, true, true],
        },
        {
          name: "Basic Charting",
          values: [true, true, true, true],
        },
        {
          name: "Advanced Charting",
          values: [false, true, true, true],
        },
        {
          name: "Custom Charting",
          button: true,
          values: [false, true, true, true],
        },
        {
          name: "AI Agent",
          values: [false, true, true, true],
        },
      ],
    },
    {
      title: "Create report",
      subtitle:
        "Create comprehensive reports effortlessly with our versatile report creation tools.",
      color: "#E492BD",
      icon: ReportIcon,
      options: [
        {
          name: "Number of reports",
          values: [5, 100, "1.000", "10.000"],
        },
        {
          name: "Basic Templates",
          values: [true, true, true, true],
        },
        {
          name: "Advanced Templates",
          values: [true, true, true, true],
        },
        {
          name: "Media / Video support",
          values: [false, true, true, true],
        },
        {
          name: "Report AI Chat",
          button: true,
          values: [false, true, true, true],
        },
        {
          name: "Report AI Builder",
          button: true,
          values: [false, true, true, true],
        },
      ],
    },
    {
      title: "User management",
      subtitle:
        "Manage your users effectively with our robust user management.",
      color: "#6061E5",
      icon: UserShieldIcon,
      options: [
        {
          name: "User Management",
          values: [1, 1, 5, 10],
        },
        {
          name: "Pricing Management",
          values: [true, true, true, true],
        },
        {
          name: "Team Management",
          values: [false, true, true, true],
        },
      ],
    },
    {
      title: "Support",
      subtitle:
        "Get comprehensive support to ensure your success with our dedicated resources.",
      color: "#63A7E4",
      icon: SupportIcon,
      options: [
        {
          name: "Ticketing support",
          values: [false, true, true, true],
        },
        {
          name: "Webinars",
          values: [false, true, true, true],
        },
        {
          name: "Live chat",
          values: [false, true, true, true],
        },
        {
          name: "Dedicated support",
          values: [false, false, false, "5/8 CET"],
        },
        {
          name: "Service Level Agreement",
          values: [false, false, false, "5/8 CET"],
        },
      ],
    },
  ];
  return (
    <section>
      {features.map((feature, idx) => (
        <>
          <div key={feature.title}>
            <div
              css={`
                display: flex;
                justify-content: space-between;
              `}
            >
              <div
                css={`
                  padding: 5px 10px;
                `}
              >
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    column-gap: 6px;
                  `}
                >
                  <feature.icon />
                  <p
                    css={`
                      margin: 0;
                      padding: 0;
                      font-weight: 400;
                      line-height: normal;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                      font-size: 20px;
                    `}
                  >
                    {feature.title}
                  </p>
                </div>
                <p
                  css={`
                    margin: 0;
                    padding: 0;
                    color: #787f88;
                    font-family: Inter;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    white-space: pre-line;
                    line-height: normal;
                    margin-top: 8px;
                  `}
                >
                  {feature.subtitle}
                </p>
              </div>

              <div
                css={`
                  display: flex;
                  justify-content: flex-end;
                  column-gap: 24px;
                `}
              >
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      css={`
                        background: rgba(202, 202, 202, 0.1);
                        width: 224px;
                        height: 100%;
                      `}
                    />
                  ))}
              </div>
            </div>
            <div
              css={`
                border-left: 4px solid ${feature.color};
              `}
            >
              {feature.options.map(
                (option: { name: string; values: any[]; button?: boolean }) => (
                  <div
                    key={option.name}
                    css={`
                      display: flex;

                      justify-content: space-between;
                      border-top: 1px solid rgba(223, 227, 229, 0.5);
                      :last-of-type {
                        border-bottom: 1px solid rgba(223, 227, 229, 0.5);
                      }
                    `}
                  >
                    <p
                      css={`
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin: 0;
                        padding: 9px 12px;
                        line-height: normal;
                        font-family: "Inter", sans-serif;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        button {
                          border: none;
                          background: none;
                          outline: none;
                          width: 88px;
                          height: 17px;
                          flex-shrink: 0;
                          border-radius: 30px;
                          border: 1px solid #252c34;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          text-transform: uppercase;
                          font-size: 10px;
                          font-family: "GothamNarrow-Book", sans-serif;
                        }
                      `}
                    >
                      {option.name}{" "}
                      {option.button && <button>Coming soon</button>}
                    </p>

                    <div
                      css={`
                        display: flex;
                        column-gap: 24px;
                      `}
                    >
                      {option.values.map((value) => (
                        <p
                          css={`
                            margin: 0;
                            line-height: normal;
                            font-family: "Inter", sans-serif;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            color: #252c34;
                            /* text-align: center; */
                            display: flex;
                            justify-content: center;
                            background: rgba(202, 202, 202, 0.1);
                            width: 224px;
                            padding: 9px 0;
                            position: relative;
                          `}
                        >
                          {value === ">" || value === "<" ? (
                            <div
                              css={`
                                position: absolute;
                                width: 24px;
                                height: 100%;
                                top: 0;
                                ${value === ">" ? "right" : "left"}: -24px;
                                background: rgba(202, 202, 202, 0.1);
                              `}
                            />
                          ) : value === true ? (
                            <GoodIcon />
                          ) : value === false ? (
                            "-"
                          ) : (
                            value
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div
            css={`
              display: flex;
              justify-content: flex-end;
              height: ${idx === features.length - 1 ? "16px" : "24px"};
              column-gap: 24px;
            `}
          >
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  css={`
                    background: rgba(202, 202, 202, 0.1);
                    width: 224px;
                    height: 100%;
                    ${idx === features.length - 1
                      ? `border-bottom-right-radius: 20px;
                          border-bottom-left-radius: 20px;`
                      : ""}
                  `}
                />
              ))}
          </div>
        </>
      ))}
    </section>
  );
};

export default Features;
