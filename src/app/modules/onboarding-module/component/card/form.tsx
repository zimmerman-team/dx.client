import React from "react";
import { OnboardingTextInput } from "../textinput";
import { actionbuttoncss } from "./style";
import { termsOfServiceCss } from "./style";
import Box from "@material-ui/core/Box";
import { ReactComponent as DividerImg } from "app/modules/onboarding-module/asset/login-divider.svg";
import { ReactComponent as SignupDividerImg } from "app/modules/onboarding-module/asset/signup-divider.svg";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function Form(
  props: Readonly<{
    isLogin: boolean;
    checked: boolean;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }>
) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  return (
    <React.Fragment>
      {props.isLogin ? (
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
                font-size: 12px;
                line-height: 20px;
                text-align: start;
                border-style: none;
                margin-top: -0.7rem;
                font-family: "GothamNarrow-Book";
                margin-bottom: 12px;
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
      ) : (
        <>
          <div
            css={`
              margin: 9px 0 25px 0;
            `}
          >
            <SignupDividerImg />
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
              type="text"
              label="name"
              value={name}
              setValue={setName}
            />
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

            <FormControlLabel
              control={
                <Checkbox
                  name="tna"
                  color="default"
                  checked={props.checked}
                  onChange={props.handleChange}
                />
              }
              label={
                <p
                  css={`
                    color: #231d2c;
                    font-size: 12px;
                    font-family: "GothamNarrow-Book";
                  `}
                >
                  I agree with DX's{" "}
                  <a
                    href=""
                    target="_blank"
                    rel="noreferrer noopener"
                    css={`
                      color: #231d2c;
                    `}
                  >
                    terms of services and privacy policy
                  </a>
                </p>
              }
              css={termsOfServiceCss}
            />
            <Box height={48} />
            <button type="button" css={actionbuttoncss}>
              Sign up
            </button>
          </div>
        </>
      )}
    </React.Fragment>
  );
}
