import React from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import Carousel from "react-grid-carousel";
import { useMediaQuery } from "@material-ui/core";
import { ArrowForwardIcon } from "app/assets/icons/ArrowForward";
import { DatasetItemModel, datasets } from "app/modules/datasets-module"
import { useStoreState } from "app/state/store/hooks";

const griditem = (content: React.ReactElement, link: string) => (
  <Link to={link} css="text-decoration: none;">
    <div
      css={`
        padding: 20px;
        height: 260px;
        color: #262c34;
        background: #fff;
        border-radius: 20px;
        border: 2px solid #fff;

        @media (max-width: 767px) {
          height: 205px;
        }

        > div {
          font-weight: bold;
          margin-bottom: 10px;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
        }

        > svg {
          width: 100%;
          height: calc(100% - 30px);
        }

        &:hover {
          border-color: #13183f;
        }
      `}
    >
      {content}
    </div>
  </Link>
);

export function DatasetCarousel() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  const datasourceMapping = useStoreState((state) => state.DataSourceMappingState.value);
  return (
    <div
      css={`
        width: 100%;

        > div {
          > div:nth-of-type(2) {
            margin: 0;
          }
          > div:nth-of-type(3) {
            padding-top: ${isSmallScreen ? "10px" : 0};
          }
        }
      `}
    >
      <Carousel
        cols={isSmallScreen ? 2 : 3}
        rows={1}
        gap={10}
        hideArrow={isSmallScreen ? true : undefined}
        showDots={isSmallScreen ? true : undefined}
        containerStyle={{ width: "100%" }}
        arrowLeft={
          <div
            css={`
              width: 30px;
              left: -40px;
              height: 30px;
              display: flex;
              position: absolute;
              align-items: center;
              top: calc(50% - 15px);
              justify-content: center;

              &:hover {
                cursor: pointer;
                border-radius: 50%;
                background: #98a1aa;
              }

              > svg {
                transform: rotate(-180deg);
              }
            `}
          >
            <ArrowForwardIcon />
          </div>
        }
        arrowRight={
          <div
            css={`
              width: 30px;
              height: 30px;
              right: -40px;
              display: flex;
              position: absolute;
              align-items: center;
              top: calc(50% - 15px);
              justify-content: center;

              &:hover {
                cursor: pointer;
                border-radius: 50%;
                background: #98a1aa;
              }
            `}
          >
            <ArrowForwardIcon />
          </div>
        }
      >
        {datasets.map((dataset: DatasetItemModel) => {
          if (!datasourceMapping.includes(dataset.name) && !datasourceMapping.includes(dataset.group)) return <React.Fragment key={dataset.link} />;
          return (
            <Carousel.Item key={dataset.link}>
              {griditem(
                <React.Fragment>
                  <div>
                    <b>{dataset.group}</b>{["Finance", "Access to Funding"].includes(dataset.group) && ` · ${dataset.name}`}
                  </div>
                  {dataset.preview}
                </React.Fragment>,
                dataset.link
              )}
            </Carousel.Item>
          )
        })}
      </Carousel>
    </div>
  );
}
