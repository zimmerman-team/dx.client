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

  React.useEffect(() => {
    if (props.autoResize) {
      handleAutoResize();
    }
  }, [name, props.autoResize]);

  const handleAutoResize = () => {
    let spanAutoResizeWidth = 0;
    if (spanRef) {
      spanAutoResizeWidth = spanRef.current ? spanRef.current.offsetWidth : 0;
    }

    const autoResizeInputWidth =
      !minWidth || spanAutoResizeWidth > minWidth
        ? spanAutoResizeWidth
        : minWidth;

    if (autoResizeInputWidth < props.maxWidth) {
      setAutoResizeInputWidth(autoResizeInputWidth);
    } else {
      setAutoResizeInputWidth(props.maxWidth);
    }
  };

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
    <div>
      <input
        {...rest}
        css={`
          ${styles.nameInput};
          color: ${spanVisibility ? "#f4f4f4" : "#262c34"};
          opacity: ${spanVisibility ? "0" : "1"};
        `}
        value={name}
        onChange={(e) => onChange(e.target.value)}
        style={getInputStyle()}
        data-cy="report-sub-header-title-input"
        title={name}
      />
      {!props.autoResize || (
        <span
          className="auto-resize-span"
          ref={spanRef}
          title={name}
          css={`
            ${styles.autoResizeSpan}
            visibility: ${spanVisibility ? "visible" : "hidden"};
            max-width: ${`calc(100% - ${spanBuffer}px)`};
          `}
        >
          {` ${name}`}
        </span>
      )}
    </div>
  );
}
