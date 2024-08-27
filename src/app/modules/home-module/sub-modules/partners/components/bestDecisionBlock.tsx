import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { bestDecisioncss } from "app/modules/home-module/sub-modules/partners/style";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";

export default function BestDecisionBlock() {
  const { isAuthenticated } = useAuth0();

  return (
    <Grid css={bestDecisioncss}>
      <h4>Best decisions are based on data</h4>

      <div
        css={`
          background: #231d2c;
          box-shadow: 0px 4px 30px 4px rgba(206, 168, 188, 0.08);
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          padding: 30px;
          padding-top: 30px;
          padding-left: 52px;
          align-items: center;
          height: 231px;
          width: 100%;
          a {
            text-decoration: none;
          }
          @media (max-width: 800px) {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 35px;
            padding-left: 22px;
            height: 100%;
          }
          @media (max-width: 600px) {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding-top: 35px;
            padding-left: 22px;
            height: 100%;
          }
        `}
      >
        <div>
          <p
            css={`
              color: #ffffff;
              font-size: 40px;
              line-height: 48px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              margin: 0;
              @media (max-width: 1024px) {
                font-size: 34px;
                line-height: 40.8px;
              }
            `}
          >
            <b>Give Dataxplorer a try, on us </b>
          </p>{" "}
          <p
            css={`
              font-weight: 325;
              font-size: 24px;
              color: #f4f4f4;
              font-family: "GothamNarrow-Light", "Helvetica Neue", sans-serif;
              @media (max-width: 1024px) {
                font-size: 20px;
                line-height: 24px;
              }
              @media (max-width: 600px) {
                font-size: 16px;
                line-height: 19.36px;
              }
            `}
          >
            Dataxplorer turns data into impact in minutes 
          </p>
        </div>
        <div
          css={`
            width: 35%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            button {
              margin-bottom: 20px;
              white-space: nowrap;
            }
            @media (max-width: 600px) {
              align-items: flex-start;
              width: 100%;
              button {
                margin-bottom: 16px;
              }
            }
          `}
        >
          {!isAuthenticated && (
            <div id="auth-buttons">
              <button onClick={() => socialAuth("google-oauth2")}>
                <GoogleIcon /> sign in for free
              </button>
              <button onClick={() => socialAuth("linkedin")}>
                <LinkedInIcon /> sign in for free
              </button>
            </div>
          )}
          <Link to="/contact">
            <button>
              <p>Contact us</p>
            </button>
          </Link>
        </div>
      </div>
    </Grid>
  );
}
