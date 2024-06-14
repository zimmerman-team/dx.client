import React from "react";
import { useTitle } from "react-use";
import AssetsCollection from "../../components/AssetCollection";
import SmallFooter from "../../components/Footer/smallFooter";

function DashboardModule() {
  useTitle("DX DataXplorer - Dashboard");

  return (
    <div
      css={`
        margin-top: 48px;
        padding-top: 32px;
        min-height: calc(100vh - 125px);
      `}
    >
      <AssetsCollection />
      <SmallFooter />
    </div>
  );
}

export default DashboardModule;
