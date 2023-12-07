import React from "react";
import { isEmpty } from "lodash";
import { ActionCreator } from "easy-peasy";
import TuneIcon from "@material-ui/icons/Tune";
import PaletteIcon from "@material-ui/icons/Palette";
import { useStoreState } from "app/state/store/hooks";
import { useHistory, useLocation, useParams } from "react-router-dom";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import TableChartIcon from "@material-ui/icons/TableChart";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { stepcss } from "app/modules/chart-module/components/toolbox/views/steps/navbar/style";

export type ToolboxNavType =
  | "dataset"
  | "mapping"
  | "lock"
  | "customize"
  | "filters"
  | "chart"
  | "selectDataset";

export default function ToolboxNav(
  props: Readonly<{
    setActiveStep: ActionCreator<ToolboxNavType>;
    activeStep: string;
    mappedData: any;
    stepPaths: { name: string; path: string }[];
    onNavBtnClick: (name: ToolboxNavType) => void;
  }>
) {
  const { page } = useParams<{ page: string }>();
  const history = useHistory();
  const location = useLocation();
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const [isClickable, setIsClickable] = React.useState(false);

  const whiteBackgroundOnly = "background-color: #fff;";
  const whiteBackgroundRoundedBottomRight =
    whiteBackgroundOnly + " border-radius: 0px 0px 8px 0px;";
  const whiteBackgroundRoundedBottomLeft =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 8px;";
  const whiteBackgroundNotRounded =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 0px";

  React.useEffect(() => {
    //on first render, set activestep based on url
    if (page !== "new") {
      const step = props.stepPaths.find(
        (s) => s.path === location.pathname
      )?.name;
      props.setActiveStep(step as ToolboxNavType);
    }
  }, []);

  const handleStepChange = () => {
    const findStep = props.stepPaths.find(
      (step) => step.name === props.activeStep
    );
    if (findStep) {
      //replace path with current step path
      history.replace(findStep.path);
    }
  };

  React.useEffect(() => {
    handleStepChange();
  }, [props.activeStep]);

  const navContent: { name: ToolboxNavType; icon: JSX.Element }[] = [
    { name: "dataset", icon: <TableChartIcon /> },
    { name: "chart", icon: <AssessmentIcon /> },
    { name: "mapping", icon: <CloudDoneIcon /> },

    { name: "filters", icon: <TuneIcon /> },
    { name: "customize", icon: <PaletteIcon /> },
  ];

  const activeStepIndex =
    props.activeStep === "selectDataset"
      ? 0
      : navContent.findIndex((nav) => nav.name === props.activeStep);

  const onMouseOverNavBtn = (name: ToolboxNavType) => {
    //handles state to set cursor types for nav buttons
    if (
      name === "dataset" ||
      name === "selectDataset" ||
      name === "chart" ||
      name === "mapping"
    ) {
      if (name === "dataset") {
        setIsClickable(true);
      }
      if (name === "chart" && !isEmpty(dataset)) {
        setIsClickable(true);
        return;
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        setIsClickable(true);
        return;
      }
    } else if (!isEmpty(props.mappedData)) {
      setIsClickable(true);
    }
  };

  return (
    <div
      css={`
        background: #f5f5f7;
        display: flex;
      `}
    >
      {navContent.map((item, index) => (
        <button
          css={`
            ${stepcss(
              item.name === props.activeStep || index === activeStepIndex,
              isClickable
            )}
            ${(() => {
              if (index === activeStepIndex - 1) {
                return whiteBackgroundRoundedBottomRight;
              } else if (index === activeStepIndex) {
                return "background: transparent;";
              } else if (index === activeStepIndex + 1) {
                return whiteBackgroundRoundedBottomLeft;
              } else {
                return whiteBackgroundNotRounded;
              }
            })()};
          `}
          key={item.name}
          onClick={() => {
            props.onNavBtnClick(item.name);
          }}
          onMouseOver={() => {
            onMouseOverNavBtn(item.name);
          }}
          onMouseOut={() => {
            console.log("mouse out");
            setIsClickable(false);
          }}
          //corresponding keyboard events for accessiblity
          onBlur={() => {
            console.log("blur");
            setIsClickable(false);
          }}
          onFocus={() => {
            console.log("focus");
            setIsClickable(true);
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
