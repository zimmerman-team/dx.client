/* third-party */
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useTitle from "react-use/lib/useTitle";
import { socialAuth } from "app/utils/socialAuth";
import { useRecoilState } from "recoil";
import { Box, Grid, Container } from "@material-ui/core";
/* project */
import HomeFooter from "app/modules/home-module/components/Footer";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.svg";

import { homeDisplayAtom } from "app/state/recoil/atoms";
import { rowFlexCss, turnsDataCss } from "app/modules/home-module/style";
import AssetsCollection from "./components/AssetCollection";

export default function HomeModule() {
  useTitle("DX Dataxplorer");

  const { isAuthenticated, user } = useAuth0();

  const [display, setDisplay] = useRecoilState(homeDisplayAtom);

  const exploreViewRef = React.useRef<HTMLDivElement>(null);

  const exploreReportClick = () => {
    setDisplay("reports");
    exploreViewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      css={`
        margin-top: 48px;
      `}
    >
      {!isAuthenticated ? (
        <div
          css={`
            position: relative;
            background: url(${HeroEllipses}),
              linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
            background-repeat: no-repeat;
            background-size: 100% 100%, auto;
            background-position: 0% 20px;
            padding-top: 48px;
          `}
        >
          <Container maxWidth="lg">
            <Grid container css={turnsDataCss}>
              <Grid
                item
                lg={5}
                md={12}
                sm={12}
                xs={12}
                css={`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <div
                  css={`
                    max-width: 450px;
                  `}
                >
                  <h1>Turn data into impact with Dataxplorer</h1>
                  <Box height={26} />
                  <p>
                    <b>
                      Dataxplorer simplifies and empowers visual data reporting
                      for all.
                    </b>
                  </p>
                  <Box height={61} />
                  {isAuthenticated && (
                    <div
                      css={`
                        ${rowFlexCss} gap: 32px;
                        width: 100%;
                      `}
                    >
                      <Link
                        to="report/new/initial"
                        css={`
                          background: #6061e5;
                        `}
                      >
                        CREATE REPORT
                      </Link>
                      <button
                        onClick={exploreReportClick}
                        css={`
                          background: #e492bd;
                        `}
                      >
                        EXPLORE REPORTS
                      </button>
                    </div>
                  )}
                  {!isAuthenticated && (
                    <div
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
                          height: 41px;
                          width: 100%;
                          background: #a1a2ff;
                          align-items: center;
                          justify-content: center;
                          text-transform: uppercase;

                          > svg {
                            transform: scale(0.8);
                          }
                          @media (max-width: 400px) {
                            font-size: 12px;
                            padding: 8px 16px;
                          }
                        }
                        @media (max-width: 655px) {
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                          button {
                            width: 70%;
                            @media (max-width: 428px) {
                              width: 85%;
                            }
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
              </Grid>
              <Grid
                item
                lg={7}
                md={12}
                sm={12}
                xs={12}
                css={`
                  display: flex;
                  @media (min-width: 1292px) {
                    justify-content: flex-end;
                    margin-right: -44px;
                  }
                  @media screen and (max-width: 1290px) {
                    justify-content: center;
                  }
                  @media (max-width: 1240px) {
                    > img {
                      width: 70%;
                      height: 100%;
                      object-fit: contain;
                    }
                  }
                  @media (max-width: 700px) {
                    > img {
                      width: 95%;
                      height: 100%;
                      object-fit: contain;
                    }
                  }
                `}
              >
                <img
                  width={710}
                  height={428}
                  fetchPriority="high"
                  alt="dataset-detail-img"
                  src="/static/dataset-detail.webp"
                  style={{
                    borderRadius: "14px",
                  }}
                />
              </Grid>
            </Grid>
          </Container>
          <Box height={20} />
        </div>
      ) : (
        <></>
      )}
      <Box height={40} />
      <AssetsCollection />

      <HomeFooter />
    </div>
  );
}
