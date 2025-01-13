import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

export const StoryGet: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/story`),
};

export const StoryCreate: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/story`),
};

export const StoryUpdate: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/story`),
};

export const StoryDelete: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/story`),
};

export const StoryDuplicate: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/story/duplicate`),
};

export const StoryGetList: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/stories`),
};

export const StoriesCount: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/stories/count`),
};
