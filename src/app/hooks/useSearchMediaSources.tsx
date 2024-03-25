import { useStoreState } from "app/state/store/hooks";
import axios from "axios";
import { get } from "lodash";
import React from "react";

export function useSearchMediaSources(source: string, elementType: string) {
  const token = useStoreState((state) => state.AuthToken.value);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);

  const [pageToken, setPageToken] = React.useState("");

  const pageSize = 10;

  const [page, setPage] = React.useState(1);

  const getYoutubeVideos = async (q: string, nextPage: boolean) => {
    await axios
      .get(
        `${
          process.env.REACT_APP_API
        }/youtube/search?q=${q}&maxResults=${pageSize}&pageToken=${
          nextPage ? pageToken : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        const nextPageToken = get(response.data, "nextPageToken", "");
        setPageToken(nextPageToken);
        const videoData = get(response.data, "items", []);

        if (nextPage) {
          setData((prev) => [
            ...prev,
            ...videoData.map((item: any) => ({
              embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
              videoId: item.id.videoId,
              snippet: item.snippet,
              source: "youtube",
            })),
          ]);
        } else {
          setData([
            ...videoData.map((item: any) => ({
              embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
              videoId: item.id.videoId,
              snippet: item.snippet,
              source: "youtube",
            })),
          ]);
        }
      })
      .catch(async (error) => {
        console.log("getYoutubeSource error: " + error);
      });
  };

  const getShutterstockImages = async (q: string, nextPage: boolean) => {
    await axios
      .get(
        `${
          process.env.REACT_APP_API
        }/shutterstock/image/search?query=${q}&perPage=${pageSize}&page=${
          nextPage ? page + 1 : "1"
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        const pageNumber = get(response.data, "page", "");
        setPage(pageNumber);
        const imageData = get(response.data, "data", []);

        if (nextPage) {
          setData((prev) => [
            ...prev,
            ...imageData.map((item: any) => ({
              imageUrl: item.assets.preview_1500.url,
              imageId: item.id,
              source: "shutterstock",
              thumbnail: item.assets.huge_thumb.url,
            })),
          ]);
        } else {
          setData([
            ...imageData.map((item: any) => ({
              imageUrl: item.assets.preview_1500.url,
              imageId: item.id,
              source: "shutterstock",
              thumbnail: item.assets.huge_thumb.url,
            })),
          ]);
        }
      })
      .catch(async (error) => {
        console.log("getShutterstock error: " + error);
      });
  };

  const getUnsplashImages = async (q: string, nextPage: boolean) => {
    await axios
      .get(
        `${process.env.REACT_APP_API}/unsplash/image/search?query=${
          q ? q : "figma"
        }&perPage=${pageSize}&page=${nextPage ? page + 1 : "1"}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        setPage(nextPage ? page + 1 : 1);
        const imageData = get(response.data, "results", []);

        if (nextPage) {
          setData((prev) => [
            ...prev,
            ...imageData.map((item: any) => ({
              imageUrl: item.urls.full,
              imageId: item.id,
              source: "unsplash",
              thumbnail: item.urls.small,
            })),
          ]);
        } else {
          setData([
            ...imageData.map((item: any) => ({
              imageUrl: item.urls.full,
              imageId: item.id,
              source: "unsplash",
              thumbnail: item.urls.thumb,
            })),
          ]);
        }
      })
      .catch(async (error) => {
        console.log("getUnsplash error: " + error);
      });
  };

  const sourceGetter = {
    video: { youtube: getYoutubeVideos },
    image: { shutterstock: getShutterstockImages, unsplash: getUnsplashImages },
  };

  const search = async (q: string, nextPage: boolean = false) => {
    if ((elementType === "video" || elementType === "image") && token) {
      setLoading(true);
      const sources = sourceGetter[elementType as keyof typeof sourceGetter];
      const getMedia = sources[source as keyof typeof sources];
      // @ts-ignore
      await getMedia(q, nextPage);
      setLoading(false);
    }
  };

  return { search, loading, data };
}
