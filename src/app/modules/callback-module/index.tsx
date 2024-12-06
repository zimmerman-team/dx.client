import React from "react";
import Box from "@material-ui/core/Box";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "app/modules/common/page-loader";
import axios from "axios";
import { useCookie, useTitle } from "react-use";

function AuthCallbackModule() {
  useTitle("DX Dataxplorer - Auth Callback");

  const history = useHistory();
  const { error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);

  const [googleDriveToken, setGoogleDriveToken] = useCookie("googleDriveToken");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const destinationPath = queryParams.get("to") as string;

  const duplicateStory = async (id: string) => {
    getAccessTokenSilently().then(async (newToken) => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/duplicate-landing-story/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      if (response.data) {
        localStorage.removeItem("duplicateStoryAfterSignIn");
        history.push(`/story/${response.data.id}/edit`);
      } else {
        history.replace("/");
      }
    });
  };

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
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/google-drive/user-token`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      if (response.data.access_token) {
        setGoogleDriveToken(response.data.access_token, {
          expires: new Date(response.data.token_details.exp * 1000),
          httpsOnly: true,
          secure: true,
          sameSite: "strict",
        });
      }
    });
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        setLoading(true);
        await duplicateAssets();
        setLoading(false);
      })();
      if (destinationPath) {
        return history.replace(destinationPath);
      }
      const storyId = localStorage.getItem("duplicateStoryAfterSignIn");
      if (storyId) {
        (async () => {
          setLoading(true);
          await duplicateStory(storyId);
          setLoading(false);
        })();
      } else {
        if (localStorage.getItem("signup-state") === "true") {
          history.replace("/story/new/initial");
          localStorage.removeItem("signup-state");
        } else {
          history.replace("/");
        }
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
