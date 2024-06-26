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
import { IHeaderDetails } from "app/modules/report-module/components/right-panel/data";

interface Props {
  previewMode: boolean;
  hasReportNameFocused?: boolean;
  sethasReportNameFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  setReportName?: React.Dispatch<React.SetStateAction<string>>;
  reportName?: string;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
}

export default function HeaderBlock(props: Props) {
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useRecoilState(
    reportRightPanelViewAtom
  );
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const descriptionPlaceholder = "Add a header description";
  const headingPlaceholder = "Add a header title";
  const [headingPlaceholderState, setHeadingPlaceholderState] =
    React.useState<string>(headingPlaceholder);
  const [descriptionPlaceholderState, setDescriptionPlaceholderState] =
    React.useState<string>(descriptionPlaceholder);

  const [isReportHeadingModified, setIsReportHeadingModified] =
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
      // checks when headerDetails.heading is empty and report heading has not been focused
      if (!props.hasReportNameFocused && isReportHeadingModified) {
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

  const setDescriptionContent = (text: EditorState) => {
    props.setHeaderDetails({
      ...props.headerDetails,
      description: text,
    });
  };

  const setHeadingContent = (text: EditorState) => {
    props.setHeaderDetails({
      ...props.headerDetails,
      heading: text,
    });
    if (text.getCurrentContent().getPlainText().length > 0) {
      setIsReportHeadingModified(true);
    }
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
      setIsReportHeadingModified(true);
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
      css={headerBlockcss.container(props.headerDetails.backgroundColor)}
      {...handlers}
      data-cy="report-header-block"
      data-testid="header-block"
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
              setTextContent={setHeadingContent}
              placeholder={headingPlaceholder}
              placeholderState={headingPlaceholderState}
              setPlaceholderState={setHeadingPlaceholderState}
              textContent={props.headerDetails.heading}
              setPlugins={props.setPlugins}
              focusOnMount
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
              placeholder={descriptionPlaceholder}
              placeholderState={descriptionPlaceholderState}
              setPlaceholderState={setDescriptionPlaceholderState}
              textContent={props.headerDetails.description}
              setPlugins={props.setPlugins}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
