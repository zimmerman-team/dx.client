import { yupResolver } from "@hookform/resolvers/yup";
import { emailSchema } from "app/utils/emailValidation";
import axios, { AxiosResponse, AxiosError } from "axios";
import React from "react";
import { FieldErrors, useForm } from "react-hook-form";

export default function NewsletterForm(
  props: Readonly<{
    setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSubscriptionFailed: React.Dispatch<React.SetStateAction<boolean>>;
    setFormError: React.Dispatch<
      React.SetStateAction<
        FieldErrors<{
          email: string;
        }>
      >
    >;
  }>
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = React.useState("Email address");
  const inputRefFocus = () => {
    setPlaceholder("");
  };
  const inputRefBlur = () => {
    if (inputRef.current?.value === "") {
      setPlaceholder("Email address");
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>({ resolver: yupResolver(emailSchema) });
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    props.setFormError(errors);
  }, [errors]);

  const handleSubscribeAction = () => {
    props.setIsSubscribed(false);
    props.setIsSubscriptionFailed(false);
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
          props.setIsSubscribed(true);
        } else {
          props.setIsSubscriptionFailed(true);
        }
      })
      .catch((error: AxiosError) => {
        props.setIsSubscriptionFailed(true);
      });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setFormError({});
    setEmail(event.target.value);
  };

  return (
    <form
      css={`
        width: 100%;
        display: flex;
        input {
          font-family: "Roboto", sans-serif;
        }
        button {
          cursor: pointer;
        }
      `}
      onSubmit={handleSubmit(handleSubscribeAction)}
    >
      <input
        type="text"
        placeholder={placeholder}
        {...register("email", { required: true })}
        onChange={handleEmailChange}
        value={email}
        ref={inputRef}
        onFocus={inputRefFocus}
        onBlur={inputRefBlur}
      />
      <button type="submit">SUBSCRIBE</button>
    </form>
  );
}
