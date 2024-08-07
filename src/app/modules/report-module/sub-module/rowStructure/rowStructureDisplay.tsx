import React, { useRef, useState } from "react";
import get from "lodash/get";
import { useDrop } from "react-dnd";
import { useDebounce } from "react-use";
import { useOnClickOutside } from "usehooks-ts";
import Tooltip from "@material-ui/core/Tooltip";
import { NumberSize, Resizable } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import IconButton from "@material-ui/core/IconButton";
import { EditorState } from "draft-js";
import { useStoreActions } from "app/state/store/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { RichEditor } from "app/modules/common/RichEditor";
import { ReportChartWrapper } from "app/modules/report-module/components/chart-wrapper";
import { ReactComponent as EditIcon } from "app/modules/report-module/asset/editIcon.svg";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import { ReactComponent as DeleteIcon } from "app/modules/report-module/asset/deleteIcon.svg";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import {
  chartFromReportAtom,
  reportContentIsResizingAtom,
  reportContentContainerWidth,
  unSavedReportPreviewModeAtom,
  isChartDraggingAtom,
} from "app/state/recoil/atoms";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { css } from "styled-components";
import { Updater } from "use-immer";

interface RowStructureDisplayProps {
  gap: string;
  height: number;
  rowIndex: number;
  rowId: string;
  selectedType: string;
  framesArray: IFramesArray[];
  selectedTypeHistory: string[];
  rowContentWidths: number[];
  rowContentHeights: number[];
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  updateFramesArray: Updater<IFramesArray[]>;
  deleteFrame: (id: string) => void;
  setSelectedTypeHistory: React.Dispatch<React.SetStateAction<string[]>>;
  rowStructureDetailItems: {
    rowId: string;
    width: number;
    factor: number;
    rowType: string;
  }[];
  previewItems?: (string | object)[];
  onRowBoxItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  onSave: (type: "create" | "edit") => Promise<void>;
}

