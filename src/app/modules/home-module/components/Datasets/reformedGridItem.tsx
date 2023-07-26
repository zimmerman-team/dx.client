import React from "react";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as EditIcon } from "app/modules/home-module/assets/edit.svg";
import { ReactComponent as DeleteIcon } from "app/modules/home-module/assets/delete.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";

import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";

interface Props {
  path: string;
  title: string;
  descr: string;
  date: Date;
  showMenu?: boolean;
  handleDelete?: (id: string) => void;
  id?: string;
}

export default function ReformedGridItem(props: Props) {
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);

  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };

  return (
    <div
      css={`
        width: 100%;
        height: 220px;
        display: flex;
        color: #262c34;
        background: #fff;
        position: relative;
        padding: 12px 16px;
        flex-direction: column;
        justify-content: space-between;
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
            height: 77px;
            word-wrap: break-word;
          `}
        >
          <p
            css={`
              margin-top: 0;
              font-size: 18px
              line-height: 22px;
              font-family: 'Gotham Narrow', sans-serif;
              overflow: hidden;
              margin-bottom: 2px;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}
          >
            <b>{props.title}</b>
          </p>
          <p
            css={`
              font-size: 12px;
              line-height: 14px;
              margin-top: 1px;
              color: #495057;
            `}
          >
            {props.descr}
          </p>
        </div>
        {props.showMenu && (
          <IconButton
            css={`
              padding: 0;
              margin-top: 5px;
            `}
            onClick={showMenuOptions}
          >
            <MenuIcon />
          </IconButton>
        )}
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
          }
        `}
      >
        <ClockIcon />
        <p>{moment(props.date).format("MMMM YYYY")}</p>
      </div>
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
              width: 100px;
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
            <div>
              <Link to="#">
                <Tooltip title="Edit">
                  <EditIcon
                    css={`
                      margin-top: 4px;
                    `}
                  />
                </Tooltip>
              </Link>
            </div>
            <div>
              <IconButton
                onClick={() => props.handleDelete?.(props.id as string)}
              >
                <Tooltip title="Delete">
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
