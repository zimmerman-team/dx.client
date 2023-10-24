/* third-party */
import React from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import { useParams } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useMount, useSessionStorage, useUpdateEffect } from "react-use";
/* project */
import { ChartRenderedItem } from "app/modules/chart-module/data";

function checkIfIsEditMode(view?: string): boolean {
  if (view) return true;
  return false;
}

function checkMappingAndDatasetIdNotEmpty(
  tabmappings: [
    [
      {
        [key: string]: any;
      }
    ]
  ],
  tabdatasetIds: [
    [
      {
        dataset: string | null;
      }
    ]
  ],
  activeTabIndex: number,
  vizIsTextContent: boolean[][]
): boolean {
  let mappingsCheck = true;
  // tabmappings.forEach((tabmapping) => {
  tabmappings[activeTabIndex].forEach((contentmapping, index) => {
    if (!vizIsTextContent[activeTabIndex][index]) {
      mappingsCheck = mappingsCheck && !isEmpty(contentmapping);
    }
  });
  // });
  let datasetIdsCheck = true;
  // tabdatasetIds.forEach((tabdatasetId) => {
  tabdatasetIds[activeTabIndex].forEach((contentdatasetId, index) => {
    if (!vizIsTextContent[activeTabIndex][index]) {
      datasetIdsCheck = datasetIdsCheck && !isEmpty(contentdatasetId);
    }
  });
  // });

  return mappingsCheck && datasetIdsCheck;
}

export function useChartsRawData(props: {
  visualOptions: any;
  setVisualOptions: (value: any) => void;
  chartFromAPI: ChartRenderedItem | null;
  setChartFromAPI: (value: ChartRenderedItem) => void;
  inChartWrapper?: boolean;
  dimensions?: any;
}) {
  const token = useSessionStorage("authToken", "")[0];
  const { visualOptions, chartFromAPI, setVisualOptions, setChartFromAPI } =
    props;

  const { page, view } = useParams<{ page: string; view?: string }>();

  const [dataTypes, setDataTypes] = React.useState([]);
  const [dataStats, setDataStats] = React.useState([]);
  const [sampleData, setSampleData] = React.useState([]);
  const [loading, setLoading] = React.useState(page !== "new");
  const [notFound, setNotFound] = React.useState(false);
  const [Error401, setError401] = React.useState(false);
  const [dataError, setDataError] = React.useState(false);
  const [dataTotalCount, setDataTotalCount] = React.useState(0);
  const [isEditMode, setIsEditMode] = React.useState(checkIfIsEditMode(view));
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

  async function loadDataset(endpoint: string) {
    const extraLoader = document.getElementById("extra-loader");
    if (extraLoader) {
      extraLoader.style.display = "block";
    }
    setLoading(true);
    return await axios
      .get(`${process.env.REACT_APP_API}/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse) => {
        setNotFound(false);

        setDataStats(response.data.stats);
        setSampleData(response.data.sample);
        setDataTypes(response.data.dataTypes);
        setDataTotalCount(response.data.count);
        setEnabledFilterOptionGroups(response.data.filterOptionGroups);
        if (extraLoader) {
          extraLoader.style.display = "none";
        }
        setLoading(false);
        return response.data.sample;
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setNotFound(true);
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
      await axios
        .post(
          `${process.env.REACT_APP_API}/chart/${chartId ?? page}/render`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setNotFound(false);

          const chart = response.data || {};
          if (!isEmpty(chart)) {
            setAllAppliedFilters(chart.appliedFilters || {});
            setEnabledFilterOptionGroups(chart.enabledFilterOptionGroups);
            setVisualOptions(chart.vizOptions);
            setMapping(chart.mapping);
            setSelectedChartType(chart.vizType);
            setDataset(chart.datasetId);
            setChartFromAPI(chart);
          }
          if (response.data === null || response.data === undefined) {
            setNotFound(true);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.log("API call error: " + error.message);
          setNotFound(true);
          setLoading(false);
          setError401(error.response?.status === 401);
        });
    }
  }

  useMount(() => {
    if (isEditMode && page !== "new" && !props.inChartWrapper) {
      loadDataFromAPI();
    }
  });

  React.useEffect(() => {
    const newValue = checkIfIsEditMode(view);
    if (newValue !== isEditMode) {
      setIsEditMode(newValue);
    }
  }, [view]);

  React.useEffect(() => {
    if (!props.inChartWrapper && page !== "new" && !isEditMode) {
      loadDataFromAPI();
    }
  }, [page, isEditMode]);

  useUpdateEffect(() => {
    if (
      !loading &&
      !props.inChartWrapper &&
      (page === "new" || isEditMode) &&
      !isEmpty(dataset)
    ) {
      const extraLoader = document.getElementById("extra-loader");
      if (extraLoader) {
        extraLoader.style.display = "block";
      }
      const dimensionKeys =
        chartFromAPI?.dimensions?.map((item: any) => item.id) || [];
      const validMappingKeys = filter(
        Object.keys(mapping),
        (key: string) => dimensionKeys.indexOf(key) > -1
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

      //get required dimensions
      const requiredDimensions = props.dimensions.filter(
        (dimension: any) => dimension.required
      );
      let req = {} as any;

      requiredDimensions.forEach((element: any) => {
        if (element.id in mapping) {
          req[element.id] = true;
        } else {
          req[element.id] = false;
        }
      });
      function allRequiredKeysExist(req: any, allreq: any) {
        for (const key in req) {
          if (req.hasOwnProperty(key) && !allreq.hasOwnProperty(key)) {
            return false;
          }
          //return false if chartType is sankey and only one dimension is selected
          if (chartType === "echartsSankey" && allreq[key].ids.length < 2) {
            return false;
          }
        }
        return true;
      }

      if (page && allRequiredKeysExist(req, mapping)) {
        axios
          .post(`${process.env.REACT_APP_API}/chart/${page}/render`, body, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const chart = response.data || {};
            setChartFromAPI(chart);
            setNotFound(false);

            setLoading(false);
            if (extraLoader) {
              extraLoader.style.display = "none";
            }
          })
          .catch((error) => {
            console.log("API call error: " + error.message);
            setNotFound(true);
            setLoading(false);
            setError401(error.response?.status === 401);
            if (extraLoader) {
              extraLoader.style.display = "none";
            }
          });
      }
    }
  }, [
    page,
    isEditMode,
    mapping,
    selectedChartType,
    get(chartFromAPI, "ssr", false) ? visualOptions : undefined,
    appliedFilters,
  ]);

  return {
    loading,
    notFound,
    Error401,
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
