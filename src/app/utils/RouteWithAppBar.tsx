import React from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar } from "app/components/AppBar";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

interface RouteWithAppBarProps {
  path?: string;
  exact?: boolean;
  element?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
}

export function RouteWithAppBar(props: RouteWithAppBarProps) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const token = useStoreState((state) => state.AuthToken.value);
  const setToken = useStoreActions((actions) => actions.AuthToken.setValue);

  React.useEffect(() => {
    if (isAuthenticated && token === "") {
      getAccessTokenSilently().then((newToken) => {
        setToken(newToken);
      });
    }
  }, [isAuthenticated]);

  return (
    <Route exact={props.exact} path={props.path}>
      <AppBar />
      {props.element ?? props.children}
    </Route>
  );
}
