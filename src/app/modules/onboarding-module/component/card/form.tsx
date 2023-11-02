import React from "react";
import { OnboardingTextInput } from "../textinput";
import { actionbuttoncss } from "./style";
import Box from "@material-ui/core/Box";
import { ReactComponent as DividerImg } from "app/modules/onboarding-module/asset/login-divider.svg";

export default function Form() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <>
      <div
        css={`
          margin: 9px 0 25px 0;
        `}
      >
        <DividerImg />
      </div>
      <div
        css={`
          width: 100%;

          > .MuiTextField-root {
            margin-bottom: 16px;
          }
        `}
      >
        <OnboardingTextInput
          type="email"
          label="Email"
          value={email}
          setValue={setEmail}
        />
        <OnboardingTextInput
          type="password"
          label="Password"
          value={password}
          setValue={setPassword}
        />

        <button
          type="button"
          css={`
            padding: 0;
            width: 100%;
            color: #231d2c;
            cursor: pointer;
            font-size: 1px;
            line-height: 20px;
            text-align: start;
            border-style: none;
            margin-top: -0.7rem;
            font-family: "GothamNarrow-Book";
            /* margin-bottom: 12px; */
            display: flex;
            justify-content: flex-end;
            background: transparent;
          `}
        >
          Forgot password?
        </button>
        <Box height={48} />
        <button type="button" css={actionbuttoncss}>
          Log in
        </button>
      </div>
    </>
  );
}
