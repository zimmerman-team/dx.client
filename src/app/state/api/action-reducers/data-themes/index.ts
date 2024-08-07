import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

export const DatasetGetList: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/datasets`),
};

export const DatasetGet: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/datasets`),
};

export const DatasetCount: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/datasets/count`),
};
