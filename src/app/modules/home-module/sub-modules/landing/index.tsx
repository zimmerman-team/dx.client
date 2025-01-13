import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import { Box, Container } from "@material-ui/core";
import StoryImage from "app/modules/home-module/sub-modules/landing/assets/story.png";
import InteractImage from "app/modules/home-module/sub-modules/landing/assets/interact.png";
import Investment from "app/modules/home-module/sub-modules/landing/assets/investment.png";
import ThePowerImage from "app/modules/home-module/sub-modules/landing/assets/the-power.png";
import HomeFooter from "app/modules/home-module/components/Footer";
import Subscribe from "app/modules/home-module/components/Subscribe";
import { useTitle } from "react-use";
import { Link } from "react-router-dom";

export default function LandingModule() {
  useTitle("DX Dataxplorer - Landing");

  return (
    <div
      css={`
        background: #ffffff;
      `}
    >
      <EmpowerBlock view="landing" />

      <Container maxWidth="lg">
        <Link to="/story/664f406b82350800ca942b92?fromLanding=true">
          <img
            src={StoryImage}
            alt="Story"
            css={`
              width: 100%;
              margin-top: -140px;
              position: relative;
              :hover {
                opacity: 0.8;
              }
            `}
          />
        </Link>
        <div
          css={`
            h2 {
              margin: 0;
              padding: 0;
              font-size: 36px;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
              color: #231d2c;
              font-weight: 350;
            }
            p {
              margin: 37px 0 0 0;
              padding: 0;
              font-size: 20px;
              font-style: normal;
              font-weight: 350;
              line-height: 30px; /* 150% */
              letter-spacing: 0.5px;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
            }
          `}
        >
          <div
            css={`
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                width: 583px;
              `}
            >
              <h2>Interactive Stories</h2>

              <p>
                Transform your data-driven insights into engaging narratives
                that captivate and inform your stakeholders. Dataxplorer allows
                you to effortlessly create interactive stories that captivate
                and inform your stakeholders.
                <br /> <br />
                Incorporate charts, text, images, and videos seamlessly. Your
                ability to convey your findings with impact is now within reach,
                enhancing your ability to drive positive change.
              </p>
            </div>
            <img
              src={InteractImage}
              alt="interact"
              css={`
                width: 551px;
                margin-right: -18.449px;
                margin-top: -6.72px;
              `}
            />
          </div>
          <div
            css={`
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              padding: 32px 0;
            `}
          >
            <img
              src={Investment}
              alt="investment"
              css={`
                width: 551px;
                margin-left: -25px;
                margin-top: -9.399px;
              `}
            />
            <div
              css={`
                width: 583px;
              `}
            >
              <h2>Visualize Your Impact</h2>

              <p>
                Your data is a valuable resource, and Dataxplorer empowers you
                to make the most of it. Our AI-driven agents are at your
                disposal, ready to generate the most pertinent charts for your
                specific dataset.
                <br /> <br /> With just a few clicks, you'll unlock insightful
                visualizations that vividly narrate your data's story, helping
                you uncover trends and patterns.
              </p>
            </div>
          </div>
        </div>

        <div
          css={`
            margin-top: 108px;
            margin-bottom: 40px;
          `}
        >
          <h2
            css={`
              margin: 0;
              padding: 0;
              font-size: 48px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              text-align: center;
            `}
          >
            Unlock the Power of Data with Dataxplorer
          </h2>
          <img
            src={ThePowerImage}
            alt="the-power-of-data"
            css={`
              margin-top: 74.17px;
              width: 100%;
            `}
          />
        </div>
        <div
          css={`
            margin-top: 60px;
            margin-bottom: 80px;
          `}
        >
          <Subscribe />
        </div>
      </Container>
      <Box height={19} />
      <HomeFooter />
    </div>
  );
}
