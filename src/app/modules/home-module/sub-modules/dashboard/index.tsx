import React from "react";
import { useTitle } from "react-use";
import AssetsCollection from "app/modules/home-module/components/AssetCollection";
import SmallFooter from "app/modules/home-module/components/Footer/smallFooter";

function DashboardModule() {
  useTitle("DX Dataxplorer - Dashboard");

  return (
    <div
      css={`
        margin-top: 48px;
        padding-top: 32px;
        min-height: calc(100vh - 48px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <AssetsCollection />
      <SmallFooter />
    </div>
  );
}

export default DashboardModule;
