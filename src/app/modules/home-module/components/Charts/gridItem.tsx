import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";

interface Props {
  id: string;
  path: string;
  title: string;
  descr: string;
  date: string;
  viz: React.ReactNode;
  handleDelete?: (id: string) => void;
}

export default function GridItem(props: Props) {
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);

  const showMenuOptions = () => {
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };

  return (
    <div
      css={`
        width: 296px;
        display: flex;
        height: 125px;
        color: #262c34;
        background: #fff;
        position: relative;
        padding: 0rem 1.2rem;
        padding-bottom: 0.5rem;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;

          a {
            color: inherit;
            text-decoration: none;
          }
        `}
      >
        <div
          css={`
            width: 60%;
          `}
        >
          <Link to={`/chart/${props.id}`}>
            <p
              css={`
                font-size: 14px;
                margin-top: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 0;
              `}
            >
              <b>{props.title}</b>
            </p>
          </Link>

          <p
            css={`
              font-size: 10px;
              line-height: 12px;
              margin-top: 1px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            `}
          >
            {props.descr}
          </p>
        </div>
        <div
          css={`
            margin-top: 28px;
            width: 74px;
            height: 74px;
            path {
              fill: #868a9d;
            }
          `}
        >
          {props.viz}
        </div>
        <IconButton
          css={`
            padding: 0;
            margin-top: -30px;
          `}
          onClick={showMenuOptions}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <div
        css={`
          display: flex;
          font-size: 12px;
          justify-content: space-between;

          > p {
            margin: 0;
          }
        `}
      >
        <p>Creation date</p>
        <p>{moment(props.date).format("DD-MM-YYYY")}</p>
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
            onClick={showMenuOptions}
          />
          <div
            css={`
              top: 30%;
              gap: 1rem;
              right: 3%;
              z-index: 2;
              width: 128px;
              display: flex;
              padding: 7px 0;
              position: absolute;
              border-radius: 13px;
              background: #f4f4f4;
              align-items: center;
              justify-content: center;
            `}
          >
            <div>
              <Link to={`/chart/${props.id}/customize`}>
                <EditIcon
                  css={`
                    cursor: pointer;
                    margin-top: 6px;
                    :hover {
                      opacity: 0.5;
                    }
                  `}
                />
              </Link>
            </div>
            <div>
              <IconButton
                css={`
                  padding: 0;
                `}
                onClick={() => props.handleDelete?.(props.id as string)}
              >
                <DeleteIcon
                  css={`
                    cursor: pointer;
                    :hover {
                      opacity: 0.5;
                    }
                  `}
                />
              </IconButton>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
