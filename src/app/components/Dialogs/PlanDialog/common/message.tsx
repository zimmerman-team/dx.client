import React from "react";
import Box from "@material-ui/core/Box";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";
import { useRecoilState } from "recoil";
import { planDialogAtom } from "app/state/recoil/atoms";
import { useHistory } from "react-router-dom";
import { PrimaryButton, TertiaryButton } from "app/components/Styled/button";

const MessageContainer = styled((props) => <Box {...props} />)`
  align-items: center;
  width: 100%;

  justify-content: space-between;
  @media (max-width: 960px) {
    flex-direction: column;
    align-items: normal;
  }
  @media (max-width: 600px) {
    gap: 16px;
    flex-direction: column;
    align-items: normal;
    justify-content: center;

    button {
      width: max-content;
    }
  }
  p {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: #231d2c;
    cursor: pointer;
    margin: 0px;
  }
`;

const Typo = styled((props) => <Typography {...props} />)`
  && {
    align-self: center;
    flex-shrink: 4;
    @media (max-width: 960px) {
      margin-bottom: 8px;
      align-self: start;
    }
  }
`;

type MessageProps = {
  onClose?: () => void;
  message: string;
};

export const Message = (props: MessageProps) => {
  const [planDialog, setPlanDialog] = useRecoilState(planDialogAtom);

  const history = useHistory();
  return (
    <MessageContainer display="flex">
      <Typo
        variant="body1"
        css={`
          color: #231d2c;

          a {
            color: #231d2c;
          }
        `}
        dangerouslySetInnerHTML={{ __html: props.message }}
      />
      <div
        css={`
          display: flex;
          align-items: center;
          gap: 16px;
          flex-basis: auto;
          @media (max-width: 960px) {
            justify-content: flex-end;

            @media (max-width: 600px) {
              justify-content: center;
              flex-direction: ${planDialog.tryAgain ? "column" : "row"};
              gap: ${planDialog.tryAgain ? "8px" : "16px"};

              button {
                width: ${planDialog.tryAgain ? "193px" : " max-content"};
              }
            }
          }
        `}
      >
        {planDialog.tryAgain && (
          <PrimaryButton
            size="small"
            bg="dark"
            type="button"
            onClick={() => {
              planDialog.onTryAgain();
              setPlanDialog({
                open: false,
                message: "",
                tryAgain: "",
                onTryAgain: () => {},
              });
            }}
          >
            {planDialog.tryAgain}
          </PrimaryButton>
        )}
        <PrimaryButton
          size="small"
          bg="light"
          type="button"
          onClick={() => {
            history.push("/pricing");
            setPlanDialog({
              open: false,
              message: "",
              tryAgain: "",
              onTryAgain: () => {},
            });
          }}
        >
          Upgrade
        </PrimaryButton>
        <TertiaryButton
          size="small"
          bg="light"
          type="button"
          css={`
            text-transform: uppercase;
            flex-shrink: 0;
          `}
          onClick={props.onClose}
        >
          Not Now
        </TertiaryButton>
      </div>
    </MessageContainer>
  );
};
