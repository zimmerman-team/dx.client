import Auth0JS from "auth0-js";

export function socialAuth(
  connection: "google-oauth2" | "linkedin" | "github" | "windowslive",
  login_hint?: string,
  page_params?: string
) {
  const webAuth = new Auth0JS.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN as string,
    clientID: process.env.REACT_APP_AUTH0_CLIENT as string,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE as string,
    redirectUri: `${window.location.origin}/callback${page_params ?? ""}`,
  });

  webAuth.authorize({
    connection,
    login_hint,
    responseType: "token",
    connection_scope:
      connection === "google-oauth2"
        ? "https://www.googleapis.com/auth/drive.readonly"
        : "",
  });
}
