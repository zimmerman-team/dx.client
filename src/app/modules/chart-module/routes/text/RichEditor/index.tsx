import React, { ReactElement, useMemo, useRef } from "react";
import picker from "app/modules/chart-module/routes/text/RichEditor/ColorModal/Picker";
import bgPicker from "app/modules/chart-module/routes/text/RichEditor/BGColorModal/Picker";
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
  placeholder?: string;
  invertColors?: boolean;
  textContent: EditorState;
  setTextContent: (value: EditorState) => void;
  setIsEditorFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  isEditorFocused?: boolean;
  setPlugins?: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  focusOnMount?: boolean;
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

  const [localFocus, setLocalFocus] = React.useState(false);

  const emojiPlugin = createEmojiPlugin({
    selectButtonContent: EmojiButton,
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
        }
      `}
    >
      <Editor
        plugins={plugins}
        customStyleMap={{
          ...bgPicker.bgColorStyleMap,
          ...picker.colorStyleMap,
        }}
        editorKey="RichEditor"
        readOnly={!props.editMode}
        editorState={props.textContent}
        onChange={props.setTextContent}
        onBlur={() => {
          setLocalFocus(false);
          props.setIsEditorFocused?.(false);
        }}
        onFocus={() => {
          setLocalFocus(true);
          props.setIsEditorFocused?.(true);
        }}
        placeholder={props.placeholder ?? "Add your story..."}
        ref={(element) => {
          editor.current = element;
        }}
      />
    </div>
  );
};
