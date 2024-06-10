import React, { useRef } from "react";
import { styles } from "app/modules/report-module/components/reportSubHeaderToolbar/styles";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  autoResize: boolean;
  minWidth: number;
  maxWidth: number;
  name: string;
  setName: (name: string) => void;
  spanVisibility: boolean;
  setSpanVisibility: (spanVisibility: boolean) => void;
  spanBuffer: number;
}
export default function AutoResizeInput(props: InputProps) {
  const {
    autoResize,
    minWidth,
    maxWidth,
    name,
    setName,
    spanVisibility,
    setSpanVisibility,
    spanBuffer,
    ...rest
  } = props;
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const [autoResizeInputWidth, setAutoResizeInputWidth] =
    React.useState<number>(100);

  const handleAutoResize = () => {
    let spanAutoResizeWidth = 0;
    if (spanRef) {
      spanAutoResizeWidth = spanRef.current ? spanRef.current.offsetWidth : 0;
    }
    const localAutoResizeInputWidth =
      !minWidth || spanAutoResizeWidth > minWidth
        ? spanAutoResizeWidth
        : minWidth;

    if (autoResizeInputWidth < props.maxWidth) {
      setAutoResizeInputWidth(localAutoResizeInputWidth);
    } else {
      setAutoResizeInputWidth(props.maxWidth);
    }
  };
  React.useEffect(() => {
    if (props.autoResize) {
      handleAutoResize();
    }
  }, [name, props.autoResize]);

  function getInputStyle() {
    const style = {
      minWidth: 0,
      maxWidth: 0,
      width: 0,
    };

    if (minWidth) {
      style.minWidth = minWidth;
    }

    if (maxWidth) {
      style.maxWidth = maxWidth;
    }

    if (autoResize && autoResizeInputWidth) {
      style.width = autoResizeInputWidth;
    }

    return style;
  }

  function onChange(value: string) {
    setName(value);
  }

  return (
    <>
      <input
        {...rest}
        css={`
          ${styles.nameInput};
          color: ${spanVisibility ? "#f4f4f4" : "#262c34"};
          opacity: ${spanVisibility ? "0" : "1"};
          ${!autoResize ? "width: 100% !important;" : ""};
          max-width: 100% !important;
        `}
        value={name}
        onChange={(e) => onChange(e.target.value)}
        style={getInputStyle()}
        data-cy="report-sub-header-title-input"
        title={name}
      />
      <span
        className="auto-resize-span"
        ref={spanRef}
        title={name}
        css={`
          ${styles.autoResizeSpan}
          visibility: ${spanVisibility ? "visible" : "hidden"};
          max-width: ${autoResize ? `calc(100% - ${spanBuffer}px)` : "100%"};
          margin-left: -0.8px;
        `}
      >
        {` ${name}`}
      </span>
    </>
  );
}
