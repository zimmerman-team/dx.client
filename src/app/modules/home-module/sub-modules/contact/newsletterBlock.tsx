import NewsletterForm from "app/modules/common/newsletterForm";
import React from "react";
import { FieldErrors } from "react-hook-form";

export default function NewsletterBlock(props: {
  formError: FieldErrors<{
    email: string;
  }>;
  setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubscriptionFailed: React.Dispatch<React.SetStateAction<boolean>>;
  setFormError: React.Dispatch<
    React.SetStateAction<FieldErrors<{ email: string }>>
  >;
  isSubscribed: boolean;
  isSubscriptionFailed: boolean;
}) {
  return (
    <div
      css={`
        width: 100%;
      `}
    >
      <p
        css={`
          font-size: 16px;
          font-weight: 350;
          color: #fff;
          font-family: "GothamNarrow-Medium", sans-serif;
        `}
      >
        Subscribe to our newsletter
      </p>
      {props.formError.email && (
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
          Please enter a valid email address.
        </label>
      )}
      <div
        css={`
          border-radius: 40px;
          background: #f7f7f7;
          width: 100%;
          height: 35px;
          display: flex;

          input {
            outline: none;
            border: none;
            border-radius: 34.5px 0 0 34.5px;
            width: 70%;
            padding-left: 24px;
            background: #f7f7f7;
            font-family: "Roboto", sans-serif;
            font-weight: 400;
            ::placeholder {
              font-family: "Roboto", sans-serif;
              font-weight: 400;
              color: #000;
            }
          }
          button {
            border: none;
            outline: none;
            border-radius: 0 34.5px 34.5px 0;
            background: #6061e5;
            text-transform: uppercase;
            color: #fff;
            font-family: "Inter", sans-serif;
            font-size: 12px;
            width: 50%;
            font-weight: 400;
            cursor: pointer;
          }
        `}
      >
        <NewsletterForm
          setIsSubscribed={props.setIsSubscribed}
          setIsSubscriptionFailed={props.setIsSubscriptionFailed}
          setFormError={props.setFormError}
        />
      </div>
      <p
        css={`
          line-height: normal;
          font-size: 12px;
          height: 10px;
          color: #fff;
          margin: 0;
          margin-top: 4px;
        `}
      >
        {props.isSubscribed
          ? "Thank you for subscribing!"
          : props.isSubscriptionFailed
          ? "Oops! Something went wrong with the request! Please fill your email again."
          : ""}
      </p>
    </div>
  );
}
