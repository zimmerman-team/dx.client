import React from "react";
import SettingsIcon from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/settings";
import { useHistory } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const UploadOption = (props: {
  name: string;
  type: string;
  formats: string[];
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setActiveOption: React.Dispatch<React.SetStateAction<string | null>>;
  connected?: boolean;
  onLogout?: () => void;
  canConnect?: boolean;
  upgradeRequired: boolean;
}) => {
  const [openSettings, setOpenSettings] = React.useState(false);

  const history = useHistory();

  return (
    <div>
      <button
        className={
          props.upgradeRequired
            ? `${props.name.split(" ").join("")}-tooltip`
            : ""
        }
        css={`
          border-radius: 8px;
          border: 1px solid #e2eaef;
          width: 100%;
          overflow: hidden;
          padding: 0;
          background: #fff;
          cursor: pointer;
          :disabled {
            cursor: not-allowed;
          }
          position: relative;
        `}
        disabled={props.disabled}
        onClick={(e) => {
          if (props.upgradeRequired) {
            return history.push("/pricing");
          }
          props.setActiveOption(props.name);
          props.onClick(e);
        }}
        data-cy="upload-option-button"
        data-testid={`${props.name}-option`}
      >
        <div
          css={`
            margin: 34px auto;
            width: max-content;
            display: flex;
            gap: 14px;
            align-items: center;
            color: #6b727b;
          `}
        >
          {props.icon}
          <div>
            <p
              css={`
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px; /* 111.111% */
                letter-spacing: 0.5px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin: 0;
                padding: 0;
                text-align: left;
              `}
            >
              {props.name}
            </p>
            <p
              css={`
                font-size: 14px;
                font-style: normal;
                font-weight: 325;
                line-height: 20px; /* 111.111% */
                letter-spacing: 0.5px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                margin: 0;
                padding: 0;
                text-align: left;
              `}
            >
              {props.type}
            </p>
          </div>
        </div>
        {props.upgradeRequired ? (
          <div
            css={`
              background: #f6c445;
              border-radius: 48px;
              color: #856207;
              font-family: "GothamNarrow-Bold", Helvetica, sans-serif;
              font-size: 11px;
              font-style: normal;
              font-weight: 450;
              line-height: normal;
              text-transform: uppercase;
              padding: 8px 16px;
              width: max-content;
              position: absolute;
              right: 8px;
              bottom: 46px;
            `}
          >
            UPGRADE
          </div>
        ) : null}

        <div
          css={`
            padding: 7px 16px;
            background: #f3f5f8;
          `}
        >
          {props.canConnect ? (
            <div
              css={`
                display: flex;
                gap: 8px;
                justify-content: space-between;
                height: 24px;
                align-items: center;
              `}
            >
              <span
                css={`
                  display: flex;
                  gap: 8px;
                  align-items: center;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 325;
                  line-height: 15px; /* 125% */
                  letter-spacing: 0.5px;
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  color: #6b727b;
                `}
              >
                <div
                  css={`
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: ${props.connected
                      ? "#51dbca"
                      : "#D9D9D9"};
                  `}
                />
                {props.connected ? "Connected" : "Not Connected"}
              </span>

              {props.connected ? (
                <div
                  css={`
                    position: relative;
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSettings(!openSettings);
                  }}
                >
                  <div
                    css={`
                      position: absolute;
                      right: calc(100% + 10px);
                      top: -4px;
                    `}
                    hidden={!openSettings}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div
                      onClick={() => {
                        props.onLogout?.();
                        setOpenSettings(false);
                      }}
                      css={`
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 15px; /* 125% */
                        letter-spacing: 0.5px;
                        color: white;
                        font-family: "GothamNarrow-Bold", "Helvetica Neue",
                          sans-serif;
                        border-radius: 12px;
                        background: #6061e5;
                        box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.1);
                        border: none;
                        /* padding: 5px 0; */
                        width: 113px;
                        height: 24px;
                        cursor: pointer;
                        :hover: {
                          opacity: 0.8;
                        }
                      `}
                    >
                      Logout
                    </div>
                  </div>

                  <SettingsIcon />
                </div>
              ) : null}
            </div>
          ) : (
            <div
              css={`
                display: flex;
                gap: 8px;
                height: 24px;
                align-items: center;
              `}
            >
              {props.formats.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          )}
        </div>
      </button>

      <Tooltip
        anchorSelect={`.${props.name.split(" ").join("")}-tooltip`}
        place="bottom"
        style={{
          background: "#231D2C",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "12px",
          fontFamily: "GothamNarrow-Medium, 'Helvetica Neue', sans-serif",
          width: "320px",
          lineHeight: "16px",
          zIndex: 2,
        }}
      >
        This feature is available on <b>the Pro Plan and above.</b> Click to
        view pricing options.
      </Tooltip>
    </div>
  );
};

export default UploadOption;
