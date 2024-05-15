import React from "react";
import Container from "@material-ui/core/Container";
import HomeFooter from "app/modules/home-module/components/Footer";
import Ellipses from "app/modules/home-module/assets/whydx-ellipses.svg";
import TryUsBlock from "app/modules/home-module/sub-modules/why-dx/components/tryUsBlock";
import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import BenefitsBlock from "app/modules/home-module/sub-modules/why-dx/components/benefitsBlock";
import KeyFeaturesBlock from "app/modules/home-module/sub-modules/why-dx/components/keyFeaturesBlock";
import { useTitle } from "react-use";

export default function WhyDX() {
  useTitle("DX DataXplorer - Why Dataxplorer?");

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
              height: 90px;
            `}
          />
          <BenefitsBlock />
          <div
            css={`
              height: 129px;
            `}
          />
          <TryUsBlock />
        </Container>
      </div>
      <div css="width: 100%;height: 36px" />
      <HomeFooter />
    </>
  );
}
