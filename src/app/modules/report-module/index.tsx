import React from "react";
import { v4 } from "uuid";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { DndProvider } from "react-dnd";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NoMatchPage } from "app/modules/common/no-match-page";
import { IHeaderDetails } from "./components/right-panel/data";
import ReportEditView from "app/modules/report-module/views/edit";
import AITemplate from "app/modules/report-module/views/ai-template";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  ReportContentHeightsType,
  ReportContentWidthsType,
  ReportModel,
  emptyReport,
} from "app/modules/report-module/data";
import ReportCreateView from "app/modules/report-module/views/create";
import { ReportPreviewView } from "app/modules/report-module/views/preview";
import ReportInitialView from "app/modules/report-module/views/initial";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ReportRightPanel } from "app/modules/report-module/components/right-panel";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import {
  Route,
  Switch,
  useHistory,
  useParams,
  Redirect,
} from "react-router-dom";
import {
  chartFromReportAtom,
  persistedReportStateAtom,
  reportRightPanelViewAtom,
  unSavedReportPreviewModeAtom,
} from "app/state/recoil/atoms";
import { ReportSubheaderToolbar } from "app/modules/report-module/components/reportSubHeaderToolbar";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import useAutosave from "app/hooks/useAutoSave";

interface RowFrameProps {
  structure:
    | "oneByOne"
    | "oneByTwo"
    | "oneByThree"
    | "oneByFour"
    | "oneByFive"
    | null;
  items: (string | object)[];
  id: string;
  content: (string | object | null)[];
  contentWidths: ReportContentWidthsType[];
  contentHeights: ReportContentHeightsType[];
  contentTypes: ("text" | "divider" | "chart" | null)[];
  type: "rowFrame" | "divider";
}

