import { IconButton, Modal, createStyles, makeStyles } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import useGetChartsStoriesCountByDataset from "app/hooks/useGetChartsStoriesCountByDataset";
import CircleLoader from "app/modules/home-module/components/Loader";
import React from "react";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
  handleDelete: (id: string) => void;
  cardId: string;
  enableButton: boolean;
  setEnableButton: (value: React.SetStateAction<boolean>) => void;
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
      width: 646,
      borderRadius: "10px",
      position: "relative",
      padding: "2.5rem 2.5rem 2.5rem 3.5rem",
      backgroundColor: "#fff",
      boxShadow:
        "0px 14.8787px 22.318px rgba(0, 0, 0, 0.05), 0px 4.4636px 7.43933px rgba(0, 0, 0, 0.05), 0px 0.743933px 7.43933px rgba(0, 0, 0, 0.05)",
      "@media (max-width: 650px)": {
        width: "80%",
      },
    },
  })
);

export default function DeleteDatasetDialog(props: Props) {
  const classes = useStyles();

  const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value === "DELETE") {
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

  const { data, loading } = useGetChartsStoriesCountByDataset(props.cardId);

  return (
    <div>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {loading ? (
          <div className="w-full h-[80px] flex items-center justify-center">
            <CircleLoader />
          </div>
        ) : (
          <div className={classes.paper}>
            <form
              onSubmit={() => props.handleDelete(props.cardId)}
              data-cy="delete-dataset-item-form"
            >
              <div
                css={`
                  width: 80%;
                `}
              >
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
                    font-weight: 400;
                    font-size: 34px;
                    padding: 0;
                    margin: 0;
                    color: #231d2c;
                    line-height: 41px;
                    margin-bottom: 0px;
                  `}
                >
                  Delete dataset
                </p>
                <p
                  css={`
                    margin-top: 8px;
                    font-size: 16px;
                  `}
                >
                  By deleting this dataset you and other users will lose access
                  to
                  <br />
                  this data and will affect usage of some charts and stories. A
                  <br />
                  total of {data.chartsCount} charts and {data.storiesCount}{" "}
                  stories will be affected.
                  <br /> <br />{" "}
                  <b>
                    Once you delete this dataset there is no turning back as
                    this
                    <br />
                    action is irreversible.
                  </b>
                </p>
                <div
                  css={`
                    margin-top: 32px;
                  `}
                >
                  <input
                    autoFocus
                    type="text"
                    placeholder='Type "DELETE" to confirm'
                    onChange={handleInputChange}
                    onKeyPress={onInputEnter}
                    css={`
                      border: 1px solid #231d2c;
                      border-radius: 10px;
                      background: #ffffff;
                      height: 48px;
                      width: 80%;
                      padding: 0px 24px;
                      :focus,
                      :active,
                      :hover {
                        outline: 1px solid #6061e5;
                      }
                      @media (max-width: 460px) {
                        width: 100%;
                      }
                    `}
                    data-cy="delete-dataset-item-input"
                  />
                </div>
              </div>
              <div
                css={`
                  display: flex;
                  justify-content: flex-end;
                  margin-top: 36px;
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
        )}
      </Modal>
    </div>
  );
}
