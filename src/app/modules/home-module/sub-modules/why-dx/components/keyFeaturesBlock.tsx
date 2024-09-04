import React from "react";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import { ReactComponent as AIPoweredImg } from "app/modules/home-module/assets/whydx-ai-powered-illustration.svg";
import { ReactComponent as CharVizImg } from "app/modules/home-module/assets/whydx-chartviz-illustration.svg";
import { ReactComponent as OpenSourceImg } from "app/modules/home-module/assets/whydx-opensource-illustration.svg";
import { ReactComponent as ReportsImg } from "app/modules/home-module/assets/whydx-reports-illustration.svg";
import { ReactComponent as SearchImg } from "app/modules/home-module/assets/whydx-search-illustration.svg";
import { keyfeaturescss } from "../style";
import { useMediaQuery } from "@material-ui/core";

export default function KeyFeaturesBlock() {
  const isTablet = useMediaQuery("(max-width:1024px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  let spacing: GridSpacing = 9;
  if (isTablet) {
    spacing = 6;
  }
  if (isMobile) {
    spacing = 2;
  }
  return (
    <div css={keyfeaturescss.container}>
      <h3>Unlock the Power of Data with Dataxplorer</h3>
      <Grid
        container
        spacing={spacing}
        alignItems="center"
        css={`
          @media (min-width: 1111px) {
            @media (max-width: 1279px) {
              flex-wrap: nowrap;
            }
          }
          @media (max-width: 1110px) {
            flex-direction: column;
            align-items: center;
          }
        `}
      >
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <SearchImg />
        </Grid>
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <div css={keyfeaturescss.text}>
            <p>All-in-One Stack</p>
            <p>
              Dataxplorer consolidates all your data management needs into a
              single, integrated stack. Whether it's data integration,
              visualization, or report creation, you'll find it all here. No
              more juggling multiple tools or struggling to maintain
              compatibility. <br /> <br />
              Our open-source platform simplifies your workflow, making your
              mission more efficient, and saving you time and resources
            </p>
          </div>
        </Grid>
      </Grid>
      <div
        css={`
          height: 120px;
          @media (max-width: 1024px) {
            height: 73px;
          }
          @media (max-width: 600px) {
            height: 48px;
          }
        `}
      />
      <Grid
        container
        spacing={spacing}
        alignItems="center"
        css={`
          @media (min-width: 1111px) {
            @media (max-width: 1279px) {
              flex-wrap: nowrap;
            }
          }
          @media (max-width: 1110px) {
            flex-direction: column-reverse;
            align-items: center;
          }
        `}
      >
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <div css={keyfeaturescss.text}>
            <p>Connect Data with Ease</p>
            <p>
              Dataxplorer simplifies the complex task of data integration,
              enabling you to seamlessly centralize your crucial datasets. Gone
              are the days of laborious manual data manipulation; we've
              streamlined the process for your convenience. <br /> <br />
              Spend less time on data wrangling and more on what matters most -
              making informed decisions.
            </p>
          </div>
        </Grid>
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <AIPoweredImg
            css={`
              margin-left: -30px;
            `}
          />
        </Grid>
      </Grid>
      <div
        css={`
          height: 100px;
          @media (max-width: 1024px) {
            height: 73px;
          }
          @media (max-width: 600px) {
            height: 48px;
          }
        `}
      />
      <Grid
        container
        spacing={spacing}
        alignItems="center"
        css={`
          @media (min-width: 1111px) {
            @media (max-width: 1279px) {
              flex-wrap: nowrap;
            }
          }
          @media (max-width: 1110px) {
            flex-direction: column;
            align-items: center;
          }
        `}
      >
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <CharVizImg
            css={`
              margin-left: -30px;
            `}
          />
        </Grid>
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <div css={keyfeaturescss.text}>
            <p>Visualize Your Impact</p>
            <p>
              Your data is a valuable resource, and Dataxplorer empowers you to
              make the most of it. Our AI-driven agents are at your disposal,
              ready to generate the most pertinent charts for your specific
              dataset. With just a few clicks, you'll unlock insightful
              visualizations that vividly narrate your data's story, helping you
              uncover trends and patterns.
            </p>
          </div>
        </Grid>
      </Grid>
      <div
        css={`
          height: 111px;
          @media (max-width: 600px) {
            height: 48px;
          }
        `}
      />
      <Grid
        container
        spacing={spacing}
        alignItems="center"
        css={`
          @media (min-width: 1111px) {
            @media (max-width: 1279px) {
              flex-wrap: nowrap;
            }
          }
          @media (max-width: 1110px) {
            flex-direction: column-reverse;
            align-items: center;
          }
        `}
      >
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <div css={keyfeaturescss.text}>
            <p>Interactive Reports </p>
            <p>
              Transform your data-driven insights into engaging narratives that
              captivate and inform your stakeholders. Dataxplorer allows you to
              effortlessly create interactive reports that captivate and inform
              your stakeholders. <br /> <br />
              Incorporate charts, text, images, and videos seamlessly. Your
              ability to convey your findings with impact is now within reach,
              enhancing your ability to drive positive change.
            </p>
          </div>
        </Grid>
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <OpenSourceImg />
        </Grid>
      </Grid>
      <div
        css={`
          height: 85px;
          @media (max-width: 600px) {
            height: 48px;
          }
        `}
      />
      <Grid
        container
        spacing={spacing}
        alignItems="center"
        css={`
          @media (min-width: 1111px) {
            @media (max-width: 1279px) {
              flex-wrap: nowrap;
            }
          }
          @media (max-width: 1110px) {
            flex-direction: column;
            align-items: center;
          }
        `}
      >
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <ReportsImg
            css={`
              margin-left: -30px;
            `}
          />
        </Grid>
        <Grid item lg={6} md={9} sm={12} xs={12}>
          <div css={keyfeaturescss.text}>
            <p>Join The Data Revolution</p>
            <p>
              Become a pioneer in the realm of data-driven decision-making.
              Embrace the future with Dataxplorer and experience the
              transformative power of streamlined data management. Sign up today
              and take the first step towards making a significant impact in the
              international aid development sector. <br /> <br />
              With Dataxplorer, your journey to data-driven excellence begins
              now.
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
