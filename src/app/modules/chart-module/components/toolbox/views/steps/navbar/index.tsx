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
    isClickable: boolean;
    setIsClickable: React.Dispatch<React.SetStateAction<boolean>>;
    onMouseOverNavBtn: (name: ToolboxNavType) => void;
  }>
) {
  const { page } = useParams<{ page: string }>();
  const history = useHistory();
  const location = useLocation();

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
              props.isClickable
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
            props.onMouseOverNavBtn(item.name);
          }}
          onMouseOut={() => {
            props.setIsClickable(false);
          }}
          //corresponding keyboard events for accessiblity
          onBlur={() => {
            props.setIsClickable(false);
          }}
          onFocus={() => {
            props.setIsClickable(true);
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
