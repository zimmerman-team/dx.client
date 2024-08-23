import { Select, TextField, withStyles } from "@material-ui/core";
import { css } from "styled-components/macro";

export const stepcss = css`
  left: 0;
  top: 47px;
  z-index: 10;
  width: 100vw;
  height: 50px;

  display: flex;
  align-items: center;
  position: fixed;
  justify-content: center;
  background: #f4f4f4;
  gap: 1rem;
  @media (min-width: 768px) {
    @media (max-width: 881px) {
      top: 66px;
    }
  }
`;

export const uploadAreacss = (isDragActive: boolean, disabled?: boolean) => css`
  height: 131px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: ${!isDragActive && !disabled ? "pointer" : "default"};
  }
  p {
    text-align: center;
  }
  button:nth-of-type(1) {
    background: #e492bd;
    p {
      font-weight: 700;
    }
  }
  button {
    border: none;
    outline: none;
    background: #231d2c;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 27px;
    gap: 10px;
    height: 43px;
    /* width: 191px; */
    cursor: pointer;
    color: #ffffff;
    p {
      font-weight: 500;
      font-size: 14px;
      font-family: "Inter", sans-serif;
      text-transform: uppercase;
    }
  }
  label {
    :hover {
      opacity: 0.9;
    }
  }
`;

export const metaDatacss = css`
  width: 100%;
  h1 {
    font-weight: 500;
    font-size: 48px;
    font-family: "Inter", sans-serif;

    margin-bottom: 4.5rem;
    @media (min-width: 768px) {
      @media (max-width: 1024px) {
        margin-top: 10px;
        margin-bottom: 3.5rem;
      }
    }
  }
  button {
    border-radius: 30px;
    padding: 12px 27px;
    height: 41px;

    font-weight: 500;
    font-size: 14px;
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

export const dataSetsCss = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  a {
    text-decoration: none;
  }
`;
export const mobileDescriptioncss = css`
  display: none;
  @media (max-width: 450px) {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    div {
      p {
        margin: 0px;
        &:nth-of-type(1) {
          color: #231d2c;
          font-family: "GothamNarrow-Bold", sans-serif;
        }
        &:nth-of-type(2) {
          font-family: "GothamNarrow-Book", sans-serif;
        }
      }
    }
  }
`;

export const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#231D2C",
    },
    "&.MuiInputLabel-outlined": {
      fontSize: "16px",
      fontFamily: "'GothamNarrow-Book', sans-serif",
      color: "#231D2C",
    },
    "& .MuiOutlinedInput-input": {
      padding: "2px 14px",
      height: "48px",
      backgroundColor: "#Fff",
    },
    "& .MuiFormHelperText-root": {
      color: "#231D2C",
      fontSize: "12px",
      fontWeight: 400,
      marginLeft: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#231D2C",
    },
    "& .MuiOutlinedInput-multiline ": {
      backgroundColor: "#Fff",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#231D2C",
        borderRadius: "10px",
        paddingBottom: "4px",
      },
      "&:hover fieldset": {
        borderColor: "#231D2C",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#231D2C",
      },
    },
  },
})(TextField);

export const CssSelectField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#231D2C",
    },
    "&.MuiInputLabel-outlined": {
      fontSize: "16px",
      fontFamily: "'GothamNarrow-Book', sans-serif",
      color: "#231D2C",
    },
    "&.MuiSelect-outlined": {
      padding: "2px 14px",
      height: "48px",
      background: "#fff",
      display: "flex",
      alignItems: "center",
    },
    "&.MuiFormHelperText-root": {
      color: "#231D2C",
      fontSize: "12px",
      fontWeight: 400,
      marginLeft: "0px",
    },
    "&.MuiInput-underline:after": {
      borderBottomColor: "#231D2C",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#231D2C",
        borderRadius: "10px",
        paddingBottom: "4px",
      },
      "&:hover fieldset": {
        borderColor: "#231D2C",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#231D2C",
      },
    },
  },
})(Select);
