import React from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as NotFoundIcon } from "app/modules/common/no-match-page/asset/404.svg";
import { ReactComponent as BgImg } from "app/modules/common/no-match-page/asset/bg-ellipse.svg";

import SmallFooter from "app/modules/home-module/components/Footer/smallFooter";

// cc:refactor this component, inline css need to be moved to proper styled components

export const NoMatchPage = () => {
  const history = useHistory();
  return (
    <div
      css={`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          width: 100%;
          height: calc(100vh - 113px);
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          position: relative;
        `}
      >
        <BgImg
          css={`
            position: absolute;
            top: 80px;
            z-index: -1;
            left: 0;
            width: 100%;
          `}
        />
        <div>
          <NotFoundIcon />
        </div>
        <div
          css={`
            height: 65px;
          `}
        />
        <div
          css={`
            p {
              text-align: center;
            }
            p:nth-of-type(1) {
              font-size: 34px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #6061e5;
              margin: 0;
              line-height: 41px;
            }
            p:nth-of-type(2) {
              font-size: 18px;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
              color: #231d2c;
            }
            margin-bottom: 50px;
          `}
        >
          <p>Oops! This page could not be found</p>
          <p>
            Sorry but the page you are looking for does not exist, have been
            removed, have changed or is temporarily unavailable.
          </p>
        </div>
        <div
          css={`
            display: flex;
            gap: 30px;
            justify-content: center;
            @media (max-width: 500px) {
              flex-direction: column;
              align-items: center;
              width: 100%;
            }
          `}
        >
          <Link
            to="/"
            css={`
              text-decoration: none;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 198px;
              height: 41px;
              background: #262c34;
              border-radius: 20px;
              @media (max-width: 500px) {
                width: 86%;
              }
            `}
          >
            <span
              css={`
                font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
                font-size: 14px;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0.15px;
                color: white;
                text-transform: uppercase;
              `}
            >
              Back to Home Page
            </span>
          </Link>
          <button
            onClick={() => {
              history.go(-1);
            }}
            css={`
              text-decoration: none;
              border: none;
              outline: none;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 164px;
              height: 41px;
              background: #6061e5;
              border-radius: 30px;
              cursor: pointer;
              @media (max-width: 500px) {
                width: 86%;
              }
            `}
          >
            <span
              css={`
                font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
                font-size: 14px;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0.15px;
                color: white;
                text-transform: uppercase;
              `}
            >
              Previous page
            </span>
          </button>
        </div>
      </div>
      <SmallFooter />
    </div>
  );
};
