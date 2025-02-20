import React from "react";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.svg";
import { socialAuth } from "app/utils/socialAuth";
import { Box, Container } from "@material-ui/core";

export default function Hero() {
  return (
    <div
      css={`
        position: relative;
        background: url(${HeroEllipses}),
          linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
        background-color: #f2f7fd;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 0% 180px;
        padding-top: 100px;
        height: 585px;
        div {
          > h1 {
            color: #231d2c;
            text-align: center;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 96px;
            text-transform: capitalize;
            line-height: normal;
            margin: 0px;
            b {
              background: linear-gradient(90deg, #a2a8ff, #b8b2ff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
          > h3 {
            color: #231d2c;
            font-family: "GothamNarrow-Book", sans-serif;
            font-size: 32px;
            font-weight: 325;
            text-align: center;
            margin-top: 32px;
            margin-bottom: 40px;
          }

          > p {
            color: #231d2c;
            font-family: "GothamNarrow-Book", sans-serif;
            font-size: 18px;
            font-style: normal;
            text-align: center;
            margin: 0;
            margin-bottom: 10px;
          }
        }
        button {
          gap: 8px;
          color: #fff;
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
      `}
    >
      <Container maxWidth="lg">
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <h1>
            Create high impact data driven <b>stories</b>
          </h1>
          <h3>
            Dataxplorer simplifies and empowers visual data storytelling for all
          </h3>
          <Box>
            <p>Sign in for free to unlock data visualisation tools with</p>
            <Box
              display={"flex"}
              gridColumnGap={"15px"}
              justifyContent={"center"}
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
            </Box>
          </Box>
        </div>
      </Container>
      <Box height={20} />
    </div>
  );
}
