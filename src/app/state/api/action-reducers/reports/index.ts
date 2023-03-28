import { APIModel } from "../..";
import { ApiCallModel } from "../../interfaces";

export const ReportsGet: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/reports`),
};
