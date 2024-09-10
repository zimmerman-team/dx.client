/* eslint-disable no-param-reassign */
import { action, Action } from "easy-peasy";

export interface DataSourceStateModel {
  value: string;
  setValue: Action<DataSourceStateModel, string>;
}

export const DataSourceState: DataSourceStateModel = {
  value: "TGFOData",
  setValue: action((state, payload: string) => {
    state.value = payload;
  }),
};

export interface DataSourceSnackbarVisibilityStateModel {
  value: boolean;
  setValue: Action<DataSourceSnackbarVisibilityStateModel, boolean>;
}

export const DataSourceSnackbarVisibilityState: DataSourceSnackbarVisibilityStateModel =
  {
    value: false,
    setValue: action((state, payload: boolean) => {
      state.value = payload;
    }),
  };

export interface AuthTokenModel {
  value: string;
  setValue: Action<AuthTokenModel, string>;
}

export const AuthTokenState: AuthTokenModel = {
  value: "",
  setValue: action((state, payload: string) => {
    state.value = payload;
  }),
};
