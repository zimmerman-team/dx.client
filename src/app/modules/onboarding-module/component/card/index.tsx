import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { socialloginbuttoncss } from "./style";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import Form from "app/modules/onboarding-module/component/card/form";

export default function AuthCard(props: Readonly<{ isLogin?: boolean }>) {
  const { loginWithRedirect } = useAuth0();
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onButtonClick = () => {
    loginWithRedirect();
  };

  return (
    <div
      css={`
        display: flex;
        color: #231d2c;
        padding: 16px 0;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        > button {
          opacity: ${checked || props.isLogin ? "1" : "0.5"};
          pointer-events: ${checked || props.isLogin ? "auto" : "none"};
        }
      `}
    >
      <button type="button" css={socialloginbuttoncss} onClick={onButtonClick}>
        <GoogleIcon /> {props.isLogin ? "Log in" : "Sign up"} with Google
      </button>
      <button type="button" css={socialloginbuttoncss} onClick={onButtonClick}>
        <LinkedInIcon />
        {props.isLogin ? "Log in" : "Sign up"} with LinkedIn
      </button>
      <Form
        isLogin={props.isLogin as boolean}
        checked={checked}
        handleChange={handleChange}
      />
    </div>
  );
}
