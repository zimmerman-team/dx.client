import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IconButton, useMediaQuery } from "@material-ui/core";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";
import MenuItems from "app/modules/home-module/components/AssetCollection/Datasets/menuItems";

interface Props {
  id: string;
  title: string;
  date: string;
  vizType: string;
  viz: React.ReactNode;
  isMappingValid: boolean;
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  owner: string;
  isAIAssisted: boolean;
}

export default function GridItem(props: Props) {
  const { user, isAuthenticated } = useAuth0();
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);

  const disabledStyle = "opacity: 0.5;pointer-events: none;";

  return (
    <div
      css={`
        position: relative;
      `}
    >
      <Link
        to={`/chart/${props.id}`}
        title={props.title}
        css={`
          width: 100%;
          height: 161.59px;
          display: flex;
          color: #262c34;
          background: #fff;
          position: relative;
          text-decoration: none;
          flex-direction: column;
          border: 1px solid #fff;
          padding: 12px 8px 4px 12px;
          justify-content: space-between;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
          }
        `}
        data-cy={`chart-grid-item`}
      >
        <div
          css={`
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            a {
              color: inherit;
              text-decoration: none;
            }
          `}
        >
          <div
            css={`
              width: 96%;
              margin-top: -9px;
              gap: 6px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <p
              css={`
                font-size: 14px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin-top: 6px;
                overflow: hidden;
                margin-bottom: 0;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
            >
              <b>{props.title}</b>
            </p>
            {props.isAIAssisted ? (
              <div
                css={`
                  margin-bottom: -12px;
                `}
                data-cy="chart-grid-item-ai-icon"
                data-testid="chart-grid-item-ai-icon"
              >
                <AIIcon />
              </div>
            ) : null}
          </div>
          <IconButton
            css={`
              position: absolute;
              right: -2px;
              top: 0px;
              cursor: pointer;
              &:hover {
                background: transparent;
              }
            `}
            onClick={showMenuOptions}
            data-cy="chart-grid-item-menu-btn"
            data-testid="chart-grid-item-menu-btn"
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div
          css={`
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              margin-top: 2px;
            `}
          >
            {props.viz}
          </div>
          <div
            css={`
              height: 10px;
            `}
          />
          <div
            css={`
              display: flex;
              font-size: 12px;
              justify-content: flex-end;
              align-items: center;
              gap: 3px;
              > p {
                margin: 0;
                font-size: 8.814px;
              }
            `}
          >
            <ClockIcon />
            <p>{moment(props.date).format("MMMM YYYY")}</p>
          </div>
        </div>
      </Link>
      {menuOptionsDisplay && (
        <MenuItems
          handleClose={() => setMenuOptionsDisplay(false)}
          handleDelete={() => props.handleDelete?.(props.id as string)}
          handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
          id={props.id as string}
          owner={props.owner}
          path={
            props.isMappingValid
              ? `/chart/${props.id}/customize`
              : `/chart/${props.id}/mapping`
          }
          type="dataset"
        />
      )}
    </div>
  );
}
