import React from "react";
import Box from "@material-ui/core/Box";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";

const MessageContainer = styled((props) => <Box {...props} />)`
  align-items: center;
  justify-content: space-between;
  @media (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

const Typo = styled((props) => <Typography {...props} />)`
  && {
    align-self: center;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #231d2c;
  color: #fff;
  width: 91px;
  height: 48px;
  outline: none;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
  cursor: pointer;

  @media (max-width: 744px) {
    height: 35px;
  }
  @media (max-width: 425px) {
    width: 100%;
  }
`;

type MessageProps = {
  onClose?: () => void;
};

export const Message = (props: MessageProps) => {
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
      >
        The website makes use of{" "}
        <a
          href={`https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view?usp=drive_link`}
          target="_blank"
          rel="noopener noreferrer"
        >
          cookies
        </a>
        . Review{" "}
        <a
          href={`https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view?usp=drive_link`}
          target="_blank"
          rel="noopener noreferrer"
        >
          data privacy
        </a>{" "}
        for more details.
      </Typo>
      <Button data-cy="cookie-btn" type="button" onClick={props.onClose}>
        {" "}
        Agree
      </Button>
    </MessageContainer>
  );
};
