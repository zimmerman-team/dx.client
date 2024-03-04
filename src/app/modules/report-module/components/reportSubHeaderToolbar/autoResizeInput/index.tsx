import React, { useRef } from "react";
import { styles } from "app/modules/report-module/components/reportSubHeaderToolbar/styles";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  autoResize: boolean;
  minWidth: number;
  maxWidth: number;
  name: string;
  setName: (name: string) => void;
};
export default function AutoResizeInput(props: InputProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const { minWidth } = props;
  const [autoResizeInputWidth, setAutoResizeInputWidth] =
    React.useState<number>(100);

  React.useEffect(() => {
    if (props.autoResize) {
      handleAutoResize();
    }
  }, [props.name, props.autoResize]);

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
    const { autoResize, minWidth, maxWidth } = props;

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
    props.setName(value);
  }

  return (
    <div>
      <input
        {...props}
        css={`
          ${styles.nameInput};
        `}
        value={props.name}
        onChange={(e) => onChange(e.target.value)}
        style={getInputStyle()}
        data-cy="report-sub-header-title-input"
      />
      {!props.autoResize || (
        <span
          className="auto-resize-span"
          ref={spanRef}
          css={`
            ${styles.autoResizeSpan}
          `}
        >
          {` ${props.name}`}
        </span>
      )}
    </div>
  );
}
