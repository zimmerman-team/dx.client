import React from "react";
import { ErrorOutlineRounded } from "@material-ui/icons";
import HomeFooter from "app/modules/home-module/components/Footer";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { Container } from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { useLocation } from "react-router-dom";

export function NotAuthorizedMessageModule(props: {
  asset: "chart" | "report" | "dataset";
  action: "view" | "edit" | "delete";
  name?: string;
}) {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();
  const destinationPath = `?to=${location.pathname}${location.search}`;
  return (
    <>
      <div
        css={`
          background-color: #f4f4f4;
          height: 50px;
          align-items: center;
          display: ${props.name ? "flex" : "none"};
        `}
      >
        <Container maxWidth="lg">
          <h1
            css={`
              font-size: 24px;
              margin: 0;
              font-family: Inter;
              font-weight: 700;
              color: #231d2c;
              max-width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: normal;
            `}
          >
            {props.name}
          </h1>
        </Container>
      </div>
      <div
        // 422px is the footer height and 98px is the header height
        css={`
          width: 100%;
          height: calc(100vh - 422px - 98px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #e75656;
          text-align: center;
        `}
      >
        <ErrorOutlineRounded
          htmlColor="#e75656"
          css={`
            font-size: 48px;
          `}
        />{" "}
        <p
          css={`
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin: 0;
            margin-top: 16px;
          `}
        >
          {isAuthenticated ? (
            <>
              You are not authorized to {props.action} this {props.asset}.
              Please contact <br /> your administrator.
            </>
          ) : (
            <>
              You are not authorized to {props.action} this {props.asset}.
              Please sign in <br /> or contact your administrator.
            </>
          )}
        </p>
        {!isAuthenticated && (
          <div
            id="auth-buttons"
            css={`
              gap: 20px;
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: center;
              margin-top: 32px;

              > button {
                gap: 10px;
                color: #fff;
                display: flex;
                padding: 9px 18px !important;
                background: #a1a2ff;
                align-items: center;
                justify-content: center;
                text-transform: uppercase;
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
            <button
              onClick={() =>
                socialAuth("google-oauth2", undefined, destinationPath)
              }
            >
              <GoogleIcon /> sign in for free
            </button>
            <button
              onClick={() => socialAuth("linkedin", undefined, destinationPath)}
            >
              <LinkedInIcon /> sign in for free
            </button>
          </div>
        )}
      </div>
      <HomeFooter />
    </>
  );
}
