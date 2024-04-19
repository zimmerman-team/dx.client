/* third-party */
import React from "react";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import { useParams } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
/* project */
import {
  ChartAPIModel,
  ChartRenderedItem,
} from "app/modules/chart-module/data";
import { isEqual } from "lodash";

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
  const requiredDimensions = dimensions?.filter(
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
  isLoadedChartMappingValid?: boolean | null;
  setIsLoadedChartMappingValid?: (value: boolean | null) => void;
}) {
  const abortControllerRef = React.useRef<AbortController>(
    new AbortController()
  );

  const token = useStoreState((state) => state.AuthToken.value);
  const { visualOptions, chartFromAPI, setVisualOptions, setChartFromAPI } =
    props;
  const loadedChartDetails = useStoreState(
    (state) => state.charts.ChartGet.crudData as ChartAPIModel
  );
  const clearLoadedChartDetails = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );
  const [renderChartFromAPIFufilled, setRenderChartFromAPIFufilled] =
    React.useState(true);
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
  const [chartErrorMessage, setChartErrorMessage] = React.useState<string>(
    "Something went wrong with loading your chart! Check your chart settings or data."
  );
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
  const isChartRoute = location.pathname.split("/")[0] === "chart";
  const isEditPage = view !== undefined && view !== "preview";
  const isPreviewMode =
    location.pathname === `/chart/${page}` ||
    location.pathname === `/chart/${page}/preview`;

  const isrequiredMappingKeysPresent = areAllRequiredDimensionsMapped(
    props.dimensions,
    mapping
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
          if (!isEqual(dataTypes, response.data.dataTypes)) {
            setDataTypes(response.data.dataTypes);
          }
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

  async function renderChartFromAPI(chartId?: string) {
    const extraLoader = document.getElementById("extra-loader");
    const validMapping = getValidMapping(chartFromAPI, mapping);
    const body =
      props.inChartWrapper || isEmpty(mapping)
        ? {}
        : {
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
    setLoading(true);
    setNotFound(false);
    setRenderChartFromAPIFufilled(false);
    if (extraLoader) {
      extraLoader.style.display = "block";
    }
    await axios
      .post(
        `${process.env.REACT_APP_API}/chart/${chartId ?? page}/render${
          token === "" ? "/public" : ""
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
          if (!isEqual(chart.appliedFilters, appliedFilters)) {
            setAllAppliedFilters(chart.appliedFilters || {});
          }
          if (!isEqual(chart.mapping, mapping)) {
            setMapping(chart.mapping);
          }
          setEnabledFilterOptionGroups(chart.enabledFilterOptionGroups);
          setVisualOptions(chart.vizOptions);
          setDataTypesFromRenderedChart(chart.dataTypes);
          setSelectedChartType(chart.vizType);
          setDataset(chart.datasetId);
          setChartFromAPI(chart);
          setDataError(false);
        }
      })
      .finally(() => {
        setRenderChartFromAPIFufilled(true);
        props.setIsLoadedChartMappingValid?.(null);
      })
      .catch((error) => {
        console.log("API call error: " + error.message);
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        setLoading(false);
        setNotFound(true);
        setChartErrorMessage("This chart is no longer available.");

        setError401(error.response?.status === 401);
      });
  }

  React.useEffect(() => {
    //used only in chart detail page
    if (!props.inChartWrapper && isPreviewMode) {
      if (loadedChartDetails?.isMappingValid) {
        renderChartFromAPI();
      } else {
        // No need to call API if mapping is not valid. hence we set loading to false
        setLoading(false);
      }
    }
  }, [token, loadedChartDetails, props.inChartWrapper, page]);

  React.useEffect(() => {
    //used when in edit page
    if (!props.inChartWrapper && isEditPage) {
      if (
        (isrequiredMappingKeysPresent || props.isLoadedChartMappingValid) &&
        renderChartFromAPIFufilled
      ) {
        // clearLoadedChartDetails();
        renderChartFromAPI();
      } else {
        // No need to call API if mapping is not valid. hence we set loading to false
        setLoading(false);
      }
    }
  }, [
    mapping,
    appliedFilters,
    props.inChartWrapper,
    token,
    isrequiredMappingKeysPresent,
    loadedChartDetails,
    props.isLoadedChartMappingValid,
  ]);

  React.useEffect(() => {
    /*set values with loadedchart values - 
            used when chart got saved 
            before mapping was successful, to load the chart with the saved values.
            Since we can not get it from renderChartFromAPI() because we only call renderChartFromAPI() when mapping is valid, we set it to loadedchart values*/
    if (
      isChartRoute &&
      isEmpty(dataset) &&
      isEmpty(dataTypes) &&
      isEmpty(selectedChartType) &&
      !loadedChartDetails?.isMappingValid
    ) {
      loadDataset(`chart/sample-data/${loadedChartDetails?.datasetId}`);
      setDataset(loadedChartDetails?.datasetId);
      setSelectedChartType(loadedChartDetails?.vizType);
      setMapping(loadedChartDetails?.mapping);
    }
  }, [dataError, loadedChartDetails]);

  return {
    loading,
    notFound,
    setNotFound,
    setDataError,
    error401,
    dataError,
    dataTypes,
    setDataTypes,
    dataTypesFromRenderedChart,
    dataStats,
    sampleData,
    isPreviewMode,
    dataTotalCount,
    loadDataset,
    renderChartFromAPI,
    chartErrorMessage,
    setChartErrorMessage,
    abortControllerRef,
  };
}
