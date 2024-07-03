import { KeyboardArrowRight } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";

interface BreadCrumbsProps {
  items: { path?: string; title: React.ReactNode }[];
}

function BreadCrumbs(props: BreadCrumbsProps) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      {props.items.map((item, index) => (
        <div
          key={index}
          css={`
            display: flex;
            align-items: center;
          `}
        >
          {index === props.items.length - 1 ? (
            <span
              css={`
                &,
                * {
                  font-size: 24px;
                  font-family: "GothamNarrow-Bold", sans-serif;
                  font-weight: 400;
                  line-height: 29px;
                  color: #2b3674;
                  margin: 0;
                  line-height: 42px;
                  padding: 0;
                }
              `}
            >
              {item.title}
            </span>
          ) : (
            <Link
              to={item.path}
              css={`
                &,
                * {
                  font-size: 24px;
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-weight: 325;
                  line-height: 29px;
                  color: #2b3674;
                  margin: 0;
                  line-height: 42px;
                  padding: 0;
                  text-decoration: none;
                  :hover {
                    opacity: 0.8;
                  }
                }
              `}
            >
              {item.title}
            </Link>
          )}

          {index < props.items.length - 1 && (
            <KeyboardArrowRight
              css={`
                width: 24px;
                height: 24px;
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default BreadCrumbs;
