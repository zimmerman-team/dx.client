import { IconButton, Modal } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import React from "react";
import { useStyles } from "./deleteChartDialog";
import { PrimaryButton } from "app/components/Styled/button";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: () => void;
  enableButton: boolean;
}

export default function DeleteAccountDialog(props: Props) {
  const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value === "DELETE") {
      props.handleDelete();
    }
  };

  const classes = useStyles();
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
          <IconButton
            onClick={() => props.setModalDisplay(false)}
            css={`
              position: absolute;
              right: 8px;
              top: 6px;
            `}
          >
            <CloseOutlined htmlColor="#231D2C" />
          </IconButton>
          <p
            css={`
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 40px;
              color: #231d2c;
              line-height: 41px;
              margin-bottom: 0px;
            `}
          >
            Delete account
          </p>
          <p
            css={`
              margin-top: 16px;
              font-size: 18px;
              margin-bottom: 36px;
            `}
          >
            Are you sure about delete account? Deleted accounts can not be
            restored. Upon deletion all your assets will be deleted from our
            systems as well.
          </p>

          <input
            autoFocus
            type="text"
            placeholder='Type "DELETE" to confirm'
            onChange={props.handleInputChange}
            onKeyPress={onInputEnter}
            css={`
              border: 1px solid #231d2c;
              border-radius: 10px;
              background: #ffffff;
              height: 48px;
              width: 100%;
              padding: 0px 24px;
              :focus,
              :active,
              :hover {
                outline: 1px solid #6061e5;
              }
            `}
          />

          <div
            css={`
              display: flex;
              justify-content: flex-end;
              margin-top: 36px;
            `}
          >
            <PrimaryButton
              bg="dark"
              size="big"
              type="submit"
              disabled={!props.enableButton}
            >
              Delete
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
