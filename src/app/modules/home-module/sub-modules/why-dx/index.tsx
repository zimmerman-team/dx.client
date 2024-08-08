import React from "react";
import Container from "@material-ui/core/Container";
import HomeFooter from "app/modules/home-module/components/Footer";
import Ellipses from "app/modules/home-module/assets/whydx-ellipses.svg";
import TryUsBlock from "app/modules/home-module/sub-modules/why-dx/components/tryUsBlock";
import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import KeyFeaturesBlock from "app/modules/home-module/sub-modules/why-dx/components/keyFeaturesBlock";
import { useTitle } from "react-use";

export default function WhyDX() {
  useTitle("DX Dataxplorer - Why Dataxplorer?");

  return (
    <>
      <EmpowerBlock view="why-dx" />
      <div
        css={`
          background-image: url(${Ellipses});
          background-repeat: no-repeat;
          background-position: 44% 4%;
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
