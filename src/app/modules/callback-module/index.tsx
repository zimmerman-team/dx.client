import React from "react";
import Box from "@material-ui/core/Box";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "app/modules/common/page-loader";
import axios from "axios";
import { useTitle } from "react-use";

function AuthCallbackModule() {
  useTitle("DX DataXplorer - Auth Callback");

  const history = useHistory();
  const { error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);

  const duplicateAssets = async () => {
    getAccessTokenSilently().then(async (newToken) => {
      await axios.post(
        `${process.env.REACT_APP_API}/users/duplicate-assets`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
    });
  };

  const duplicateReport = async (id: string) => {
    getAccessTokenSilently().then(async (newToken) => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/duplicate-landing-report/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      if (response.data) {
        localStorage.removeItem("duplicateReportAfterSignIn");
        history.push(`/report/${response.data.id}/edit`);
      }
    });
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        setLoading(true);
        await duplicateAssets();
        setLoading(false);
        const reportId = localStorage.getItem("duplicateReportAfterSignIn");
        if (reportId) {
          await duplicateReport(reportId);
        }
      })();

      if (localStorage.getItem("signup-state") == "true") {
        history.replace("/report/new/initial");
        localStorage.removeItem("signup-state");
      } else {
        history.replace("/");
      }
    } else {
      getAccessTokenSilently();
    }
  }, [isAuthenticated]);

  return (
    <Box>
      {(!error || loading) && <PageLoader />}
      {error && <Box>{error.message}</Box>}
    </Box>
  );
}

export default AuthCallbackModule;
