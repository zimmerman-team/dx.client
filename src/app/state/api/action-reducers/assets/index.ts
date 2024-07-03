import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

export const AssetGetList: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/assets`),
};

export const AssetsCount: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/assets/count`),
};
