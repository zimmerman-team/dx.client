import React from "react";
import get from "lodash/get";

const COLOR_SCHEMES_LABELS = {
  interpolateBlues: "Blue sequential",
  interpolateGreens: "Green sequential",
  interpolateReds: "Red sequential",
  interpolateRdBu: "RdBu diverging",
  interpolateBrBG: "BrBG diverging",
  interpolatePiYG: "PiYG diverging",
  schemeCategory10: "Categorical 10",
  interpolateTurbo: "Turbo discrete",
  interpolateSpectral: "Spectral discrete",
};

const ColorSchemePreview = ({ label, scale, numSamples = 150 }) => {
  let samples;
  if (scale.ticks) {
    samples = scale.ticks(numSamples);
  } else {
    if (scale.domain) {
      samples = scale.domain();
    } else {
      samples = [];
    }
  }
  return (
    <div className="scheme-preview">
      {label && (
        <div style={{ marginBottom: 2 }}>
          {get(COLOR_SCHEMES_LABELS, label, label)}
        </div>
      )}
      <div className="d-flex">
        {samples.map((sample) => (
          <div
            key={"sample-" + sample}
            style={{ flex: 1, height: 10, background: scale(sample) }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ColorSchemePreview);
