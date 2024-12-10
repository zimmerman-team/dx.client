import React from "react";
import Modal from "@material-ui/core/Modal";
import { CloseOutlined } from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
import { ReactComponent as ShareIconLight } from "app/modules/dataset-module/assets/share-icon.svg";
import { ReactComponent as CopyIconLight } from "app/modules/dataset-module/assets/copy-icon.svg";
import { ReactComponent as FacebookIcon } from "app/components/Dialogs/EmbedChartDialog/assets/facebook.svg";
import { ReactComponent as TwitterIcon } from "app/components/Dialogs/EmbedChartDialog/assets/twitter.svg";
import { ReactComponent as LinkedinIcon } from "app/components/Dialogs/EmbedChartDialog/assets/linkedIn.svg";
import { ReactComponent as PNGIcon } from "app/components/Dialogs/EmbedChartDialog/assets/png-icon.svg";
import { ReactComponent as SVGIcon } from "app/components/Dialogs/EmbedChartDialog/assets/svg-icon.svg";
import { ReactComponent as PDFIcon } from "app/components/Dialogs/EmbedChartDialog/assets/pdf-icon.svg";
import { shareModalcss } from "app/modules/story-module/components/storySubHeaderToolbar/infosnackbar";
import SaveAlt from "@material-ui/icons/SaveAlt";
import { makeStyles, createStyles } from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";
import { exportPage } from "app/utils/exportPage";

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
  })
);
export default function ShareModal(props: {
  isShareModalOpen: boolean;
  setIsShareModalOpen: (val: boolean) => void;
  datasetDetails: any;
  handleCopy: (text: string, result: boolean) => void;
  url: string;
}) {
  const classes = useStyles();
  function handleTypeChange(value: ".svg" | ".png" | ".pdf", filename: string) {
    if (value === ".png") {
      exportPage("png", "#f2f7fd", filename);
    }
    if (value === ".svg") {
      exportPage("svg", "#f2f7fd", filename);
    }
    if (value === ".pdf") {
      exportPage("pdf", "", filename);
    }
  }

  return (
    <Modal
      open={props.isShareModalOpen}
      onClose={() => props.setIsShareModalOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modal}
    >
      <div css={shareModalcss}>
        <p>
          <span title={props.datasetDetails.name ?? ""}>
            {props.datasetDetails?.name}
          </span>{" "}
          <span
            css={`
              margin-top: 1px;
            `}
          >
            <CloseOutlined onClick={() => props.setIsShareModalOpen(false)} />
          </span>
        </p>
        <p>
          <ShareIconLight /> <span>Share via Social Media</span>
        </p>
        <div>
          <a
            href={`https://www.facebook.com/sharer.php?u=${props.url}`}
            target="_blank"
            rel="noreferrer"
          >
            <FacebookIcon />
          </a>

          <a
            href={`https://x.com/intent/tweet?url=${encodeURIComponent(
              props.url
            )}&quote=${encodeURIComponent("")}`}
            target="_blank"
            rel="noreferrer"
          >
            <TwitterIcon />
          </a>

          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              props.url
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinIcon />
          </a>
        </div>
        <div>
          <div>
            <p>
              <LinkIcon /> <span>Copy The Link</span>
            </p>
            <CopyToClipboard text={props.url} onCopy={props.handleCopy}>
              <button>
                <CopyIconLight />
              </button>
            </CopyToClipboard>
          </div>
          <div
            css={`
              border-radius: 10px;
              border: 1px solid #000;
              background: #fff;
              height: 35px;
              width: 100%;
              display: flex;
              align-items: center;
              p {
                color: #565656;
                font-family: "GothamNarrow-Book", sans-serif;
                font-size: 10px;
              }
            `}
          >
            <p>{props.url}</p>
          </div>
        </div>
        <div>
          <p>
            <SaveAlt /> Download{" "}
          </p>
          <div>
            <button
              onClick={() =>
                handleTypeChange(".pdf", props.datasetDetails?.name)
              }
            >
              <PDFIcon />
              PDF
            </button>
            <button
              onClick={() =>
                handleTypeChange(".png", props.datasetDetails?.name)
              }
            >
              <PNGIcon />
              PNG
            </button>
            <button
              onClick={() =>
                handleTypeChange(".svg", props.datasetDetails?.name)
              }
            >
              <SVGIcon />
              SVG
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
