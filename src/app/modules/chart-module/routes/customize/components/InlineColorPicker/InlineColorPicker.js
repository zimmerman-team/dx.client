import React, { useState } from "react";
import { SketchPicker } from "react-color";
import styles from "./InlineColorPicker.module.css";

export default function InlineColorPicker({
  color: maybeColor,
  onChange,
  disabled,
}) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const color = maybeColor ?? "#000000"; // Same as <input type='color' />

  const pickerRef = React.useRef(null);

  const rect = pickerRef?.current?.getBoundingClientRect();

  const heightDifference = rect
    ? document.documentElement.scrollHeight - (window.scrollY + rect.bottom)
    : 0;

  const heightCheck = 350;

  return (
    <div
      css={`
        position: relative;
      `}
    >
      <div
        className={styles.swatch}
        onClick={() => setDisplayColorPicker(true)}
        id="inline-color-picker-swatch"
        ref={pickerRef}
      >
        <div className={styles.color} style={{ background: color }} />
        {color.toUpperCase()}
      </div>
      {displayColorPicker && (
        <div
          css={`
            position: absolute;
            z-index: 2000;
            right: 0;
            ${heightDifference < heightCheck ? "bottom: 100%;" : "top: 100%;"};
          `}
          id="inline-color-picker-popover"
        >
          <div
            className={styles.cover}
            onClick={() => setDisplayColorPicker(false)}
          />
          <div
            css={`
              .sketch-pickerz {
                padding: 16px !important;
                box-shadow: 0px 0px 6px 0px rgba(31, 41, 55, 0.05),
                  0px 10px 15px 0px rgba(31, 41, 55, 0.1) !important;
                border: none;
                > div:nth-of-type(1) {
                  padding-bottom: 45% !important;
                }
                > .flexbox-fix:nth-of-type(4) {
                  div {
                    width: 24px !important;
                    height: 24px !important;
                    border-radius: 50% !important;
                    border: none !important;
                    &:hover {
                      border-radius: 100px;
                      border: 2px solid var(--white, #fff);
                      background: var(--indigo-500, #6467f2);
                      box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.25);
                    }
                  }
                }
              }
            `}
          >
            <SketchPicker
              disabled={disabled}
              disableAlpha
              color={color}
              onChangeComplete={(color) => onChange(color.hex)}
              width={264}
              className="sketch-pickerz"
            />
          </div>
        </div>
      )}
    </div>
  );
}
