import { APPLICATION_JSON } from "app/state/api";
import { useStoreState } from "app/state/store/hooks";
import axios from "axios";
import React, { useEffect } from "react";

const useGetDatasetContent = (datasetId: string, pageSize: number = 10) => {
  const token = useStoreState((state) => state.AuthToken.value);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);

  const [page, setPage] = React.useState(1);
  const [count, setCount] = React.useState(0);

  const refetch = (nextPage: boolean = false) => {
    const nextPageToken = nextPage ? page + 1 : 1;
    if (count === data.length && nextPage) return;
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API}/datasets${
          token ? "" : "/public"
        }/${datasetId}/data?page=${nextPageToken}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        setLoading(false);
        if (nextPage) {
          setPage(page + 1);
          setData((prev) => [...prev, ...response.data.data]);
        } else {
          setCount(response.data.count);
          setPage(1);
          setData([...response.data.data]);
        }
      })
      .catch(async (error) => {
        setLoading(false);
        console.log("getDatasetContent: " + error);
      });
  };

  useEffect(() => {
    refetch();
  }, [datasetId, token]);

  return { data, loading, refetch };
};

export default useGetDatasetContent;
