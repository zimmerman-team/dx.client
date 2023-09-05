import React from "react";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError, AxiosResponse } from "axios";
import { emailSchema } from "app/utils/emailValidation";
import { ReactComponent as MailImg } from "app/modules/report-module/asset/mail-img.svg";
import { ReactComponent as TopEllipse } from "app/modules/report-module/asset/ai-newsletter-top-ellipse.svg";
import { ReactComponent as BigEllipse } from "app/modules/report-module/asset/ai-newsletter-big-ellipse.svg";
import { ReactComponent as MidEllipse } from "app/modules/report-module/asset/ai-newsletter-md-btm-ellipse.svg";
import { ReactComponent as BtmGreenEllipse } from "app/modules/report-module/asset/ai-newsletter-btm-green-ellipse.svg";
import { ReactComponent as BtmPurpleEllipse } from "app/modules/report-module/asset/ai-newsletter-sm-purple-ellispe.svg";
import { ReactComponent as ReportIllustration } from "app/modules/report-module/asset/report-illustration.svg";
import { ReactComponent as DatasetIllustration } from "app/modules/report-module/asset/dataset-illustration.svg";
import { ReactComponent as ChartIllustration } from "app/modules/report-module/asset/chart-illustration.svg";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {
  bigEllipsecss,
  btmGreenEllipsecss,
  btmPurpleEllipsecss,
  chartIllustrationcss,
  datasetIllustrationcss,
  midEllipsecss,
  newsletterIllustrationcss,
  notSubscribedcss,
  reportIllustrationcss,
  subscribedcss,
  topEllipsecss,
} from "./style";
import SneakPreview from "./sneakPreview";

export default function AITemplate() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>({ resolver: yupResolver(emailSchema) });
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isSubscriptionFailed, setIsSubscriptionFailed] = React.useState(false);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(true);

  const handleSubscribeAction = () => {
    axios
      .post(
        `https://api.hsforms.com/submissions/v3/integration/submit/${process.env.REACT_APP_HUBSPOT_PORTAL_ID}/${process.env.REACT_APP_HUBSPOT_SUBSCRIBE_FORM_ID}`,
        {
          portalId: process.env.REACT_APP_HUBSPOT_PORTAL_ID,
          formGuid: process.env.REACT_APP_HUBSPOT_SUBSCRIBE_FORM_ID,
          fields: [
            {
              name: "email",
              value: email,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setEmail("");
          setIsSubscribed(true);
        } else {
          setIsSubscriptionFailed(true);
        }
      })
      .catch((error: AxiosError) => {
        setIsSubscriptionFailed(true);
        console.log(error.response, "res");
      });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Grid
      container
      css={`
        height: calc(100vh - 48px);
      `}
    >
      {modalDisplay && <SneakPreview setModalDisplay={setModalDisplay} />}
      <Grid
        item
        xs={12}
        md={6}
        css={`
          height: 100%;
        `}
      >
        <div css={newsletterIllustrationcss}>
          <h1>Subscribe to our newsletter</h1>
          <p>
            Want to be the first one to know when we launch our brand new
            AI-powered template for reports? Don't miss out on this exciting
            opportunity!
          </p>
          <div
            css={`
              position: relative;
              width: 100%;
            `}
          >
            <BigEllipse css={bigEllipsecss} />
            <MidEllipse css={midEllipsecss} />
            <BtmGreenEllipse css={btmGreenEllipsecss} />
            <BtmPurpleEllipse css={btmPurpleEllipsecss} />
            <DatasetIllustration css={datasetIllustrationcss} />
            <ChartIllustration css={chartIllustrationcss} />
            <ReportIllustration css={reportIllustrationcss} />
          </div>
          <TopEllipse css={topEllipsecss} />
        </div>
      </Grid>

      <Grid item xs={12} md={6}>
        {isSubscribed ? (
          <div css={subscribedcss}>
            <div>
              <MailImg />
              <div
                css={`
                  height: 47px;
                `}
              />
              <p>
                <b>Thank you for subscribing!</b>
              </p>

              <p>
                <b>
                  You will be the first to know when we launch our AI-powered
                  template as well
                  <br /> as new other new releases and exciting news!{" "}
                </b>
              </p>

              <p>You should receive a confirmation email soon.</p>
            </div>
          </div>
        ) : (
          <div css={notSubscribedcss(Boolean(errors.email))}>
            <div>
              <MailImg />
              <div
                css={`
                  height: 47px;
                `}
              />
              <p>
                Sign up now by entering your email below. Be among the first to
                experience the future of <br />
                reporting unfold right in your inbox. 🚀
              </p>
              <div
                css={`
                  height: 44px;
                `}
              />
              <label
                css={`
                  font-family: "Inter", sans-serif;
                  font-size: 12px;
                  text-align: left;
                  width: 100%;
                  padding-left: 10px;
                  color: #e75656;
                  p {
                    font-family: "Gotham Narrow", sans-serif;
                    text-align: left;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    line-height: 15px;
                    margin: 0;
                  }
                `}
              >
                {errors.email && "Please enter a valid email address."}
                {isSubscriptionFailed && (
                  <p>
                    <span>
                      <ErrorOutlineIcon htmlColor="#E75656" />
                    </span>{" "}
                    Oops! Something went wrong with the request! Please fill
                    your email again.
                  </p>
                )}
              </label>
              <div
                css={`
                  display: flex;
                  height: 50px;
                  width: 100%;
                  border-radius: 40px;
                `}
              >
                <form
                  css={`
                    width: 100%;
                    display: flex;
                  `}
                  onSubmit={handleSubmit(handleSubscribeAction)}
                >
                  <input
                    type="text"
                    placeholder="Email address"
                    {...register("email", { required: true })}
                    onChange={handleEmailChange}
                  />
                  <button type="submit">SUBSCRIBE</button>
                </form>
              </div>
              <p
                css={`
                  text-align: left;
                  width: 100%;
                  padding-left: 10px;
                  font-size: 12px;
                  font-family: "Roboto", sans-serif;
                  line-height: normal;
                  color: #000;
                `}
              >
                You will receive occasional emails from DX. You always have
                choice to unsubscribe within every Email.
              </p>
            </div>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
