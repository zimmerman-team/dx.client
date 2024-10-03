import React from "react";
import Container from "@material-ui/core/Container";
import HomeFooter from "app/modules/home-module/components/Footer";
import EllipsesDesktop from "app/modules/home-module/assets/whydx-ellipses.svg";
import EllipsesTablet from "app/modules/home-module/assets/whydx-ellipses-tablet.svg";
import EllipsesMobile from "app/modules/home-module/assets/whydx-ellipses-mobile.svg";
import TryUsBlock from "app/modules/home-module/sub-modules/why-dx/components/tryUsBlock";
import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import KeyFeaturesBlock from "app/modules/home-module/sub-modules/why-dx/components/keyFeaturesBlock";
import { useTitle } from "react-use";
import { useMediaQuery } from "usehooks-ts";

export default function WhyDX() {
  useTitle("DX Dataxplorer - Why Dataxplorer?");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 641px)");
  let Ellipses = EllipsesDesktop;
  if (isTablet) {
    Ellipses = EllipsesTablet;
  } else if (isMobile) {
    Ellipses = EllipsesMobile;
  }

  return (
    <>
      <EmpowerBlock view="why-dx" />
      <div
        css={`
          background-image: url(${Ellipses});
          background-repeat: no-repeat;
          background-position: ${isTablet ? "49% 58%" : "44% 4%"};
        `}
      >
        <Container maxWidth="lg">
          <KeyFeaturesBlock />
          <div
            css={`
              height: 50px;
            `}
          />
          <div
            css={`
              height: 129px;
              @media (max-width: 1024px) {
                height: 39px;
              }
            `}
          />
          <TryUsBlock />
          <div
            css={`
              height: 50px;
            `}
          />
        </Container>
      </div>
      <div css="width: 100%;height: 19px" />
      <HomeFooter />
    </>
  );
}
