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
          width: 160px;
          height: 40px;
          font-size: 14px;
          cursor: pointer;
          min-width: 160px;
          max-width: 160px;
          background: #fff;
          border-radius: 30px;
          border: 1px solid #231d2c;
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
