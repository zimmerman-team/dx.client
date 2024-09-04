import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { PopupRequest, PublicClientApplication } from "@azure/msal-browser";
import { v4 } from "uuid";
interface Props {
  onFileSubmit: (file: File) => void;
  onCancel: () => void;
  onDownloadStart: () => void;
}

export const useOneDrivePicker = ({
  onCancel,
  onFileSubmit,
  onDownloadStart,
}: Props) => {
  const [app, setApp] = useState<PublicClientApplication | null>(null);
  const baseUrl = "https://onedrive.live.com/picker";

  const [connected, setConnected] = useState(false);

  const msalParams = {
    auth: {
      authority: "https://login.microsoftonline.com/consumers",
      clientId: "a5f756dd-d422-443e-93d2-3361f8a4a6f8",
      redirectUri: window.location.origin,
    },
  };

  const initializeApp = async () => {
    const msalInstance = new PublicClientApplication(msalParams);
    await msalInstance.initialize();
    setApp(msalInstance);
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const channelId = useMemo(() => v4(), []);

  const params = {
    sdk: "8.0",
    entry: {
      oneDrive: {
        files: {},
      },
    },
    authentication: {},
    messaging: {
      origin: window.location.origin,
      channelId: channelId,
    },
    typesAndSources: {
      mode: "files",
      filters: [".xlsx", ".csv", ".xml", ".xls", ".xhtml"],
      pivots: {
        oneDrive: true,
        recent: true,
      },
    },
  };

  let win: Window | null;
  let port: MessagePort | null;

  async function launchPicker() {
    const authToken = await getToken();
    const popupHeight = 500;
    const popupWidth = 1000;
    const popupLeft = (window.screen.width - popupWidth) / 2;
    const popupTop = (window.screen.height - popupHeight) / 2;

    win = window.open(
      "",
      "Picker",
      `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`
    );

    if (win) {
      const queryString = new URLSearchParams({
        filePicker: JSON.stringify(params),
      });

      const url = `${baseUrl}?${queryString}`;

      const form = win.document.createElement("form");
      form.setAttribute("action", url);
      form.setAttribute("method", "POST");
      win.document.body.append(form);

      const input = win.document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "access_token");
      input.setAttribute("value", authToken);
      form.appendChild(input);

      form.submit();

      window.addEventListener("message", (event) => {
        if (event.origin !== "https://onedrive.live.com") {
          return;
        }
        if (event.source && event.source === win) {
          const message = event.data;

          if (
            message.type === "initialize" &&
            message.channelId === params.messaging.channelId
          ) {
            port = event.ports[0];

            port.addEventListener("message", messageListener);

            port.start();

            port.postMessage({
              type: "activate",
            });
          }
        }
      });
    }
  }

  async function messageListener(message: MessageEvent) {
    if (port === null) return;
    if (win === null) return;
    switch (message.data.type) {
      case "notification":
        break;

      case "command":
        port.postMessage({
          type: "acknowledge",
          id: message.data.id,
        });

        const command = message.data.data;

        switch (command.command) {
          case "authenticate":
            // getToken is from scripts/auth.js
            const token = await getToken();

            if (typeof token !== "undefined" && token !== null) {
              port.postMessage({
                type: "result",
                id: message.data.id,
                data: {
                  result: "token",
                  token,
                },
              });
            } else {
              console.error(
                `Could not get auth token for command: ${JSON.stringify(
                  command
                )}`
              );
            }

            break;

          case "close":
            win.close();
            onCancel();
            break;

          case "pick":
            downloadFiles(command);

            port.postMessage({
              type: "result",
              id: message.data.id,
              data: {
                result: "success",
              },
            });

            win.close();

            break;

          default:
            console.warn(`Unsupported command: ${JSON.stringify(command)}`, 2);

            port.postMessage({
              result: "error",
              error: {
                code: "unsupportedCommand",
                message: command.command,
              },
              isExpected: true,
            });
            break;
        }

        break;
    }
  }

  const downloadFiles = async (commandData: any) => {
    onDownloadStart();
    let data = commandData.items[0];
    let tokenObj = getToken();

    let url = `${data["@sharePoint.endpoint"]}/drives/${data.parentReference.driveId}/items/${data.id}`;
    const accessToken = await tokenObj;

    try {
      const response = await axios({
        url: url,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const downloadUrl = response.data["@content.downloadUrl"];

      const downloadResponse = await axios({
        url: downloadUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob",
      });

      const b = downloadResponse?.data;
      const gfile = new File([b], data.name, { type: "text/csv" });

      onFileSubmit(gfile);
    } catch (e) {
      console.log(e, " error");
    }
  };

  async function getToken() {
    if (!app) return "";
    let accessToken = "";

    const authParams: PopupRequest = { scopes: [`OneDrive.ReadOnly`] };

    try {
      // see if we have already the idtoken saved
      const resp = await app.acquireTokenSilent(authParams);
      accessToken = resp.accessToken;
      setConnected(true);
    } catch (e) {
      // per examples we fall back to popup
      const resp = await app.loginPopup(authParams);

      app.setActiveAccount(resp.account);

      if (resp.idToken) {
        const resp2 = await app.acquireTokenSilent(authParams);
        accessToken = resp2.accessToken;
        setConnected(true);
      }
    }

    return accessToken;
  }

  async function clearToken() {
    if (app) {
      await app.clearCache();
      setConnected(false);
    }
  }

  async function checkToken() {
    if (!app) return false;
    let accessToken = "";

    const authParams = { scopes: [`OneDrive.ReadOnly`] };
    try {
      // see if we have already the idtoken saved
      const resp = await app.acquireTokenSilent(authParams);
      accessToken = resp.accessToken;
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    if (app) {
      checkToken().then((c) => {
        setConnected(c);
      });
    }
  }, [app]);

  return { launchPicker, clearToken, connected };
};
