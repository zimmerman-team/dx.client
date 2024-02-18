/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* third-party */
import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import remove from "lodash/remove";
import isEqual from "lodash/isEqual";
import findIndex from "lodash/findIndex";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
/* project */
import { ResetIcon } from "app/assets/icons/Reset";
import { SearchIcon } from "app/assets/icons/Search";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import { splitStrBasedOnCapitalLetters } from "app/utils/splitStrBasedOnCapitalLetters";
import {
  FilterGroupModel,
  FilterGroupOptionModel,
  FilterGroupProps,
  FilterOptionProps,
} from "app/components/ToolBoxPanel/components/filters/data";
import {
  getAllOptionsCount,
  multiCheckFilterOptions,
  multiUnCheckFilterOptions,
} from "app/modules/chart-module/routes/filters/utils";
import { isEmpty } from "lodash";

interface ExpandedFilterGroupProps extends FilterGroupModel, FilterGroupProps {
  goBack: () => void;
  loadChartDataFromAPI?: (customAppliedFilters?: {
    [key: string]: any[];
  }) => void;
}

export function ExpandedFilterGroup(props: ExpandedFilterGroupProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [allSelected, setAllSelected] = React.useState(false);
  const [optionsToShow, setOptionsToShow] = React.useState(props.options);

  const allAppliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const appliedFilters = useStoreState((state) =>
    get(state.charts.appliedFilters.value, props.name, [])
  );
  const setAllAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.setValue
  );

  const [tmpAppliedFilters, setTmpAppliedFilters] = React.useState([
    ...appliedFilters,
  ]);

  const [shiftKeyDown, setShiftKeyDown] = React.useState(false);

  const [lastClickedPosition, setLastClickedPosition] = React.useState(
    appliedFilters.length - 1
  );

  React.useEffect(() => {
    //updates the allSelected state when the applied filters change
    //gets the value of all the options in the filter group
    const allOptionsCount = getAllOptionsCount(props.options);

    //checks if the length of the applied filters is equal to the length of the options in the filter group
    //if yes, then all the options are selected
    //if no, then not all the options are selected
    setAllSelected(tmpAppliedFilters.length === allOptionsCount);
  }, [tmpAppliedFilters, props.options]);

  const handleSearch = (value: string) => {
    if (value.length === 0) {
      setOptionsToShow(props.options);
    } else {
      const options: FilterGroupOptionModel[] = [];
      props.options.forEach((option: FilterGroupOptionModel) => {
        if (option.label.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          options.push(option);
        } else if (option.subOptions) {
          option.subOptions.forEach((subOption: FilterGroupOptionModel) => {
            if (
              subOption.label.toLowerCase().indexOf(value.toLowerCase()) > -1
            ) {
              const fParentIndex = findIndex(options, { label: option.label });
              if (fParentIndex > -1) {
                options[fParentIndex].subOptions?.push(subOption);
              } else {
                options.push({
                  ...option,
                  subOptions: [subOption],
                });
              }
            } else if (subOption.subOptions) {
              subOption.subOptions.forEach(
                (subSubOption: FilterGroupOptionModel) => {
                  if (
                    (subSubOption.label || "")
                      .toLowerCase()
                      .indexOf(value.toLowerCase()) > -1
                  ) {
                    const fGrandParentIndex = findIndex(options, {
                      label: option.label,
                    });
                    if (fGrandParentIndex > -1) {
                      const fParentIndex = findIndex(
                        options[fGrandParentIndex]?.subOptions,
                        { label: subOption.label }
                      );
                      if (fParentIndex > -1) {
                        // @ts-ignore
                        options[fGrandParentIndex]?.subOptions[
                          fParentIndex
                        ]?.subOptions.push(subSubOption);
                      } else {
                        // @ts-ignore
                        options[fGrandParentIndex]?.subOptions.push({
                          ...subOption,
                          subOptions: [subSubOption],
                        });
                      }
                    } else {
                      options.push({
                        ...option,
                        subOptions: [
                          {
                            ...subOption,
                            subOptions: [subSubOption],
                          },
                        ],
                      });
                    }
                  }
                }
              );
            }
          });
        }
      });
      setOptionsToShow(options);
    }
  };

  function handleChangeAll(event: React.ChangeEvent<HTMLInputElement>) {
    const tmp: any[] = [];
    if (event.target.checked) {
      props.options.forEach((option: FilterGroupOptionModel) => {
        tmp.push(option.value);
      });
      setTmpAppliedFilters(tmp);
    } else {
      setTmpAppliedFilters([]);
    }
  }

  function handleApply() {
    if (!isEqual(appliedFilters, tmpAppliedFilters)) {
      setAllAppliedFilters({
        key: props.name,
        value: tmpAppliedFilters,
      });
      if (props.loadChartDataFromAPI) {
        const temp = allAppliedFilters;
        temp[props.name] = [
          ...get(temp, `["${props.name}"]`, []),
          ...tmpAppliedFilters,
        ];
        props.loadChartDataFromAPI(temp);
      }
    }
    props.goBack();
  }

  function onOptionChange(
    checked: boolean,
    option: FilterGroupOptionModel,
    currentPosition: number
  ) {
    let tmp = [...tmpAppliedFilters];
    const optionsValueList = optionsToShow.map((o) => o.value);

    if (shiftKeyDown && checked && tmp.length > 0) {
      multiCheckFilterOptions(
        tmp,
        optionsValueList,
        currentPosition,
        lastClickedPosition
      );
    } else if (shiftKeyDown && !checked && tmp.length > 0) {
      tmp = multiUnCheckFilterOptions(
        tmp,
        optionsValueList,
        currentPosition,
        lastClickedPosition
      );
    } else if (checked) {
      tmp.push(option.value);
    } else {
      remove(tmp, (o: string) => o === option.value);
    }
    // used new Set to remove duplicates
    setTmpAppliedFilters([...new Set(tmp)]);

    //update lastClickedPosition
    setLastClickedPosition(currentPosition);
  }

  React.useEffect(() => {
    //listen for shift keydown and keyup events
    //used for multi-check of filter options
    document.addEventListener("keydown", (event) => {
      if (event.key === "Shift") {
        setShiftKeyDown(true);
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "Shift") {
        setShiftKeyDown(false);
      }
    });
  }, []);

  function resetFilters() {
    if (appliedFilters.length > 0) {
      setAllAppliedFilters({
        key: props.name,
        value: [],
      });
      if (props.loadChartDataFromAPI) {
        const temp = allAppliedFilters;
        temp[props.name] = [];
        props.loadChartDataFromAPI(temp);
      }
      setTmpAppliedFilters([]);
    }
  }
  React.useEffect(() => {
    //when all applied filters are removed, reset the tmpAppliedFilters
    if (isEmpty(allAppliedFilters)) {
      setTmpAppliedFilters([]);
    }
  }, [allAppliedFilters]);

  return (
    <React.Fragment>
      <div
        css={`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 24px;
          margin-top: 16px;
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: row;
            align-items: center;

            > button {
              transform: rotate(-90deg);
              &:hover {
                background: transparent;
              }
            }
          `}
        >
          <IconButton onClick={props.goBack} aria-label="expanded-filter-close">
            <TriangleXSIcon />
          </IconButton>
          <div
            css={`
              max-width: 170px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 14px;
            `}
          >
            {splitStrBasedOnCapitalLetters(
              `${props.name[0].toUpperCase()}${props.name.slice(1)}`
            ).replace(/_/g, "")}
          </div>
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={allSelected}
                onChange={handleChangeAll}
                disabled={searchValue.length > 0}
              />
            }
            label="Select all"
          />
          <IconButton onClick={resetFilters} aria-label="reset-button">
            <ResetIcon />
          </IconButton>
        </div>
      </div>
      <div
        css={`
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
          height: 35px;
          margin-top: 11.5px;
          padding: 0px 20px;
          border-radius: 24px;
          background: #dfe3e6;
          box-shadow: 0px 0px 10px rgba(152, 161, 170, 0.05);
          path {
            fill: #495057;
          }
        `}
      >
        <input
          type="search"
          name="search-input"
          css={`
            width: 100%;
            outline: none;
            color: #495057;
            font-size: 14px;
            border-style: none;
            background: #dfe3e6;
            height: 100%;
          `}
          tabIndex={0}
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <SearchIcon />
      </div>

      <div
        css={`
          width: 100%;
          height: 20px;
          border-bottom: 1px solid #dfe3e6;
        `}
      />
      <div
        css={`
          overflow-y: auto;
          max-height: calc(100vh - 452px);
          height: 100%;

          @media (max-width: 767px) {
            max-height: unset;
            overflow-y: unset;
          }

          &::-webkit-scrollbar {
            width: 5px;
            border-radius: 4px;
            background: #262c34;
          }
          &::-webkit-scrollbar-track {
            border-radius: 4px;
            background: #f5f5f7;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: #262c34;
          }
          &::-webkit-scrollbar:horizontal {
            visibility: hidden;
          }
          &::-webkit-scrollbar-track:horizontal {
            visibility: hidden;
          }
          &::-webkit-scrollbar-thumb:horizontal {
            visibility: hidden;
          }
        `}
      >
        {optionsToShow.map((option: FilterGroupOptionModel, index: number) => (
          <FilterOption
            {...option}
            level={1}
            position={index}
            key={option.value}
            forceExpand={searchValue.length > 0}
            onOptionChange={(e) => onOptionChange(e, option, index)}
            selectedOptions={tmpAppliedFilters}
            selected={
              find(tmpAppliedFilters, (o: string) => o === option.value) !==
              undefined
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleApply}
        css={`
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          margin-top: 15px;
          font-weight: 500;
          width: fit-content;
          padding: 12px 27px;
          border-style: none;
          border-radius: 30px;
          background: #231d2c;
          box-shadow: 0px 0px 10px rgba(152, 161, 170, 0.05);
          font-family: "Inter", sans-serif;
        `}
      >
        Apply
      </button>
    </React.Fragment>
  );
}

function FilterOption(props: FilterOptionProps) {
  const [showSubOptions, setShowSubOptions] = React.useState(false);

  React.useEffect(() => {
    if (props.forceExpand && !showSubOptions) {
      setShowSubOptions(true);
    } else {
      setShowSubOptions(false);
    }
  }, [props.forceExpand]);

  return (
    <div
      css={`
        width: 100%;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #dfe3e6;
        border-bottom-style: ${props.subOptions ? "solid" : "none"};
      `}
    >
      <div
        css={`
          width: 100%;
          padding: 5px;
          display: flex;
          position: relative;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          > button {
            z-index: 3;
            margin-right: 6px;
            transform: rotate(${showSubOptions ? 0 : 180}deg);
          }
        `}
      >
        <FormControlLabel
          css={`
            && {
              z-index: 3;

              span {
                font-size: 14px;
              }
            }
          `}
          control={
            <Checkbox
              color="primary"
              checked={props.selected}
              data-testid="filter-option-checkbox"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onOptionChange(
                  e.target.checked,
                  {
                    label: props.label,
                    value: props.value,
                    subOptions: props.subOptions,
                  },
                  props.level
                )
              }
            />
          }
          label={props.label}
        />
        {props.subOptions && (
          <React.Fragment>
            <div
              css={`
                top: 0;
                left: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                cursor: pointer;
                position: absolute;
              `}
              onClick={() => setShowSubOptions(!showSubOptions)}
            />
            <IconButton onClick={() => setShowSubOptions(!showSubOptions)}>
              <TriangleXSIcon />
            </IconButton>
          </React.Fragment>
        )}
      </div>
      {props.subOptions && showSubOptions && (
        <div
          css={`
            gap: 6px;
            width: 100%;
            display: flex;
            padding-left: 25px;
            flex-direction: column;

            > * {
              @supports (-webkit-touch-callout: none) and
                (not (translate: none)) {
                &:not(:last-child) {
                  margin-right: 6px;
                }
              }
            }
          `}
        >
          {props.subOptions.map(
            (option: FilterGroupOptionModel, index: number) => (
              <FilterOption
                {...option}
                key={option.value}
                position={index}
                level={props.level + 1}
                forceExpand={props.forceExpand}
                onOptionChange={props.onOptionChange}
                selectedOptions={props.selectedOptions}
                selected={
                  find(
                    props.selectedOptions,
                    (o: string) => o === option.value
                  ) !== undefined
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
