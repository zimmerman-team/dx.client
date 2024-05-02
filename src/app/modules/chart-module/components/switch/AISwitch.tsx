import { useStoreActions, useStoreState } from "app/state/store/hooks";
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
  background-color: ${({ checked }) => (checked ? "#359C96" : "#ADB5BD")};
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

const AISwitch = (props: {
  checked: boolean;
  setIsAiActive: (value: boolean) => void;
  disabled?: boolean;
  dataset: string;
}) => {
  const loadChartTypesSuggestions = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.fetch
  );
  const clearChartTypesSuggestions = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.clear
  );
  const token = useStoreState((state) => state.AuthToken.value);

  return (
    <StyledLabel checked={props.checked}>
      <p>{props.checked ? "ON" : "OFF"}</p>
      <StyledInput
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled ?? false}
        data-cy="ai-agent-switch"
        onChange={(e) => {
          if (e.target.checked) {
            loadChartTypesSuggestions({
              token,
              filterString: `id=${props.dataset as string}`,
              storeInCrudData: true,
            });
          } else {
            clearChartTypesSuggestions();
          }
          props.setIsAiActive(e.target.checked);
        }}
        data-testid={"auto-save-switch"}
      />
      <StyledSpan checked={props.checked} />
    </StyledLabel>
  );
};

export default AISwitch;
