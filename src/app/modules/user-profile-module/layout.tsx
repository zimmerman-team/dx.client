import React from "react";
import Tab from "./component/tab";
import Profile from "./sub-module/profile";
import Settings from "./sub-module/settings";
import { useAuth0 } from "@auth0/auth0-react";
import { bigAvicss, layoutcss } from "./style";
import { Box, Container, Grid } from "@material-ui/core";
import { PageTopSpacer } from "app/modules/common/page-top-spacer";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { LogOutIcon, RightIcon } from "./component/icons";
import LogOutDialog from "app/components/Dialogs/logOutDialog";

export default function UserProfileLayout() {
  const { user } = useAuth0();
  const history = useHistory();

  const [logoutModalDisplay, setLogoutModalDisplay] =
    React.useState<boolean>(false);
  const { tab: activeTab } = useParams<{ tab: string }>();

  const tabList = [
    {
      title: "profile",
      component: (active: boolean) => <RightIcon active={active} />,
    },
    {
      title: "settings",
      component: (active: boolean) => <RightIcon active={active} />,
    },
    {
      title: "billing",
      component: (active: boolean) => <RightIcon active={active} />,
    },
    {
      title: "Log Out",
      component: (active: boolean) => <LogOutIcon active={active} />,
    },
  ];

  const handleTabClick = (index: number, title: string) => {
    if (title === "Log Out") {
      setLogoutModalDisplay(true);
    } else {
      history.push(`/user-management/${title}`);
    }
  };

  return (
    <div css={layoutcss}>
      <Container maxWidth="lg">
        <PageTopSpacer />
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={6}
            md={5}
            lg={4}
            css={`
              @media (max-width: 600px) {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
            `}
          >
            <Box height={20} />
            <div css={bigAvicss}>
              <p>
                {user?.given_name?.slice(0, 1)}
                {user?.family_name?.slice(0, 1)}
              </p>
            </div>
            <Box height={109} />
            <div
              css={`
                @media (max-width: 600px) {
                  width: 100%;
                }
              `}
            >
              {tabList.map((tab, index) => (
                <div key={tab.title}>
                  <Tab
                    title={tab.title}
                    active={tab.title === activeTab}
                    handleClick={() => handleTabClick(index, tab.title)}
                    component={() => tab.component(tab.title === activeTab)}
                    disabled={tab.title === "billing"}
                  />
                  <Box height={10} />
                </div>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={6}>
            <Switch>
              <Route path="/user-management/profile">
                <Profile />
              </Route>
              <Route path="/user-management/settings">
                <Settings />
              </Route>
            </Switch>
          </Grid>
          <LogOutDialog
            modalDisplay={logoutModalDisplay}
            setModalDisplay={setLogoutModalDisplay}
          />
        </Grid>
      </Container>
    </div>
  );
}
