import React from "react";
import "app/modules/report-module/components/reportSubHeaderToolbar/autoSaveSwitch/style.css";
export default function AutoSaveSwitch() {
  return (
    <>
      <div className="toggle-button-cover">
        <div className="button-cover">
          <div className="button b2" id="button-13">
            <input type="checkbox" className="checkbox" />
            <div className="knobs" id="text">
              <span></span>
            </div>
            <div className="layer"></div>
          </div>
        </div>
      </div>
    </>
  );
}
