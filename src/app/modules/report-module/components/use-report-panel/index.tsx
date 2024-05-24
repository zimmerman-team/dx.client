import useCookie from "@devhammed/use-cookie";
import { Container } from "@material-ui/core";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { socialAuth } from "app/utils/socialAuth";
import React from "react";
import { useParams } from "react-router-dom";

function ReportUsePanel() {
  const [_, setDuplicateReportAfterSignIn] = useCookie(
    "duplicateReportAfterSignIn",
    null
  );
  const { page } = useParams<{ page: string }>();

  const handleSignIn = (connection: "google-oauth2" | "linkedin") => {
    setDuplicateReportAfterSignIn(page, {
      expires: 3600, // 1hr
      domain: "",
      path: "",
      secure: false,
      httpOnly: false,
      maxAge: 0,
      sameSite: "",
    });
    socialAuth(connection);
  };

  return (
    <div
      css={`
        position: fixed;
        bottom: 0;
        width: 100%;
      `}
    >
      <Container maxWidth="lg">
        <div
          css={`
            background: #231d2c;
            border-radius: 24px 24px 0px 0px;
            box-shadow: 0px 4px 30px 4px rgba(206, 168, 188, 0.08);
            padding: 34px 73px 38.73px 62px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <div>
            <p
              css={`
                margin: 0;
                padding: 0;
                font-size: 40px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                font-family: "GothamNarrow-Bold", sans-serif;
                color: #fff;
              `}
            >
              Use this report and edit away!
            </p>

            <p
              css={`
                margin: 0;
                padding: 0;
                font-size: 20px;
                font-style: normal;
                font-weight: 325;
                line-height: normal;
                font-family: "GothamNarrow-Book", sans-serif;
                margin-top: 12.03px;
                color: #fff;
              `}
            >
              Stay informed with exclusive updates, offers, and
              <br /> exclusive content delivered straight to your inbox!
            </p>
          </div>

          <div
            id="auth-buttons"
            css={`
              gap: 22px;
              width: max-content;
              display: flex;
              flex-direction: row;
              justify-content: center;

              > button {
                gap: 10px;
                color: #fff;
                display: flex;
                padding: 9px 18px !important;
                background: #a1a2ff;
                align-items: center;
                justify-content: center;
                text-transform: uppercase;
                flex-shrink: 0;
                padding: 9px 27px;
                height: 41px;
                border-radius: 30px;
                outline: none;
                border: none;
                font-family: "Inter", sans-serif;
                font-weight: 700;
                font-size: 14px;
                text-decoration: none;

                :hover {
                  opacity: 0.8;
                  cursor: pointer;
                }

                > svg {
                  transform: scale(0.8);
                }
              }
            `}
          >
            <button onClick={() => handleSignIn("google-oauth2")}>
              <GoogleIcon /> sign in for free
            </button>
            <button onClick={() => handleSignIn("linkedin")}>
              <LinkedInIcon /> sign in for free
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ReportUsePanel;
