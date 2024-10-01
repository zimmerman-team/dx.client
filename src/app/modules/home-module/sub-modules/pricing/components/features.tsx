import React from "react";
import BackupIcon from "../assets/backup";
import AddChartIcon from "../assets/add-chart";
import GoodIcon from "../assets/good-icon";
import ReportIcon from "../assets/report";
import UserShieldIcon from "../assets/user-shied";
import SupportIcon from "../assets/support";
import { InfoOutlined } from "@material-ui/icons";
import InfoIcon from "../assets/info-icon";
import { Tooltip } from "react-tooltip";

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
          info: "The amount of datasets you can manage",
          values: [
            "5 datasets / 1GB",
            "100 datasets / 10GB",
            "1.000 datasets / 25GB",
            "10.000 datasets / 100GB",
          ],
        },
        {
          name: "Federated search",
          info: "Access to datasources like Worldbank, Kaggle, WHO, HDX and more.",
          values: ["Max 12 results", "Unlimited", "Unlimited", "Unlimited"],
        },

        {
          name: "Availability",
          info: "How long Dataxplorer will keep your assets",
          values: ["180 days", "Unlimited", "Unlimited", "Unlimited"],
        },
        {
          name: "Connect Data",
          info: "Bring your own data via CSV, SQL, noSQL or connect your REST services",
          values: [true, true, true, true],
        },
        {
          name: "Data export (CSV)",
          info: "Export your view in a nice CSV file",
          values: ["", true, true, true],
        },
        {
          name: "Connect your own data source",
          info: "Connect data from your database",
          values: ["", true, true, true],
        },
        {
          name: "Microsoft Drive data connect",
          info: "Connect data from your Microsoft Drive",
          values: ["", true, true, true],
        },
        {
          name: "Google Drive data connect",
          info: "Connect data from your Google Drive",
          values: ["", true, true, true],
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
          info: "The amount of charts you can manage.",
          values: [10, 100, "5.000", "50.000"],
        },
        {
          name: "Access to the Chartbuilder",
          info: "Create charts from your datasets",
          values: [true, true, true, true],
        },
        {
          name: "Share Chart Powered by\n Dataxplorer",
          info: "Sharing charts standalone as link AND embed code",
          values: [true, true, true, true],
        },
        {
          name: "Basic Charting",
          values: [true, true, true, true],
        },
        {
          name: "Advanced Charting",
          info: "Advanced charting all CB charting features",
          values: ["", true, true, true],
        },
        {
          name: "AI Agent",
          info: "Use AI Agent to help you chart",
          values: ["", true, true, true],
        },
        {
          name: "Custom Charting",
          info: "",
          button: true,
          values: ["", true, true, true],
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
          info: "The amount of reports you can manage.",
          values: [5, 100, "1.000", "10.000"],
        },
        {
          name: "Basic Templates",
          info: "Access to Basic templates",
          values: [true, true, true, true],
        },
        {
          name: "Advanced Templates",
          info: "Access to Advanced templates",
          values: [true, true, true, true],
        },
        {
          name: "Media / Video support",
          info: "Add images and video",
          values: ["", true, true, true],
        },
        {
          name: "Report AI Chat",
          info: "Talk to your data",
          button: true,
          values: ["", true, true, true],
        },
        {
          name: "Report AI Builder",
          info: "Use AI Agent to draft your Report",
          button: true,
          values: ["", true, true, true],
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
          values: [1, 1, 5, 100],
        },
        {
          name: "Pricing Management",
          values: [true, true, true, true],
        },
        {
          name: "Team Management",
          values: ["", true, true, true],
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
          info: "Access to a ticketing system",
          values: ["", true, true, true],
        },
        {
          name: "Webinars",
          info: "Access to monthly webinars",
          values: ["", true, true, true],
        },
        {
          name: "Live chat",
          info: "Chat with support",
          values: ["", true, true, true],
        },
        {
          name: "Dedicated support",
          info: "Dedicated support only",
          values: ["", "", "", "5/8 CET"],
        },
        {
          name: "Service Level Agreement",
          info: "Custom Service Level",
          values: ["", "", "", "5/8 CET"],
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
                (
                  option: {
                    name: string;
                    values: any[];
                    button?: boolean;
                    info?: string;
                  },
                  optionIndex
                ) => (
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
                        padding: 0px 12px;
                        line-height: normal;
                        font-family: "Inter", sans-serif;
                        font-size: 13px;
                        font-style: normal;
                        font-weight: 500;
                        white-space: pre-line;
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
                          font-family: "GothamNarrow-Book", "Helvetica Neue",
                            sans-serif;
                        }
                      `}
                    >
                      {option.name}{" "}
                      <div
                        css={`
                          flex-shrink: 0;
                          cursor: pointer;
                        `}
                        className={`feature-${idx}-option-${optionIndex}`}
                      >
                        {option.button ? (
                          <button>Coming soon!</button>
                        ) : (
                          <InfoIcon />
                        )}
                      </div>
                      <Tooltip
                        anchorSelect={`.feature-${idx}-option-${optionIndex}`}
                        place="right"
                        css={`
                          opacity: 1 !important;
                        `}
                        style={{
                          backgroundColor: "#231D2C",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                          fontFamily: "GothamNarrow-Medium",
                          maxWidth: "320px",
                          lineHeight: "16px",
                          zIndex: "1",
                          padding: "12px",
                        }}
                      >
                        {option.info}
                      </Tooltip>
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
