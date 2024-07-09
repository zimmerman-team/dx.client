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
import DatasetDetailImage from "app/modules/home-module/assets/dataset-detail.png";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.svg";

import { homeDisplayAtom } from "app/state/recoil/atoms";
import {
  datsetDetailImgcss,
  rowFlexCss,
  turnsDataCss,
} from "app/modules/home-module/style";

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
          <Grid
            container
            css={turnsDataCss}
            alignItems="center"
            alignContent="flex-start"
          >
            <Grid item lg={5} md={12} sm={12} xs={12}>
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
                        padding: 9px 18px;
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
              </div>
            </Grid>
            <Grid
              item
              lg={7}
              md={12}
              sm={12}
              xs={12}
              css={`
                margin-right: -44px;
                display: flex;
                justify-content: flex-end;
                @media screen and (max-width: 1257px) {
                  justify-content: center;
                }
              `}
            >
              <img
                src={DatasetDetailImage}
                alt="dataset-detail-img"
                css={datsetDetailImgcss}
              />
            </Grid>
          </Grid>
        </Container>
        <Box height={20} />
      </div>
      <Box height={40} />
      <AssetsCollection />

      <HomeFooter />
    </div>
  );
}
