import { yupResolver } from "@hookform/resolvers/yup";
import { APPLICATION_JSON } from "app/state/api";
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
  const emailAddress = "Email address";
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = React.useState(emailAddress);
  const inputRefFocus = () => {
    setPlaceholder("");
  };
  const inputRefBlur = () => {
    if (inputRef.current?.value === "") {
      setPlaceholder(emailAddress);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm<{ email: string }>({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "" },
  });

  React.useEffect(() => {
    props.setFormError(errors);
  }, [errors]);

  const handleSubscribeAction = (formValues: { email: string }) => {
    props.setIsSubscribed(false);
    props.setIsSubscriptionFailed(false);
    axios
      .post(
        `${process.env.REACT_APP_API}/users/subscribe-to-newsletter`,
        {
          email: formValues.email,
        },
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
          },
        }
      )
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          if (response.data.error) {
            return props.setIsSubscriptionFailed(true);
          }
          setValue("email", "");
          setPlaceholder(emailAddress);
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
    setValue("email", event.target.value);
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
        value={getValues("email")}
        placeholder={placeholder}
        {...register("email", { required: true })}
        onChange={handleEmailChange}
        ref={inputRef}
        onFocus={inputRefFocus}
        onBlur={inputRefBlur}
      />
      <button type="submit">SUBSCRIBE</button>
    </form>
  );
}
