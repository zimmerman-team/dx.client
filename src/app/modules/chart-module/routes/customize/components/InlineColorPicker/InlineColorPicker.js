import React, { useState } from "react";
import styles from "./InlineColorPicker.module.css";
import { SketchPicker } from "react-color";

export default function InlineColorPicker({
  color: maybeColor,
  onChange,
  disabled,
}) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const color = maybeColor ?? "#000000"; // Same as <input type='color' />

  return (
    <>
      <div
        className={styles.swatch}
        onClick={() => setDisplayColorPicker(true)}
      >
        <div className={styles.color} style={{ background: color }} />
        {color.toUpperCase()}
      </div>
      {displayColorPicker && (
        <div className={styles.popover} id="inline-color-picker-popover">
          <div
            className={styles.cover}
            onClick={() => setDisplayColorPicker(false)}
          />
          <div
          css={`.sketch-pickerz {
            padding: 16px !important;
            box-shadow: 0px 0px 6px 0px rgba(31, 41, 55, 0.05), 0px 10px 15px 0px rgba(31, 41, 55, 0.10) !important;
            border:none;
            >div:nth-of-type(1) {
             padding-bottom: 45% !important;
            }
          
          }`}
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
    </>
  );
}
