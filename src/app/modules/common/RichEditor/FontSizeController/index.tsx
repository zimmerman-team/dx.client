import { EditorState, RichUtils, ContentState, Modifier } from "draft-js";
import { set } from "lodash";
import React, { useEffect } from "react";

interface Props {
  getEditorState: () => EditorState;
  setEditorState: (value: EditorState) => void;
  theme: any;
}
export default function FontSizeController(props: Props) {
  const [fontSize, setFontSize] = React.useState(10);

  const reduceFontSize = () => {
    const editorState = props.getEditorState();

    const currentStyle = editorState.getCurrentInlineStyle();

    let newEditorState = editorState;
    if (currentStyle.has(`font-size-${fontSize - 1}`)) {
      newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        `font-size-${fontSize - 1}`
      ); // reset the font size
    }

    props.setEditorState(
      RichUtils.toggleInlineStyle(newEditorState, `font-size-${fontSize - 1}`)
    );
    setFontSize((prev) => prev - 1);
  };
  const increaseFontSize = () => {
    const editorState = props.getEditorState();
    const currentStyle = editorState.getCurrentInlineStyle();
    let newEditorState = editorState;

    if (currentStyle.has(`font-size-${fontSize + 1}`)) {
      // reset the font size
      newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        `font-size-${fontSize + 1}`
      );
    }
    props.setEditorState(
      RichUtils.toggleInlineStyle(newEditorState, `font-size-${fontSize + 1}`)
    );
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
    }
  }, [props.getEditorState().getCurrentInlineStyle()]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
      const editorState = props.getEditorState();
      const currentStyle = editorState.getCurrentInlineStyle();
      let newEditorState = editorState;

      if (currentStyle.has(`font-size-${e.target.value}`)) {
        // reset the font size
        newEditorState = RichUtils.toggleInlineStyle(
          editorState,
          `font-size-${e.target.value}`
        );
      }
      props.setEditorState(
        RichUtils.toggleInlineStyle(
          newEditorState,
          `font-size-${e.target.value}`
        )
      );
      setFontSize(Number(e.target.value));
    }
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
        <span onClick={() => reduceFontSize()}>-</span>
        <input
          type="text"
          name="font-size"
          id=""
          onChange={handleInputChange}
          value={fontSize}
          min={1}
        />
        <span onClick={() => increaseFontSize()}>+</span>
      </div>
    </>
  );
}
