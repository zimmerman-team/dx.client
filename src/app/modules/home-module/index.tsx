/* third-party */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useTitle from "react-use/lib/useTitle";
/* project */
import HomeFooter from "app/modules/home-module/components/Footer";

import AssetsCollection from "./components/AssetCollection";
import Hero from "./components/hero";
import NonAuthUserLibrary from "./components/nonAuthUserLibrary";
import { Box } from "@material-ui/core";

export default function HomeModule() {
  useTitle("DX Dataxplorer");

  const { isAuthenticated, user } = useAuth0();

  return (
    <div
      css={`
        margin-top: 48px;
        min-height: calc(100vh - 48px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f2f7fd;
      `}
    >
      {!isAuthenticated ? <Hero /> : <Box height={40} />}

      {!isAuthenticated ? <NonAuthUserLibrary /> : <AssetsCollection />}

      <HomeFooter />
    </div>
  );
}
