import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import axios from "axios";
import { isEmpty } from "lodash";
import React from "react";
export const useLoadDatasetDetails = (
  id: string,
  token: string | undefined
) => {
  const [datasetDetailsLoading, setDatasetDetailsLoading] =
    React.useState(false);
  const [datasetDetails, setDatasetDetails] =
    React.useState<DatasetListItemAPIModel>({} as DatasetListItemAPIModel);
  const [datasetDetailsError, setDatasetDetailsError] =
    React.useState<string>("");

  const loadDatasetDetails = async () => {
    try {
      setDatasetDetailsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/datasets${token ? "" : "/public"}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: (token ? `Bearer ${token}` : undefined) as string,
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
      if (axios.isCancel(e)) {
        //TODO: handle error
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
