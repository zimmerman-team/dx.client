import React from "react";
import { IconButton, Tooltip, useMediaQuery } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ReactComponent as EditIcon } from "app/modules/home-module/assets/edit.svg";
import { ReactComponent as DuplicateIcon } from "app/modules/home-module/assets/duplicate.svg";
import { ReactComponent as DeleteIcon } from "app/modules/home-module/assets/delete.svg";
import { useAuth0 } from "@auth0/auth0-react";

export default function MenuItems(props: {
  handleClose: () => void;
  owner: string;
  id: string;
  path: string;
  handleDuplicate: (id: string, type?: string) => void;
  handleDelete: (id: string) => void;
  type: "chart" | "dataset" | "report";
  top?: string;
  right?: string;
}) {
  const { user, isAuthenticated } = useAuth0();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const canEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);

  const disabledStyle = "opacity: 0.5;pointer-events: none;";

  return (
    <React.Fragment>
      <div
        onClick={(e) => {
          e.stopPropagation();
          props.handleClose();
        }}
        data-testid={`${props.type}-grid-item-menu-overlay`}
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
          top: ${props.top ?? "38px"};
          gap: 1rem;
          right: ${props.right ?? "3%"};
          z-index: 2;
          display: flex;
          height: 38px;
          padding: 0 23px;
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
        <div css={!isAuthenticated ? disabledStyle : ""}>
          <Tooltip title="Duplicate">
            <span>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  props.handleDuplicate?.(props.id as string);
                }}
                data-cy={`${props.type}-grid-item-duplicate-btn`}
                aria-label={`${props.type}-duplicate-button`}
                disabled={!isAuthenticated}
              >
                <DuplicateIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        {!isMobile && (
          <div css={!canEditDelete ? disabledStyle : ""}>
            <Link
              to={props.path}
              aria-label="edit-icon"
              onClick={(e) => e.stopPropagation()}
              data-cy={`${props.type}-grid-item-edit-btn`}
            >
              <Tooltip title="Edit">
                <EditIcon
                  css={`
                    margin-top: 4px;
                  `}
                />
              </Tooltip>
            </Link>
          </div>
        )}
        <div css={!canEditDelete ? disabledStyle : ""}>
          <Tooltip
            title="Delete"
            data-cy={`${props.type}-grid-item-delete-btn`}
          >
            <span>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  props.handleDelete(props.id as string);
                }}
                data-cy={`${props.type}-grid-item-delete-btn`}
                aria-label={`${props.type}-delete-button`}
                disabled={!canEditDelete}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
    </React.Fragment>
  );
}
