import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { HomePrimaryButton, PrimaryButton } from "app/components/Styled/button";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import { ReactComponent as Ellipses } from "app/modules/home-module/assets/ellipses.svg";
import { ReactComponent as EllipsesMobile } from "app/modules/home-module/assets/ellipses-mobile.svg";
import {
  empowercss,
  ClimateButton,
} from "app/modules/home-module/sub-modules/partners/style";
import { Box } from "@material-ui/core";

export default function EmpowerBlock(props: {
  view?: "why-dx" | "contact" | "about" | "partners" | "explore" | "landing";
}) {
  const { isAuthenticated } = useAuth0();

  let mainText = "";
  let mainTextMobile = "";
  let subText = `Dataxplorer simplifies and empowers \n visual data Storytelling for all.`;

  switch (props.view) {
    case "why-dx":
      mainText = `Turn Data into Impact in Minutes with\nDataxplorer`;
      mainTextMobile = `Turn Data into Impact\n in Minutes with\n Dataxplorer`;
      break;
    case "contact":
      mainText = "Dataxplorer Equips You with\nInsightful Data";
      mainTextMobile = "Dataxplorer Equips\n You with\nInsightful Data";
      break;
    case "about":
      mainText = `Dataxplorer Equips\n You with\nInsightful Data`;
      break;
    case "partners":
      mainText = `Global Health and International Development\nOrganizations are using Dataxplorer`;
      mainTextMobile = `Global Health and International Development\nOrganizations are\n using Dataxplorer`;

      break;
    case "explore":
      mainText = "Explore Empowered Data";
      break;
    case "landing":
      mainText = "Start Making Impact Today\nwith Dataxplorer";
      subText = "Create top-notch stories for your business.";
      break;

    default:
      mainText = "Empower people with meaningful data";
      subText = "AI-powered solution to communicate your data with more impact";
      break;
  }

  return (
    <Box css={empowercss(props.view!)}>
      <h1>{mainText}</h1>
      <h1>{mainTextMobile}</h1>

      <p>
        <b>{subText}</b>
      </p>
      {props.view === "landing" ? (
        <div
          css={`
            margin: 0 auto;
            width: max-content;
            margin-top: 34px !important;
          `}
        >
          <Link
            data-cy="landing-story-link"
            to="/story/664f406b82350800ca942b92?fromLanding=true"
          >
            <ClimateButton color="#6061E5" type="button">
              EXPLORE CLIMATE CHANGE IN EUROPE 2022 STORY
            </ClimateButton>
          </Link>
        </div>
      ) : null}

      {isAuthenticated && (
        <div>
          <Link
            to="/story/new/initial"
            data-cy="empower-block-create-story-link"
          >
            <HomePrimaryButton color="#6061E5" type="button">
              CREATE STORY
            </HomePrimaryButton>
          </Link>
          <Link to="/" data-cy="empower-block-explore-stories-link">
            <PrimaryButton size="big" bg="light" type="button">
              Explore the Dashboard
            </PrimaryButton>
          </Link>
        </div>
      )}
      {!isAuthenticated && (
        <div
          css={`
            > button {
              gap: 8px;
              color: #231d2c;
              display: flex;
              padding: 9px 17px !important;
              height: 48px;
              border-radius: 12px;
              outline: none;
              border: none;
              background: #a1a2ff;
              align-items: center;
              justify-content: center;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              white-space: nowrap;
              font-size: 16px;
              > svg {
                transform: scale(0.8);
              }
              :hover {
                opacity: 0.8;
                cursor: pointer;
              }
            }
            @media (max-width: 655px) {
              flex-direction: column;
              gap: 8px;

              button {
                width: 60%;
                @media (max-width: 428px) {
                  width: 82%;
                }
              }
            }
          `}
        >
          <button onClick={() => socialAuth("google-oauth2")}>
            <GoogleIcon /> Google
          </button>
          <button onClick={() => socialAuth("linkedin")}>
            <LinkedInIcon /> LinkedIn
          </button>
          <button onClick={() => socialAuth("windowslive")}>
            <MicrosoftIcon /> Microsoft
          </button>
        </div>
      )}
      <Ellipses
        css={`
          position: absolute;
          top: -1px;
          z-index: -1;
          display: block;
          width: 100%;
          @media (min-width: 900px) {
            @media (max-width: 1024px) {
              top: 20px;
            }
          }
          @media (min-width: 642px) {
            @media (max-width: 899px) {
              top: 53px;
            }
          }
          @media (max-width: 641px) {
            display: none;
          }
        `}
      />
      <EllipsesMobile
        css={`
          display: none;
          @media (max-width: 641px) {
            position: absolute;
            bottom: -21px;
            right: -63px;
            z-index: -1;
            display: block;
          }
        `}
      />
    </Box>
  );
}
