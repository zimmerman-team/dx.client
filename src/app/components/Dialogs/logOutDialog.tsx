import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useStyles } from "./deleteChartDialog";
import { CloseOutlined } from "@material-ui/icons";
import { IconButton, Modal } from "@material-ui/core";
import { useStoreActions } from "app/state/store/hooks";
import { PrimaryButton, TertiaryButton } from "app/components/Styled/button";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
}

export default function LogOutDialog(props: Props) {
  const classes = useStyles();
  const { logout } = useAuth0();

  const setToken = useStoreActions((actions) => actions.AuthToken.setValue);

  const clearDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.clear
  );
  const clearCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.clear
  );
  const clearStories = useStoreActions(
    (actions) => actions.stories.StoryGetList.clear
  );

  function clearAssets() {
    setToken("");
    clearDatasets();
    clearCharts();
    clearStories();
  }

  function onLogout() {
    // @ts-ignore
    if (window?.Intercom) {
      window.Intercom("shutdown");
    }
    clearAssets();
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  return (
    <div>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <div className={classes.paper}>
          <div>
            <IconButton
              onClick={() => props.setModalDisplay(false)}
              css={`
                position: absolute;
                right: 8px;
                top: 6px;
                color: #231d2c;
              `}
            >
              <CloseOutlined color="inherit" />
            </IconButton>
            <p
              css={`
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 40px;
                color: #231d2c;
                line-height: 41px;
                margin-bottom: 0px;
                margin-top: 2.5rem;
              `}
            >
              Sign out
            </p>
            <p
              css={`
                margin-top: 16px;
                margin-bottom: 36px;
                font-size: 18px;
              `}
            >
              Are you sure you want to Sign out?
            </p>
          </div>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
              gap: 16px;
            `}
          >
            <TertiaryButton
              type="button"
              bg="dark"
              size="big"
              onClick={() => props.setModalDisplay(false)}
            >
              Cancel
            </TertiaryButton>
            <PrimaryButton
              bg="dark"
              size="big"
              type="submit"
              onClick={onLogout}
            >
              Sign out
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
