/* third-party */
import React from "react";

import { useStoreState } from "app/state/store/hooks";

import { useHistory, useLocation, useParams } from "react-router-dom";
import useUpdateEffect from "react-use/lib/useUpdateEffect";

/* project */
import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { ChartToolBoxMapping } from "app/modules/chart-module/components/toolbox/steps/panels-content/Mapping";
import { ChartToolBoxFilters } from "app/modules/chart-module/components/toolbox/steps/panels-content/Filters";
import { ChartToolBoxChartType } from "app/modules/chart-module/components/toolbox/steps/panels-content/ChartType";
import { ChartToolBoxCustomize } from "app/modules/chart-module/components/toolbox/steps/panels-content/Customize";
import { DatasetPanel } from "app/modules/chart-module/components/toolbox/steps/panels-content/SelectDataset";

import { isEmpty } from "lodash";
import { ToolboxNavType } from "app/modules/chart-module/components/toolbox/data";

import { ChartRenderedItem } from "app/modules/chart-module/data";
import { chartFromStoryAtom } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";

interface ChartToolBoxStepsProps {
  data: { [key: string]: string | number | null }[];
  loading: boolean;
  mappedData?: any;
  openPanel?: number;
  dataTypes: any;
  visualOptions?: any;
  forceNextEnabled?: boolean;
  rawViz?: any;
  save: () => void;
  filterOptionGroups: FilterGroupModel[];
  setVisualOptions?: (value: any) => void;
  loadDataset: (endpoint: string) => Promise<boolean>;
  dimensions: any[];
  activeStep: ToolboxNavType;
  onNavBtnClick: (name: ToolboxNavType, path: string) => void;
  isClickable: boolean;
  setIsClickable: React.Dispatch<React.SetStateAction<boolean>>;
  onMouseOverNavBtn: (name: ToolboxNavType) => void;
  stepPaths: { name: string; path: string }[];
  setChartFromAPI: (
    value: React.SetStateAction<ChartRenderedItem | null>
  ) => void;
  deselectDataset: () => void;
  setShowSnackbar: (value: string | null) => void;
}

export function ChartToolBoxSteps(props: ChartToolBoxStepsProps) {
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const history = useHistory();
  const { filterOptionGroups } = props;
  const [_expanded, setExpanded] = React.useState<number>(props.openPanel ?? 0);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const [chartFromStory, setChartFromStory] =
    useRecoilState(chartFromStoryAtom);
  let appliedFiltersCount = 0;

  Object.keys(appliedFilters || {}).forEach((key) => {
    appliedFiltersCount += appliedFilters[key].length;
  });

  const handleSave = () => {
    const { page: storyPage, view: storyView } = chartFromStory;
    if (!isEmpty(props.mappedData)) {
      props.save();
      if (chartFromStory.state) {
        setChartFromStory((prev) => ({ ...prev, chartId: page }));
        history.push(`/story/${storyPage}/edit`);
      } else {
        props.setShowSnackbar("Your chart has been successfully saved!");
        history.push(`/chart/${page}`);
      }
    }
  };

  const currentPath = location.pathname;
  const currentPathIndex = props.stepPaths.findIndex(
    (s) => s.path === currentPath
  );
  const handleNext = () => {
    const nextStep = props.stepPaths[currentPathIndex + 1]?.name;
    const nextPath = props.stepPaths[currentPathIndex + 1]?.path;
    props.onNavBtnClick(nextStep as ToolboxNavType, nextPath);

    if (currentPathIndex === 5) {
      handleSave();
    } else {
      return;
    }
  };

  const handleBack = () => {
    const prevStep = props.stepPaths[currentPathIndex - 1]?.name;
    const prevPath = props.stepPaths[currentPathIndex - 1]?.path;
    if (currentPathIndex === 0) {
      return;
    }
    props.onNavBtnClick(prevStep as ToolboxNavType, prevPath);
  };
  const handleMouseOverNext = () => {
    const nextStep = props.stepPaths[currentPathIndex + 1]?.name;
    props.onMouseOverNavBtn(nextStep as ToolboxNavType);
  };
  const handleMouseOverBack = () => {
    const prevStep = props.stepPaths[currentPathIndex - 1]?.name;
    props.onMouseOverNavBtn(prevStep as ToolboxNavType);
  };

  const displayToolboxPanel = () => {
    switch (props.activeStep) {
      case "dataset":
      case "selectDataset":
        return <DatasetPanel deselectDataset={props.deselectDataset} />;
      case "chart":
        return <ChartToolBoxChartType />;
      case "mapping":
        return (
          <ChartToolBoxMapping
            dataTypes={props.dataTypes}
            dimensions={props.dimensions}
            setChartFromAPI={props.setChartFromAPI}
            loading={props.loading}
          />
        );
      case "filters":
        return <ChartToolBoxFilters filterOptionGroups={filterOptionGroups} />;
      case "customize":
        return (
          <ChartToolBoxCustomize
            dataTypes={props.dataTypes}
            mappedData={props.mappedData}
            visualOptions={props.visualOptions}
            setVisualOptions={props.setVisualOptions}
          />
        );

      default:
        return <DatasetPanel deselectDataset={props.deselectDataset} />;
    }
  };

  useUpdateEffect(() => setExpanded(props.openPanel ?? 0), [props.openPanel]);

  return (
    <div>
      <div
        css={`
          width: 400px;
          overflow-y: hidden;
          height: calc(100vh - 229px);
          position: relative;

          &::-webkit-scrollbar {
            width: 5px;
            background: #262c34;
          }
          &::-webkit-scrollbar-track {
            background: #f5f5f7;
          }
          &::-webkit-scrollbar-thumb {
            background: #262c34;
          }
        `}
      >
        {displayToolboxPanel()}
      </div>
      <div
        css={`
          display: flex;
          gap: 8px;
          height: 64px;
          align-items: center;
          justify-content: center;

          background: #f5f5f7;
          button {
            outline: none;
            border: none;
            border-radius: 12px;
            width: 188px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            cursor: ${props.isClickable ? "pointer" : "not-allowed"};
            :nth-child(1) {
              background: ${currentPathIndex !== 0 ? "#adb5bd" : "#DFE3E5"};
              color: #231d2c;
            }
            :nth-child(2) {
              background: #262c34;
              color: #fff;
            }
          }
        `}
      >
        <button
          type="button"
          onClick={handleBack}
          onMouseOver={handleMouseOverBack}
          onMouseOut={() => {
            props.setIsClickable(false);
          }}
          //corresponding keyboard events for accessiblity
          onBlur={() => {
            props.setIsClickable(false);
          }}
        >
          Back{" "}
        </button>
        <button
          onClick={handleNext}
          onMouseOver={handleMouseOverNext}
          onMouseOut={() => {
            props.setIsClickable(false);
          }}
          //corresponding keyboard events for accessiblity
          onBlur={() => {
            props.setIsClickable(false);
          }}
          data-cy="toolbox-chart-next"
        >
          {currentPathIndex < 5 ? "Next" : "Save and Preview"}
        </button>
      </div>
    </div>
  );
}
