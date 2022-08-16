import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

const DataSourceList: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/available-datasources`),
};

export default DataSourceList;
