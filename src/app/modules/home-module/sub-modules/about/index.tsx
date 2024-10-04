import React from "react";

import { Box, Container } from "@material-ui/core";
import { ReactComponent as MissionImg } from "app/modules/home-module/assets/about-mission.svg";
import { ReactComponent as DXImg } from "app/modules/home-module/assets/about-dx.svg";
import { ReactComponent as StoryImg } from "app/modules/home-module/assets/about-story.svg";
import EllipsesMobile from "app/modules/home-module/assets/about-page-ellipses-mobile.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import HomeFooter from "app/modules/home-module/components/Footer";
import { subParagraphcss } from "./style";
import { useTitle } from "react-use";
import { HomePrimaryButton } from "app/components/Styled/button";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
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
      text: "Access over 100.000 datasets to create reports and charts. Create impact with data from 3rd parties built in Dataxplorer or connect your in-house datasources.",
    },
    {
      title: "+15 Visuals",
      subtitle: "Chart type provided",
      text: "Dataxplorer offers over 15 different chart types for you to work with. Based on the open sources Apache E-charts library you are able to create rich graphs.",
    },
    {
      title: "+3",
      subtitle: "Languages are supported",
      text: "Dataxplorer caters to a global clientele, ensuring seamless data integration and communication. We will offer Dataxplorer in 3 different languages.",
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
      name: "Okechukwu Samuel \n Owhondah",
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

  const teamCarousel = team.map((member) => (
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
          white-space: pre-line;
          @media (max-width: 500px) {
            font-size: 20px;
            margin-top: 16px;
          }
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
  ));
  const futureTeam = Array.from({ length: 1 }).map((_, index) => (
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
          font-family: "Inter", sans-serif;
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
          @media (max-width: 500px) {
            font-size: 16px;
            padding: 12px 24px;
          }
        `}
      >
        Join Our Team
      </Link>
    </div>
  ));
  const allTeamCarousel = [...teamCarousel, ...futureTeam];

  return (
    <section
      css={`
        background-image: url(${EllipsesMobile});
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
      <div
        css={`
          height: 77px;
          @media (max-width: 600px) {
            height: 48px;
          }
        `}
      />

      <Container maxWidth="lg">
        <div
          css={`
            display: flex;
            justify-content: space-between;
            align-items: center;
            @media (max-width: 805px) {
              flex-direction: column;
            }
          `}
        >
          <div
            css={`
              width: 518px;
              @media (max-width: 1200px) {
                width: 62%;
              }
              @media (max-width: 805px) {
                width: 100%;
              }
              @media (max-width: 500px) {
                p {
                  font-size: 16px;
                }
                h1 {
                  font-size: 40px;
                }
              }
            `}
          >
            <h1
              css={`
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 64px;
                font-style: normal;
                font-weight: 400;
                line-height: 130%;
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
                font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
                @media (max-width: 1024px) {
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                }
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
                @media (max-width: 500px) {
                  margin-top: 24px;
                }
              `}
            >
              {isAuthenticated && (
                <div
                  css={`
                    display: flex;
                    column-gap: 20px;
                    @media (max-width: 425px) {
                      flex-direction: column;
                      gap: 10px;
                      button {
                        width: 51%;
                      }
                    }
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
                    @media (max-width: 425px) {
                      flex-direction: column;
                      button {
                        width: 100%;
                      }
                    }
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
                      white-space: nowrap;
                      :hover {
                        opacity: 0.8;
                        cursor: pointer;
                      }

                      > svg {
                        transform: scale(0.8);
                      }
                      @media (max-width: 600px) {
                        gap: 3px;
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
                  <button onClick={() => socialAuth("windowslive")}>
                    <MicrosoftIcon /> sign in for free
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            css={`
              margin-right: -41px;
              @media (max-width: 1200px) {
                margin-right: unset;
                svg {
                  width: 100%;
                  height: 100%;
                }
              }
              @media (max-width: 500px) {
                margin-top: 40px;
              }
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
              column-gap: 150px;
              justify-content: center;
              @media (max-width: 1110px) {
                column-gap: 88px;
              }
              @media (max-width: 905px) {
                column-gap: unset;
                flex-direction: column;
                gap: 40px;
              }
            `}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                css={`
                  width: ${index === 2 ? "100%" : "auto"};
                  @media (max-width: 1218px) {
                    h2 {
                      margin-left: unset;
                    }
                    p {
                      &:nth-of-type(1) {
                        margin-left: unset;
                      }
                      &:nth-of-type(2) {
                        width: 100%;
                      }
                    }
                  }
                `}
              >
                <h2
                  css={`
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 36px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%;
                    margin: 0;
                    color: #fff;
                    margin-left: 16.3%;
                  `}
                >
                  {feature.title}
                </h2>
                <p
                  css={`
                    font-size: 24px;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%;
                    margin: 0;
                    color: #fff;
                    margin-left: 16.3%;
                  `}
                >
                  {feature.subtitle}
                </p>
                <p
                  css={`
                    color: #fff;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    white-space: pre-line;
                    width: 66%;
                    margin: 16px auto 0 auto;
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
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
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
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
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
            @media (min-width: 501px) {
              display: none;
            }
            width: 55%;
            height: 325px;
            margin: auto;
            img {
              width: 100%;
              height: 50%;

              object-fit: cover;
            }
          `}
        >
          <Carousel
            autoPlay
            infiniteLoop
            swipeable
            stopOnHover
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            showIndicators={false}
          >
            {allTeamCarousel}
          </Carousel>
        </div>
        <div
          css={`
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            column-gap: 48px;
            row-gap: 64px;
            @media (min-width: 880px) {
              @media (max-width: 1314px) {
                row-gap: 56px;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                justify-items: center;
              }
            }
            @media (max-width: 879px) {
              grid-template-columns: repeat(3, minmax(0, 1fr));
              justify-items: center;
              img {
                width: 100%;
                height: 70%;
                object-fit: cover;
              }
            }
            @media (max-width: 830px) {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              row-gap: 46px;
              justify-items: center;
              img {
                width: 100%;
                height: 70%;
                object-fit: cover;
              }
            }
            @media (max-width: 500px) {
              display: none;
            }
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
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-style: normal;
                  font-weight: 400;
                  line-height: normal;
                  color: #504e4e;
                  white-space: pre-line;
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
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
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
        <div
          css={`
            height: 77px;
            @media (max-width: 500px) {
              height: 56px;
            }
          `}
        />
        <div css={subParagraphcss}>
          <div>
            <h3 id="ab-mobile">
              <b>Mission</b>
            </h3>
            <div
              css={`
                margin-left: -28px;
                @media (max-width: 1024px) {
                  margin-left: unset;
                }
              `}
            >
              <MissionImg />
            </div>
            <div>
              <h3 id="ab-desktop">
                <b>Mission</b>
              </h3>
              <div
                css={`
                  height: 39.5px;
                  @media (max-width: 1024px) {
                    display: none;
                  }
                `}
              />
              <p css={``}>
                Our mission is to create lasting impact for organizations that
                bring positive change to our world by helping them to unlock the
                power of data. Our trusted and easy-to-use data solutions boost
                an organization's performance by powering its core mission.
              </p>
            </div>
          </div>
        </div>
        <div
          css={`
            height: 77px;
            @media (max-width: 500px) {
              height: 56px;
            }
          `}
        />
        <div
          css={`
            ${subParagraphcss};
            @media (max-width: 1024px) {
              > div:nth-of-type(1) {
                display: flex;
                flex-direction: column-reverse;
              }
            }
          `}
        >
          <div>
            <div>
              <h3 id="ab-desktop">
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
            <h3 id="ab-mobile">
              <b>Dataxplorer</b>
            </h3>
          </div>
        </div>
      </Container>
      <Box height={56} />
      <HomeFooter />
    </section>
  );
}
