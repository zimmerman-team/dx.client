import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MobileFooter from "./MobileFooter";
import DesktopFooter from "./DesktopFooter";

export default function HomeFooter() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return <>{isMobile ? <MobileFooter /> : <DesktopFooter />}</>;
}
