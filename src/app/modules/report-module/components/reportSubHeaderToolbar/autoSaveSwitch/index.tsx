import React from "react";
import "app/modules/report-module/components/reportSubHeaderToolbar/autoSaveSwitch/style.css";
export default function AutoSaveSwitch(props: {
  checked: boolean;
  setAutoSave: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className="toggle-button-cover">
        <div className="button-cover">
          <div className="button b2" id="button-13">
            <input
              type="checkbox"
              className="checkbox"
              checked={props.checked}
              onChange={(e) => props.setAutoSave(e.target.checked)}
            />
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
