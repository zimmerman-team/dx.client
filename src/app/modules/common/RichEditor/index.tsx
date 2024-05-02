import React, { ReactElement, useMemo, useRef } from "react";
import picker from "app/modules/common/RichEditor/ColorModal/Picker";
import bgPicker from "app/modules/common/RichEditor/BGColorModal/Picker";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";

/*plugins */
import { EditorState } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createLinkPlugin from "@draft-js-plugins/anchor";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import createUndoPlugin from "@draft-js-plugins/undo";
import createTextAlignmentPlugin from "@draft-js-plugins/text-alignment";
import { RedoIcon } from "app/assets/icons/Redo";
import { UndoIcon } from "app/assets/icons/Undo";
import { EmojiButton } from "./buttons";

/* stylesheets */
import "@draft-js-plugins/anchor/lib/plugin.css";
import editorStyles from "./editorStyles.module.css";
import buttonStyles from "./buttonStyles.module.css";
import toolbarStyles from "./toolbarStyles.module.css";
import alignmentStyles from "./alignmentStyles.module.css";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "@draft-js-plugins/emoji/lib/plugin.css";

export const RichEditor = (props: {
  editMode: boolean;
  fullWidth?: boolean;
  placeholderState: string;
  invertColors?: boolean;
  textContent: EditorState;
  setTextContent: (value: EditorState) => void;
  setPlugins?: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  focusOnMount?: boolean;
  setPlaceholderState: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
}): ReactElement => {
  const editor = useRef<Editor | null>(null);

  const focus = (): void => {
    editor.current?.focus();
  };

  React.useEffect(() => {
    if (props.focusOnMount) {
      focus();
    }
  }, []);

  const [localFocus, setLocalFocus] = React.useState(true);

  const emojiPlugin = createEmojiPlugin({
    selectButtonContent: EmojiButton,
    theme: { emojiSelectButton: buttonStyles.emojiButton },
  });
  const textAlignmentPlugin = createTextAlignmentPlugin({
    theme: {
      alignmentStyles: {
        ...alignmentStyles,
        draftCenter: alignmentStyles.draftCenter,
        draftLeft: alignmentStyles.draftLeft,
        draftRight: alignmentStyles.draftRight,
      },
    },
  });
  const linkPlugin = createLinkPlugin({
    linkTarget: "_blank",
    placeholder: "Enter a URL and press enter",
  });

  const undoPlugin = createUndoPlugin({
    undoContent: <UndoIcon />,
    redoContent: <RedoIcon />,
    theme: { undo: buttonStyles.undoButton, redo: buttonStyles.undoButton },
  });

  const plugins = useMemo(() => {
    const toolbarPlugin = createToolbarPlugin({
      theme: { buttonStyles, toolbarStyles },
    });

    return [
      toolbarPlugin,
      linkPlugin,
      undoPlugin,
      textAlignmentPlugin,
      emojiPlugin,
    ];
  }, []);

  React.useEffect(() => {
    if (localFocus) {
      props.setPlugins?.(plugins);
    }
  }, [localFocus]);

  return (
    <div
      className={
        props.editMode ? editorStyles.editor : editorStyles.editorPreview
      }
      onClick={focus}
      css={`
        ${!props.fullWidth && "max-width: 800px !important;"}

        font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        line-height: normal;
        font-weight: 12px;
        h1,
        h2 {
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          * {
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          }
        }

        blockquote {
          padding-left: 11px;
          margin-inline-start: 0px;
          border-left: 4px solid #262c34;
        }

        .public-DraftEditorPlaceholder-hasFocus {
          .public-DraftEditorPlaceholder-inner {
            opacity: 0.5;
          }
        }

        .public-DraftEditorPlaceholder-inner {
          position: absolute;
          color: #dfe3e5;
          font-weight: bold;
          font-size: 16px;
        }
      `}
      data-cy="rich-text-editor-container"
    >
      <Editor
        plugins={plugins}
        customStyleMap={{
          ...bgPicker.bgColorStyleMap,
          ...picker.colorStyleMap,
          BOLD: {
            fontFamily: "GothamNarrow-Bold",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "normal",
          },
        }}
        editorKey="RichEditor"
        readOnly={!props.editMode}
        editorState={props.textContent}
        onChange={props.setTextContent}
        onBlur={() => {
          setLocalFocus(false);
          if (props.textContent.getCurrentContent().getPlainText().length === 0)
            props.setPlaceholderState(props.placeholder);
        }}
        onFocus={() => {
          setLocalFocus(true);
          props.setPlaceholderState("");
        }}
        placeholder={props.placeholderState}
        ref={(element) => {
          editor.current = element;
        }}
        webDriverTestID="rich-text-editor"
        data-cy="rich-text-editor"
      />
    </div>
  );
};
