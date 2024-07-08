import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IconButton, Tooltip } from "@material-ui/core";
import { ReactComponent as EditIcon } from "app/modules/home-module/assets/edit.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as DeleteIcon } from "app/modules/home-module/assets/delete.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as DuplicateIcon } from "app/modules/home-module/assets/duplicate.svg";
import { ReactComponent as AIIcon } from "app/modules/chart-module/assets/ai-icon.svg";

interface Props {
  id: string;
  path: string;
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
  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);

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
                font-family: "GothamNarrow-Bold", sans-serif;
                margin-top: 6px;
                overflow: hidden;
                margin-bottom: 0;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
            >
              <b>{props.title}</b>
            </p>

            <div
              css={`
                display: ${props.isAIAssisted ? "block" : "none"};
                margin-bottom: -12px;
              `}
              data-cy="chart-grid-item-ai-icon"
            >
              <AIIcon />
            </div>
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
        <React.Fragment>
          <div
            css={`
              top: 0;
              left: 0;
              z-index: 1;
              width: 100vw;
              height: 100vh;
              position: fixed;
            `}
            onClick={() => setMenuOptionsDisplay(false)}
          />
          <div
            css={`
              top: 38px;
              gap: 1rem;
              right: 3%;
              z-index: 2;

              display: flex;
              height: 38px;
              width: 143px;
              position: absolute;
              background: #adb5bd;
              border-radius: 100px;
              align-items: center;
              justify-content: center;
              a {
                :hover {
                  svg {
                    path {
                      fill: #fff;
                    }
                  }
                }
              }
              button {
                padding: 4px;
                :hover {
                  background: transparent;
                  svg {
                    path {
                      fill: #fff;
                    }
                  }
                }
              }
            `}
          >
            <div
              css={!isAuthenticated ? "opacity: 0.5;pointer-events: none;" : ""}
            >
              <IconButton
                onClick={() => {
                  props.handleDuplicate?.(props.id);
                  setMenuOptionsDisplay(false);
                }}
              >
                <Tooltip
                  title="Duplicate"
                  data-cy="chart-grid-item-duplicate-btn"
                >
                  <DuplicateIcon />
                </Tooltip>
              </IconButton>
            </div>
            <div
              css={
                !canChartEditDelete ? "opacity: 0.5;pointer-events: none;" : ""
              }
            >
              <Link
                to={
                  props.isMappingValid
                    ? `/chart/${props.id}/customize`
                    : `/chart/${props.id}/mapping`
                }
              >
                <Tooltip title="Edit" data-cy="chart-grid-item-edit-btn">
                  <EditIcon
                    css={`
                      margin-top: 4px;
                    `}
                  />
                </Tooltip>
              </Link>
            </div>
            <div
              css={
                !canChartEditDelete ? "opacity: 0.5;pointer-events: none;" : ""
              }
            >
              <IconButton onClick={() => props.handleDelete?.(props.id)}>
                <Tooltip title="Delete" data-cy="chart-grid-item-delete-btn">
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
