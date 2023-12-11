/* third-party */
import React from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import { useUpdateEffect } from "react-use";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
/* project */
import { ChartRenderedItem } from "app/modules/chart-module/data";

const getValidMapping = (
  chartFromAPI: ChartRenderedItem | null,
  mapping: {
    [key: string]: any;
  }
) => {
  const dimensionIDs =
    chartFromAPI?.dimensions?.map((item: any) => item.id) || [];
  const validMappingKeys = filter(
    Object.keys(mapping),
    (key: string) => dimensionIDs.indexOf(key) > -1
  );
  let validMapping = {};
  if (validMappingKeys.length === 0) {
    validMapping = mapping;
  }
  validMappingKeys.forEach((key: string) => {
    validMapping = {
      ...validMapping,
      [key]: mapping[key],
    };
  });
  return validMapping;
};

const getReqMappingKeyFromReqDimension = (
  dimensions: any,
  mapping: {
    [key: string]: any;
  }
) => {
  //get required dimensions
  const requiredDimensions = dimensions.filter(
    (dimension: any) => dimension.required
  );
  let requiredMappingKey: { [key: string]: boolean } = {};

  requiredDimensions.forEach((element: any) => {
    //assign true if mapping key exists and false if not
    requiredMappingKey[element.id] = element.id in mapping;
  });
  return requiredMappingKey;
};

const allRequiredKeysExist = (
  req: any,
  allreq: any,
  chartType: string | null
): boolean => {
  if (isEmpty(allreq)) {
    return false;
  }

  for (const key in req) {
    if (req.hasOwnProperty(key) && !allreq.hasOwnProperty(key)) {
      return false;
    }
    //return false if chartType is sankey and only one dimension is selected
    if (
      (chartType === "echartsSankey" ||
        chartType === "echartsForcegraph" ||
        chartType === "echartsCirculargraph") &&
      allreq[key].ids.length < 2
    ) {
      return false;
    }
  }
  return true;
};

export function useChartsRawData(props: {
  visualOptions: any;
  setVisualOptions: (value: any) => void;
  chartFromAPI: ChartRenderedItem | null;
  setChartFromAPI: (value: ChartRenderedItem) => void;
  inChartWrapper?: boolean;
  dimensions?: any;
}) {
  const { isLoading } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const { visualOptions, chartFromAPI, setVisualOptions, setChartFromAPI } =
    props;

  const { page, view } = useParams<{ page: string; view?: string }>();

  const [dataTypes, setDataTypes] = React.useState([]);
  const [dataStats, setDataStats] = React.useState([]);
  const [sampleData, setSampleData] = React.useState([]);
  const [loading, setLoading] = React.useState(page !== "new");
  const [notFound, setNotFound] = React.useState(false);
  const [error401, setError401] = React.useState(false);
  const [dataError, setDataError] = React.useState(false);
  const [dataTotalCount, setDataTotalCount] = React.useState(0);
  // const [isEditMode, setIsEditMode] = React.useState(checkIfIsEditMode(view));
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const chartType = useStoreState((state) => state.charts.chartType.value);

  const setAllAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.setAll
  );
  const setEnabledFilterOptionGroups = useStoreActions(
    (actions) => actions.charts.enabledFilterOptionGroups.setValue
  );
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const selectedChartType = useStoreState(
    (state) => state.charts.chartType.value
  );
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const setSelectedChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );
  const isEditMode = !(
    (page !== "new" && view === undefined) ||
    view === "preview"
  );

  async function loadDataset(endpoint: string) {
    const extraLoader = document.getElementById("extra-loader");
    if (extraLoader) {
      extraLoader.style.display = "block";
    }
    setLoading(true);
    setDataError(false);
    return await axios
      .get(`${process.env.REACT_APP_API}/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse) => {
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        setLoading(false);
        if (isEmpty(response.data)) {
          setDataError(true);
        } else {
          setDataStats(response.data.stats);
          setSampleData(response.data.sample);
          setDataTypes(response.data.dataTypes);
          setDataTotalCount(response.data.count);
          setEnabledFilterOptionGroups(response.data.filterOptionGroups);
        }

        return response.data?.sample;
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setDataError(true);
        setDataStats([]);
        setSampleData([]);

        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        setLoading(false);
        return [];
      });
  }

  async function loadDataFromAPI(
    customAppliedFilters?: [
      [
        {
          [key: string]: any[];
        }
      ]
    ],
    chartId?: string
  ) {
    if (chartId || page) {
      const body = {
        previewAppliedFilters: customAppliedFilters
          ? customAppliedFilters
          : appliedFilters,
      };
      setLoading(true);
      setNotFound(false);

      await axios
        .post(
          `${process.env.REACT_APP_API}/chart/${chartId ?? page}/render${
            token === "" ? "/public" : ""
          }`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const chart = response.data || {};
          setLoading(false);
          if (!isEmpty(chart)) {
            setAllAppliedFilters(chart.appliedFilters || {});
            setEnabledFilterOptionGroups(chart.enabledFilterOptionGroups);
            setVisualOptions(chart.vizOptions);
            setMapping(chart.mapping);
            setSelectedChartType(chart.vizType);
            setDataset(chart.datasetId);
            setChartFromAPI(chart);
          } else {
            setNotFound(true);
          }
        })
        .catch((error) => {
          console.log("API call error: " + error.message);
          setLoading(false);
          setNotFound(true);
          setError401(error.response?.status === 401);
        });
    }
  }

  React.useEffect(() => {
    if (
      !props.inChartWrapper &&
      page !== "new" &&
      (isEditMode || !props.inChartWrapper) &&
      !isLoading
    ) {
      loadDataFromAPI();
    }
  }, [page, isEditMode, props.inChartWrapper]);

  const renderChartFromAPI = () => {
    const extraLoader = document.getElementById("extra-loader");
    if (extraLoader) {
      extraLoader.style.display = "block";
    }

    const validMapping = getValidMapping(chartFromAPI, mapping);
    const requiredMappingKey = getReqMappingKeyFromReqDimension(
      props.dimensions,
      mapping
    );

    const body = {
      rows: [
        [
          {
            mapping: validMapping,
            vizType: selectedChartType,
            datasetId: dataset,
            vizOptions: visualOptions,
            appliedFilters,
          },
        ],
      ],
    };

    if (page && allRequiredKeysExist(requiredMappingKey, mapping, chartType)) {
      setNotFound(false);

      axios
        .post(`${process.env.REACT_APP_API}/chart/${page}/render`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (extraLoader) {
            extraLoader.style.display = "none";
          }
          const chart = response.data || {};
          if (isEmpty(chart)) {
            setNotFound(true);
          } else {
            setChartFromAPI(chart);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log("API call error: " + error.message);
          if (extraLoader) {
            extraLoader.style.display = "none";
          }
          setNotFound(true);
          setLoading(false);
          setError401(error.response?.status === 401);
        });
    }
  };

  useUpdateEffect(() => {
    if (!loading && !props.inChartWrapper && isEditMode && !isEmpty(dataset)) {
      renderChartFromAPI();
    }
  }, [
    page,
    view,
    mapping,
    selectedChartType,
    get(chartFromAPI, "ssr", false) ? visualOptions : undefined,
    appliedFilters,
  ]);

  return {
    loading,
    notFound,
    setNotFound,
    setDataError,
    error401,
    dataError,
    dataTypes,
    dataStats,
    sampleData,
    isEditMode,
    dataTotalCount,
    loadDataset,
    loadDataFromAPI,
  };
}
