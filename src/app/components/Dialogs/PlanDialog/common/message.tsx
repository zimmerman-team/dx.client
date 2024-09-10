import React from "react";
import Box from "@material-ui/core/Box";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";
import { useRecoilState } from "recoil";
import { planDialogAtom } from "app/state/recoil/atoms";
import { useHistory } from "react-router-dom";

const MessageContainer = styled((props) => <Box {...props} />)`
  align-items: center;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 960px) {
    flex-direction: column;
    align-items: normal;
  }
  p {
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: #231d2c;
    cursor: pointer;
  }
`;

const Typo = styled((props) => <Typography {...props} />)`
  && {
    align-self: center;
    @media (max-width: 960px) {
      margin-bottom: 8px;
    }
  }
`;

const Button = styled.button`
  padding: 16px 24px;
  border-radius: 48px;
  background: #6061e5;
  color: #fff;
  outline: none;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 960px) {
    margin-bottom: 8px;
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
        `}
      >
        <p
          css={`
            text-transform: uppercase;
            flex-shrink: 0;
          `}
          onClick={props.onClose}
        >
          Not Now
        </p>
        {planDialog.tryAgain && (
          <Button
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
          </Button>
        )}
        <Button
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
          Upgrade Now
        </Button>
      </div>
    </MessageContainer>
  );
};
