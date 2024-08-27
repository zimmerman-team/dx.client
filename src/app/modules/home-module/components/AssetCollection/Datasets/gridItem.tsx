import React from "react";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as EditIcon } from "app/modules/home-module/assets/edit.svg";
import { ReactComponent as DuplicateIcon } from "app/modules/home-module/assets/duplicate.svg";
import { ReactComponent as DeleteIcon } from "app/modules/home-module/assets/delete.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as DataCardImg } from "app/modules/home-module/assets/data-card-img.svg";
import { ReactComponent as InfoIcon } from "app/modules/home-module/assets/info-icon.svg";

import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreActions } from "app/state/store/hooks";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";

interface Props {
  path: string;
  title: string;
  descr: string;
  date: Date;
  showMenu?: boolean;
  handleDuplicate?: (id: string) => void;
  handleDelete?: (id: string) => void;
  id?: string;
  owner: string;
  inChartBuilder: boolean;
}

export default function GridItem(props: Readonly<Props>) {
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const [displayCreateChartButton, setDisplayCreateChartButton] =
    React.useState(false);
  const setIsAiSwitchActive = useRecoilState(isChartAIAgentActive)[1];
  const { user, isAuthenticated } = useAuth0();

  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };
  const canDatasetEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  function handleCreateNewChart() {
    setDataset(props.id as string);
    setIsAiSwitchActive(true);
  }
  let destinationPath = `/dataset/${props.id}/detail`;
  if (location.pathname === "/") {
    destinationPath += "?fromHome=true";
  }

  return (
    <div
      onMouseEnter={() => setDisplayCreateChartButton(true)}
      onMouseLeave={() => setDisplayCreateChartButton(false)}
      css={`
        position: relative;
      `}
      data-cy="dataset-grid-item"
    >
      <Link
        to={destinationPath}
        css={`
          text-decoration: none;
        `}
      >
        <div
          css={`
            width: 100%;
            height: 161.59px;
            display: flex;
            color: #262c34;
            background: #fff;

            flex-direction: column;
            padding: 12px 8px 4px 12px;
            justify-content: space-between;
            box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);

            &:hover {
              box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
            }
          `}
        >
          <div
            css={`
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                width: 90%;
                height: 50px;
                word-wrap: break-word;
              `}
            >
              <p
                title={props.title}
                css={`
                  margin-top: -5px;
                  font-size: 14px;
                  line-height: 22px;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  overflow: hidden;
                  margin-bottom: 2px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                `}
              >
                <b>{props.title}</b>
              </p>
              <p
                title={props.descr}
                css={`
                  font-size: 10px;
                  line-height: 14px;
                  margin-top: 1px;
                  color: #495057;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                `}
              >
                {props.descr}
              </p>
            </div>
            {props.showMenu && (
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
                data-cy="dataset-grid-item-menu-btn"
              >
                <MenuIcon />
              </IconButton>
            )}
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
                margin-top: 8px;
                svg {
                  width: 119.084px;
                  height: 69.761px;
                }
              `}
            >
              <DataCardImg />
            </div>
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
        </div>
      </Link>
      {displayCreateChartButton &&
        !props.inChartBuilder &&
        canDatasetEditDelete && (
          <Link
            to={{
              pathname: `/chart/new/chart-type`,
              search: "?loadataset=true",
            }}
          >
            <button
              onClick={handleCreateNewChart}
              disabled={!canDatasetEditDelete}
              css={`
                position: absolute;
                cursor: ${canDatasetEditDelete ? "pointer" : "not-allowed"};
                height: 20px;
                border-radius: 20px;
                color: #ffffff;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                right: 8px;
                bottom: 30px;
                z-index: 2;
                border: none;
                outline: none;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8.3px;
                background: #359c96;
                span {
                  margin: 0;
                  padding: 0;
                  font-size: 10px;
                }
              `}
            >
              <span>Create chart with AI</span>
              <InfoIcon />
            </button>
          </Link>
        )}
      {menuOptionsDisplay && (
        <React.Fragment>
          <div
            onClick={() => setMenuOptionsDisplay(false)}
            css={`
              top: 0;
              left: 0;
              z-index: 1;
              width: 100vw;
              height: 100vh;
              position: fixed;
            `}
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
              <Tooltip
                title="Duplicate"
                data-cy="dataset-grid-item-duplicate-btn"
              >
                <IconButton
                  onClick={() => props.handleDuplicate?.(props.id as string)}
                >
                  <DuplicateIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div
              css={
                !canDatasetEditDelete
                  ? "opacity: 0.5;pointer-events: none;"
                  : ""
              }
            >
              <Link to={props.path}>
                <Tooltip title="Edit" data-cy="dataset-grid-item-edit-btn">
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
                !canDatasetEditDelete
                  ? "opacity: 0.5;pointer-events: none;"
                  : ""
              }
            >
              <Tooltip title="Delete" data-cy="dataset-grid-item-delete-btn">
                <IconButton
                  onClick={() => props.handleDelete?.(props.id as string)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
