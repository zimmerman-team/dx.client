import React from "react";
import Box from "@material-ui/core/Box";
import { ReactComponent as ConnectImg } from "app/modules/home-module/assets/connect-seamlessly-illustration.svg";
import { ReactComponent as VisualiseImg } from "app/modules/home-module/assets/visualise-illustration.svg";
import { ReactComponent as CreateReportImg } from "app/modules/home-module/assets/creat-report-illustration.svg";
import { ReactComponent as CollaborateImg } from "app/modules/home-module/assets/collaborate-illustration.svg";
import { ReactComponent as SaveTimeImg } from "app/modules/home-module/assets/saveTime-illustration.svg";

export default function ExtraFeaturesCard(props: { handleClose: () => void }) {
  const data = [
    {
      title: "Connect Seamlessly",
      description:
        "Upload or search datasets in seconds. Save time with integrations from trusted sources like X, Y, and Z.",
      img: <ConnectImg />,
    },
    {
      title: "Visualize with Ease",
      description:
        "Transform raw data into stunning, interactive charts and graphs—no technical skills required.",
      img: <VisualiseImg />,
    },
    {
      title: "Create Impactful Reports",
      description:
        "Effortlessly combine visuals into ready-to-share reports, perfect for decision-making and storytelling.",
      img: <CreateReportImg />,
    },
    {
      title: "Collaborate Better",
      description:
        "Work with your team in real-time, and ensure everyone’s on the same page with centralized data storytelling",
      img: <CollaborateImg />,
    },
    {
      title: "Save Time, Drive Insights",
      description:
        "Our streamlined workflow helps you focus on what matters—actionable insights and results.",
      img: <SaveTimeImg />,
    },
  ];
  return (
    <div
      css={`
        height: 352px;
        background: #231d2c;
        color: #fff;
        border-radius: 16px;
        padding: 16px;
      `}
    >
      <Box
        display={"grid"}
        gridColumnGap={"20px"}
        gridRowGap={"10px"}
        width={"100%"}
        gridTemplateColumns={"50% 50%"}
      >
        {data.map((item, index) => (
          <Box
            display={"flex"}
            gridColumnGap={"16.79px"}
            alignItems={"center"}
            height={"90px"}
            key={item.title}
          >
            {item.img}
            <Box>
              <p
                css={`
                  color: #fff;
                  font-family: "GothamNarrow-Bold", sans-serif;
                  font-size: 18px;
                  font-style: normal;
                  margin: 0px;
                `}
              >
                {item.title}
              </p>
              <p
                css={`
                  color: #fff;
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-size: 14px;
                  font-weight: 325;
                  line-height: 20px;
                  margin: 0px;
                  white-space: pre-line;
                `}
              >
                {item.description}
              </p>
            </Box>
          </Box>
        ))}
      </Box>
      <div
        css={`
          display: flex;
          justify-content: end;
          button {
            color: #fff;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 14px;
            text-decoration-line: underline;
            cursor: pointer;
            border: none;
            background: none;
            width: max-content;
            height: max-content;
          }
        `}
      >
        <button onClick={props.handleClose}> Collapse this Section</button>
      </div>
    </div>
  );
}
