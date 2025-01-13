import React from "react";
import { ReactComponent as EyeIcon } from "app/modules/home-module/assets/chunk-eye.svg";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { ReactComponent as GoogleIcon } from "app/modules/home-module/assets/google-icon-flat.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/home-module/assets/linkedIn-icon-flat.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/home-module/assets/microsoft-icon-flat.svg";
import { socialAuth } from "app/utils/socialAuth";

export default function InfoCard() {
  const [displayButtons, setDisplayButtons] = React.useState(false);
  const toggleDisplayButtons = () => {
    setDisplayButtons(!displayButtons);
  };
  return (
    <div
      css={`
        border-radius: 16px;
        background: #6061e5;
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
        display: flex;
        width: 384px;
        padding: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        p {
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;

          &:nth-of-type(1) {
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 20px;
          }
          &:nth-of-type(2) {
            font-family: "GothamNarrow-Book", sans-serif;
            font-size: 14px;
            line-height: 20px;
          }
          &:nth-of-type(3) {
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            svg {
              transform: rotate(${displayButtons ? "180deg" : "0deg"});
              transition: transform 0.2s;
              cursor: pointer;
            }
          }
        }
      `}
    >
      <p>
        <EyeIcon />
        You’re Viewing Default DX Assets
      </p>
      <p>
        The items displayed here are default assets from DX. Sign in to create,
        customize, and personalize your own assets to match your needs.
      </p>
      <p onClick={toggleDisplayButtons}>
        Sign In to Our Free Plan <KeyboardArrowDownIcon />{" "}
      </p>
      {displayButtons ? (
        <div
          css={`
            display: flex;
            gap: 10px;
            justify-content: center;
            button {
              border-radius: 30px;
              background: #fff;
              border: none;
              display: flex;
              height: 35px;
              width: 113.33px;
              justify-content: center;
              align-items: center;
              gap: 10px;
              color: #6061e5;
              font-family: "Inter", sans-serif;
              font-size: 14px;
              font-weight: 700;
              cursor: pointer;
              svg {
                path,
                rect {
                  fill: #6061e5;
                }
              }
              &:nth-of-type(2) {
                svg {
                  path {
                    fill: #fff;
                  }
                }
              }
            }
          `}
        >
          <button onClick={() => socialAuth("google-oauth2")}>
            <GoogleIcon /> Google
          </button>
          <button onClick={() => socialAuth("linkedin")}>
            <LinkedInIcon /> LinkedIn
          </button>
          <button onClick={() => socialAuth("windowslive")}>
            <MicrosoftIcon /> Microsoft
          </button>
        </div>
      ) : null}
    </div>
  );
}
