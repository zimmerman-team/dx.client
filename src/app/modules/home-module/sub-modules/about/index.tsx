import React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import { ReactComponent as MissionImg } from "app/modules/home-module/assets/about-mission.svg";
import { ReactComponent as DXImg } from "app/modules/home-module/assets/about-dx.svg";
import { ReactComponent as StoryImg } from "app/modules/home-module/assets/about-story.svg";
import Ellipses from "app/modules/home-module/assets/about-page-ellipses.svg";

import HomeFooter from "app/modules/home-module/components/Footer";
import { subParagraphcss } from "./style";
import { useTitle } from "react-use";
import { HomePrimaryButton } from "app/components/Styled/button";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import SiemAvi from "app/modules/home-module/assets/team/siem.png";
import JohnAvi from "app/modules/home-module/assets/team/john.png";
import KennyAvi from "app/modules/home-module/assets/team/kenny.png";
import AylinAvi from "app/modules/home-module/assets/team/aylin.png";
import SylvanAvi from "app/modules/home-module/assets/team/sylvan.png";
import VeronikaAvi from "app/modules/home-module/assets/team/veronika.png";
import StefanosAvi from "app/modules/home-module/assets/team/stefanos.png";
import EmmanuellaAvi from "app/modules/home-module/assets/team/emmanuella.png";
import SamuelAvi from "app/modules/home-module/assets/team/samuel.png";
import AnsonAvi from "app/modules/home-module/assets/team/anson.png";
import EmptyAvi from "app/modules/home-module/assets/team/empty.png";

