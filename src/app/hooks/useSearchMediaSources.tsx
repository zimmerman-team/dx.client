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

  const DEFAULT_SEARCH_QUERY = "figma";

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

        const videoData = get(response.data, "items", []).map((item: any) => ({
          embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
          videoId: item.id.videoId,
          source: "youtube",
          thumbnail: item.snippet.thumbnails.medium.url,
          title: item.snippet.title,
          description: item.snippet.description,
          ownerThumbnail: item.snippet.thumbnails.default.url,
        }));

        if (nextPage) {
          setData((prev) => [...prev, ...videoData]);
        } else {
          setData([...videoData]);
        }
      })
      .catch(async (error) => {
        console.log("getYoutubeSource error: " + error);
      });
  };

  const getVimeoVideos = async (q: string, nextPage: boolean) => {
    await axios
      .get(
        `${
          process.env.REACT_APP_API
        }/vimeo/search?q=${q}&perPage=${pageSize}&page=${
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

        const videoData = get(response.data, "data", []).map((item: any) => ({
          embedUrl: item.player_embed_url,
          videoId: item.uri,
          source: "vimeo",
          thumbnail: item.pictures.base_link,
          ownerThumbnail: item.uploader.pictures.base_link,
          title: item.name,
          description: item.description,
        }));

        if (nextPage) {
          setData((prev) => [...prev, ...videoData]);
        } else {
          setData([...videoData]);
        }
      })
      .catch(async (error) => {
        console.log("getVimeo error: " + error);
      });
  };

  const getShutterstockImages = async (q: string, nextPage: boolean) => {
    await axios
      .get(
        `${
          process.env.REACT_APP_API
        }/shutterstock/image/search?q=${q}&perPage=${pageSize}&page=${
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
        const imageData = get(response.data, "data", []).map((item: any) => ({
          imageUrl: item.assets.preview_1500.url,
          imageId: item.id,
          source: "shutterstock",
          thumbnail: item.assets.huge_thumb.url,
        }));

        if (nextPage) {
          setData((prev) => [...prev, ...imageData]);
        } else {
          setData([...imageData]);
        }
      })
      .catch(async (error) => {
        console.log("getShutterstock error: " + error);
      });
  };

  const getUnsplashImages = async (q: string, nextPage: boolean) => {
    await axios
      .get(
        `${
          process.env.REACT_APP_API
        }/unsplash/image/search?q=${q}&perPage=${pageSize}&page=${
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
        setPage(nextPage ? page + 1 : 1);
        const imageData = get(response.data, "results", []).map(
          (item: any) => ({
            imageUrl: item.urls.full,
            imageId: item.id,
            source: "unsplash",
            thumbnail: item.urls.small,
          })
        );

        if (nextPage) {
          setData((prev) => [...prev, ...imageData]);
        } else {
          setData([...imageData]);
        }
      })
      .catch(async (error) => {
        console.log("getUnsplash error: " + error);
      });
  };

  const sourceGetter = {
    video: { youtube: getYoutubeVideos, vimeo: getVimeoVideos },
    image: { shutterstock: getShutterstockImages, unsplash: getUnsplashImages },
  };

  const search = async (q: string, nextPage: boolean = false) => {
    if ((elementType === "video" || elementType === "image") && token) {
      if (!nextPage) {
        setData([]);
      }
      setLoading(true);
      const sources = sourceGetter[elementType as keyof typeof sourceGetter];
      const getMedia = sources[source as keyof typeof sources];
      // @ts-ignore
      await getMedia(q || DEFAULT_SEARCH_QUERY, nextPage);
      setLoading(false);
    }
  };

  return { search, loading, data };
}
