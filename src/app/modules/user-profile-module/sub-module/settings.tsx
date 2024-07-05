import { useAuth0 } from "@auth0/auth0-react";
import DeleteAccountDialog from "app/components/Dialogs/deleteAccountDialog";
import { PrimaryButton } from "app/components/Styled/button";
import { PageLoader } from "app/modules/common/page-loader";
import axios from "axios";
import React from "react";
import { useTitle } from "react-use";

export default function Settings() {
  useTitle("DX Dataxplorer - User Settings");

  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const { getAccessTokenSilently, logout } = useAuth0();

  const deleteUserAccount = async () => {
    return getAccessTokenSilently().then(async (newToken) => {
      return await axios.post(
        `${process.env.REACT_APP_API}/users/delete-account`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
    });
  };

  const handleDelete = () => {
    setLoading(true);
    deleteUserAccount()
      .then(() => {
        setLoading(false);
        setModalDisplay(false);
        setEnableButton(false);
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };
  return (
    <>
      {loading && <PageLoader />}
      <div
        css={`
          width: 70%;
        `}
      >
        <h4
          css={`
            font-weight: 700;
            font-size: 24px;
            color: #6061e5;
          `}
        >
          Settings
        </h4>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <p>Account</p>
          <div
            css={`
              width: 60%;
              color: #ffffff;
            `}
          >
            <PrimaryButton
              dark
              type="button"
              onClick={() => setModalDisplay(true)}
            >
              Delete account
            </PrimaryButton>
          </div>
        </div>
      </div>
      <DeleteAccountDialog
        enableButton={enableButton}
        handleDelete={handleDelete}
        handleInputChange={handleInputChange}
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
      />
    </>
  );
}
