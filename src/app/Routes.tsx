// cc:application base#;application routes

// base

import React, { Suspense, lazy } from "react";
import { socialAuth } from "app/utils/socialAuth";
import { useScrollToTop } from "app/hooks/useScrollToTop";
import { PageLoader } from "app/modules/common/page-loader";
import { RouteWithAppBar } from "app/utils/RouteWithAppBar";
import { Route, Switch, useHistory } from "react-router-dom";
import { NoMatchPage } from "app/modules/common/no-match-page";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import {
  AppState,
  Auth0Provider,
  User,
  WithAuthenticationRequiredOptions,
  useAuth0,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import axios from "axios";

const LandingModule = lazy(
  () => import("app/modules/home-module/sub-modules/landing")
);
const HomeModule = lazy(() => import("app/modules/home-module"));
const PartnersModule = lazy(
  () => import("app/modules/home-module/sub-modules/partners")
);
const ContactModule = lazy(
  () => import("app/modules/home-module/sub-modules/contact")
);
const AboutModule = lazy(
  () => import("app/modules/home-module/sub-modules/about")
);
const WhyDXModule = lazy(
  () => import("app/modules/home-module/sub-modules/why-dx")
);
const ExploreAssetsModule = lazy(
  () => import("app/modules/home-module/sub-modules/explore-assets")
);

const PricingModule = lazy(
  () => import("app/modules/home-module/sub-modules/pricing")
);

const ChartModule = lazy(() => import("app/modules/chart-module"));
const ReportModule = lazy(() => import("app/modules/report-module"));

const AuthCallbackModule = lazy(() => import("app/modules/callback-module"));
const OnboardingModule = lazy(() => import("app/modules/onboarding-module"));
const UserProfileModule = lazy(() => import("app/modules/user-profile-module"));
const DatasetModule = lazy(() => import("app/modules/dataset-module"));

const ProtectedRoute = (props: {
  component: React.ComponentType<any>;
  args?: WithAuthenticationRequiredOptions;
}) => {
  const Component = withAuthenticationRequired(props.component, props.args);

  return <Component />;
};

const Auth0ProviderWithRedirectCallback = (props: {
  domain: string;
  clientId: string;
  authorizationParams: {
    audience: string;
    redirect_uri: string;
  };
  children: React.ReactNode;
}) => {
  const history = useHistory();

  const onRedirectCallback = (appState?: AppState, user?: User) => {
    history.push(
      appState && appState.returnTo
        ? appState.returnTo
        : window.location.pathname
    );
  };

  return (
    <Auth0Provider
      cacheLocation={
        process.env.REACT_APP_CYPRESS_TEST === "true"
          ? "localstorage"
          : "memory"
      }
      onRedirectCallback={onRedirectCallback}
      {...props}
    >
      {props.children}
    </Auth0Provider>
  );
};

const AuthLoader = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div
        css={`
          > div {
            background: #fff;
          }
        `}
      >
        <PageLoader />;
      </div>
    );
  }

  return null;
};

const OneTapLoginComponent = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const loadRef = React.useRef<HTMLDivElement>(null);

  useGoogleOneTapLogin({
    disabled: isLoading || isAuthenticated,
    onError: (error) => console.log(error),
    onSuccess: (response) => socialAuth("google-oauth2", response.email),
    googleAccountConfigs: {
      client_id: process.env.REACT_APP_GOOGLE_API_CLIENT_ID!,
      cancel_on_tap_outside: false,
      // @ts-ignore
      use_fedcm_for_prompt: true,
    },
  });

  const onBeforeUnload = () => {
    if (loadRef.current) {
      loadRef.current.style.display = "block";
    }
  };

  React.useEffect(() => {
    window.onbeforeunload = onBeforeUnload;
  }, []);

  return (
    <div ref={loadRef} style={{ display: "none" }}>
      <PageLoader />
    </div>
  );
};

const IntercomBootupComponent = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const APP_ID = window.location.hostname.includes("dataxplorer.org")
    ? "tfvurn19"
    : "hv1bfyau";

  React.useEffect(() => {
    if (window.Intercom) {
      window.Intercom("update");
    }
  }, [location.pathname]);

  const getIntercomHash = async () => {
    return getAccessTokenSilently().then(async (newToken) => {
      return await axios.get(
        `${process.env.REACT_APP_API}/users/intercom-hash`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
    });
  };

  React.useEffect(() => {
    if (window.Intercom)
      if (isAuthenticated) {
        getIntercomHash()
          .then((res) => {
            if (res.data.error) {
              console.error(res.data.error);
            } else {
              // @ts-ignore
              window.Intercom("boot", {
                api_base: "https://api-iam.intercom.io",
                app_id: APP_ID,
                name: user?.name, // Full name
                email: user?.email, // the email for your user
                user_id: user?.sub, // user_id as a string
                created_at: user?.created_at, // Signup date as a Unix timestamp
                user_hash: res.data.hash,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // @ts-ignore
        window.Intercom("boot", {
          api_base: "https://api-iam.intercom.io",
          app_id: APP_ID,
        });
      }
  }, [isAuthenticated]);

  return <></>;
};

export function MainRoutes() {
  useScrollToTop();

  return (
    <Auth0ProviderWithRedirectCallback
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT!}
      authorizationParams={{
        audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
        redirect_uri: `${window.location.origin}/callback`,
      }}
    >
      <AuthLoader />
      <OneTapLoginComponent />
      <IntercomBootupComponent />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route exact path="/callback">
            <AuthCallbackModule />
          </Route>
          <RouteWithAppBar exact path="/">
            <HomeModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/partners">
            <PartnersModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/contact">
            <ContactModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/why-dataXplorer">
            <WhyDXModule />
          </RouteWithAppBar>
          {/* <RouteWithAppBar exact path="/explore">
            <ExploreAssetsModule />
          </RouteWithAppBar> */}
          <RouteWithAppBar exact path="/report/:page/:view?">
            <ReportModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/dataset/:page/:view?">
            <DatasetModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/about">
            <AboutModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/pricing">
            <PricingModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/landing">
            <LandingModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/chart/:page/:view?">
            <ChartModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/dataset/:id/edit">
            <></>
          </RouteWithAppBar>
          <RouteWithAppBar path="/onboarding">
            <OnboardingModule />
          </RouteWithAppBar>
          <RouteWithAppBar
            exact
            path="/user-management/:tab?"
            element={<ProtectedRoute component={UserProfileModule} />}
          />
          <RouteWithAppBar path="*">
            <NoMatchPage />
          </RouteWithAppBar>
        </Switch>
      </Suspense>
    </Auth0ProviderWithRedirectCallback>
  );
}
