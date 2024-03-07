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

export const areAllRequiredDimensionsMapped = (
  dimensions: any,
  mapping: {
    [key: string]: any;
  }
): boolean => {
  //get required dimensions
  const requiredDimensions = dimensions.filter(
    (dimension: any) => dimension.required
  );
  //if required dimesions are empty or mapping is empty,
  //then req dimesions are not mapped, so return false
  if (isEmpty(requiredDimensions) || isEmpty(mapping)) {
    return false;
  }
  //check if all required dimensions are mapped
  for (const element of requiredDimensions) {
    if (
      !mapping.hasOwnProperty(element.id) ||
      mapping[element.id].ids.length < 1
    ) {
      return false;
    }
    if (
      element.multiple &&
      mapping[element.id].ids.length < element.minValues
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
  const [dataTypesFromRenderedChart, setDataTypesFromRenderedChart] =
    React.useState([]);
  const [dataStats, setDataStats] = React.useState([]);
  const [sampleData, setSampleData] = React.useState([]);
  const [loading, setLoading] = React.useState(page !== "new");
  const [notFound, setNotFound] = React.useState(false);
  const [error401, setError401] = React.useState(false);
  const [dataError, setDataError] = React.useState(false);
  const [dataTotalCount, setDataTotalCount] = React.useState(0);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );

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
  const chartDetailPage = location.pathname === `/chart/${page}`;
  const isPreviewMode =
    location.pathname === `/chart/${page}` ||
    location.pathname === `/chart/${page}/preview`;

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
          setDataError(false);
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

  async function loadChartDataFromAPI(
    customAppliedFilters?: [
      [
        {
          [key: string]: any[];
        }
      ]
    ],
    chartId?: string
  ) {
    if ((chartId || page) && page !== "new" && !isEmpty(token)) {
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
          console.log(response.data, "response.data 1");
          const chart = response.data || {};
          setLoading(false);
          if (isEmpty(chart)) {
            setNotFound(true);
          } else if (response.data.error) {
            setDataError(true);
          } else {
            setAllAppliedFilters(chart.appliedFilters || {});
            setEnabledFilterOptionGroups(chart.enabledFilterOptionGroups);
            setVisualOptions(chart.vizOptions);
            setMapping(chart.mapping);
            setSelectedChartType(chart.vizType);
            setDataset(chart.datasetId);
            setChartFromAPI(chart);
            setDataError(false);
          }
        })
        .catch((error) => {
          console.log("API call error: " + error);
          setLoading(false);
          setNotFound(true);
          setError401(error.response?.status === 401);
        });
    }
  }

  React.useEffect(() => {
    // calls loadChartDataFromAPI  on first render  when token is available or token changes
    // useful when coming from report page to edit chart page
    // if in chart wrapper component, loadChartDataFromAPI is called from chart-wrapper component
    if (!props.inChartWrapper && !isEmpty(token)) {
      loadChartDataFromAPI();
    }
  }, [token]);

  useUpdateEffect(() => {
    //calls on second render
    // calls loadChartDataFromAPI only in chart detail page
    if (!props.inChartWrapper && chartDetailPage && !isLoading) {
      loadChartDataFromAPI();
    }
  }, [page, props.inChartWrapper, isLoading, token]);

  const renderChartFromAPI = () => {
    const extraLoader = document.getElementById("extra-loader");

    const validMapping = getValidMapping(chartFromAPI, mapping);
    const requiredMappingKey = areAllRequiredDimensionsMapped(
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

    if (page && requiredMappingKey) {
      setNotFound(false);
      if (extraLoader) {
        extraLoader.style.display = "block";
      }
      axios
        .post(`${process.env.REACT_APP_API}/chart/${page}/render`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("here?");
          if (extraLoader) {
            extraLoader.style.display = "none";
          }
          console.log(response.data, "response.data");

          const chart = response.data || {};
          if (isEmpty(chart)) {
            setNotFound(true);
          } else if (response.data.error) {
            setDataError(true);
          } else {
            setChartFromAPI(chart);
            setDataTypesFromRenderedChart(chart.dataTypes);
            setDataError(false);
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
    // calls renderChartFromAPI only in chart editable pages
    // calls only when token is available
    // calls only when dataset is not empty and loading state is false
    if (
      !loading &&
      !props.inChartWrapper &&
      !isPreviewMode &&
      !isEmpty(dataset) &&
      token
    ) {
      renderChartFromAPI();
    }
  }, [
    page,
    view,
    mapping,
    selectedChartType,
    get(chartFromAPI, "ssr", false) ? visualOptions : undefined,
    appliedFilters,
    token,
  ]);

  return {
    loading,
    notFound,
    setNotFound,
    setDataError,
    error401,
    dataError,
    dataTypes,
    dataTypesFromRenderedChart,
    dataStats,
    sampleData,
    isPreviewMode,
    dataTotalCount,
    loadDataset,
    loadChartDataFromAPI,
  };
}
