import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "app/modules/common/page-loader";

interface AuthProtectedRouteProps {
  element?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
}

export function AuthProtectedRoute(props: AuthProtectedRouteProps) {
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const publicParam = queryParams.get("public") as string;
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  const destination = history.location.pathname;

  React.useEffect(() => {
    getAccessTokenSilently()
      .then((newToken) => {
        setLoading(false);
        console.log(newToken, "newToken");
      })
      .catch((error) => {
        setLoading(false);

        console.log(error, "error");
        if (publicParam === "true") {
          return;
        }
        history.replace(`/onboarding/login?to=${destination}`);
      });
  }, []);
  return (
    <div>{!loading ? props.element ?? props.children : <PageLoader />}</div>
  );
}
