import { useAuth0 } from "@auth0/auth0-react";
import { fetchPlanLoadingAtom, planDialogAtom } from "app/state/recoil/atoms";
import { useStoreState } from "app/state/store/hooks";
import axios from "axios";
import React from "react";
import { useSetRecoilState } from "recoil";

export function useCheckUserPlan() {
  const { isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const setLoading = useSetRecoilState(fetchPlanLoadingAtom);

  const [userPlan, setUserPlan] = React.useState<{
    planData: {
      name: string;
      datasets: {
        noOfDatasets: number;
        datasetsSize: number;
        availability: number;
        connectData: boolean;
        exportDatasetCsv: boolean;
        connectYourOwnDataSource: boolean;
        googleDrive: boolean;
      };
      charts: {
        noOfCharts: number;
        chartBuilderAccess: boolean;
        shareChart: boolean;
        basicCharts: boolean;
        advancedCharts: boolean;
        aiAgent: boolean;
        customCharting: boolean;
      };
      stories: {
        noOfStories: number;
        basicTemplates: boolean;
        advancedTemplates: boolean;
        mediaSupport: boolean;
        aiChat: boolean;
        aiAgent: boolean;
      };
    };
    assetsCount: {
      datasets: number;
      charts: number;
      stories: number;
    };
  } | null>(null);

  React.useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API}/users/plan-data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserPlan(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleClick = (
    asset: "story" | "chart" | "dataset",
    handleCreate: () => void
  ) => {
    if (!isAuthenticated) {
      return handleCreate();
    }
    if (userPlan) {
      if (asset === "dataset") {
        if (
          userPlan.planData.datasets.noOfDatasets >
          userPlan.assetsCount.datasets
        ) {
          handleCreate();
        } else {
          setPlanDialog({
            open: true,
            message: `You have reached the <b>${userPlan.planData.datasets.noOfDatasets}</b> datasets limit for your ${userPlan.planData.name} Plan. Upgrade to increase.`,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
      } else if (asset === "chart") {
        if (userPlan.planData.charts.noOfCharts > userPlan.assetsCount.charts) {
          handleCreate();
        } else {
          setPlanDialog({
            open: true,
            message: `You have reached the <b>${userPlan.planData.charts.noOfCharts}</b> charts limit for your ${userPlan.planData.name} Plan. Upgrade to increase.`,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
      } else if (asset === "story") {
        if (
          userPlan.planData.stories.noOfStories > userPlan.assetsCount.stories
        ) {
          handleCreate();
        } else {
          setPlanDialog({
            open: true,
            message: `You have reached the <b>${userPlan.planData.stories.noOfStories}</b> stories limit for your ${userPlan.planData.name} Plan. Upgrade to increase.`,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
      }
    }
  };

  return { userPlan, handleClick };
}
