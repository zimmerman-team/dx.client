import React from "react";
import { ReactComponent as GoogleIcon } from "app/modules/home-module/assets/google-icon-flat.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/home-module/assets/linkedIn-icon-flat.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/home-module/assets/microsoft-icon-flat.svg";
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
          display: flex;
          width: 203px;
          height: 35px;
          padding: 8px 18px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 30px;
          background: #13183f;
          border: none;
          outline: none;
          color: #ffffff;
          font-weight: bold;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          cursor: pointer;
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
            Dataxplorer simplifies and empowers visual data reporting for all
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
