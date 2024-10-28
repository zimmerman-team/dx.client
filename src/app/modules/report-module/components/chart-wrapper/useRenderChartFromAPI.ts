import { ChartRenderedItem } from "app/modules/chart-module/data";
import { loadedChartsInReportAtom } from "app/state/recoil/atoms";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";

export const useRenderChartFromAPI = (
  token: string | undefined,
  chartId?: string
) => {
  const extraLoader = document.getElementById("extra-loader");
  const location = useLocation();
  const body = {};
  const [loading, setLoading] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);
  const [chartErrorMessage, setChartErrorMessage] = React.useState("");
  const [dataError, setDataError] = React.useState(false);
  const [visualOptions, setVisualOptions] = React.useState({});
  const [chartFromAPI, setChartFromAPI] =
    React.useState<ChartRenderedItem | null>(null);
  const abortControllerRef = React.useRef<AbortController>(
    new AbortController()
  );
  const [loadedChartsList, setLoadedChartsList] = useRecoilState(
    loadedChartsInReportAtom
  );
  console.log("loadedChartsList", loadedChartsList);
  const fetchRenderChart = async (id: string) => {
    setLoading(true);
    setNotFound(false);
    if (extraLoader) {
      extraLoader.style.display = "block";
    }
    await axios
      .post(
        `${process.env.REACT_APP_API}/chart/${id}/render${
          token ? "" : "/public"
        }`,
        body,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const chart = response.data || {};
        if (!location.pathname.includes("downloaded-view")) {
          console.log("view", location.pathname);
        } else {
          console.log("view", location.pathname, id);
          setLoadedChartsList((prev) => [...prev, id]);
        }
        setLoading(false);
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        if (isEmpty(chart)) {
          setNotFound(true);
          setChartErrorMessage("This chart is no longer available.");
        } else if (response.data.error) {
          setChartErrorMessage(response.data.error);
          setDataError(true);
        } else {
          setVisualOptions(chart.vizOptions);
          setChartFromAPI(chart);

          setDataError(false);
        }
      })

      .catch((error) => {
        console.log("API call error: " + error.message);
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        setLoading(false);
        setNotFound(true);
        setChartErrorMessage("This chart is no longer available.");
      });
  };

  React.useEffect(() => {
    if (chartId) {
      fetchRenderChart(chartId);
    }
    return () => {
      abortControllerRef.current.abort();
    };
  }, [chartId, token]);

  return {
    loading,
    notFound,
    chartErrorMessage,
    setChartErrorMessage,
    dataError,
    visualOptions,
    chartFromAPI,
    abortControllerRef,
    setVisualOptions,
    setNotFound,
  };
};