export default function RowstructureDisplay(props: RowStructureDisplayProps) {
  const ref = useRef(null);
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const [reportPreviewMode] = useRecoilState(unSavedReportPreviewModeAtom);

  const viewOnlyMode =
    (page !== "new" &&
      get(location.pathname.split("/"), "[3]", "") !== "edit") ||
    reportPreviewMode;

  const handlers = viewOnlyMode
    ? {}
    : {
        onMouseEnter: () => {
          setHandleDisplay(true);
        },
      };
  const resetRowSizes = () => {
    const rowSizes = [
      {
        type: "oneByOne",
        width: [100],
        height: [400],
      },
      {
        type: "oneByTwo",
        width: [50, 50],
        height: [420, 420],
      },
      {
        type: "oneByThree",
        width: [33.33, 33.33, 33.33],
        height: [460, 460, 460],
      },
      {
        type: "oneByFour",
        width: [25, 25, 25, 25],
        height: [122, 122, 122, 122],
      },
      {
        type: "oneByFive",
        width: [20, 20, 20, 20, 20],
        height: [142, 142, 142, 142, 142],
      },
    ];
    props.updateFramesArray((draft) => {
      const rowStructure = draft[props.rowIndex].structure;
      const defaultWidths =
        rowSizes.find((row) => row.type === rowStructure)?.width ?? [];
      const defaultHeights =
        rowSizes.find((row) => row.type === rowStructure)?.height ?? [];
      draft[props.rowIndex].contentWidths = defaultWidths;
      draft[props.rowIndex].contentHeights = defaultHeights;
    });
  };

  useOnClickOutside(ref, () => setHandleDisplay(false));

  const border =
    !viewOnlyMode && handleDisplay
      ? "0.722415px dashed  #ADB5BD"
      : "0.722415px dashed transparent";

  return (
    <div
      ref={ref}
      css={`
        width: 100%;
        height: 100%;
        position: relative;
        margin-bottom: ${!viewOnlyMode ? "0px" : "16px"};
      `}
    >
      <div
        {...handlers}
        css={`
          width: 100%;
          height: 100%;
        `}
      >
        {handleDisplay && (
          <div
            css={`
              width: 32px;
              left: -3rem;
              display: flex;
              position: absolute;
              height: calc(100% + 8px);
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
              `}
            >
              <div
                css={`
                  background: #adb5bd;
                  border-radius: 100px;
                  height: 75px;
                  width: 22px;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  flex-direction: column;

                  padding-bottom: 2px;
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
                <IconButton onClick={() => resetRowSizes()}>
                  <Tooltip
                    title="Go back to default placeholder size"
                    placement="right"
                  >
                    <ZoomOutMapIcon fontSize={"small"} htmlColor="#231D2C" />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    props.setSelectedTypeHistory([
                      ...props.selectedTypeHistory,
                      props.selectedType,
                      "",
                    ]);
                  }}
                  data-cy="edit-row-structure-button"
                >
                  <Tooltip title="Edit" placement="right">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => props.deleteFrame(props.rowId)}>
                  <Tooltip title="Delete" placement="right">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          </div>
        )}
        <div
          css={`
            width: 100%;
            height: 100%;
            display: flex;
            overflow: hidden;
            gap: ${props.gap};
            border: ${border};
          `}
          data-cy={`row-frame-${props.rowIndex}`}
        >
          {props.rowStructureDetailItems.map((row, index) => (
            <Box
              key={row.rowId}
              width={get(props.rowContentWidths, `[${index}]`, "fit-content")}
              height={get(props.rowContentHeights, `[${index}]`, props.height)}
              itemIndex={index}
              rowId={props.rowId}
              rowIndex={props.rowIndex}
              rowType={row.rowType}
              onRowBoxItemResize={props.onRowBoxItemResize}
              updateFramesArray={props.updateFramesArray}
              previewItem={get(props.previewItems, `[${index}]`, undefined)}
              rowItemsCount={props.rowStructureDetailItems.length}
              setPlugins={props.setPlugins}
              onSave={props.onSave}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const Box = (props: {
  width: number;
  height: number;
  rowId: string;
  rowIndex: number;
  itemIndex: number;
  rowType: string;
  setPlugins?: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  updateFramesArray: Updater<IFramesArray[]>;
  rowItemsCount: number;
  previewItem?: string | any;
  onSave: (type: "create" | "edit") => Promise<void>;
  onRowBoxItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
}) => {
  const location = useLocation();
  const history = useHistory();
  const { page, view } = useParams<{ page: string; view: string }>();

  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  const [chartError, setChartError] = React.useState(false);
  const setLoadedChart = useStoreActions(
    (state) => state.charts.ChartGet.setCrudData
  );
  const setCreateChartData = useStoreActions(
    (state) => state.charts.ChartCreate.setCrudData
  );
  const isChartDragging = useRecoilValue(isChartDraggingAtom);
  const setChartFromReport = useRecoilState(chartFromReportAtom)[1];
  const resetMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );
  const [chartId, setChartId] = React.useState<string | null>(null);

  const [displayMode, setDisplayMode] = useState<
    "chart" | "text" | "image" | "video" | null
  >(null);

  const [textContent, setTextContent] = React.useState<EditorState>(
    EditorState.createEmpty()
  );

  const [videoContent, setVideoContent] = React.useState<{
    videoId: string;
    embedUrl: string;
    snippet: any;
    source: "youtube";
  }>();

  const [imageContent, setImageContent] = React.useState<{
    imageId: string;
    imageUrl: string;
    source: "shutterstock";
    thumbnail: string;
  }>();

  const [displayBoxIcons, setDisplayBoxIcons] = React.useState(false);
  const placeholder = "Add your story...";
  const [textPlaceholderState, setTextPlaceholderState] =
    React.useState<string>(placeholder);

  const handleEditChart = () => {
    setChartFromReport({
      state: true,
      view,
      page,
      action: "edit",
      chartId: null,
    });
    setDataset(null);
    setLoadedChart(null);
    setCreateChartData(null);
    resetMapping();

    //save report before exiting
    props.onSave("edit");
    history.push(`/chart/${chartId}/mapping`);
  };

  const handleRowFrameItemAddition = (
    rowId: string,
    itemIndex: number,
    itemContent: string | any,
    itemContentType: "text" | "divider" | "chart" | "image" | "video",
    textHeight?: number
  ) => {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === rowId);
      if (frameId === -1) {
        return [...draft];
      }
      draft[frameId].content[itemIndex] = itemContent;
      draft[frameId].contentTypes[itemIndex] = itemContentType;
      const heights = draft[frameId].contentHeights;
      if (textHeight) {
        //relative to the text content, we only want to increase the height of textbox
        if (textHeight > heights[itemIndex]) {
          heights[itemIndex] = textHeight;
        }
      }
    });
  };
  const handleRowFrameItemRemoval = (rowId: string, itemIndex: number) => {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === rowId);
      if (frameId === -1) {
        return [...draft];
      }

      draft[frameId].content[itemIndex] = null;
      draft[frameId].contentTypes[itemIndex] = null;
    });
  };

  const containerWidth = useRecoilValue(reportContentContainerWidth);
  const [reportPreviewMode] = useRecoilState(unSavedReportPreviewModeAtom);
  const [_isResizing, setIsResizing] = useRecoilState(
    reportContentIsResizingAtom
  );

  const viewOnlyMode =
    (page !== "new" &&
      get(location.pathname.split("/"), "[3]", "") !== "edit") ||
    reportPreviewMode;

  const elementTypes = [
    ReportElementsType.TEXT,
    ReportElementsType.BIG_NUMBER,
    ReportElementsType.CHART,
    ReportElementsType.IMAGE,
    ReportElementsType.VIDEO,
  ];

  const [{ isOver }, drop] = useDrop(() => ({
    accept:
      props.rowType === "oneByFive"
        ? elementTypes
        : elementTypes.filter((type) => type !== ReportElementsType.BIG_NUMBER),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
    drop: (item: any, monitor) => {
      if (item.type === ReportElementsType.TEXT) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          textContent,
          "text"
        );
        setDisplayMode("text");
      } else if (
        item.type === ReportElementsType.CHART ||
        item.type === ReportElementsType.BIG_NUMBER
      ) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          item.value,
          "chart"
        );
        setChartId(item.value);
        setDisplayMode("chart");
        monitor.getDropResult();
      } else if (item.type === ReportElementsType.VIDEO) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          item.value,
          "video"
        );
        setVideoContent(item.value);
        setDisplayMode("video");
      } else if (item.type === ReportElementsType.IMAGE) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          item.value,
          "image"
        );
        setImageContent(item.value);
        setDisplayMode("image");
      }
    },
  }));
  const textResizableRef = React.useRef<HTMLDivElement>(null);
  const editorHeight = textResizableRef.current?.clientHeight;

  const firstUpdate = useRef(true);

  const [,] = useDebounce(
    () => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }

      if (displayMode === "text") {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          textContent,
          "text",
          editorHeight
        );
      }
    },
    300,
    [textContent, editorHeight]
  );

  React.useEffect(() => {
    if (displayMode === "chart" && chartId) {
      handleRowFrameItemAddition(
        props.rowId,
        props.itemIndex,
        chartId,
        "chart"
      );
    } else if (displayMode === "video") {
      handleRowFrameItemAddition(
        props.rowId,
        props.itemIndex,
        videoContent,
        "video"
      );
    } else if (displayMode === "image") {
      handleRowFrameItemAddition(
        props.rowId,
        props.itemIndex,
        imageContent,
        "image"
      );
    }
  }, [chartId, displayMode, imageContent, videoContent]);

  let width = `${props.width}%`;
  if (containerWidth) {
    width = `${
      containerWidth * (props.width / 100) -
      ((props.rowItemsCount - 1) * 11.3) / props.rowItemsCount
    }px`;
  }

  const onResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    let newWidth = elementRef.offsetWidth;
    let newHeight = elementRef.offsetHeight;
    props.onRowBoxItemResize(props.rowId, props.itemIndex, newWidth, newHeight);
    setIsResizing(false);
  };

  const onResize = () => {
    setIsResizing(true);
  };

  const content = React.useMemo(() => {
    if (displayMode === "text") {
      return (
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{ width: width, height: `${props.height}px` }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottom: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
          css={`
            background: #fff;
            overflow: hidden;
            position: relative;

            div {
              ${viewOnlyMode && "cursor: default;"}
            }
          `}
        >
          <div
            ref={textResizableRef}
            onMouseEnter={() => setDisplayBoxIcons(true)}
            onMouseLeave={() => setDisplayBoxIcons(false)}
            data-cy={`row-frame-text-item-${props.rowIndex}-${props.itemIndex}`}
          >
            {!viewOnlyMode && displayBoxIcons && (
              <IconButton
                onClick={() => {
                  setDisplayMode(null);
                  setChartId(null);
                  setTextContent(EditorState.createEmpty());
                  handleRowFrameItemRemoval(props.rowId, props.itemIndex);
                }}
                css={`
                  top: 12px;
                  z-index: 1;
                  right: 12px;
                  position: absolute;
                  padding: 4px;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: #adb5bd;

                  :hover {
                    background: #adb5bd;
                    svg {
                      path {
                        fill: #fff;
                      }
                    }
                  }
                `}
                data-cy="delete-item-button"
              >
                <DeleteIcon />
              </IconButton>
            )}

            <RichEditor
              fullWidth
              editMode={!viewOnlyMode}
              textContent={textContent}
              setTextContent={setTextContent}
              setPlugins={props.setPlugins}
              placeholder={placeholder}
              setPlaceholderState={setTextPlaceholderState}
              placeholderState={textPlaceholderState}
            />
          </div>
        </Resizable>
      );
    }

    if (displayMode === "chart" && chartId) {
      return (
        <Resizable
          key={chartId}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{ width: width, height: `${props.height}px` }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottom: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
        >
          <div
            css={`
              height: 100%;
              position: relative;
              padding: ${props.rowType === "oneByFive" ? "0" : "24px"};
              background: #fff;
            `}
            onMouseEnter={() => setDisplayBoxIcons(true)}
            onMouseLeave={() => setDisplayBoxIcons(false)}
            onFocus={() => setDisplayBoxIcons(true)}
            onBlur={() => setDisplayBoxIcons(false)}
            data-cy={`row-frame-chart-item-${props.rowIndex}-${props.itemIndex}`}
          >
            {!viewOnlyMode && displayBoxIcons && (
              <div>
                <IconButton
                  onClick={() => {
                    setDisplayMode(null);
                    setChartId(null);
                    setTextContent(EditorState.createEmpty());
                    handleRowFrameItemRemoval(props.rowId, props.itemIndex);
                  }}
                  css={`
                    top: 12px;
                    z-index: 1;
                    right: 12px;
                    position: absolute;
                    padding: 4px;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #adb5bd;
                    :hover {
                      background: #adb5bd;
                      svg {
                        path {
                          fill: #fff;
                        }
                      }
                    }
                  `}
                  data-cy="delete-item-button"
                >
                  <Tooltip title="Delete Chart">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={handleEditChart}
                  data-cy="edit-chart-button"
                  css={`
                    top: 12px;
                    z-index: 1;
                    right: 39px;
                    position: absolute;
                    visibility: ${chartError ? "hidden" : "visible"};
                    padding: 4px;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #adb5bd;
                    :hover {
                      background: #adb5bd;
                      svg {
                        path {
                          fill: #fff;
                        }
                      }
                    }
                  `}
                >
                  <Tooltip title="Edit Chart">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              </div>
            )}
            <ReportChartWrapper
              id={chartId}
              width={width.slice(0, -2)}
              error={chartError}
              setError={setChartError}
            />
          </div>
        </Resizable>
      );
    }

    if (displayMode === "video") {
      return (
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{ width: width, height: `${props.height}px` }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottom: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
          css={`
            background: #fff;
            overflow: hidden;
            position: relative;

            div {
              ${viewOnlyMode && "cursor: default;"}
            }
          `}
        >
          <div
            onMouseEnter={() => setDisplayBoxIcons(true)}
            onMouseLeave={() => setDisplayBoxIcons(false)}
            data-cy={`row-frame-video-item-${props.rowIndex}-${props.itemIndex}`}
          >
            {!viewOnlyMode && displayBoxIcons && (
              <IconButton
                onClick={() => {
                  setDisplayMode(null);
                  setChartId(null);
                  setTextContent(EditorState.createEmpty());
                  handleRowFrameItemRemoval(props.rowId, props.itemIndex);
                }}
                css={`
                  top: 12px;
                  z-index: 1;
                  right: 12px;
                  position: absolute;
                  padding: 4px;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: #adb5bd;

                  :hover {
                    background: #adb5bd;
                    svg {
                      path {
                        fill: #fff;
                      }
                    }
                  }
                `}
                data-cy="delete-item-button"
              >
                <DeleteIcon />
              </IconButton>
            )}
            <iframe
              title="Video Content"
              src={videoContent?.embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              css={css`
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                border: none;
                box-shadow: none;
              `}
              data-cy="report-video-content"
            ></iframe>
          </div>
        </Resizable>
      );
    }

    if (displayMode === "image") {
      return (
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{ width: width, height: `${props.height}px` }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottom: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
          css={`
            background: #fff;
            overflow: hidden;
            position: relative;

            div {
              ${viewOnlyMode && "cursor: default;"}
            }
          `}
        >
          <div
            onMouseEnter={() => setDisplayBoxIcons(true)}
            onMouseLeave={() => setDisplayBoxIcons(false)}
            data-cy={`row-frame-image-item-${props.rowIndex}-${props.itemIndex}`}
          >
            {!viewOnlyMode && displayBoxIcons && (
              <IconButton
                onClick={() => {
                  setDisplayMode(null);
                  setChartId(null);
                  setTextContent(EditorState.createEmpty());
                  handleRowFrameItemRemoval(props.rowId, props.itemIndex);
                }}
                css={`
                  top: 12px;
                  z-index: 1;
                  right: 12px;
                  position: absolute;
                  padding: 4px;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: #adb5bd;

                  :hover {
                    background: #adb5bd;
                    svg {
                      path {
                        fill: #fff;
                      }
                    }
                  }
                `}
                data-cy="delete-item-button"
              >
                <DeleteIcon />
              </IconButton>
            )}
            <img
              src={imageContent?.imageUrl}
              alt={imageContent?.imageId}
              css={css`
                width: 100%;
                height: ${props.height}px;
                object-fit: cover;
              `}
              data-cy="report-image-content"
            />
          </div>
        </Resizable>
      );
    }

    return null;
  }, [
    displayMode,
    chartId,
    textContent,
    viewOnlyMode,
    displayBoxIcons,
    width,
    props.height,
    chartError,
  ]);

  React.useEffect(() => {
    if (props.previewItem) {
      if (typeof props.previewItem === "string") {
        setChartId(props.previewItem);
        setDisplayMode("chart");
      } else if (get(props.previewItem, "embedUrl", null)) {
        setVideoContent(props.previewItem);
        setDisplayMode("video");
      } else if (get(props.previewItem, "imageUrl", null)) {
        setImageContent(props.previewItem);
        setDisplayMode("image");
      } else {
        setTextContent(props.previewItem);
        setDisplayMode("text");
      }
    }
  }, [props.previewItem]);

  let border = "none";
  if (isOver) {
    border = "1px solid #231d2c";
  } else if (isChartDragging === "bigNumber" && props.rowType === "oneByFive") {
    border = "1px dashed #231d2c";
  } else if (isChartDragging === "chart" && props.rowType !== "oneByFive") {
    border = "1px dashed #231d2c";
  }

  return (
    content ?? (
      <Resizable
        grid={[5, 5]}
        onResize={onResize}
        onResizeStop={onResizeStop}
        size={{ width: width, height: `${props.height}px` }}
        maxWidth={!viewOnlyMode ? containerWidth : undefined}
        minWidth={78}
        enable={{
          right: !viewOnlyMode,
          bottom: !viewOnlyMode,
          bottomRight: !viewOnlyMode,
        }}
      >
        <div
          css={`
            width: ${width};
            border: ${border};
            background: ${viewOnlyMode ? "transparent" : "#dfe3e6"};
            height: ${props.height}px;
          `}
          ref={drop}
          data-cy={`row-frame-item-drop-zone-${props.rowIndex}-${props.itemIndex}`}
        >
          <p
            css={`
              margin: 0;
              width: 100%;
              height: 100%;
              padding: 24px;
              color: #495057;
              font-size: 14px;
              font-weight: 400;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              text-align: center;
              align-items: center;
              justify-content: center;
              display: ${viewOnlyMode ? "none" : "flex"};
            `}
          >
            {isOver ? "Release to drop" : "Drag and drop content here"}
          </p>
        </div>
      </Resizable>
    )
  );
};
