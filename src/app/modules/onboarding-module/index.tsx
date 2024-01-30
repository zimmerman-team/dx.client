import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import SplitBar from "./component/splibar";
import { useAuth0 } from "@auth0/auth0-react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import AuthCard from "app/modules/onboarding-module/component/card";
import OnboardingRightDeco from "app/modules/onboarding-module/asset/onboardingRight-img.svg";

export default function Onboarding() {
  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated } = useAuth0();
  const mobile = useMediaQuery("(max-width: 959px)");

  if (isAuthenticated) {
    history.replace("/");
  }
  return (
    <Grid
      container
      spacing={6}
      css={`
        margin-top: 48px;
        padding-left: 40px;
        position: relative;
        overflow-y: hidden;
      `}
    >
      <Grid
        xs={12}
        sm={12}
        md={6}
        lg={true}
        css={`
          @media (max-width: 1024px) {
            padding-bottom: 7rem;
          }
          padding-top: 94px;
          /* width: 45.625%; */
        `}
      >
        <div
          css={`
            width: 60%;
            margin: auto;
          `}
        >
          <h2
            css={`
              color: #6061e5;
              font-size: 24px;
              font-weight: 700;
              font-style: normal;
              font-family: "GothamNarrow-Bold";
              padding: 0;
              margin: 0;
            `}
          >
            {location.pathname.includes("login")
              ? "Welcome back!"
              : "Create your free account."}
          </h2>
          <div
            css={`
              width: 100%;
            `}
          >
            <SplitBar leftLabel="Log In" rightLabel="Sign Up" />
          </div>
          <Switch>
            <Route path="/onboarding/signup">
              <AuthCard />
            </Route>
            <Route path="/onboarding/login">
              <AuthCard isLogin />
            </Route>
          </Switch>
        </div>
      </Grid>
      {!mobile && (
        <Grid
          xs={false}
          sm={false}
          md={6}
          lg={"auto"}
          css={`
            right: 0;
            margin-top: -48px;
            width: 54.375%;
            height: 100vh;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(${OnboardingRightDeco});
          `}
        />
      )}
    </Grid>
  );
}
