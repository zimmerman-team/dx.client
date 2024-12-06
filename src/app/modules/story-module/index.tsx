import React from "react";
import { v4 } from "uuid";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { DndProvider } from "react-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useImmer } from "use-immer";
import { useAuth0 } from "@auth0/auth0-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NoMatchPage } from "app/modules/common/no-match-page";
import ReportEditView from "app/modules/report-module/views/edit";
import AITemplate from "app/modules/report-module/views/ai-template";
import { EditorState, convertToRaw } from "draft-js";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import { ReportPreviewView } from "app/modules/report-module/views/preview";
import ReportInitialView from "app/modules/report-module/views/initial";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ReportRightPanel } from "app/modules/report-module/components/right-panel";
import {
  Route,
  Switch,
  useHistory,
  useParams,
  Redirect,
} from "react-router-dom";
import {
  planDialogAtom,
  reportRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { ReportSubheaderToolbar } from "app/modules/report-module/components/reportSubHeaderToolbar";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import useAutosave from "app/hooks/useAutoSave";
import DownloadedView from "./views/downloaded-view";

export default function ReportModule() {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const aiTemplateString = "ai-template";
  const { page, view } = useParams<{
    page: string;
    view: "initial" | "edit" | "create" | "preview" | typeof aiTemplateString;
  }>();
  const [hasChangesBeenMade, setHasChangesBeenMade] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState<{
    isAutoSaveEnabled: boolean;
  }>({ isAutoSaveEnabled: false });

  const setPlanDialog = useSetRecoilState(planDialogAtom);
  const [plugins, setPlugins] = React.useState<ToolbarPluginsType>([]);
  const token = useStoreState((state) => state.AuthToken.value);
  const [_rightPanelView, setRightPanelView] = useRecoilState(
    reportRightPanelViewAtom
  );
  const [isPreviewView, setIsPreviewView] = React.useState(false);
  const defaultReportTitle = "Untitled report";
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [reportName, setReportName] = React.useState("Untitled report");
  const [hasReportNameFocused, setHasReportNameFocused] = React.useState(false);
  const [hasReportNameBlurred, setHasReportNameBlurred] = React.useState(false);

  const [reportType, setReportType] = React.useState<
    "basic" | "advanced" | "ai" | null
  >(null);

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

  const reportCreateData = useStoreState(
    (state) => state.reports.ReportCreate.crudData as any
  );

  React.useEffect(() => {
    if (
      reportCreateData?.error &&
      reportCreateData?.errorType === "planError"
    ) {
      setPlanDialog({
        open: true,
        message: reportCreateData?.error,
        tryAgain: "",
        onTryAgain: () => {},
      });
    }
  }, [reportCreateData]);

  const reportPlanWarning = useStoreState(
    (state) => state.reports.ReportCreate.planWarning
  );

  React.useEffect(() => {
    if (reportPlanWarning) {
      setPlanDialog({
        open: true,
        message: reportPlanWarning,
        tryAgain: "",
        onTryAgain: () => {},
      });
    }
  }, [reportPlanWarning]);

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
      setReportName(defaultReportTitle);
    }
    return () => {
      setHasReportNameBlurred(false);
    };
  }, [hasReportNameBlurred]);

  const deleteFrame = (id: string) => {
    updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === id);
      draft.splice(frameId, 1);
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

  const [framesArray, updateFramesArray] =
    useImmer<IFramesArray[]>(initialFramesArray);

  React.useEffect(() => {
    if (view === "edit" && !rightPanelOpen) {
      setRightPanelOpen(true);
    }
  }, [view]);

  React.useEffect(() => {
    return () => {
      resetDataset();
      resetChartType();
      reportEditClear();
      reportCreateClear();
      resetMapping();
      clearChart();
      setRightPanelView("charts");
      updateFramesArray([]);
    };
  }, []);

  const resetReport = () => {
    updateFramesArray(initialFramesArray);
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
    setReportName(defaultReportTitle);
    setRightPanelView("charts");
    setRightPanelOpen(true);
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
      updateFramesArray(basicReportInitialState());
    } else if (type === "advanced") {
      updateFramesArray(advancedReportInitialState());
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
    hasChangesBeenMade,
    [framesArray, reportName, headerDetails]
  );

  const isSaveEnabled = React.useMemo(() => {
    let hasTextValue = !(
      reportName === defaultReportTitle &&
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
        (view === "edit" || view === undefined) && (
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
            isPreviewView={isPreviewView}
            plugins={plugins}
          />
        )}
      {view && !reportError401 && view === "edit" && canEditDeleteReport && (
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
          onSave={onSave}
        />
      )}

      <Switch>
        <Route exact path="/report/new/initial">
          <div
            css={`
              height: 98px;
            `}
          />
          <ReportInitialView
            resetReport={resetReport}
            handleSetButtonActive={handleSetButtonActive}
          />
        </Route>
        <Route exact path="/report/new/ai-template">
          <AITemplate />
        </Route>
        <Route exact path="/report/:page/edit">
          <div
            css={`
              height: ${canEditDeleteReport && !reportError401
                ? "98px"
                : "0px"};
            `}
          />
          <ReportEditView
            rightPanelOpen={rightPanelOpen}
            handleRightPanelOpen={() => setRightPanelOpen(true)}
            autoSave={autoSave.isAutoSaveEnabled}
            reportType={reportType}
            setHasChangesBeenMade={setHasChangesBeenMade}
            setReportName={setReportName}
            reportName={reportName}
            framesArray={framesArray}
            headerDetails={headerDetails}
            updateFramesArray={updateFramesArray}
            setHeaderDetails={setHeaderDetails}
            stopInitializeFramesWidth={stopInitializeFramesWidth}
            setStopInitializeFramesWidth={setStopInitializeFramesWidth}
            view={view}
            hasReportNameFocused={hasReportNameFocused}
            setHasReportNameFocused={setHasReportNameFocused}
            setPlugins={setPlugins}
            setAutoSave={setAutoSave}
            isSaveEnabled={isSaveEnabled}
            onSave={onSave}
          />
        </Route>
        <Route exact path="/report/:page">
          <div
            css={`
              height: ${reportError401 ? "0px" : "98px"};
            `}
          />
          <ReportPreviewView
            setIsPreviewView={setIsPreviewView}
            setAutoSave={setAutoSave}
          />
        </Route>

        <Route exact path="/report/:page/downloaded-view">
          <DownloadedView
            setIsPreviewView={setIsPreviewView}
            setAutoSave={setAutoSave}
          />
        </Route>
        <Route exact path="/report/new">
          <Redirect to="/report/new/initial" />
        </Route>
        <Route path="*">
          <NoMatchPage />
        </Route>
      </Switch>
    </DndProvider>
  );
}
