import React from "react";
import get from "lodash/get";
import { useDrop } from "react-dnd";
import { ContentState, EditorState } from "draft-js";
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
import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";

interface Props {
  isToolboxOpen: boolean;
  previewMode: boolean;
  hasReportNameFocused?: boolean;
  isReportHeadingModified?: boolean;
  sethasReportNameFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  setReportName?: React.Dispatch<React.SetStateAction<string>>;
  reportName?: string;
  handleRightPanelOpen: () => void;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
}

export default function HeaderBlock(props: Props) {
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const [currentView, setCurrentView] = useRecoilState(
    reportRightPanelViewAtom
  );
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const descriptionPlaceholder = "Add a header description";
  const headingPlaceholder = "Add a header title";
  const [headingPlaceholderState, setHeadingPlaceholderState] =
    React.useState<string>(headingPlaceholder);
  const [charCount, setCharCount] = React.useState<null | number>(null);
  const [maxCharCount, setMaxCharCount] = React.useState(50);
  const [isHeadingFocused, setIsHeadingFocused] = React.useState(true);
  const [isDescriptionFocused, setIsDescriptionFocused] = React.useState(false);
  const [updateCharCount, setUpdateCharCount] = React.useState(false);
  const [descriptionPlaceholderState, setDescriptionPlaceholderState] =
    React.useState<string>(descriptionPlaceholder);

  const viewOnlyMode =
    page !== "new" && get(location.pathname.split("/"), "[3]", "") !== "edit";
  const handlers = viewOnlyMode
    ? {}
    : {
        onMouseEnter: () => setHandleDisplay(true),
        onMouseLeave: () => setHandleDisplay(false),
      };

  React.useEffect(() => {
    const plainText = getPlainTextFromEditorState(props.headerDetails.heading);
    if (charCount === null && props.headerDetails.isUpdated) {
      setCharCount(plainText.length);
      setUpdateCharCount(true);
      setMaxCharCount(50);
    }
  }, [props.headerDetails.isUpdated]);

  //handles report name state
  const [,] = useDebounce(
    () => {
      // checks when headerDetails.heading is empty and report heading has not been focused
      if (!props.hasReportNameFocused && props.isReportHeadingModified) {
        props.setReportName?.(
          props.headerDetails.heading.getCurrentContent().getPlainText()
        );
      }
    },
    500,
    [props.headerDetails.heading]
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
  const getPlainTextFromEditorState = (text: EditorState) => {
    return text.getCurrentContent().getPlainText();
  };

  const setTextContent = (
    text: EditorState,
    propsState: EditorState,
    type: "heading" | "description"
  ) => {
    let max = type === "heading" ? 50 : 250;
    setMaxCharCount(max);
    const plainText = getPlainTextFromEditorState(text);
    const plainDescr = getPlainTextFromEditorState(propsState);
    if (plainText.length <= max) {
      if (updateCharCount) {
        setCharCount(plainText.length);
      }
      if (type === "heading") {
        props.setHeaderDetails({
          ...props.headerDetails,
          heading: text,
        });
      } else {
        props.setHeaderDetails({
          ...props.headerDetails,
          description: text,
        });
      }
    } else {
      if (type === "heading") {
        props.setHeaderDetails({
          ...props.headerDetails,
          heading: EditorState.moveFocusToEnd(propsState),
        });
      } else {
        props.setHeaderDetails({
          ...props.headerDetails,
          description: EditorState.moveFocusToEnd(propsState),
        });
      }
      setCharCount(plainDescr.length);
    }
  };

  const onEdit = () => {
    setCurrentView("editHeader");
    props.handleRightPanelOpen();
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
        data-testid="drop-area"
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
      css={headerBlockcss.container(
        props.headerDetails.backgroundColor,
        props.isToolboxOpen
      )}
      {...handlers}
      data-cy="report-header-block"
      data-testid="header-block"
    >
      <div
        css={`
          position: absolute;
          right: ${props.isToolboxOpen ? "404px" : "4px"};
          top: 4px;
          color: #ffffff;
          display: ${props.previewMode ||
          (!isDescriptionFocused && !isHeadingFocused)
            ? "none"
            : "block"};
        `}
      >
        {charCount} / {maxCharCount}
      </div>
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
            @media (max-width: 881px) {
              top: 16.5px;
              svg {
                rect {
                  height: 91%;
                }
              }
            }
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
            <IconButton
              onClick={onEdit}
              id="edit-header-icon"
              data-testid="edit-header-button"
            >
              <Tooltip title="Edit" placement="right">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={onRemove}
              id="delete-header-icon"
              data-testid="delete-header-button"
            >
              <Tooltip title="Remove header" placement="right">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </div>
        </div>
      )}
      <Container maxWidth="lg">
        <div css={headerBlockcss.innerContainer}>
          <div
            css={`
              width: 60%;
              overflow-y: hidden;
              color: ${props.headerDetails.titleColor} !important;
              font-size: 29px;
              min-width: 600px;
              line-height: 16.8px;
              background: inherit;
              position: relative;
              letter-spacing: 0.692603px;
              ${props.previewMode && "pointer-events: none;"}

              ::placeholder {
                color: ${props.headerDetails.titleColor};
              }

              > div {
                padding: 0;
                .public-DraftEditorPlaceholder-inner {
                  position: absolute;
                  color: ${props.headerDetails.titleColor};
                  opacity: 0.5;
                  font-size: 29px; !important;
                  font-family: "GothamNarrow-Bold", sans-serif;
                }
                span {
                  font-family: "GothamNarrow-Bold", sans-serif;
                }
                > div {
                  > div {
                    > div {
                      font-family: "GothamNarrow-Bold", sans-serif;

                      min-height: 32px !important;
                    }
                  }
                }
              }
            `}
          >
            <RichEditor
              invertColors
              editMode={!props.previewMode}
              setTextContent={(text) =>
                setTextContent(text, props.headerDetails.heading, "heading")
              }
              placeholder={headingPlaceholder}
              placeholderState={headingPlaceholderState}
              setPlaceholderState={setHeadingPlaceholderState}
              textContent={props.headerDetails.heading}
              setPlugins={props.setPlugins}
              focusOnMount
              onBlur={() => {
                setIsHeadingFocused(false);
                if (!props.isReportHeadingModified && props.reportName === "") {
                  props.setReportName?.("Untitled Report");
                }
              }}
              onFocus={() => {
                setIsHeadingFocused(true);
              }}
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
              @media (max-width: 1024px) {
                width: 100%;
              }
              @media (max-width: 600px) {
                max-height: 100%;
                overflow-y: hidden;
                display: -webkit-box;
                width: 100%;
                min-width: unset;
                -webkit-line-clamp: 6;
                -webkit-box-orient: vertical;
              }
            `}
          >
            <RichEditor
              invertColors
              editMode={true}
              setTextContent={(text) =>
                setTextContent(
                  text,
                  props.headerDetails.description,
                  "description"
                )
              }
              placeholder={descriptionPlaceholder}
              placeholderState={descriptionPlaceholderState}
              setPlaceholderState={setDescriptionPlaceholderState}
              textContent={props.headerDetails.description}
              setPlugins={props.setPlugins}
              onBlur={() => {
                setIsDescriptionFocused(false);
              }}
              onFocus={() => {
                setIsDescriptionFocused(true);
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
