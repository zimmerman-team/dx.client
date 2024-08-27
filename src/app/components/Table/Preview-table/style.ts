import { css } from "styled-components/macro";

export const previewTablecss = css`
  width: max-content;
  border-collapse: separate;
  background: #fff;
  border-radius: 19px;

  th {
    border-bottom: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;

    padding: 0.1rem 0.7rem;
    height: 54px;
    text-transform: capitalize;
    font-weight: 500;
  }
  td {
    border-bottom: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;

    padding: 10px 16px;
    height: 35px;
    font-weight: 400;
    font-size: 14px;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
  }

  tr {
    :first-of-type {
      th {
        border-top: 1px solid #e4e4e4;
        :first-of-type {
          border-left: 1px solid #e4e4e4;
          border-top-left-radius: 19px;
        }
        :last-of-type {
          border-top-right-radius: 19px;
        }
      }
    }
    :nth-of-type(2) {
      th {
        :first-of-type {
          border-left: 1px solid #e4e4e4;
        }
      }
    }
    td {
      :first-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    :last-of-type {
      td {
        :first-of-type {
          border-bottom-left-radius: 19px;
        }
        :last-of-type {
          border-bottom-right-radius: 19px;
        }
      }
    }
  }
`;
