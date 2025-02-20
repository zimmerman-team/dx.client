import React from "react";

interface Props {
  datasetCategories: string[];
  categories: string[];
  setCategories: (c: string[]) => void;
  customCss?: { gap: string };
}
export default function DatasetCategoryList(props: Readonly<Props>) {
  const { customCss } = props;
  return (
    <div
      css={`
        gap: ${customCss ? customCss.gap : "18px"};
        width: 100%;
        height: 55px;
        display: flex;
        max-width: 100%;
        overflow-x: auto;
        flex-direction: row;
        margin: 40px 0 20px 0;

        &::-webkit-scrollbar {
          height: 5px;
          border-radius: 20px;
          background: #231d2c;
        }
        &::-webkit-scrollbar-track {
          background: #dfe3e6;
        }
        &::-webkit-scrollbar-thumb {
          background: #231d2c;
        }

        > button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: max-content;
          padding: 0 24px;
          height: 35px;
          font-size: 16px;
          white-space: nowrap;
          cursor: pointer;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #231d2c;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
        }
      `}
    >
      {props.datasetCategories.map((c: string) => (
        <button
          key={c}
          onClick={() => {
            if (!props.categories.includes(c)) {
              props.setCategories([...props.categories, c]);
            } else {
              const fCategory = props.categories.filter((f) => f !== c);
              props.setCategories(fCategory);
            }
          }}
          data-cy="dataset-category-button"
          style={
            props.categories.includes(c)
              ? {
                  color: "#fff",
                  background: "#6061E5",
                  border: "none",
                  fontWeight: "bold",
                }
              : {}
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}
