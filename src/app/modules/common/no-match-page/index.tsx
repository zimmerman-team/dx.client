import React from "react";
import get from "lodash/get";
import { Link } from "react-router-dom";

// cc:refactor this component, inline css need to be moved to proper styled components

export const NoMatchPage = () => {
  return (
    <div
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding: 100px 50px 50px 50px;
      `}
    >
      <div
        css={`
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 14px;
          font-weight: 500;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.71;
          letter-spacing: 0.1px;
          color: #231d2c;
        `}
      >
        <div>Oops! Page not found</div>
      </div>
      <div
        css={`
          font-size: 120px;
          font-weight: bold;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 2.15px;
          color: #525252;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        `}
      >
        <div>404</div>
      </div>
      <div
        css={`
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 14px;
          font-weight: 600;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.71;
          letter-spacing: 1.25px;
          text-align: center;
          color: #231d2c;
          margin-bottom: 50px;
        `}
      >
        <div>We are sorry, but the page you requested was not found</div>
      </div>
      <Link
        to="/"
        css={`
          text-decoration: none;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 204px;
            height: 46px;
            background: #262c34;
            border-radius: 20px;
          `}
        >
          <span
            css={`
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 14px;
              font-weight: 500;
              font-style: normal;
              font-stretch: normal;
              line-height: 1.5;
              letter-spacing: 0.15px;
              color: white;
            `}
          >
            <div>Back to Home Page</div>
          </span>
        </div>
      </Link>
    </div>
  );
};
