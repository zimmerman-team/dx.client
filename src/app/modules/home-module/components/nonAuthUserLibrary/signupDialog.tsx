import { IconButton, Modal, createStyles, makeStyles } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import { ReactComponent as OpenLockIcon } from "app/modules/home-module/assets/open-lock-icon.svg";
import { ReactComponent as GoogleIcon } from "app/modules/home-module/assets/google-icon-flat.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/home-module/assets/linkedIn-icon-flat.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/home-module/assets/microsoft-icon-flat.svg";
import { socialAuth } from "app/utils/socialAuth";
import React from "react";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    paper: {
      outline: 0,
      width: 540,
      borderRadius: "10px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      justifyContent: "center",
      padding: "40px 20px",
      backgroundColor: "#fff",
      boxShadow:
        "0px 14.8787px 22.318px rgba(0, 0, 0, 0.05), 0px 4.4636px 7.43933px rgba(0, 0, 0, 0.05), 0px 0.743933px 7.43933px rgba(0, 0, 0, 0.05)",
      "@media (max-width: 650px)": {
        width: "80%",
      },
    },
  })
);

export default function SignupDialog(props: Props) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <IconButton
            onClick={() => props.setModalDisplay(false)}
            css={`
              position: absolute;
              right: 12px;
              top: 10px;
              padding: 0;
              &:hover {
                background: transparent;
              }
            `}
          >
            <CloseOutlined htmlColor="#A1AEBD" />
          </IconButton>
          <div
            css={`
              border-radius: 16px;
              background: #6061e5;
              box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
              padding: 12px;
              p {
                display: flex;
                gap: 10px;
                color: #fff;
                margin: 0;
                :nth-of-type(1) {
                  font-family: "GothamNarrow-Bold", sans-serif;
                  font-size: 20px;
                }
                :nth-of-type(2) {
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  margin-top: 10.18px;
                }
              }
            `}
          >
            <p>
              <OpenLockIcon />
              Sign in to Create and Manage Assets
            </p>
            <p>
              To enable editing and creation, DX needs to link your account.
              Once signed up, you’ll find all your assets saved in your library.
            </p>
          </div>
          <p
            css={`
              text-align: center;
              margin: 0;
              font-family: "GothamNarrow-Book", sans-serif;
              font-size: 18px;
              color: #231d2c;
            `}
          >
            Sign in for free to unlock data visualisation tools with
          </p>

          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
              button {
                border-radius: 30px;
                background: #13183f;
                display: flex;
                width: 203px;
                height: 35px;
                padding: 8px 18px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                border: none;
                color: #fff;
                font-family: "Inter", sans-serif;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
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
        </div>
      </Modal>
    </div>
  );
}
