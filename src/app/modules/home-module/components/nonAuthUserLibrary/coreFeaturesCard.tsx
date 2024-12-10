import React from "react";
import Box from "@material-ui/core/Box";
import { ReactComponent as UploadDataImg } from "app/modules/home-module/assets/upload-data-illustration.svg";
import { ReactComponent as CreateChartImg } from "app/modules/home-module/assets/create-charts-illustration.svg";
import { ReactComponent as BuildReportImg } from "app/modules/home-module/assets/build-reports-illustration.svg";
import { ReactComponent as ShareInsightsImg } from "app/modules/home-module/assets/share-insights-illustration.svg";

export default function CoreFeaturesCard(props: { handleClose: () => void }) {
  const data = [
    {
      title: "Upload or Search Data",
      description: "Quickly upload datasets or \n search from the library.",
      img: <UploadDataImg />,
    },
    {
      title: "Create Charts",
      description: "Visualize your data in customizable formats.",
      img: <CreateChartImg />,
    },
    {
      title: "Build Reports",
      description: "Integrate visuals into shareable reports.",
      img: <BuildReportImg />,
    },
    {
      title: "Share Insights",
      description: "Publish and share your findings with ease.",
      img: <ShareInsightsImg />,
    },
  ];
  return (
    <div
      css={`
        height: 152px;
        background: #231d2c;
        color: #fff;
        border-radius: 16px;
        padding: 16px;
      `}
    >
      <Box display={"flex"} gridColumnGap={"10px"} width={"100%"}>
        {data.map((item, index) => (
          <Box
            display={"flex"}
            gridColumnGap={"16.79px"}
            alignItems={"center"}
            width={"292.5px"}
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
