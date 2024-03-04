import React from "react";
import { ActionCreator } from "easy-peasy";
import TuneIcon from "@material-ui/icons/Tune";
import PaletteIcon from "@material-ui/icons/Palette";
import { useHistory, useLocation, useParams } from "react-router-dom";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import TableChartIcon from "@material-ui/icons/TableChart";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { stepcss } from "app/modules/chart-module/components/toolbox/steps/navbar/style";
import { useStoreActions } from "app/state/store/hooks";

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
    setActivePanelStep: ActionCreator<ToolboxNavType>;
    activePanelStep: string;
    mappedData: any;
    stepPaths: { name: string; path: string }[];
    onNavBtnClick: (name: ToolboxNavType, path: string) => void;
    isClickable: boolean;
    setIsClickable: React.Dispatch<React.SetStateAction<boolean>>;
    onMouseOverNavBtn: (name: ToolboxNavType) => void;
  }>
) {
  const { page } = useParams<{ page: string }>();
  const history = useHistory();
  const location = useLocation();
  const resetActivePanels = useStoreActions(
    (actions) => actions.charts.activePanels.reset
  );
  const whiteBackgroundOnly = "background-color: #fff;";
  const whiteBackgroundRoundedBottomRight =
    whiteBackgroundOnly + " border-radius: 0px 0px 8px 0px;";
  const whiteBackgroundRoundedBottomLeft =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 8px;";
  const whiteBackgroundNotRounded =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 0px";

  React.useEffect(() => {
    //on first render, set activestep based on url
    if (page !== "new" && location.pathname !== `/chart/${page}/preview`) {
      const step = props.stepPaths.find(
        (s) => s.path === location.pathname
      )?.name;
      props.setActivePanelStep(step as ToolboxNavType);
    }
    return () => {
      resetActivePanels();
    };
  }, []);

  const navContent: {
    name: ToolboxNavType;
    icon: JSX.Element;
    path: string;
  }[] = [
    {
      name: "dataset",
      icon: <TableChartIcon />,
      path: `/chart/${page}/preview-data`,
    },
    {
      name: "chart",
      icon: <AssessmentIcon />,
      path: `/chart/${page}/chart-type`,
    },
    {
      name: "mapping",
      icon: <CloudDoneIcon />,
      path: `/chart/${page}/mapping`,
    },

    { name: "filters", icon: <TuneIcon />, path: `/chart/${page}/filters` },
    {
      name: "customize",
      icon: <PaletteIcon />,
      path: `/chart/${page}/customize`,
    },
  ];

  const activePanelStepIndex =
    props.activePanelStep === "selectDataset"
      ? 0
      : navContent.findIndex((nav) => nav.name === props.activePanelStep);

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
              item.name === props.activePanelStep ||
                index === activePanelStepIndex,
              props.isClickable
            )}
            ${(() => {
              if (index === activePanelStepIndex - 1) {
                return whiteBackgroundRoundedBottomRight;
              } else if (index === activePanelStepIndex) {
                return "background: transparent;";
              } else if (index === activePanelStepIndex + 1) {
                return whiteBackgroundRoundedBottomLeft;
              } else {
                return whiteBackgroundNotRounded;
              }
            })()};
          `}
          disabled={!props.isClickable}
          key={item.name}
          onClick={() => {
            props.onNavBtnClick(item.name, item.path);
          }}
          onMouseOver={() => {
            props.onMouseOverNavBtn(item.name);
          }}
          onMouseOut={() => {
            props.setIsClickable(false);
          }}
          data-cy={`chart-toolbox-${item.name}-tab`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
