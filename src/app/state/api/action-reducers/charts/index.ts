import { APIModel } from "../..";
import { ApiCallModel } from "../../interfaces";

export const ChartsGet: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/charts`),
};

export const chartDelete: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/charts`),
};
