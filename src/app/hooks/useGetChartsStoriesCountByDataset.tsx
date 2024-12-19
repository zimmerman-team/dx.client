import { APPLICATION_JSON } from "app/state/api";
import { useStoreState } from "app/state/store/hooks";
import axios from "axios";
import { get } from "lodash";
import React, { useEffect } from "react";

const useGetChartsStoriesCountByDataset = (datasetId: string) => {
  const token = useStoreState((state) => state.AuthToken.value);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    chartsCount: 0,
    storiesCount: 0,
  });

  async function refetch() {
    setLoading(true);
    return await axios
      .get(
        `${process.env.REACT_APP_API}/datasets/${datasetId}/charts-stories/count`,
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        setLoading(false);
        setData(response.data);
      })
      .catch(async (error) => {
        console.log("getChartsStoriesCountByDataset error: " + error);
      });
  }
  useEffect(() => {
    if (datasetId) {
      refetch();
    }
  }, [datasetId]);

  return { data, loading };
};

export default useGetChartsStoriesCountByDataset;
