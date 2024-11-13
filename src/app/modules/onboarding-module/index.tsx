import React from "react";
import Grid from "@material-ui/core/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import AuthCard from "app/modules/onboarding-module/component/card";
import OnboardingRightDeco from "app/modules/onboarding-module/asset/onboardingRight-img.svg";
import { useTitle } from "react-use";

export default function Onboarding() {
  useTitle("DX Dataxplorer - Onboarding");

  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated } = useAuth0();
  const tablet = useMediaQuery("(max-width: 1140px)");

  if (isAuthenticated) {
    history.replace("/");
  }
  return (
    <Grid
      container
      css={`
        padding-left: 40px;
        position: relative;
        height: 100vh;
        @media (max-width: 1140px) {
          padding-left: unset;
        }
      `}
    >
      <Grid
        xs={12}
        sm={12}
        md={12}
        lg={true}
        css={`
          @media (max-width: 1024px) {
            padding-bottom: 7rem;
          }
          padding-top: 222px;
        `}
      >
        <div
          css={`
            width: 60%;
            margin: auto;
            @media (max-width: 1140px) {
              width: 395px;
            }
            @media (max-width: 428px) {
              width: 94%;
            }
          `}
        >
          <h2
            css={`
              color: #6061e5;
              font-size: 24px;
              font-weight: 700;
              font-style: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              padding: 0;
              margin: 0;
            `}
          >
            {location.pathname.includes("signin")
              ? "Welcome back!"
              : "Create your free account."}
          </h2>

          <Switch>
            <Route path="/onboarding/signup">
              <AuthCard />
            </Route>
            <Route path="/onboarding/signin">
              <AuthCard isSignIn />
            </Route>
          </Switch>
        </div>
      </Grid>
      {!tablet && (
        <Grid
          xs={false}
          sm={false}
          md={6}
          lg={"auto"}
          css={`
            right: 0;
            width: 54.375%;
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
