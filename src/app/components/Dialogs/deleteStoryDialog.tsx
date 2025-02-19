import React from "react";
import CloseOutlined from "@material-ui/icons/ClearOutlined";
import { createStyles, IconButton, makeStyles, Modal } from "@material-ui/core";
import { PrimaryButton } from "app/components/Styled/button";

interface Props {
  cardId?: string;

  modalDisplay: boolean;
  enableButton: boolean;
  handleDelete: (id: string) => void;
  setModalDisplay: (value: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    paper: {
      outline: 0,
      width: 560,
      borderRadius: "16px",
      position: "relative",
      padding: "0 81px",
      paddingBottom: "32px",
      backgroundColor: "#fff",
      boxShadow:
        "0px 14.8787px 22.318px rgba(0, 0, 0, 0.05), 0px 4.4636px 7.43933px rgba(0, 0, 0, 0.05), 0px 0.743933px 7.43933px rgba(0, 0, 0, 0.05)",
      "@media (max-width: 577px)": {
        width: "90%",
        padding: "0 48px",
        paddingBottom: "32px",
      },
    },
  })
);

export default function DeleteStoryDialog(props: Props) {
  const classes = useStyles();

  const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value === "DELETE") {
      props.handleDelete(props.cardId as string);
    }
  };

  return (
    <Modal
      open={props.modalDisplay}
      className={classes.modal}
      onClose={() => props.setModalDisplay(false)}
    >
      <div className={classes.paper}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.handleDelete(props.cardId as string);
          }}
          data-cy="delete-story-item-form"
          aria-label="form"
        >
          <div>
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
                font-size: 40px;
                color: #231d2c;
                line-height: 41px;
                margin-bottom: 0px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              `}
            >
              Delete story
            </p>
            <p
              css={`
                margin-top: 16px;
                margin-bottom: 32px;
                font-size: 18px;
              `}
            >
              Absolutely sure you want to delete the story(s)? <br />{" "}
              <b>This action is irreversible!</b>
            </p>

            <input
              autoFocus
              type="text"
              placeholder='Type "DELETE" to confirm'
              onChange={props.handleInputChange}
              onKeyPress={onInputEnter}
              data-cy="delete-story-item-input"
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
                margin-top: 32px;
                display: flex;
                justify-content: flex-end;
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
        </form>
      </div>
    </Modal>
  );
}