export default function AboutModule() {
  useTitle("DX Dataxplorer - About");
  const { isAuthenticated } = useAuth0();

  const features = [
    {
      title: "+100.000",
      subtitle: "Datasets available",
      text: "Access over 100.000 datasets to\n create reports and charts. Create\n impact with data from 3rd parties\n built in Dataxplorer or connect\n your in-house datasources.",
    },
    {
      title: "+15 Visuals",
      subtitle: "Chart type provided",
      text: "Dataxplorer offers over 15\n different chart types for you to\n work with. Based on the open\n sources Apache E-charts library\n you are able to create rich graphs.",
    },
    {
      title: "+3",
      subtitle: "Languages are supported",
      text: "Dataxplorer caters to a global\n clientele, ensuring seamless data\n integration and communication.\n We will offer Dataxplorer in 3\n different languages.",
    },
  ];

  const uiUx = "UI/UX Design Intern";

  const team = [
    {
      img: SiemAvi,
      name: "Siem Vaessen",
      role: "Managing Director",
      linkedIn: "https://nl.linkedin.com/in/siemvaessen",
    },
    {
      img: JohnAvi,
      name: "John Busch",
      role: "Digital Communications Specialist",
      linkedIn: "https://ch.linkedin.com/in/johnbusch74",
    },
    {
      img: StefanosAvi,
      name: "Stefanos Hadjipetrou",
      role: "Software Developer",
      linkedIn: "https://cy.linkedin.com/in/hadjipetroustefanos",
    },
    {
      img: SylvanAvi,
      name: "Sylvan Ridderinkhof",
      role: "Data Engineer",
      linkedIn: "https://nl.linkedin.com/in/sylvan-ridderinkhof-86a020107",
    },
    {
      img: KennyAvi,
      name: "Kennet Z. Porter",
      role: "UI/UX & Data Visualisation Designer",
      linkedIn: "https://es.linkedin.com/in/kennet-z-porter/en",
    },
    {
      img: AylinAvi,
      name: "Aylin Paçaci",
      role: uiUx,
      linkedIn: "https://tr.linkedin.com/in/aylinpacaci",
    },
    {
      img: EmmanuellaAvi,
      name: "Emmanuella Okorie",
      role: "Frontend Developer",
      linkedIn: "https://ng.linkedin.com/in/okorie-emmanuella-350916173",
    },
    {
      img: SamuelAvi,
      name: "Okechukwu Samuel Owhondah",
      role: "Frontend Developer",
      linkedIn: "https://ng.linkedin.com/in/okorie-emmanuella-350916173",
    },
    {
      img: VeronikaAvi,
      name: "Veronika Ivanova",
      role: uiUx,
      linkedIn: "https://nl.linkedin.com/in/veronika-ivanova-448b6b1b6",
    },
    {
      img: AnsonAvi,
      name: "Shiyi Anson Chen",
      role: uiUx,
      linkedIn: "",
    },
  ];

  return (
    <section
      css={`
        background-image: url(${Ellipses});
        background-repeat: no-repeat;
        background-position: 40% 0%;
        height: 100%;
        padding-bottom: 80px;
        background-color: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0) 0%,
          #f2f7fd 100%
        );
      `}
    >
      <Box height={48} />
      <Box height={77} />

      <Container maxWidth="lg">
        <div
          css={`
            display: flex;
            justify-content: space-between
            align-items: center;
   
          `}
        >
          <div
            css={`
              width: 518px;
            `}
          >
            <h1
              css={`
                font-family: "GothamNarrow-Bold";
                font-size: 64px;
                font-style: normal;
                font-weight: 400;
                line-height: 130%; /* 83.2px */
                margin: 0;
              `}
            >
              Our Story
            </h1>

            <p
              css={`
                margin: 0;
                margin-top: 37.38px;
                font-size: 20px;
                font-style: normal;
                font-weight: 350;
                line-height: normal;
                font-family: "GothamNarrow-Medium";
              `}
            >
              With 20+ years combined experience in data and global health
              development, we empower organisations with innovative data
              solutions to enhance their communication. Our decade-long
              commitment drives us to advance data communication continually.
              <br />
              <br />
              Discover the true potential of your data with Dataxplorer. Let us
              help you harness its power!
            </p>

            <div
              css={`
                margin-top: 59px;
              `}
            >
              {isAuthenticated && (
                <div
                  css={`
                    display: flex;
                    column-gap: 20px;
                  `}
                >
                  <Link
                    to="/report/new/initial"
                    data-cy="empower-block-create-report-link"
                  >
                    <HomePrimaryButton color="#6061E5" type="button">
                      CREATE REPORT
                    </HomePrimaryButton>
                  </Link>
                  <Link to="/" data-cy="empower-block-explore-reports-link">
                    <HomePrimaryButton color="#E492BD" type="button">
                      EXPLORE REPORTS
                    </HomePrimaryButton>
                  </Link>
                </div>
              )}
              {!isAuthenticated && (
                <div
                  id="auth-buttons"
                  css={`
                    gap: 20px;
                    width: 100%;
                    display: flex;
                    flex-direction: row;

                    > button {
                      gap: 10px;
                      color: #fff;
                      display: flex;
                      padding: 9px 18px !important;
                      background: #a1a2ff;
                      align-items: center;
                      justify-content: center;
                      text-transform: uppercase;
                      height: 41px;
                      border-radius: 30px;
                      outline: none;
                      border: none;
                      font-family: "Inter", sans-serif;
                      font-weight: 700;
                      font-size: 14px;
                      text-transform: uppercase;
                      text-decoration: none;

                      :hover {
                        opacity: 0.8;
                        cursor: pointer;
                      }

                      > svg {
                        transform: scale(0.8);
                      }
                    }
                  `}
                >
                  <button onClick={() => socialAuth("google-oauth2")}>
                    <GoogleIcon /> sign in for free
                  </button>
                  <button onClick={() => socialAuth("linkedin")}>
                    <LinkedInIcon /> sign in for free
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            css={`
              margin-right: -41px;
            `}
          >
            <StoryImg />
          </div>
        </div>
      </Container>
      <Box height={77} />
      <div
        css={`
          background-color: #6061e5;
          padding: 48px 0;
        `}
      >
        <Container maxWidth="lg">
          <div
            css={`
              display: flex;
              column-gap: 180px;
              justify-content: center;
            `}
          >
            {features.map((feature) => (
              <div key={feature.title}>
                <h2
                  css={`
                    font-family: "GothamNarrow-Bold";
                    font-size: 36px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%;
                    margin: 0;
                    color: #fff;
                  `}
                >
                  {feature.title}
                </h2>
                <p
                  css={`
                    font-size: 24px;
                    font-family: "GothamNarrow-Bold";
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%; /* 31.2px */
                    margin: 0;
                    color: #fff;
                  `}
                >
                  {feature.subtitle}
                </p>
                <p
                  css={`
                    color: #fff;
                    margin: 0;
                    margin-top: 16px;
                    font-family: "GothamNarrow-Book";
                    white-space: pre-line;
                  `}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Box height={77} />

      <Container maxWidth="lg">
        <h2
          css={`
            font-family: "GothamNarrow-Bold";
            font-size: 36px;
            font-style: normal;
            font-weight: 400;
            line-height: 130%;
            margin: 0;
            text-align: center;
            color: #231d2c;
          `}
        >
          Meet Our Team
        </h2>
        <p
          css={`
            text-align: center;
            font-size: 20px;
            font-family: "GothamNarrow-Book";
            font-style: normal;
            font-weight: 325;
            line-height: normal;
            margin: 0;
            margin-top: 11px;
            color: #231d2c;
          `}
        >
          Zimmerman B.V. is a data information technology company based in
          Amsterdam that specialises
          <br /> in making data meaningful through visualisation tooling and
          dashboards.
        </p>
        <Box height={77} />

        <div
          css={`
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            column-gap: 48px;
            row-gap: 64px;
          `}
        >
          {team.map((member) => (
            <div key={member.name}>
              <img
                src={member.img}
                alt={member.name}
                css={`
                  width: 270.25px;
                  height: 307.25px;
                  border-radius: 20px;
                `}
              />
              <p
                css={`
                  margin: 0;
                  margin-top: 32px;
                  font-size: 24px;
                  font-family: "GothamNarrow-Bold";
                  font-style: normal;
                  font-weight: 400;
                  line-height: normal;
                  color: #504e4e;
                `}
              >
                {member.name}
              </p>
              <p
                css={`
                  margin: 0;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 325;
                  line-height: normal;
                  font-family: "GothamNarrow-Book";
                  color: #231d2c;
                `}
              >
                {member.role}
              </p>
            </div>
          ))}
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
              <img
                src={EmptyAvi}
                alt={"Empty"}
                css={`
                  width: 270.25px;
                  height: 307.25px;
                  border-radius: 20px;
                `}
              />
              <Link
                to={"/contact"}
                css={`
                  margin-top: 32px;
                  font-family: Inter;
                  font-size: 20px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: normal;
                  text-transform: uppercase;
                  border-radius: 30px;
                  background: #231d2c;
                  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
                  width: max-content;
                  margin: 32px auto 0 auto;
                  display: block;
                  color: #fff;
                  padding: 12px 27px;
                  border: none;
                  text-decoration: none;
                `}
              >
                Join Our Team
              </Link>
            </div>
          ))}
        </div>
        <Box height={77} />
        <div css={subParagraphcss}>
          <div
            css={`
              display: flex;
              column-gap: 97px;
              align-items: start;
            `}
          >
            <div
              css={`
                margin-left: -28px;
              `}
            >
              <MissionImg />
            </div>
            <div>
              <h3>
                <b>Mission</b>
              </h3>
              <Box height={39.5} />
              <p>
                Our mission is to create lasting impact for organizations that
                bring positive change to our world by helping them to unlock the
                power of data. Our trusted and easy-to-use data solutions boost
                an organization's performance by powering its core mission.
              </p>
            </div>
          </div>
        </div>
        <Box height={77} />
        <div css={subParagraphcss}>
          <div
            css={`
              display: flex;
              align-items: start;
              column-gap: 97px;
            `}
          >
            <div>
              <h3>
                <b>Dataxplorer</b>
              </h3>
              <Box height={26.9} />
              <p>
                Many organizations struggle to convey the data they collect,
                analyze, and share. We specialize in turning data into a
                strategic asset, helping global organizations communicate their
                impact with precision and effectiveness.
                <br /> <br /> To position your organization as a leader in your
                field using the power of data, we offer Dataxplorer, an
                AI-powered, purpose-driven data platform. Dataxplorer equips
                people with insightful data for making informed decisions,
                driving us closer to an equitable future for all.
              </p>
            </div>

            <div>
              <DXImg />
            </div>
          </div>
        </div>
      </Container>
      <Box height={56} />
      <HomeFooter />
    </section>
  );
}
