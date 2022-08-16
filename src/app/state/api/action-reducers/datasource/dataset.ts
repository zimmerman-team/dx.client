import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

const DataSetList: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/mapped-datasets`),
};

export default DataSetList;