export default function ReportModule() {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const { page, view } = useParams<{
    page: string;
    view: "initial" | "edit" | "create" | "preview" | "ai-template";
  }>();
  const reportNameRef = React.useRef<string>("");
  const framesArrayRef = React.useRef<IFramesArray[]>([]);
  const headerDetailsRef = React.useRef<IHeaderDetails>({} as IHeaderDetails);

  const [autoSave, setAutoSave] = React.useState<{
    isAutoSaveEnabled: boolean;
  }>({ isAutoSaveEnabled: false });

  /** static toolbar states */
  const [plugins, setPlugins] = React.useState<ToolbarPluginsType>([]);
  /** end of static toolbar states */

  const token = useStoreState((state) => state.AuthToken.value);

  const [_rightPanelView, setRightPanelView] = useRecoilState(
    reportRightPanelViewAtom
  );

  const [_chartFromReport, setChartFromReport] =
    useRecoilState(chartFromReportAtom);

  const [_reportPreviewMode, setReportPreviewMode] = useRecoilState(
    unSavedReportPreviewModeAtom
  );

  const [persistedReportState, setPersistedReportState] = useRecoilState(
    persistedReportStateAtom
  );
  const [isPreviewView, setIsPreviewView] = React.useState(false);

  const localReportState = JSON.parse(persistedReportState.framesArray);

  let localPickedCharts: string[] = [];
  localReportState.map((data: any) => {
    return data.contentTypes.map((item: any, index: number) => {
      if (item === "chart") {
        localPickedCharts.push(data.content[index]);
      }
    });
  });

  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [reportName, setReportName] = React.useState("Untitled report");
  const [hasReportNameFocused, setHasReportNameFocused] = React.useState(false);
  const [hasReportNameBlurred, setHasReportNameBlurred] = React.useState(false);

  const [reportType, setReportType] = React.useState<
    "basic" | "advanced" | "ai" | null
  >(null);
  const [headerDetails, setHeaderDetails] = React.useState({
    title: "",
    description: EditorState.createEmpty(),
    heading: EditorState.createEmpty(),
    showHeader: true,
    backgroundColor: "#252c34",
    titleColor: "#ffffff",
    descriptionColor: "#ffffff",
    dateColor: "#ffffff",
  });

  const [stopInitializeFramesWidth, setStopInitializeFramesWidth] =
    React.useState(false);

  React.useEffect(() => {
    //set report name back to untitled report if it is empty and user is not focused on subheader title
    if (reportName === "" && hasReportNameBlurred) {
      setReportName("Untitled report");
    }
    return () => {
      setHasReportNameBlurred(false);
    };
  }, [hasReportNameBlurred]);

  const handleRowFrameItemResize = (
    rowId: string,
    itemIndex: number,
    width: number,

    height: number
  ) => {
    setFramesArray((prev) => {
      const tempPrev = prev.map((item) => ({ ...item }));
      const frameIndex = tempPrev.findIndex((frame) => frame.id === rowId);
      if (frameIndex === -1) {
        return prev;
      }
      const contentContainer = document.getElementById("content-container");
      const percentage =
        ((width + (tempPrev[frameIndex].structure !== "oneByOne" ? 30 : 0)) /
          contentContainer!.offsetWidth) *
        100;
      tempPrev[frameIndex].contentWidths[itemIndex] = percentage;
      if (tempPrev[frameIndex].content.length > 1) {
        let remainingWidth = 100 - percentage;
        tempPrev[frameIndex].content.forEach((_, index) => {
          if (index < itemIndex) {
            remainingWidth -= tempPrev[frameIndex].contentWidths[index];
          }
          if (index > itemIndex) {
            tempPrev[frameIndex].contentWidths[index] =
              remainingWidth / (tempPrev[frameIndex].content.length - index);
          }
        });
      }
      if (tempPrev[frameIndex].contentHeights) {
        tempPrev[frameIndex].contentHeights[itemIndex] = height;
      } else {
        tempPrev[frameIndex].contentHeights = [];
        tempPrev[frameIndex].contentHeights[itemIndex] = height;
      }
      return [...tempPrev];
    });
  };

  const deleteFrame = (id: string) => {
    setFramesArray((prev) => {
      const tempPrev = prev.map((item) => ({ ...item }));
      const frameId = tempPrev.findIndex((frame) => frame.id === id);

      tempPrev.splice(frameId, 1);
      return [...tempPrev];
    });
  };

  const handlePersistReportState = () => {
    // does not have up to date values of states so we use refs
    setPersistedReportState({
      ...persistedReportState,
      reportName: reportNameRef.current,
      headerDetails: {
        ...headerDetailsRef.current,
        heading: JSON.stringify(
          convertToRaw(headerDetailsRef.current.heading.getCurrentContent())
        ),
        description: JSON.stringify(
          convertToRaw(headerDetailsRef.current.description.getCurrentContent())
        ),
      },

      framesArray: JSON.stringify(
        framesArrayRef.current.map((frame) => ({
          id: frame.id,
          structure: frame.structure,
          content: frame.content.map((item, index) =>
            frame.contentTypes[index] === "text"
              ? convertToRaw((item as EditorState).getCurrentContent())
              : item
          ),
          contentTypes: frame.contentTypes,
          contentWidths: frame.contentWidths,
          contentHeights: frame.contentHeights,
          items: frame.content.map((item, index) =>
            frame.contentTypes[index] === "text"
              ? convertToRaw((item as EditorState).getCurrentContent())
              : item
          ),
        }))
      ),
    });
  };

  const basicReportInitialState = () => {
    const id = v4();
    return [
      {
        id,
        frame: {
          rowIndex: 0,
          rowId: id,
          handlePersistReportState,
          handleRowFrameItemResize,
          type: "rowFrame",
        },
        content: [],
        contentWidths: [],
        contentHeights: [],
        contentTypes: [],
        structure: null,
      },
    ] as IFramesArray[];
  };

  const advancedReportInitialState = () => {
    const rowOne = v4();
    const rowTwo = v4();

    const rowFive = v4();
    return [
      {
        id: rowOne,
        frame: {
          rowId: rowOne,
          rowIndex: 0,
          forceSelectedType: "oneByFive",
          handlePersistReportState,
          handleRowFrameItemResize,
          type: "rowFrame",
        },
        content: [null, null, null, null, null],
        contentWidths: [20, 20, 20, 20, 20],
        contentHeights: [121, 121, 121, 121, 121],
        contentTypes: [null, null, null, null, null],
        structure: "oneByFive",
      },
      {
        id: rowTwo,
        frame: {
          rowId: rowTwo,
          rowIndex: 1,
          forceSelectedType: "oneByOne",
          handlePersistReportState,
          handleRowFrameItemResize,
          type: "rowFrame",
        },
        content: [null],
        contentWidths: [100],
        contentHeights: [400],
        contentTypes: [null],
        structure: "oneByOne",
      },

      {
        id: rowFive,
        frame: {
          rowId: rowFive,
          rowIndex: 2,
          forceSelectedType: "oneByThree",
          handlePersistReportState,
          handleRowFrameItemResize,
          type: "rowFrame",
        },
        content: [null, null, null],
        contentWidths: [33, 33, 33],
        contentHeights: [460, 460, 460],
        contentTypes: [null, null, null],
        structure: "oneByThree",
      },
    ] as IFramesArray[];
  };

  const initialFramesArray = React.useMemo(() => {
    if (reportType === "basic") {
      return basicReportInitialState();
    } else if (reportType === "advanced") {
      return advancedReportInitialState();
    }
    return [];
  }, [reportType]);

  const [framesArray, setFramesArray] =
    React.useState<IFramesArray[]>(initialFramesArray);

  React.useEffect(() => {
    if (view === "edit" && !rightPanelOpen) {
      setRightPanelOpen(true);
    }
  }, [view]);

  //sets report state to persisted report state
  React.useEffect(() => {
    setReportName(persistedReportState.reportName || "Untitled report");
    setHeaderDetails({
      ...persistedReportState.headerDetails,
      heading: EditorState.createWithContent(
        convertFromRaw(JSON.parse(persistedReportState.headerDetails.heading))
      ),
      description: EditorState.createWithContent(
        convertFromRaw(
          JSON.parse(persistedReportState.headerDetails.description)
        )
      ),
    });

    const localFramesArray =
      JSON.parse(persistedReportState.framesArray || "[]").length > 0
        ? JSON.parse(persistedReportState.framesArray).map(
            (rowFrame: RowFrameProps, index: number) => {
              const isDivider =
                rowFrame.content &&
                rowFrame.content.length === 1 &&
                rowFrame.content[0] === ReportElementsType.DIVIDER;

              const content = rowFrame?.items?.map((item, index) => {
                return rowFrame.contentTypes[index] === "text"
                  ? EditorState.createWithContent(convertFromRaw(item as any))
                  : item;
              });
              return {
                id: rowFrame.id,

                frame: {
                  rowIndex: index,
                  rowId: rowFrame.id,

                  handlePersistReportState,
                  handleRowFrameItemResize,
                  type: isDivider ? "divider" : "rowFrame",
                  forceSelectedType: rowFrame.structure ?? undefined,
                  previewItems: content,
                },

                type: rowFrame.type,
                content: content ?? [],
                contentWidths: rowFrame.contentWidths,
                contentHeights: rowFrame.contentHeights,
                contentTypes: rowFrame.contentTypes,
                structure: rowFrame.structure,
              };
            }
          )
        : initialFramesArray;

    setFramesArray(localFramesArray);
  }, [persistedReportState]);

  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );

  const resetDataset = useStoreActions(
    (actions) => actions.charts.dataset.reset
  );
  const resetChartType = useStoreActions(
    (actions) => actions.charts.chartType.reset
  );
  const resetMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );

  const reportGetData = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
  );

  const reportCreate = useStoreActions(
    (actions) => actions.reports.ReportCreate.post
  );

  const reportCreateClear = useStoreActions(
    (actions) => actions.reports.ReportCreate.clear
  );

  const reportEdit = useStoreActions(
    (actions) => actions.reports.ReportUpdate.patch
  );

  const reportEditClear = useStoreActions(
    (actions) => actions.reports.ReportUpdate.clear
  );

  const reportError401 = useStoreState(
    (state) =>
      get(state.reports.ReportGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.reports.ReportGet.crudData, "error", "") === "Unauthorized"
  );

  const errorReportName = useStoreState((state) =>
    get(state.reports.ReportGet.crudData, "name", "")
  );

  React.useEffect(() => {
    return () => {
      resetDataset();
      resetChartType();
      reportEditClear();
      reportCreateClear();
      resetMapping();
      clearChart();
      setRightPanelView("charts");
      setFramesArray([]);
    };
  }, []);

  //get current value of states for handlePersistReportState function
  headerDetailsRef.current = headerDetails;
  framesArrayRef.current = framesArray;
  reportNameRef.current = reportName;

  const resetReport = () => {
    setFramesArray(initialFramesArray);
    setPersistedReportState({
      reportName: "Untitled report",
      headerDetails: {
        title: "",
        heading: JSON.stringify(
          convertToRaw(EditorState.createEmpty().getCurrentContent())
        ),
        description: JSON.stringify(
          convertToRaw(EditorState.createEmpty().getCurrentContent())
        ),
        showHeader: true,
        backgroundColor: "#252c34",
        titleColor: "#ffffff",
        descriptionColor: "#ffffff",
        dateColor: "#ffffff",
      },

      framesArray: JSON.stringify([]),
    });

    setHeaderDetails({
      title: "",
      heading: EditorState.createEmpty(),
      description: EditorState.createEmpty(),
      showHeader: true,
      backgroundColor: "#252c34",
      titleColor: "#ffffff",
      descriptionColor: "#ffffff",
      dateColor: "#ffffff",
    });
    setReportName("Untitled report");
    setRightPanelView("charts");
    setRightPanelOpen(true);
    setReportPreviewMode(false);
    setAutoSave({ isAutoSaveEnabled: false });
  };

  const onSave = async (type: "create" | "edit") => {
    const action = type === "create" ? reportCreate : reportEdit;
    action({
      token,
      patchId: page === "new" ? "public" : page,
      values: {
        name: reportName,
        authId: user?.sub,
        showHeader: headerDetails.showHeader,
        title: headerDetails.showHeader ? headerDetails.title : undefined,
        heading: convertToRaw(
          headerDetails.showHeader
            ? headerDetails.heading.getCurrentContent()
            : EditorState.createEmpty().getCurrentContent()
        ),
        description: convertToRaw(
          headerDetails.showHeader
            ? headerDetails.description.getCurrentContent()
            : EditorState.createEmpty().getCurrentContent()
        ),
        rows: framesArray.map((frame) => ({
          structure: frame.structure,
          items: frame.content.map((item, index) =>
            frame.contentTypes[index] === "text"
              ? convertToRaw((item as EditorState).getCurrentContent())
              : item
          ),
          contentWidths: {
            id: frame.id,
            widths: frame.contentWidths,
          },
          contentHeights: {
            id: frame.id,
            heights: frame.contentHeights,
          },
        })),
        backgroundColor: headerDetails.backgroundColor,
        titleColor: headerDetails.titleColor,
        descriptionColor: headerDetails.descriptionColor,
        dateColor: headerDetails.dateColor,
      },
    });
  };

  const handleSetButtonActive = (type: "basic" | "advanced" | "ai") => {
    if (type === "ai") {
      history.push(`/report/${page}/ai-template`);
    } else if (type === "basic") {
      setFramesArray(basicReportInitialState());
    } else if (type === "advanced") {
      setFramesArray(advancedReportInitialState());
    }

    setReportType(type);
  };
  React.useEffect(() => {
    if (reportType === "advanced" || reportType === "basic") {
      onSave("create");
    }
    return () => {
      setReportType(null);
    };
  }, [reportType]);

  useAutosave(
    () => {
      onSave("edit");
    },
    2 * 1000,
    autoSave.isAutoSaveEnabled,
    [framesArray, reportName, headerDetails]
  );

  React.useEffect(() => {
    if (view === "edit" && !rightPanelOpen) {
      setRightPanelOpen(true);
    }
  }, [view]);

  const isSaveEnabled = React.useMemo(() => {
    let hasTextValue = !(
      reportName === "Untitled report" &&
      !headerDetails.description.getCurrentContent().hasText() &&
      isEmpty(headerDetails.title) &&
      framesArray.length === 1
    );

    let framesArrayState = framesArray.some(
      (frame) =>
        frame.content.length !== 0 ||
        frame.contentTypes.length !== 0 ||
        frame.structure !== null
    );
    return hasTextValue || framesArrayState;
  }, [reportName, framesArray, headerDetails]);

  const canEditDeleteReport = React.useMemo(() => {
    return isAuthenticated && reportGetData?.owner === user?.sub;
  }, [user, isAuthenticated, reportGetData]);

  const showReportHeader = view === "edit" ? canEditDeleteReport : true;
  return (
    <DndProvider backend={HTML5Backend}>
      {!reportError401 &&
        showReportHeader &&
        view !== "ai-template" &&
        view !== "initial" && (
          <ReportSubheaderToolbar
            autoSave={autoSave.isAutoSaveEnabled}
            setAutoSave={setAutoSave}
            onReportSave={onSave}
            setName={setReportName}
            setHasReportNameFocused={setHasReportNameFocused}
            setHasReportNameBlurred={setHasReportNameBlurred}
            isSaveEnabled={isSaveEnabled}
            name={page !== "new" && !view ? reportGetData.name : reportName}
            framesArray={framesArray}
            headerDetails={headerDetails}
            setStopInitializeFramesWidth={setStopInitializeFramesWidth}
            handlePersistReportState={handlePersistReportState}
            isPreviewView={isPreviewView}
            plugins={plugins}
          />
        )}
      {view &&
        !reportError401 &&
        view !== "preview" &&
        canEditDeleteReport &&
        view !== "initial" &&
        view !== "ai-template" && (
          <ReportRightPanel
            open={rightPanelOpen}
            currentView={view}
            headerDetails={headerDetails}
            setHeaderDetails={setHeaderDetails}
            onOpen={() => setRightPanelOpen(true)}
            onClose={() => setRightPanelOpen(false)}
            showHeaderItem={!headerDetails.showHeader}
            framesArray={framesArray}
            reportName={reportName}
            handlePersistReportState={handlePersistReportState}
          />
        )}
      <div
        css={`
          width: 100%;
          height: ${view === "ai-template" ||
          reportError401 ||
          !showReportHeader
            ? "0px"
            : "98px"};
        `}
      />
      <Switch>
        <Route path="/report/:page/initial">
          <ReportInitialView
            resetReport={resetReport}
            handleSetButtonActive={handleSetButtonActive}
          />
        </Route>
        <Route path="/report/:page/ai-template">
          <AITemplate />
        </Route>
        <Route path="/report/:page/create">
          <ReportCreateView
            open={rightPanelOpen}
            view={view}
            setReportName={setReportName}
            reportName={reportName}
            deleteFrame={deleteFrame}
            hasReportNameFocused={hasReportNameFocused}
            reportType={reportType}
            framesArray={framesArray}
            headerDetails={headerDetails}
            setFramesArray={setFramesArray}
            setHeaderDetails={setHeaderDetails}
            handlePersistReportState={handlePersistReportState}
            handleRowFrameItemResize={handleRowFrameItemResize}
            setPlugins={setPlugins}
          />
        </Route>
        <Route path="/report/:page/edit">
          <ReportEditView
            open={rightPanelOpen}
            reportType={reportType}
            setReportName={setReportName}
            reportName={reportName}
            localPickedCharts={localPickedCharts}
            framesArray={framesArray}
            headerDetails={headerDetails}
            setFramesArray={setFramesArray}
            setHeaderDetails={setHeaderDetails}
            handlePersistReportState={handlePersistReportState}
            handleRowFrameItemResize={handleRowFrameItemResize}
            stopInitializeFramesWidth={stopInitializeFramesWidth}
            setStopInitializeFramesWidth={setStopInitializeFramesWidth}
            view={view}
            hasReportNameFocused={hasReportNameFocused}
            setHasReportNameFocused={setHasReportNameFocused}
            setPlugins={setPlugins}
            setAutoSave={setAutoSave}
            isSaveEnabled={isSaveEnabled}
          />
        </Route>
        <Route path="/report/:page/preview">
          <ReportPreviewView
            setIsPreviewView={setIsPreviewView}
            setAutoSave={setAutoSave}
          />
        </Route>
        <Route path="/report/:page">
          <ReportPreviewView
            setIsPreviewView={setIsPreviewView}
            setAutoSave={setAutoSave}
          />
        </Route>
        <Route path="/report/new">
          <Redirect to="/report/new/initial" />
        </Route>
        <Route path="*">
          <NoMatchPage />
        </Route>
      </Switch>
    </DndProvider>
  );
}
