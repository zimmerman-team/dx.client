import React from "react";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Container from "@material-ui/core/Container";
import withStyles from "@material-ui/core/styles/withStyles";
import HomeFooter from "app/modules/home-module/components/Footer";
import DXBlock from "app/modules/home-module/sub-modules/partners/components/useDXBlock";
import QuoteBlock from "app/modules/home-module/sub-modules/partners/components/quoteBlock";
import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import OurPartnersBlock from "app/modules/home-module/sub-modules/partners/components/ourPartnersBlock";
import BestDecisionBlock from "app/modules/home-module/sub-modules/partners/components/bestDecisionBlock";
import {
  AboutTabCard,
  BudgetsTabCard,
  GrantsTabCard,
  PerformanceTabCard,
} from "app/modules/home-module/sub-modules/partners/components/tabCard";
import { useTitle } from "react-use";

const StyledTab = withStyles(() => ({
  root: {
    "&.MuiButtonBase-root": {
      "&.MuiTab-root": {
        width: "fit-content",
        minWidth: "fit-content",
        padding: "0px ",
        textTransform: "none",
      },
    },
    "&.MuiTab-textColorPrimary": {
      "& .MuiTab-wrapper": {
        fontSize: "24px",
        fontWeight: 700,
        fontFamily: "Inter, sans-serif",
        "@media (max-width: 1024px)": {
          fontSize: "16px",
        },
      },
      "&.Mui-selected": {
        "& .MuiTab-wrapper": {
          fontSize: "24px",
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          "@media (max-width: 1024px)": {
            fontSize: "16px",
          },
        },
      },
    },
  },
}))(Tab);

const StyledTabs = withStyles({
  root: {
    "& .MuiTabs-scroller": {
      "& .MuiTabs-flexContainer": {
        gap: "113px",
        "@media (max-width: 768px)": {
          gap: "36px",
        },
        "@media (max-width: 390px)": {
          gap: "18px",
        },
      },
    },
  },
})(Tabs);

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Pagination = (props: {
  index: number;
  onChangeIndex: (index: number) => void;
  dots: number;
}) => (
  <div
    css={`
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0%;
      bottom: 26px;
      width: 100%;
      height: 12px;
      gap: 8px;
      @media (max-width: 1129px) {
        top: unset;
        bottom: 3%;
      }
    `}
  >
    {new Array(props.dots).fill(0).map((_, i) => (
      <div
        key={i}
        css={`
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${props.index === i ? "#DADAF8" : "#fff"};
          cursor: pointer;
        `}
        onClick={() => props.onChangeIndex(i)}
      />
    ))}
  </div>
);
export default function PartnersModule() {
  useTitle("DX Dataxplorer - Partners");

  const [displayTab, setDisplayTab] = React.useState<number>(0);
  const handleChange = (
    event: React.ChangeEvent<{}> | null,
    newValue: number
  ) => {
    setDisplayTab(newValue);
  };
  const [autoPlay, setAutoPlay] = React.useState<boolean>(false);

  const cards = [
    <AboutTabCard />,
    <GrantsTabCard />,
    <BudgetsTabCard />,
    <PerformanceTabCard />,
  ];

  return (
    <>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          min-height: 100vh;
        `}
      >
        <div>
          <EmpowerBlock view="partners" />
          <Container maxWidth="lg">
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              css={`
                width: 100%;
              `}
            >
              <OurPartnersBlock />
              <DXBlock />
              <div
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
                css={`
                  width: 100%;
                  margin-top: 78px;
                  position: relative;
                  height: 639px;
                  @media (max-width: 1129px) {
                    width: 83%;
                    height: 100%;
                  }
                  @media (max-width: 600px) {
                    width: 100%;
                    height: 100%;
                  }
                `}
              >
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  `}
                >
                  <StyledTabs
                    css={`
                      margin-left: 5px;
                    `}
                    TabIndicatorProps={{
                      style: {
                        bottom: "0px",
                        height: "4px",
                      },
                    }}
                    value={displayTab}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    className="Home-MuiTabs-flexContainer"
                    data-cy="partners-tabs"
                  >
                    <StyledTab disableTouchRipple label="About" value={0} />
                    <StyledTab disableTouchRipple label="Grants" value={1} />
                    <StyledTab disableTouchRipple label="Budgets" value={2} />
                    <StyledTab
                      disableTouchRipple
                      label="Performance"
                      value={3}
                    />
                  </StyledTabs>
                </div>
                <div
                  css={`
                    height: 55px;
                    @media (max-width: 1024px) {
                      height: 32px;
                    }
                  `}
                />
                <div
                  css={`
                    position: relative;
                    background: linear-gradient(
                      180deg,
                      #a4a0ff -61.62%,
                      #f8fcfc 114.5%
                    );
                    border-radius: 29px;
                  `}
                >
                  <AutoPlaySwipeableViews
                    index={displayTab}
                    onChangeIndex={(index) =>
                      autoPlay && handleChange(null, index)
                    }
                    animateTransitions={true}
                    interval={3000}
                  >
                    {cards.map((card, index) => (
                      <div key={index} data-cy="partners-view">
                        {card}
                      </div>
                    ))}
                  </AutoPlaySwipeableViews>
                  <Pagination
                    dots={4}
                    index={displayTab}
                    onChangeIndex={(index) => handleChange(null, index)}
                  />
                </div>
                <div
                  css={`
                    height: 110px;
                    @media (max-width: 1129px) {
                      display: none;
                    }
                  `}
                />
              </div>
              <div
                css={`
                  height: 75px;
                `}
              />
              <QuoteBlock />
            </Grid>
            <div
              css={`
                height: 150px;
                @media (max-width: 1129px) {
                  height: 130px;
                }
              `}
            />
            <BestDecisionBlock />
          </Container>

          <div css="width: 100%;height: 148px;" />
        </div>
        <HomeFooter />
      </div>
    </>
  );
}
