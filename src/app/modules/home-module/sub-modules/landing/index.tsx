import { useAuth0 } from "@auth0/auth0-react";
import EmpowerBlock from "../partners/components/empowerBlock";
import { Container } from "@material-ui/core";
import ReportImage from "app/modules/home-module/sub-modules/landing/assets/report.png";
import InteractImage from "app/modules/home-module/sub-modules/landing/assets/interact.png";
import Investment from "app/modules/home-module/sub-modules/landing/assets/investment.png";
import ThePowerImage from "app/modules/home-module/sub-modules/landing/assets/the-power.png";
import HomeFooter from "../../components/Footer";
import Subscribe from "../../components/Subscribe";
import { useTitle } from "react-use";
import { Link } from "react-router-dom";

export default function LandingModule() {
  useTitle("DX DataXplorer - Landing");

  return (
    <div
      css={`
        background: #ffffff;
      `}
    >
      <EmpowerBlock view="landing" />

      <Container maxWidth="lg">
        <Link to="/report/664f406b82350800ca942b92?fromLanding=true">
          <img
            src={ReportImage}
            alt="report-image"
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
              font-family: "GothamNarrow-Medium", sans-serif;
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
              font-family: "GothamNarrow-Medium", sans-serif;
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
              <h2>Interactive Reports</h2>

              <p>
                Transform your data-driven insights into engaging narratives
                that captivate and inform your stakeholders. DataXplorer allows
                you to effortlessly create interactive reports that captivate
                and inform your stakeholders.
                <br /> <br />
                Incorporate charts, text, images, and videos seamlessly. Your
                ability to convey your findings with impact is now within reach,
                enhancing your ability to drive positive change.
              </p>
            </div>
            <img
              src={InteractImage}
              alt="interact-image"
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
              alt="investment-image"
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
                Your data is a valuable resource, and DataXplorer empowers you
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
              font-family: "GothamNarrow-Bold", sans-serif;
              text-align: center;
            `}
          >
            Unlock the Power of Data with DataXplorer
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
      <HomeFooter />
    </div>
  );
}
