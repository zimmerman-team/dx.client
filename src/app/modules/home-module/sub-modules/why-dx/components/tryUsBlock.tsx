import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as RightArr } from "app/modules/home-module/assets/right-arr-icon.svg";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";

export default function TryUsBlock() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <p
        css={`
          text-align: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          font-size: 48px;
          font-style: normal;
          line-height: normal;
          margin-bottom: 34px;
          margin-top: 0;
          color: #231d2c;
          @media (max-width: 1200px) {
            font-size: 36px;
            line-height: normal;
          }
          @media (max-width: 600px) {
            font-size: 24px;
            line-height: normal;
          }
        `}
      >
        Best decisions are based on data
      </p>
      <div
        css={`
          background: #231d2c;
          box-shadow: 0px 4px 30px 4px rgba(206, 168, 188, 0.08);
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          padding: 58px 111px 45px 61px;
          align-items: center;
          height: 215px;
          width: 100%;
          p {
            &:nth-of-type(1) {
              color: #ffffff;
              font-size: 40px;
              line-height: 48px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              margin: 0;
            }
            &:nth-of-type(2) {
              font-size: 24px;
              color: #f4f4f4;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            }
          }
          @media (max-width: 900px) {
            padding: 58px 43px 45px 45px;
          }
          @media (max-width: 774px) {
            padding: 32px 32px;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            height: 296px;

            p {
              margin: 0;
              &:nth-of-type(1) {
                font-size: 31px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                line-height: normal;
              }
              &:nth-of-type(2) {
                font-size: 18px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
                margin-top: 8px;
              }
            }
          }
        `}
      >
        <div>
          <p>Try Dataxplorer for free</p>{" "}
          <p>Dataxplorer turns data into impact </p>
        </div>
        {isAuthenticated && (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 42px;
              align-items: center;
              @media (max-width: 774px) {
                gap: 22px;
              }
              button,
              a {
                outline: none;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 14px;
                font-family: "Inter", sans-serif;
                border-radius: 30px;
                white-space: nowrap;
                text-transform: uppercase;
                cursor: pointer;
                :hover {
                  opacity: 0.9;
                }
              }
              button:nth-child(1),
              a:nth-child(1) {
                background: #e492bd;
                border-radius: 30px;
                width: 198.53px;
                height: 41px;
                padding: 12px 27px;
                gap: 10px;
                color: #ffffff;
                text-decoration: none;
                svg {
                  path {
                    fill: #ffffff;
                  }
                }
              }
              button:nth-child(2),
              a:nth-child(2) {
                background: #ffffff;
                color: #231d2c;
                text-decoration: none;
                width: 206.53px;
                height: 41px;
                padding: 12px 27px;
                gap: 10px;
              }
            `}
          >
            <Link to="/report/new/initial">
              CREATE REPORT <RightArr />
            </Link>
            <Link to="/contact">
              Contact sales <RightArr />
            </Link>
          </div>
        )}
        {!isAuthenticated && (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 42px;
              align-items: center;
              @media (max-width: 774px) {
                gap: 22px;
              }
              button,
              a {
                padding: 9px 18px;
                height: 41px;
                border-radius: 30px;
                outline: none;
                border: none;
                color: #231d2c;
                font-family: "Inter", sans-serif;
                font-weight: 700;
                font-size: 14px;
                text-transform: uppercase;
                text-decoration: none;
                display: flex;
                white-space: nowrap;
                align-items: center;
                justify-content: center;
                gap: 10px;

                > svg {
                  transform: scale(0.8);
                }
                :hover {
                  opacity: 0.8;
                  cursor: pointer;
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
    </>
  );
}
