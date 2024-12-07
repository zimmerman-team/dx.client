import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { EditorState } from "draft-js";
import { useMediaQuery } from "@material-ui/core";
import MenuItems from "app/modules/home-module/components/AssetCollection/Datasets/menuItems";

interface Props {
  date: Date;
  id?: string;
  heading: EditorState;
  name: string;
  color: string;
  viz: JSX.Element;
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  showMenuButton?: boolean;
  owner: string;
}

export default function GridItem(props: Readonly<Props>) {
  const { user, isAuthenticated } = useAuth0();
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };
  const canStoryEditDelete = React.useMemo(() => {
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
        to={`/story/${props.id}`}
        css={`
          width: 100%;
          height: 161.59px;
          padding: 12px;
          display: flex;
          color: #262c34;
          background: #fff;
          position: relative;
          text-decoration: none;
          flex-direction: column;
          border: 1px solid #fff;
          align-items: space-between;
          justify-content: space-between;
          transition: box-shadow 0.2s ease-in-out;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
          }
        `}
        data-cy="story-grid-item"
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
              width: 80%;
              margin-top: -7px;
            `}
          >
            <p
              title={props.heading.getCurrentContent().getPlainText()}
              css={`
                font-size: 14px;
                line-height: 22px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin-top: 2px;

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 0;
              `}
            >
              <b>{props.heading.getCurrentContent().getPlainText()}</b>
            </p>
            <p
              title={props.name}
              css={`
                font-size: 10px;
                line-height: 14px;
                font-family: "Gotham Narrow ", "Helvetica Neue", sans-serif;
                margin-top: 1px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                color: #495057;
              `}
            >
              {props.name}
            </p>
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
            aria-label="story-menu-button"
            onClick={showMenuOptions}
            data-cy="story-grid-item-menu-btn"
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div
          css={`
            margin-top: 4px;
            position: absolute;
            bottom: -8px;
            svg {
              width: 119.722px;
              height: 83.717px;
            }
            rect:nth-of-type(2) {
              fill: ${props.color || "#231d2c"};
            }

            ${props.showMenuButton &&
            `
            bottom: -5px;
            transform: scale(0.7);
            transform-origin: left bottom;
          `}
          `}
        >
          {props.viz}
        </div>
        <div
          css={`
            position: absolute;
            bottom: 4px;
            right: 3%;
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
      </Link>
      {menuOptionsDisplay && (
        <MenuItems
          handleClose={() => setMenuOptionsDisplay(false)}
          handleDelete={() => props.handleDelete?.(props.id as string)}
          handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
          id={props.id as string}
          owner={props.owner}
          path={`/story/${props.id}/edit`}
          type="story"
        />
      )}
    </div>
  );
}
