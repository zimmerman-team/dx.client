import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoIcon } from "app/modules/home-module/components/Footer/asset/logo.svg";
import { ReactComponent as CopyIcon } from "app/modules/home-module/components/Footer/asset/copy.svg";
import moment from "moment";

export default function MobileFooter() {
  return (
    <>
      <div
        css={`
          height: 113px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: white;
          padding: 16px;
        `}
      >
        <Link to="/">
          <LogoIcon />
        </Link>
        <hr
          css={`
            color: #d9d9d9;
            height: 1px;
            width: 100%;
          `}
        />
        <div
          css={`
            height: 14px;
          `}
        />
        <div
          css={`
            height: 39px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            a {
              text-decoration: none;
              color: #000;
              font-size: 12px;
              font-family: "GothamNarrow-Book", sans-serif;
            }
            p:nth-of-type(1) {
              display: flex;
              align-items: center;
              gap: 20px;
              margin: 0;
            }
            p:nth-of-type(2) {
              display: flex;
              align-items: center;
              gap: 8px;
              margin: 0;
            }
          `}
        >
          <p>
            <a
              href="https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view"
              className="privacy-link"
              target="_blank"
              rel="noreferrer"
            >
              Privacy
            </a>{" "}
            <a
              href="https://drive.google.com/file/d/1wgY5HYdE5-redIOF85E5fZZJT_YueOWP/view?usp=sharing"
              className="privacy-link"
              target="_blank"
              rel="noreferrer"
            >
              Terms and conditions
            </a>{" "}
          </p>
          <p
            css={`
              display: flex;
              align-items: center;
              gap: 8px;
              margin: 0;
              padding: 0;
            `}
          >
            <CopyIcon />
            {moment(new Date()).format("YYYY")} Dataxplorer All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
}
