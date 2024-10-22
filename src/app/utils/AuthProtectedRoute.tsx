import React from "react";
import { useHistory, useLocation, matchPath } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "app/modules/common/page-loader";

interface AuthProtectedRouteProps {
  element?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
}

export function AuthProtectedRoute(props: AuthProtectedRouteProps) {
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const exemptedRoutes = [
    "/report/:page",
    "/chart/:page",
    "/dataset/:page/detail",
  ];
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  const destination = location.pathname;

  React.useEffect(() => {
    getAccessTokenSilently()
      .then((newToken) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);

        console.log(error, "error");
        if (
          matchPath(destination, {
            path: exemptedRoutes,
            exact: true,
            strict: true,
          })
        ) {
          return;
        }
        history.replace(
          `/onboarding/signin?to=${destination}${location.search}`
        );
      });
  }, []);
  return (
    <div>{!loading ? props.element ?? props.children : <PageLoader />}</div>
  );
}
