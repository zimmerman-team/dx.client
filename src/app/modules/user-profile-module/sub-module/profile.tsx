import { PrimaryButton } from "app/components/Styled/button";
import React from "react";
import { avicss, flexContainercss, inputcss, profilecss } from "../style";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useStoreState } from "app/state/store/hooks";

interface State {
  password: string;
  showPassword: boolean;
}

export default function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);

  const [values, setValues] = React.useState({
    name: user?.name || `${user?.given_name} ${user?.family_name}`,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/users/update-profile`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "response");
      if (response.data.error) {
      } else {
        getAccessTokenSilently().then(() => {
          if (user) {
            user["name"] = response.data.name;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div css={profilecss}>
      <h4>Profile</h4>
      <form onSubmit={handleSave}>
        <div css={flexContainercss}>
          <p>Name</p>
          <div>
            <input
              type="text"
              name="name"
              css={inputcss}
              onChange={handleChange}
              value={values.name}
            />
          </div>
        </div>
        <div css={flexContainercss}>
          <p>Photo</p>
          <div
            css={`
              width: 100%;
              justify-content: flex-start;
            `}
          >
            <div css={avicss}>
              {user?.given_name?.slice(0, 1)}
              {user?.family_name?.slice(0, 1)}
            </div>
          </div>
        </div>

        <div
          css={`
            width: 10%;
            display: flex;
            justify-content: flex-end;
            color: #ffffff;
            margin-top: 2rem;
            position: absolute;
            top: 73vh;
            right: 0%;
          `}
        >
          <PrimaryButton type="submit" color="#231D2C">
            Save
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
