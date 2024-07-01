import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { useStoreState } from "app/state/store/hooks";
import axios from "axios";
import { isEmpty } from "lodash";
import React from "react";
export const useLoadDatasetDetails = (id: string) => {
  const [datasetDetailsLoading, setDatasetDetailsLoading] =
    React.useState(false);
  const [datasetDetails, setDatasetDetails] =
    React.useState<DatasetListItemAPIModel>({} as DatasetListItemAPIModel);
  const [datasetDetailsError, setDatasetDetailsError] =
    React.useState<string>("");
  const abortControllerRef = React.useRef<AbortController>(
    new AbortController()
  );
  const token = useStoreState((state) => state.AuthToken.value);

  const loadDatasetDetails = async () => {
    try {
      setDatasetDetailsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/datasets/${id}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataset = response.data || {};
      setDatasetDetailsLoading(false);
      if (isEmpty(dataset)) {
        setDatasetDetailsError("This dataset is no longer available.");
      } else if (response.data.error) {
        setDatasetDetailsError(response.data.error);
      } else {
        setDatasetDetails(dataset);
      }
    } catch (e) {
      setDatasetDetailsLoading(false);
      console.log("load dataset details error", e);
      if (axios.isCancel(e)) {
        console.log("Request cancelled");
      } else {
        setDatasetDetailsError(
          "An error occurred while fetching dataset details."
        );
      }
    }
  };

  React.useEffect(() => {
    if (id) {
      loadDatasetDetails();
    }
  }, [token, id]);

  return {
    datasetDetailsLoading,
    datasetDetails,
    datasetDetailsError,
  };
};
