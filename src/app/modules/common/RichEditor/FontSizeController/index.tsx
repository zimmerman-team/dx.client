import { EditorState, RichUtils, ContentState, Modifier } from "draft-js";
import { set } from "lodash";
import React, { useEffect } from "react";

interface Props {
  getEditorState: () => EditorState;
  setEditorState: (value: EditorState) => void;
  theme: any;
}
export default function FontSizeController(props: Props) {
  const [fontSize, setFontSize] = React.useState(14);

  const reduceFontSize = () => {
    updateEditorStateWithFontSize(fontSize - 1);
    setFontSize((prev) => prev - 1);
  };
  const increaseFontSize = () => {
    updateEditorStateWithFontSize(fontSize + 1);

    setFontSize((prev) => prev + 1);
  };

  useEffect(() => {
    const currentStyle = props.getEditorState().getCurrentInlineStyle();
    const nfontSize = currentStyle.findLast((style: any) =>
      style.includes("font-size")
    );
    if (nfontSize) {
      const size = nfontSize.split("-")[2];
      setFontSize(Number(size));
    } else {
      setFontSize(14);
    }
  }, [props.getEditorState().getCurrentInlineStyle()]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //number validation with regex so input only accepts number characters
    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
      updateEditorStateWithFontSize(Number(e.target.value));
      setFontSize(Number(e.target.value));
    }
  };
  const updateEditorStateWithFontSize = (fontSize: number) => {
    const editorState = props.getEditorState();
    const currentStyle = editorState.getCurrentInlineStyle();
    let newEditorState = editorState;

    if (currentStyle.has(`font-size-${fontSize}`)) {
      // reset the font size
      newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        `font-size-${fontSize}`
      );
    }
    props.setEditorState(
      RichUtils.toggleInlineStyle(newEditorState, `font-size-${fontSize}`)
    );
  };

  return (
    <>
      <div
        css={`
          width: 57px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          border-radius: 8px;
          background: #f4f4f4;
          span {
            font-size: 14px;
            color: #70777e;
            font-family: "GothamNarrow-Bold", sans-serif;
            cursor: pointer;
          }

          input {
            width: 20px;
            height: 100%;
            text-align: center;
            background: transparent;
            border: none;
            font-size: 14px;
            font-family: "GothamNarrow-Bold", sans-serif;
            color: #70777e;
            outline: none;
          }
        `}
      >
        <span
          onClick={() => reduceFontSize()}
          onMouseDown={(e) => e.preventDefault()}
        >
          -
        </span>
        <input
          type="text"
          name="font-size"
          id=""
          onChange={handleInputChange}
          value={fontSize}
          min={1}
        />
        <span
          onClick={() => increaseFontSize()}
          onMouseDown={(e) => e.preventDefault()}
        >
          +
        </span>
      </div>
    </>
  );
}
