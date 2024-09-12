import { APIModel } from "../..";
import { ApiCallModel } from "../../interfaces";

export const UserProfile: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/users/profile`),
};
