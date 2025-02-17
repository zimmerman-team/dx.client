/* third-party */
import React from "react";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import { useLocation, useParams } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
/* project */
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  ChartAPIModel,
  ChartRenderedItem,
} from "app/modules/chart-module/data";
import { isEqual } from "lodash";
import { APPLICATION_JSON } from "app/state/api";

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
  dimensions?: any;
  isLoadedChartMappingValid?: boolean | null;
  setIsLoadedChartMappingValid?: (value: boolean | null) => void;
}) {
  const location = useLocation();
  const abortControllerRef = React.useRef<AbortController>(
    new AbortController()
  );

  const defaultChartErrorMessage =
    "Something went wrong with loading your data!\nChoose another dimensions or select different chart type.";
  const token = useStoreState((state) => state.AuthToken.value);
  const { visualOptions, chartFromAPI, setVisualOptions, setChartFromAPI } =
    props;
  const loadedChartDetails = useStoreState(
    (state) => state.charts.ChartGet.crudData as ChartAPIModel
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
  const [chartError, setChartError] = React.useState(false);
  const [error401, setError401] = React.useState(false);
  const [dataError, setDataError] = React.useState(false);
  const [dataTotalCount, setDataTotalCount] = React.useState(0);
  const [chartErrorMessage, setChartErrorMessage] = React.useState<string>(
    defaultChartErrorMessage
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
  const datasetId = useStoreState((state) => state.charts.dataset.value);
  const setDatasetId = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const setSelectedChartType = useStoreActions(
    (actions) => actions.charts.chartType.setValue
  );

  const isEditPage = view !== undefined && view !== "preview";
  const isPreviewMode =
    location.pathname === `/chart/${page}` ||
    location.pathname === `/chart/${page}/preview`;

  const isrequiredMappingKeysPresent = areAllRequiredDimensionsMapped(
    props.dimensions,
    mapping
  );
  async function loadDataset(id: string) {
    const extraLoader = document.getElementById("extra-loader");
    if (extraLoader) {
      extraLoader.style.display = "block";
    }
    setLoading(true);
    setDataError(false);
    return await axios
      .get(
        `${process.env.REACT_APP_API}/chart/sample-data${
          token ? "" : "/public"
        }/${id}`,
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response: AxiosResponse) => {
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        setLoading(false);
        if (isEmpty(response.data) || response.data.error) {
          setDataError(true);
          setChartErrorMessage(response.data.error ?? defaultChartErrorMessage);
        } else {
          if (response.data.stats === "Error") {
            setDataStats([]);
          } else {
            setDataStats(response.data.stats);
          }

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
    const body = isEmpty(mapping)
      ? {}
      : {
          rows: [
            [
              {
                mapping: validMapping,
                vizType: selectedChartType,
                datasetId: datasetId,
                vizOptions: visualOptions,
                appliedFilters,
              },
            ],
          ],
        };
    setLoading(true);
    setChartError(false);
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
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const chart = response.data;
        setLoading(false);
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        if (isEmpty(chart)) {
          setChartError(true);
          setChartErrorMessage(
            "Something went wrong with loading your data!\n\nChoose another dimensions or select different chart type."
          );
        } else if (response.data.error) {
          setChartErrorMessage(
            "Something went wrong with loading your data!\n\nChoose another dimensions or select different chart type."
          );
          setChartError(true);
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
          setDatasetId(chart.datasetId);
          setChartFromAPI(chart);
          setDataError(false);
          setChartError(false);
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
        setChartError(true);
        setChartErrorMessage(defaultChartErrorMessage);

        setError401(error.response?.status === 401);
      });
  }

  React.useEffect(() => {
    //used only in chart detail page
    if (isPreviewMode) {
      if (loadedChartDetails?.isMappingValid && renderChartFromAPIFufilled) {
        console.log("rendering chart from API");
        renderChartFromAPI();
      } else {
        // No need to call API if mapping is not valid. hence we set loading to false
        setLoading(false);
      }
    }
  }, [token, loadedChartDetails, page]);

  React.useEffect(() => {
    //used when in edit page
    if (isEditPage) {
      if (
        (isrequiredMappingKeysPresent || props.isLoadedChartMappingValid) &&
        renderChartFromAPIFufilled
      ) {
        renderChartFromAPI();
      } else {
        // No need to call API if mapping is not valid. hence we set loading to false
        setLoading(false);
      }
    }
  }, [
    mapping,
    appliedFilters,
    token,
    isrequiredMappingKeysPresent,
    loadedChartDetails,
    props.isLoadedChartMappingValid,
  ]);

  return {
    loading,
    chartError,
    setChartError,
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
