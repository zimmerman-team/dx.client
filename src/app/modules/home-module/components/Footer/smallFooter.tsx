import React from "react";
import moment from "moment";
import { ReactComponent as CopyIcon } from "app/modules/home-module/components/Footer/asset/copy.svg";
import { Container } from "@material-ui/core";

function SmallFooter() {
  return (
    <>
      <div
        css={`
          height: 77px;
        `}
      />
      <div
        css={`
          background: white;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        `}
      >
        <Container maxWidth="lg">
          <div
            css={`
              display: flex;
              gap: 38px;
              align-items: center;
              padding-top: 25px;
              padding-bottom: 28px;
              font-size: 12px;
              a {
                text-decoration: none;
                color: #000;
              }
              p {
                margin: 0;
                padding: 0;
              }
            `}
          >
            <p
              css={`
                display: flex;
                align-items: center;
                gap: 8px;
              `}
            >
              <CopyIcon />
              {moment(new Date()).format("YYYY")} Dataxplorer All Rights
              Reserved
            </p>
            <p>
              <a
                href="https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view"
                className="privacy-link"
                target="_blank"
                rel="noreferrer"
              >
                Privacy
              </a>
            </p>
            <p>
              <a
                href="https://drive.google.com/file/d/1wgY5HYdE5-redIOF85E5fZZJT_YueOWP/view?usp=sharing"
                className="privacy-link"
                target="_blank"
                rel="noreferrer"
              >
                Terms and conditions
              </a>
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}

export default SmallFooter;
