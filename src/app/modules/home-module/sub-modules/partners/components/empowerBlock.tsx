import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { HomePrimaryButton } from "app/components/Styled/button";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
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
  let subText = "";

  switch (props.view) {
    case "why-dx":
      mainText = `Turn Data into Impact in Minutes with\nDataxplorer`;
      subText =
        "Dataxplorer simplifies and empowers visual data reporting for all.";
      break;
    case "contact":
      mainText = "Dataxplorer Equips You with\nInsightful Data";
      subText =
        "Dataxplorer simplifies and empowers visual data reporting for all.";
      break;
    case "about":
      mainText = `Dataxplorer Equips You with\nInsightful Data`;
      subText =
        "Dataxplorer simplifies and empowers visual data reporting for all.";
      break;
    case "partners":
      mainText = `Global Health and International Development\nOrganizations are using Dataxplorer`;
      subText =
        "Dataxplorer simplifies and empowers visual data reporting for all.";
      break;
    case "explore":
      mainText = "Explore Empowered Data";
      subText =
        "Dataxplorer simplifies and empowers visual data reporting for all.";
      break;
    case "landing":
      mainText = "Start Making Impact Today\nwith Dataxplorer";
      subText = "Create top-notch reports for your business.";
      break;

    default:
      mainText = "Empower people with meaningful data";
      subText = "AI-powered solution to communicate your data with more impact";
      break;
  }

  return (
    <Box css={empowercss(props.view!)}>
      <h1>{mainText}</h1>
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
          <Link to="/report/664f406b82350800ca942b92?fromLanding=true">
            <ClimateButton color="#6061E5" type="button">
              EXPLORE CLIMATE CHANGE IN EUROPE 2022 REPORT
            </ClimateButton>
          </Link>
        </div>
      ) : null}

      {isAuthenticated && (
        <div>
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
            justify-content: center;

            > button {
              gap: 10px;
              color: #fff;
              display: flex;
              padding: 9px 18px !important;
              background: #a1a2ff;
              align-items: center;
              justify-content: center;
              text-transform: uppercase;

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
    </Box>
  );
}
