import React from "react";
import UserProfileLayout from "./layout";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOutIcon, RightIcon } from "./component/icons";
import { useTitle } from "react-use";

const tabList = [
  // {
  //   title: "profile",
  //   active: true,
  //   component: (active: boolean) => <RightIcon active={active} />,
  // },
  // {
  //   title: "settings",
  //   active: false,
  //   component: (active: boolean) => <RightIcon active={active} />,
  // },
  // {
  //   title: "billing",
  //   active: false,
  //   component: (active: boolean) => <RightIcon active={active} />,
  // },
  {
    title: "Sign Out",
    active: false,
    component: (active: boolean) => <LogOutIcon active={active} />,
  },
];

export default function UserProfileModule() {
  useTitle("DX Dataxplorer - User Management");

  const history = useHistory();
  const { isAuthenticated, isLoading } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      history.push("/");
    }
  }, [isLoading, isAuthenticated]);

  return <UserProfileLayout />;
}
