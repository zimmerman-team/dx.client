import React from "react";
import BackupIcon from "../assets/backup";
import AddChartIcon from "../assets/add-chart";
import GoodIcon from "../assets/good-icon";
import ReportIcon from "../assets/report";
import UserShieldIcon from "../assets/user-shied";
import SupportIcon from "../assets/support";

const Features = () => {
  const features = [
    {
      title: "Connect Data",
      subtitle: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
      color: "#73D3CD",
      icon: BackupIcon,
      options: [
        {
          name: "Number of  datasets or data size",
          values: ["5 / 1GB", "100 / 10GB", "1000 / 25GB", "10000 / 100GB"],
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
      subtitle: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
      color: "rgba(223, 227, 229, 0.50)",
      icon: AddChartIcon,
      options: [
        {
          name: "Number of charts",
          values: [10, 100, 5000, 50000],
        },
        {
          name: "Chartbuilder",
          values: [true, true, true, true],
        },
        {
          name: "Share Chart Powered by Dx",
          values: [true, true, true, true],
        },
        {
          name: "Basic Charting",
          values: [true, true, true, true],
        },
        {
          name: "Charts Group #1",
          values: [false, true, true, true],
        },
        {
          name: "Charts Group #2",
          values: [false, true, true, true],
        },
        {
          name: "Charts Group #3",
          values: [false, true, true, true],
        },
        {
          name: "Custom Charting",
          values: [false, true, true, true],
        },
        {
          name: "AI agent",
          values: [false, true, true, true],
        },
        {
          name: "Interoperability",
          values: [false, true, true, true],
        },
      ],
    },
    {
      title: "Create report",
      subtitle: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
      color: "#E492BD",
      icon: ReportIcon,
      options: [
        {
          name: "Number of reports",
          values: [5, 100, 1000, 10000],
        },
        {
          name: "Basic Templates",
          values: [true, true, true, true],
        },
        {
          name: "Template Group #1",
          values: [true, true, true, true],
        },
        {
          name: "Template Group #2",
          values: [false, true, true, true],
        },
        {
          name: "Template Group #3",
          values: [false, true, true, true],
        },
        {
          name: "Custom Templates",
          values: [false, true, true, true],
        },
        {
          name: "Media / Video support",
          values: [false, true, true, true],
        },
        {
          name: "Report AI Chat",
          values: [false, true, true, true],
        },
        {
          name: "Report AI Builder",
          values: [false, true, true, true],
        },
      ],
    },
    {
      title: "User management",
      subtitle: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
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
      subtitle: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
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
              {feature.options.map((option) => (
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
                      margin: 0;
                      padding: 9px 12px;
                      line-height: normal;
                      font-family: Inter;
                      font-size: 14px;
                      font-style: normal;
                      font-weight: 500;
                    `}
                  >
                    {option.name}
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
                          font-family: Inter;
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
              ))}
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
