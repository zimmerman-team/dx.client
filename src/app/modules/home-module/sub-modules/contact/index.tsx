import React from "react";
import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import {
  Container,
  Snackbar,
  TextField,
  useMediaQuery,
  withStyles,
} from "@material-ui/core";
import HomeFooter from "app/modules/home-module/components/Footer";
import { ReactComponent as FullEllipse } from "app/modules/home-module/assets/contact-lg-ellispe.svg";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useTitle } from "react-use";
import { PageLoader } from "app/modules/common/page-loader";
import NewsletterBlock from "./newsletterBlock";
import { FieldErrors } from "react-hook-form";

const CssTextField = withStyles({
  root: {
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:938px)"]: {
      marginTop: "unset !important",
      "& label": {
        fontSize: "12px",
      },
    },
  },
})(TextField);

export default function ContactModule() {
  useTitle("DX Dataxplorer - Contact");
  const md = useMediaQuery("(max-width: 940px)");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isSubscriptionFailed, setIsSubscriptionFailed] = React.useState(false);
  const [formError, setFormError] = React.useState<
    FieldErrors<{
      email: string;
    }>
  >({});

  const [contactFormDetails, setContactFormDetails] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    message: "",
  });

  const resetForm = () => {
    setContactFormDetails({
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      message: "",
    });
  };
  const [_contactFormFailed, setContactFormFailed] = React.useState(false);

  const handleContactFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setContactFormDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContactFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        `${process.env.REACT_APP_API}/users/send-contact-form-to-intercom`,
        contactFormDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: AxiosResponse) => {
        setLoading(false);
        if (response.status === 200) {
          if (response.data.error) {
            return setContactFormFailed(true);
          }
          setOpenSnackbar(true);
          setMessage(response.data.message);
          resetForm();
        } else {
          setContactFormFailed(true);
        }
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        setContactFormFailed(true);
      });
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
      />
      {loading && <PageLoader />}
      <div
        css={`
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        `}
      >
        <EmpowerBlock view="contact" />
        <Container maxWidth="lg">
          <div
            css={`
              position: relative;
              z-index: 1;
              height: 874px;
              margin: auto;
              margin-top: 18px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              @media (max-width: 940px) {
                margin-top: 56px;
                height: 100%;
              }
              h4 {
                font-family: "GothamNarrow-Bold", sans-serif;
                font-size: 36px;
                line-height: 43px;
                color: #231d2c;
                text-align: center;
                @media (max-width: 640px) {
                  margin: 0;
                  margin-bottom: 20px;
                }
              }
              p {
                font-size: 20px;
                line-height: 24px;
                text-align: center;
                font-family: "GothamNarrow-Medium", sans-serif;
                margin-top: 0;

                /* width: 60%; */

                @media (max-width: 600px) {
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-size: 16px;
                  line-height: 19px;
                  width: auto;
                }
              }
            `}
          >
            <FullEllipse
              css={`
                position: absolute;
                z-index: -1;
                top: 0px;
                @media (max-width: 940px) {
                  @media (min-width: 601px) {
                    width: 100%;
                    height: 100%;
                    top: 37px;
                  }
                }
                @media (max-width: 600px) {
                  width: 100%;
                  left: -16px;
                  top: -241px;
                }
              `}
            />
            <h4>Contact us!</h4>
            <p>
              Schedule a free demo now or ask us any data related <br />{" "}
              question you may have.
            </p>
            <form
              onSubmit={handleContactFormSubmit}
              css={`
                width: 522px;
                height: 100%;
                margin: auto;
                .MuiFormControl-root {
                  margin-top: 20px;
                }
                input {
                  font-family: "Inter", sans-serif;
                  color: #231d2c;
                }
                @media (max-width: 1024px) {
                  width: 450px;
                }
                @media (max-width: 600px) {
                  width: 80%;
                  p {
                    font-family: "GothamNarrow-Book", sans-serif;
                    font-size: 16px;
                    line-height: 19px;
                  }
                }
              `}
            >
              <CssTextField
                id="standard-basic"
                label="E-mail"
                variant="standard"
                fullWidth
                required
                name="email"
                type="email"
                onChange={handleContactFormChange}
                value={contactFormDetails.email}
                style={{ fontSize: "12px" }}
              />
              <CssTextField
                id="standard-basic"
                label="First Name"
                variant="standard"
                fullWidth
                name="firstName"
                value={contactFormDetails.firstName}
                onChange={handleContactFormChange}
              />
              <CssTextField
                id="standard-basic"
                label="Last Name"
                variant="standard"
                fullWidth
                name="lastName"
                value={contactFormDetails.lastName}
                onChange={handleContactFormChange}
              />
              <CssTextField
                id="standard-basic"
                label="Company Name"
                variant="standard"
                fullWidth
                name="company"
                value={contactFormDetails.company}
                onChange={handleContactFormChange}
              />
              <CssTextField
                id="standard-basic"
                label="Message"
                variant="standard"
                fullWidth
                required
                name="message"
                multiline
                minRows={md ? 4 : 5}
                value={contactFormDetails.message}
                onChange={handleContactFormChange}
              />
              <div
                css={`
                  height: 60px;
                  @media (max-width: 600px) {
                    height: 26px;
                  }
                `}
              ></div>
              <div
                css={`
                  display: flex;
                  justify-content: center;
                  width: 100%;
                  @media (max-width: 600px) {
                    button {
                      width: 100%;
                      font-size: 16px;
                    }
                  }
                `}
              >
                <button
                  type="submit"
                  css={`
                    border: none;
                    outline: none;
                    background: #6061e5;
                    border-radius: 30px;
                    height: 48px;
                    width: 133px;
                    color: #ffffff;
                    font-size: 20px;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    :hover {
                      cursor: pointer;
                      opacity: 0.9;
                    }
                  `}
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
          <div
            css={`
              display: none;
              @media (max-width: 1024px) {
                @media (min-width: 601px) {
                  display: block;
                  height: 81px;
                }
              }
            `}
          />
          <div
            css={`
              width: 100%;
              display: flex;
              justify-content: center;
            `}
          >
            <div
              css={`
                display: none;
                @media (max-width: 600px) {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  width: 98%;
                  height: 296px;
                  border-radius: 20px;
                  margin: 56px 0;
                  background: #231d2c;
                  box-shadow: 0px 4px 30px 4px rgba(206, 168, 188, 0.08);
                  padding: 0px 16px 0px 23px;
                  > p:nth-of-type(1) {
                    color: #fff;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    font-size: 24px;
                    margin: 0;
                  }
                  > p:nth-of-type(2) {
                    color: #fff;
                    font-family: "GothamNarrow-Book", sans-serif;
                    font-size: 14px;
                    margin-bottom: 28px;
                    line-height: 17px;
                    margin-top: 8px;
                  }
                }
              `}
            >
              <p>Want to stay up to date with new releases? </p>
              <p>
                Stay informed with exclusive updates, offers, and exclusive
                content delivered straight to your inbox!
              </p>
              <NewsletterBlock
                formError={formError}
                isSubscribed={isSubscribed}
                isSubscriptionFailed={isSubscriptionFailed}
                setFormError={setFormError}
                setIsSubscribed={setIsSubscribed}
                setIsSubscriptionFailed={setIsSubscriptionFailed}
              />
            </div>
          </div>
        </Container>
      </div>
      <HomeFooter />
    </>
  );
}
