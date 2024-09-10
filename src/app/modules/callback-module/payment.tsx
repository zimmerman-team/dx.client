import React from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Container from "@material-ui/core/Container";
import { PageLoader } from "app/modules/common/page-loader";
import HomeFooter from "app/modules/home-module/components/Footer";
import BgEllipses from "app/modules/home-module/assets/full-bg-ellipses.svg";

const CommonLink = (props: { to: string; text: string; replace?: boolean }) => {
  return (
    <Link
      to={props.to}
      replace
      css={`
        color: #fff;
        width: 175px;
        cursor: pointer;
        padding: 11px 0;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        margin-top: 100px;
        text-align: center;
        border-style: none;
        border-radius: 50px;
        background: #2c2c79;
        text-decoration: none;

        :disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      `}
    >
      {props.text}
    </Link>
  );
};

export function PaymentSuccessCallbackModule() {
  const history = useHistory();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(history.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId && isAuthenticated) {
      getAccessTokenSilently().then((token: string) => {
        axios
          .post(
            `${process.env.REACT_APP_API}/stripe/update-user-subscription-metadata`,
            {
              sessionId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setSuccess(true);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setError(error.message);
            setLoading(false);
          });
      });
    }
  }, [isAuthenticated]);

  return (
    <section
      css={`
        background: url(${BgEllipses});
        background-size: 100%;
        background-position: center 72px;
        background-repeat: no-repeat;
        padding-top: 48px; // AppBar height
      `}
    >
      {loading && <PageLoader />}
      <Container
        maxWidth="lg"
        css={`
          display: flex;
          padding-top: 100px;
          align-items: center;
          flex-direction: column;
        `}
      >
        {success && (
          <React.Fragment>
            <svg width="112" height="112" viewBox="0 0 112 112" fill="none">
              <path
                d="M43.946 69.6826L45.0001 70.7247L46.0546 69.6831L83.8301 32.3722L86.867 35.3747L45.0006 76.7654L26.6413 58.6147L29.7069 55.6053L43.946 69.6826Z"
                fill="#252C34"
                stroke="#252C34"
                strokeWidth="3"
              />
              <circle
                cx="56"
                cy="56"
                r="54.5"
                stroke="#252C34"
                strokeWidth="3"
              />
            </svg>
            <h2
              css={`
                color: #252c34;
                font-size: 36px;
                font-weight: 700;
                line-height: 44px;
              `}
            >
              Payment successful!
            </h2>
            <CommonLink to="/" replace text="Continue" />
          </React.Fragment>
        )}
        {!success && !loading && error && (
          <React.Fragment>
            <h2
              css={`
                color: #252c34;
                font-size: 36px;
                font-weight: 700;
                line-height: 44px;
              `}
            >
              Payment unsuccessful.
            </h2>
            <p
              css={`
                color: #252c34;
                font-size: 16px;
                font-weight: 400;
                line-height: 24px;
              `}
            >
              {error}
            </p>
            <CommonLink to="/contact" replace text="Contact us" />
          </React.Fragment>
        )}
      </Container>
      <HomeFooter />
    </section>
  );
}

export function PaymentCanceledCallbackModule() {
  return (
    <section
      css={`
        background: url(${BgEllipses});
        background-size: 100%;
        background-position: center 72px;
        background-repeat: no-repeat;
        padding-top: 48px; // AppBar height
      `}
    >
      <Container
        maxWidth="lg"
        css={`
          display: flex;
          padding-top: 100px;
          align-items: center;
          flex-direction: column;
        `}
      >
        <h2
          css={`
            color: #252c34;
            font-size: 36px;
            font-weight: 700;
            line-height: 44px;
          `}
        >
          Payment canceled.
        </h2>
        <CommonLink to="/" replace text="Continue" />
      </Container>
      <HomeFooter />
    </section>
  );
}
