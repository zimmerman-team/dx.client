import { css } from "styled-components/macro";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { withStyles } from "@material-ui/core/styles";

export const styles = {
  container: css`
    right: 0;
    z-index: 99;
    position: fixed;
    top: 97px;
    display: flex;
    background: #f1f3f5;
    box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
    flex-direction: column;

    > section {
      padding: 0 31px 25px 31px;

      > h5 {
        font-size: 18px;
        font-weight: 700;
        margin: 25px 0 16px 0;
        font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
      }

      > h6 {
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
      }
    }
  `,
  contentlist: css`
    width: 100%;
    display: flex;
    margin-top: 40px;
    flex-direction: column;

    > div {
      display: flex;
      font-weight: 700;
      flex-direction: row;
      margin-bottom: 24px;
      align-items: center;
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;

      :nth-of-type(1),
      :nth-of-type(2) {
        cursor: pointer;
      }

      > div {
        width: 32px;
        height: 32px;
        padding: 3px;
        margin-right: 14px;
        border-radius: 50%;
        border: 1px solid #373d43;
      }
    }
  `,
  textcontent: css`
    width: 192px;
    display: flex;
    color: #98a1aa;
    font-size: 18px;
    font-weight: 700;
    padding-top: 96px;
    line-height: 22px;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  `,
  exportview: css`
    width: 400px;
    background: red;
    padding: 24px;
  `,
};

export const mappingStyles = {
  selectedButtoncss: (dimension: any) => css`
    width: 100%;
    display: flex;
    font-size: 14px;
    padding: 12px 16px;
    margin-bottom: 8px;
    margin-top: 6px;
    flex-direction: row;
    height: 31px;
    border-radius: 36px;
    border: ${dimension.mappedValues.length > 0 && !dimension.multiple
      ? "none"
      : "0.722px dashed #262c34"};
    background: ${dimension.mappedValues.length > 0 && !dimension.multiple
      ? "#262c34"
      : "#dfe3e5"};
    text-transform: capitalize;
    justify-content: space-between;
    color: ${dimension.mappedValues.length > 0 && !dimension.multiple
      ? "#fff"
      : "#868e96"};

    &:hover {
      background: #262c34;
      color: #fff;
      svg {
        path {
          fill: #fff;
        }
      }
    }

    svg {
      transition: all 0.2s ease-in-out;
      transform: rotate(${dimension.mapValuesDisplayed ? "180" : "0"}deg);
      > path {
        fill: ${dimension.mappedValues.length > 0 && !dimension.multiple
          ? "#fff"
          : "#262c34"};
      }
      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
      }
    }
  `,
  mappingItemcss: (props: any) => css`
    height: 31px;
    display: flex;
    justify-content: space-between;
    min-height: 31px;
    position: relative;
    padding-left: 16px;
    align-items: center;
    border-radius: 25px;
    margin-bottom: ${props.marginBottom};
    color: #262c34;
    background: ${props.backgroundColor ?? "#cfd4da"};
    ${props.dimension.mappedValues.includes(props.mappingItemValue) &&
    "background: #262c34; color: #fff;"}
    >div:nth-of-type(1) {
      display: flex;
      align-items: center;
      gap: 13px;
      width: 100%;
    }
    p {
      font-family: "GothamNarrow-book", sans-serif;
      font-size: 14px;
    }
    &:hover {
      background: #262c34;
      color: #fff;
      svg {
        path {
          fill: #fff;
        }
      }
    }
    cursor: pointer;
  `,
  mappedValuecss: css`
    height: 31px;
    display: flex;
    gap: 13px;
    min-height: 31px;
    position: relative;
    padding-left: 16px;
    width: 100%;
    align-items: center;
    border-radius: 25px;
    z-index: 10;
    transform: translate(0px, 0px);
    margin-bottom: 8px;
    background: #262c34;
    border: none;
    gap: 12px;
    outline: none;
    color: #fff;
    p {
      font-family: "Roboto", sans-serif;
      font-size: 14px;
    }
    &:last-child {
      margin-bottom: 0px;
    }
    &:hover {
      background: #262c34;
      color: #fff;
      svg {
        path {
          fill: #fff;
        }
      }
    }
    cursor: pointer;
  `,
};

export const Accordion = withStyles({
  root: {
    boxShadow: "none",
    borderTop: "1px solid #C0C7D2",
    backgroundColor: "transparent",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

export const AccordionSummary = withStyles({
  root: {
    minHeight: 56,
    marginBottom: -1,
    padding: "0 24px",
    backgroundColor: "transparent",
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    fontSize: "14px",
    "& > div": {
      width: 23,
      height: 23,
      color: "#fff",
      marginRight: 25,
      fontSize: "14px",
      borderRadius: "50%",
      textAlign: "center",
      backgroundColor: "#727F95",
    },
    "&$expanded": {
      margin: "12px 0",
      fontFamily: "GothamNarrow-Bold, sans-serif",
      fontWeight: 700,
      "& > div": {
        backgroundColor: "#262C34",
      },
    },
  },
  expanded: {},
})(MuiAccordionSummary);

export const AccordionDetails = withStyles(() => ({
  root: {
    padding: "16px 24px",
    flexDirection: "column",
  },
}))(MuiAccordionDetails);
