import React from "react";
import { Link } from "react-router-dom";
import BigLogo from "app/assets/BigLogo";
import { Search } from "app/components/Search";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useStoreState } from "app/state/store/hooks";
import { DatasetCarousel } from "app/components/DatasetCarousel";
import {
  container,
  subtitle,
  datasetstitle,
  datasetslink,
} from "app/modules/landing-module/styles";

export const LandingLayout = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const datasource = useStoreState((state) => state.DataSourceState.value);

  return (
    <div css={container}>
      <div
        css={`
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;

          @media (max-width: 600px) {
            > svg {
              width: 100%;
            }
          }
        `}
      >
        <BigLogo />
        <div css={subtitle}>Free and open access to the { datasource === 'TGFOData' ? 'Global Fund Data' : `${datasource} dataset` }</div>
        <Search />
        {!isMobile && (
          <React.Fragment>
            <div css={datasetstitle}>Explore the Datasets</div>
            <DatasetCarousel />
            <div css={datasetslink}>
              <Link to="/datasets">View all</Link>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
