import { Snackbar } from "@material-ui/core";
import styled from "styled-components/macro";

export const InfoSnackbar = styled((props) => {
  const { gap, ...otherProps } = props;

  return <Snackbar {...otherProps} />;
})`
  && {
    bottom: 40px;
  }

  & [class*="MuiSnackbarContent-root"] {
    width: 100%;
    display: flex;
    padding: 0 78px;
    background: #fff;
    flex-wrap: nowrap;
    border-radius: 12px;
    gap: ${(props) => (props.gap ? "0px" : "84px")};
    justify-content: center;
    box-shadow: 0 8px 17px -4px rgba(130, 142, 148, 0.35),
      0 0 4px 0 rgba(130, 142, 148, 0.16), 0 0 2px 0 rgba(130, 142, 148, 0.12);

    @media (max-width: 550px) {
      width: calc(100% - 16px);
    }
  }

  & [class*="MuiSnackbarContent-message"] {
    color: #000;
    font-size: 18px;
    padding: 16px 0;
    font-weight: 700;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  }

  & [class*="MuiSnackbarContent-action"] {
    > button {
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      border-style: none;
      padding: 12px 27px;
      background: #262c34;
      border-radius: 20px;
    }
  }

  & [class*="MuiSnackbarContent-action"] {
    padding: 16px 0;
  }
`;
