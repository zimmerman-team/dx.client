import React from "react";

interface Source {
  name: string;
  value: string;
}

interface Props {
  baseSources: Source[];
  sources: string[];
  setSources: (c: string[]) => void;
  customCss?: { gap: string };
  terminateSearch?: () => void;
}
export default function SourceCategoryList(props: Readonly<Props>) {
  const { customCss } = props;
  return (
    <div
      css={`
        gap: ${customCss ? customCss.gap : "19px"};
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        overflow-x: auto;
        flex-direction: row;

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
          font-size: 14px;
          cursor: pointer;
          width: max-content;
          background: #fff;
          border-radius: 12px;
          border: 0.5px solid #231d2c;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          padding: 0px 24px;
          height: 35px;
        }
      `}
    >
      {props.baseSources.map((s) => (
        <button
          key={s.value}
          onClick={() => {
            props.terminateSearch && props.terminateSearch();
            if (!props.sources.includes(s.value)) {
              props.setSources([...props.sources, s.value]);
            } else {
              const fSource = props.sources.filter((f) => f !== s.value);
              props.setSources(fSource);
            }
          }}
          data-cy="source-category-button"
          style={
            props.sources.includes(s.value)
              ? {
                  color: "#fff",
                  background: "#6061E5",
                  border: "none",
                  fontWeight: 400,
                  fontFamily: "GothamNarrow-Bold, 'Helvetica Neue', sans-serif",
                }
              : {}
          }
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
