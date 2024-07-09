import React from "react";
import { Col } from "react-bootstrap";
import ChartOptionSelect from "app/modules/chart-module/routes/customize/components/ChartOptionSelect";
import styles from "app/modules/chart-module/routes/customize/components/InlineColorPicker/InlineColorPicker.module.css";
import { SketchPicker } from "react-color";
import { useOnClickOutside } from "usehooks-ts";

const ChartOptionColor2 = ({
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  isEnabled,
  ...props
}) => {
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const sketchRef = React.useRef(null);

  useOnClickOutside(sketchRef, () => {
    setDisplayColorPicker(false);
  });

  React.useEffect(() => {
    if (sketchRef.current) {
      sketchRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [sketchRef.current]);

  if (props.options) {
    return (
      <ChartOptionSelect
        value={value}
        error={error}
        onChange={onChange}
        default={defaultValue}
        label={label}
        {...props}
      />
    );
  }

  const color = value ?? "#000000";

  return (
    <label className={props.className + " row"}>
      <Col xs={6} className="d-flex align-items-center">
        {label}
      </Col>
      <Col xs={6}>
        <div
          className={styles.swatch}
          onClick={() => setDisplayColorPicker(true)}
          id="inline-color-picker-swatch"
          onKeyDown={() => {}}
        >
          <div className={styles.color} style={{ background: color }} />
          {color.toUpperCase()}
        </div>
      </Col>
      {displayColorPicker && (
        <>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <div
              ref={sketchRef}
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
                disabled={!isEnabled}
                disableAlpha
                color={color}
                onChangeComplete={(color) => onChange(color.hex)}
                width={264}
                className="sketch-pickerz"
              />
            </div>
          </div>
          <div
            css={`
              height: 40px;
            `}
          />
        </>
      )}
      {error && (
        <small>
          <i>{error}</i>
        </small>
      )}
    </label>
  );
};

export default React.memo(ChartOptionColor2);
