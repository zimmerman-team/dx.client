import { IconButton, Modal } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import React from "react";
import { useStyles } from "./deleteChartDialog";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
  handleDelete: (id: string) => void;
  cardId: string;
  enableButton: boolean;
  setEnableButton: (value: React.SetStateAction<boolean>) => void;
}

export default function DeleteDatasetDialog(props: Props) {
  const classes = useStyles();

  const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.handleDelete(props.cardId);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "DELETE") {
      props.setEnableButton(true);
    } else {
      props.setEnableButton(false);
    }
  };

  return (
    <div>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <form onSubmit={() => props.handleDelete(props.cardId)}>
            <div
              css={`
                width: 80%;
                position: relative;
              `}
            >
              <IconButton
                onClick={() => props.setModalDisplay(false)}
                css={`
                  position: absolute;
                  right: -93px;
                  top: -16px;
                  color: "#231D2C";
                `}
              >
                <CloseOutlined color="inherit" />
              </IconButton>
              <p
                css={`
                  font-weight: 400;
                  font-size: 34px;
                  color: #231d2c;
                  line-height: 41px;
                  margin-bottom: 0px;
                `}
              >
                Delete dataset
              </p>
              <p
                css={`
                  margin-top: 3px;
                `}
              >
                Absolutely sure you want to delete the dataset(s)? <br />{" "}
                <b>This action is irreversible!</b>
              </p>
              <div
                css={`
                  margin-top: 3rem;
                `}
              >
                <input
                  type="text"
                  placeholder='Type "DELETE" to confirm'
                  onChange={handleInputChange}
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
              </div>
            </div>
            <div
              css={`
                display: flex;
                justify-content: flex-end;
                margin-top: 3rem;

                margin-bottom: 2rem;
                padding-right: 1rem;
              `}
            >
              <button
                type="submit"
                disabled={!props.enableButton}
                css={`
                  background: ${props.enableButton ? "#231D2C" : "#e4e4e4"};
                  border-radius: 30px;
                  width: 107px;
                  height: 41px;
                  outline: none;
                  border: none;
                  text-transform: uppercase;
                  color: #ffffff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;
                `}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
