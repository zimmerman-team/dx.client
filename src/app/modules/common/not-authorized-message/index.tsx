import React from "react";
import { ErrorOutlineRounded } from "@material-ui/icons";
import HomeFooter from "app/modules/home-module/components/Footer";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Container, useMediaQuery } from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { Link, useHistory, useLocation } from "react-router-dom";

export function NotAuthorizedMessageModule(props: {
  asset: "chart" | "story" | "dataset";
  action: "view" | "edit" | "delete";
  name?: string;
  handleRetry: () => void;
}) {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 599px)");
  const destinationPath = `?to=${location.pathname}${location.search}`;

  return (
    <>
      <div
        css={`
          background-color: #f4f4f4;
          height: 50px;
          align-items: center;
          display: ${props.name ? "flex" : "none"};
          @media (max-width: 881px) {
            margin-top: 17px;
          }
        `}
      >
        <Container maxWidth="lg">
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 4px;
            `}
          >
            {isMobile && <ArrowBackIosIcon onClick={() => history.go(-1)} />}
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
          </div>
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
          h3 {
            margin-top: 13.3px;
            margin-bottom: 0px;
            font-size: 36px;
            white-space: pre-line;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          }
          button,
          a {
            border-radius: 12px;
            background: #231d2c;
            display: flex;
            padding: 0px 24px;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 16px;
            font-weight: 400;
            border: none;
            outline: none;
            text-decoration: none;
            height: 48px;
            cursor: pointer;

            > svg {
              transform: scale(0.8);
            }
          }
          @media (max-width: 500px) {
            flex-direction: column;
            align-items: center;
            button {
              width: 86%;
            }
          }
          @media (max-width: 767px) {
            padding-top: 200px;
          }
        `}
      >
        <ErrorOutlineRounded
          htmlColor="#e75656"
          css={`
            font-size: 64px;
          `}
        />{" "}
        <h3>Error</h3>
        <p
          css={`
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
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
        {isAuthenticated && (
          <div
            css={`
              gap: 20px;
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: center;
              margin-top: 32px;
            `}
          >
            <button onClick={props.handleRetry}>Retry</button>
            <Link to="/">Back to Dashboard</Link>
          </div>
        )}
      </div>
      <HomeFooter />
    </>
  );
}
