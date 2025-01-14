import React from "react";

import styled from "styled-components";
interface Props {
  checked: boolean;
  setAutoSave?: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledLabel = styled.label<Props>`
  position: relative;
  display: inline-block;
  width: 62px;
  height: 24px;
  border-radius: 36px;
  background-color: ${({ checked }) => (checked ? "#231D2C" : "#ADB5BD")};
  cursor: pointer;
  padding-right: 4px;
  p {
    color: #fff;
    margin: 0;
    font-size: 12px;
    transform: ${({ checked }) =>
      checked ? "translateX(6px)" : "translateX(32px)"};
  }
`;

const StyledInput = styled.input`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 36px;
  appearance: none;
  cursor: pointer;
`;

const StyledSpan = styled.span<Props>`
  position: absolute;
  left: 0;
  width: 14px;
  height: 14px;
  border-radius: 36px;
  transition: transform 0.3s ease-in-out;
  top: 4.5px;
  background-color: #fff;
  cursor: pointer;
  transform: ${({ checked }) =>
    checked ? "translateX(42px)" : "translateX(6px)"};
`;

const AutoSaveSwitch = (props: {
  checked: boolean;
  setAutoSave: (value: {
    isAutoSaveEnabled: boolean;
    enableAutoSaveSwitch?: boolean;
  }) => void;
  disabled?: boolean;
}) => {
  return (
    <StyledLabel checked={props.checked}>
      <p>{props.checked ? "ON" : "OFF"}</p>
      <StyledInput
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled ?? false}
        onChange={(e) => {
          props.setAutoSave({
            isAutoSaveEnabled: e.target.checked,
            enableAutoSaveSwitch: true,
          });
        }}
        data-testid={"auto-save-switch"}
      />
      <StyledSpan checked={props.checked} />
    </StyledLabel>
  );
};

export default AutoSaveSwitch;
