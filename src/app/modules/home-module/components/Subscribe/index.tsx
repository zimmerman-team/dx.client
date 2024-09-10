import React from "react";
import { FieldErrors } from "react-hook-form";
import NewsletterForm from "app/modules/common/newsletterForm";

export default function Subscribe() {
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isSubscriptionFailed, setIsSubscriptionFailed] = React.useState(false);
  const [formError, setFormError] = React.useState<
    FieldErrors<{
      email: string;
    }>
  >({});
  return (
    <div
      css={`
        border-radius: 24px;
        padding: 55px 40px 55px 40px;
        background: #231d2c;
        box-shadow: 0px 4px 30px 4px rgba(206, 168, 188, 0.08);
        width: 100%;
        height: 270px;
        display: flex;
        align-items: center;
        gap: 40px;
        div:nth-child(1) {
          width: 60%;
        }
      `}
    >
      <div>
        <p
          css={`
            color: #fff;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 40px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin: 0;
          `}
        >
          Want to stay up to date with new releases?{" "}
        </p>
        <p
          css={`
            color: #fff;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            font-size: 20px;
            font-style: normal;
            font-weight: 325;
            margin: 0;
            margin-top: 15px;
          `}
        >
          Stay informed with exclusive updates, offers, and exclusive content
          delivered straight to your inbox!
        </p>
      </div>
      <div
        css={`
          margin-top: 25px;
        `}
      >
        <p
          css={`
            color: #fff;
            font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
            font-size: 22px;
            font-style: normal;
            font-weight: 350;
            line-height: normal;
            margin-top: 0;
            margin-bottom: 16px;
          `}
        >
          Subscribe to our newsletter
        </p>

        {formError.email && (
          <label
            css={`
              font-family: "Inter", sans-serif;
              font-size: 12px;
              text-align: left;
              width: 100%;
              padding-left: 10px;
              color: #e75656;
            `}
          >
            {"Please enter a valid email address."}
          </label>
        )}
        <div
          css={`
            border-radius: 40px;
            background: #f7f7f7;
            width: 611px;
            height: 47px;
            display: flex;
            input {
              outline: none;
              border: none;
              border-radius: 34.5px 0 0 34.5px;
              width: 70%;
              padding-left: 24px;
            }
            button {
              border: none;
              outline: none;
              border-radius: 0 34.5px 34.5px 0;
              background: #6061e5;
              text-transform: uppercase;
              color: #fff;
              font-family: "Inter", sans-serif;
              font-size: 16px;
              width: 30%;
            }
          `}
        >
          <NewsletterForm
            setIsSubscribed={setIsSubscribed}
            setIsSubscriptionFailed={setIsSubscriptionFailed}
            setFormError={setFormError}
          />
        </div>
        <p
          css={`
            line-height: normal;
            font-size: 12px;
            color: #fff;
          `}
        >
          {isSubscribed
            ? "Thank you for subscribing!"
            : isSubscriptionFailed
            ? "Oops! Something went wrong with the request! Please fill your email again."
            : ""}
        </p>
      </div>
    </div>
  );
}
