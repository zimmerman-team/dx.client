import React from "react";
import get from "lodash/get";
import { useDrop } from "react-dnd";
import { EditorState } from "draft-js";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import { useLocation, useParams } from "react-router-dom";
import { reportRightPanelViewAtom } from "app/state/recoil/atoms";
import { RichEditor } from "app/modules/common/RichEditor";
import { ReactComponent as EditIcon } from "app/modules/report-module/asset/editIcon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/report-module/asset/deleteIcon.svg";
import { headerBlockcss } from "app/modules/report-module/sub-module/components/headerBlock/style";
import { ReactComponent as HeaderHandlesvg } from "app/modules/report-module/asset/header-handle.svg";
import { Tooltip } from "@material-ui/core";
import useDebounce from "react-use/lib/useDebounce";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

interface Props {
  previewMode: boolean;
  hasSubHeaderTitleFocused?: boolean;
  setHasSubHeaderTitleFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  setReportName?: React.Dispatch<React.SetStateAction<string>>;
  reportName?: string;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  isEditorFocused: boolean;
  setIsEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
  headerDetails: {
    title: string;
    showHeader: boolean;
    description: EditorState;
    createdDate: Date;
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    dateColor: string;
  };
  setHeaderDetails: React.Dispatch<
    React.SetStateAction<{
      title: string;
      showHeader: boolean;
      description: EditorState;
      backgroundColor: string;
      titleColor: string;
      descriptionColor: string;
      dateColor: string;
    }>
  >;
}

export default function HeaderBlock(props: Props) {
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useRecoilState(
    reportRightPanelViewAtom
  );
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const placeholder = "Add a header description";
  const [descriptionPlaceholderState, setDescriptionPlaceholderState] =
    React.useState<string>(placeholder);

  const [isReportTitleModified, setIsReportTitleModified] =
    React.useState(false);

  const viewOnlyMode =
    page !== "new" && get(location.pathname.split("/"), "[3]", "") !== "edit";
  const handlers = viewOnlyMode
    ? {}
    : {
        onMouseEnter: () => setHandleDisplay(true),
        onMouseLeave: () => setHandleDisplay(false),
      };
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  //handles report name state
  const [,] = useDebounce(
    () => {
      // checks when headerDetails.title is empty and report title has not been focused
      if (!props.hasSubHeaderTitleFocused && isReportTitleModified) {
        props.setReportName?.(props.headerDetails.title);
      }
    },
    500,
    [props.headerDetails.title]
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "header",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
    drop: () => {
      props.setHeaderDetails({
        ...props.headerDetails,
        showHeader: true,
      });
    },
  }));

  const setDescriptionContent = (text: EditorState) => {
    props.setHeaderDetails({
      ...props.headerDetails,
      description: text,
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    props.setHeaderDetails({
      ...props.headerDetails,
      [name]: value,
    });
    if (name == "title") {
      setIsReportTitleModified(true);
    }
  };

  const onEdit = () => {
    setCurrentView("editHeader");
  };

  const onRemove = () => {
    props.setHeaderDetails({
      ...props.headerDetails,
      showHeader: false,
    });
  };

  if (!props.headerDetails.showHeader) {
    return (
      <div
        ref={drop}
        css={`
          z-index: 1;
          width: 100%;
          height: 50px;
          position: absolute;
          background-color: ${isOver ? " #262C34;" : "transparent"};
        `}
      />
    );
  }

  return (
    <div
      css={headerBlockcss.container(props.headerDetails.backgroundColor)}
      {...handlers}
      data-cy="report-header-block"
    >
      {(handleDisplay || currentView === "editHeader") && (
        <div
          css={`
            top: -2.5px;
            left: 0;
            height: 100%;
            display: flex;
            gap: 4px;
            z-index: 101;
            position: absolute;
          `}
        >
          <HeaderHandlesvg />
          <div
            css={`
              width: 22px;
              height: 53px;
              margin: auto;
              display: ${currentView === "editHeader" ? "none" : "flex"};
              margin-left: 10px;
              align-items: center;
              background: #adb5bd;
              border-radius: 100px;
              flex-direction: column;
              justify-content: center;

              button {
                padding: 4px;
                :hover {
                  background: transparent;
                  svg {
                    path {
                      fill: #fff;
                    }
                    circle {
                      stroke: #fff;
                    }
                  }
                }
              }
            `}
          >
            <IconButton onClick={onEdit} id="edit-header-icon">
              <Tooltip title="Edit" placement="right">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton onClick={onRemove} id="delete-header-icon">
              <Tooltip title="Remove header" placement="right">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </div>
        </div>
      )}
      <Container maxWidth="lg">
        <div css={headerBlockcss.innerContainer}>
          <div>
            <input
              ref={inputRef}
              name="title"
              type="text"
              placeholder="Add a header title"
              onChange={handleChange}
              disabled={props.previewMode}
              value={props.headerDetails.title}
              css={headerBlockcss.inputStyle(props.headerDetails.titleColor)}
              data-cy="report-header-block-title-input"
            />
          </div>

          <Box height={17} />
          <div
            css={`
              width: 60%;
              max-height: 90px;
              overflow-y: hidden;
              color: ${props.headerDetails.descriptionColor} !important;
              font-size: 14px;
              font-weight: 400;
              min-width: 600px;
              line-height: 16.8px;
              background: inherit;
              position: relative;
              letter-spacing: 0.692603px;
              ${props.previewMode && "pointer-events: none;"}

              ::placeholder {
                color: ${props.headerDetails.descriptionColor};
              }

              > div {
                padding: 0;
                .public-DraftEditorPlaceholder-inner {
                  position: absolute;
                  color: #ffffff;

                  font-weight: 325;
                  font-size: 14px !important;
                }
                > div {
                  > div {
                    > div {
                      min-height: 90px !important;
                    }
                  }
                }
              }
            `}
          >
            <RichEditor
              invertColors
              editMode={true}
              setTextContent={setDescriptionContent}
              placeholder={placeholder}
              placeholderState={descriptionPlaceholderState}
              setPlaceholderState={setDescriptionPlaceholderState}
              textContent={props.headerDetails.description}
              setPlugins={props.setPlugins}
              isEditorFocused={props.isEditorFocused}
              setIsEditorFocused={props.setIsEditorFocused}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
