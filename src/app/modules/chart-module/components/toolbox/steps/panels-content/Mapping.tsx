import React from "react";
import get from "lodash/get";
import {
  getTypeName,
  getDefaultDimensionAggregation,
  getAggregatorNames,
  // @ts-ignore
} from "@rawgraphs/rawgraphs-core";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { uniqueId, filter, isEmpty } from "lodash";
import { Box, Button, IconButton } from "@material-ui/core";
import ToolboxSubheader from "app/modules/chart-module/components/toolbox/steps/sub-header";
import { ReactComponent as DateIcon } from "app/modules/chart-module/assets/date.svg";
import CloseIcon from "@material-ui/icons/Close";
import { mappingStyles } from "../../styles";
import SearchIcon from "@material-ui/icons/Search";
import { useDebounce } from "react-use";
import {
  ChartAPIModel,
  ChartRenderedItem,
  emptyChartAPI,
} from "app/modules/chart-module/data";
import { Dropdown } from "react-bootstrap";
import { areAllRequiredDimensionsMapped } from "app/hooks/useChartsRawData";
import Skeleton from "@material-ui/lab/Skeleton";

interface ChartToolBoxMappingProps {
  dataTypes: any;
  dimensions: any[];
  loading: boolean;
  setChartFromAPI: (
    value: React.SetStateAction<ChartRenderedItem | null>
  ) => void;
}
interface ChartToolBoxMappingItemProps {
  index: number;
  dimension?: any;
  testId: string;
  mappingItemValue: string;
  dataTypes: any[];
  marginBottom: string;
  backgroundColor?: string;
  type: "string" | "number" | "date";
  nonStaticDimensionsId: number;
  nonStaticDimensionsIndex: number;
  handleNonStaticDimensionsUpdate: (
    nonStaticDimensionsId: number,
    mappingItemValue: any
  ) => void;
  // setNonStaticDimensions: React.Dispatch<React.SetStateAction<any[]>>;
  nonStaticDimensions: any[];
  displayCloseButton?: boolean;
  showAggregation: boolean;
  handleButtonToggle?: (id: string) => void;
}

const typeIcon = {
  string: <span>Aa</span>,
  number: <span>#</span>,
  date: <DateIcon />,
};

export const AGGREGATIONS_LABELS = {
  count: "Count",
  mean: "Average",
  median: "Median",
  max: "Max",
  min: "Min",
  countDistinct: "Count unique",
  sum: "Sum",
  csv: "CSV",
  csvDistinct: "CSV (unique)",
};

const DimensionContainerSkeleton = () => {
  return (
    <div
      css={`
        width: 100%;
        padding: 16px;
        /* height: 89px; */
        border-radius: 11px;
        background: #dfe3e5;
        margin-top: 16px;
      `}
    >
      <Skeleton
        animation="wave"
        variant="rect"
        width="100%"
        height={39}
        style={{ borderRadius: "25px" }}
      />

      <Skeleton
        animation="wave"
        variant="rect"
        width="100%"
        height={39}
        style={{ borderRadius: "25px", marginTop: "16px" }}
      />
    </div>
  );
};

export function ChartToolBoxMapping(props: Readonly<ChartToolBoxMappingProps>) {
  const staticDimensions = filter(props.dimensions, (d: any) => d.static);
  const nonStaticDimensions = React.useMemo(() => {
    return filter(props.dimensions, (d: any) => !d.static).map((d: any) => {
      return {
        ...d,
        mappedValues: [],
        mapValuesDisplayed: false,
      };
    });
  }, [props.dimensions]);

  const [nonStaticDimensionsState, setNonStaticDimensionsState] =
    React.useState(nonStaticDimensions);

  const mapping = useStoreState((state) => state.charts.mapping.value);

  const handleButtonToggle = (id: string) => {
    setNonStaticDimensionsState((prev) => {
      return prev.map((data) => {
        if (data.id === id) {
          return {
            ...data,
            mapValuesDisplayed: !data.mapValuesDisplayed,
          };
        }
        return data;
      });
    });
  };

  const handleNonStaticDimensionsUpdate = (
    nonStaticDimensionsId: number,
    mappingItemValue: any
  ) => {
    setNonStaticDimensionsState((prev) => {
      return prev.map((data) => {
        if (data.id === nonStaticDimensionsId) {
          return {
            ...data,
            mappedValues: [...data.mappedValues, mappingItemValue],
            mapValuesDisplayed: false,
          };
        }
        return data;
      });
    });
  };

  React.useEffect(() => {
    //updates non static dimension with mapped values
    let updatedNonStaticDimensions = [...nonStaticDimensions];
    const mappingKeys = Object.keys(mapping);
    mappingKeys.forEach((dimensionId: string) => {
      const nonStaticDimensionIndex = updatedNonStaticDimensions.findIndex(
        (d) => d.id === dimensionId
      );
      if (nonStaticDimensionIndex !== -1) {
        updatedNonStaticDimensions[nonStaticDimensionIndex].mappedValues =
          mapping[dimensionId].value;
      }
    });

    setNonStaticDimensionsState(updatedNonStaticDimensions);
  }, [mapping]);

  // empty rendered chart when req mapping fields are not filled
  React.useEffect(() => {
    if (!areAllRequiredDimensionsMapped(props.dimensions, mapping)) {
      props.setChartFromAPI(null);
    }
  }, [mapping]);

  const getValidDataTypes = (dimensionTypes: string[], searchValue: string) => {
    const validDataTypes: any = {};
    //get valid data types for the current dimension
    //filter data types by search value
    Object.keys(props.dataTypes)
      ?.filter((dt) => dt.toLowerCase().includes(searchValue.toLowerCase()))
      .map((dataTypeName: string, index: number) => {
        let type = props.dataTypes[dataTypeName];

        if (typeof props.dataTypes[dataTypeName] === "object") {
          type = props.dataTypes[dataTypeName].type;
        }
        //if the data type is valid for the current dimension, add it to the validDataTypes object
        if (dimensionTypes?.includes(type)) {
          validDataTypes[dataTypeName] = type;
        }
      });
    return validDataTypes;
  };

  const getSelectButtonLabel = (
    mappedValues: (string | number)[],
    multiple: boolean
  ) => {
    if (multiple) {
      if (mappedValues.length === 0) {
        return "Select dimension";
      } else {
        return "Select another dimension";
      }
    } else {
      return mappedValues.length > 0 ? mappedValues[0] : "Select dimension";
    }
  };

  return (
    <div
      css={`
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 30px;
        height: 100%;
      `}
    >
      <ToolboxSubheader name="Mapping" level={3} />
      <div
        css={`
          width: 90%;
          margin: auto;
          overflow-y: auto;
          height: 100%;
          padding-bottom: 40px;
          max-height: calc(100vh - 260px);
          &::-webkit-scrollbar {
            width: 4px;
            visibility: hidden;
            background: #262c34;
          }
          &::-webkit-scrollbar-track {
            background: #f1f3f5;
            visibility: hidden;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: #262c34;
            visibility: hidden;
          }
        `}
      >
        <div
          css={`
            z-index: 1030;
            position: relative;
          `}
        >
          {props.loading ? (
            <div
              css={`
                width: 100%;
              `}
            >
              <Box height={16} />
              <DimensionContainerSkeleton />
              <DimensionContainerSkeleton />
            </div>
          ) : (
            <>
              {nonStaticDimensionsState?.map(
                (dimension: any, dimensionIndex: number) => (
                  <NonStaticDimensionContainer
                    dataTypes={props.dataTypes}
                    key={dimension.id}
                    dimension={dimension}
                    dimensionIndex={dimensionIndex}
                    nonStaticDimensions={nonStaticDimensionsState}
                    handleNonStaticDimensionsUpdate={
                      handleNonStaticDimensionsUpdate
                    }
                    nonStaticDimensionsId={dimension.id}
                    getValidDataTypes={getValidDataTypes}
                    getSelectButtonLabel={getSelectButtonLabel}
                    handleButtonToggle={handleButtonToggle}
                  />
                )
              )}
              {staticDimensions &&
                staticDimensions.map((dimension: any) => (
                  <StaticDimensionContainer
                    key={dimension.id}
                    dimension={dimension}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const NonStaticDimensionContainer = (props: {
  dimension: any;
  dimensionIndex: number;
  nonStaticDimensions: any[];
  handleNonStaticDimensionsUpdate: (
    nonStaticDimensionsId: number,
    mappingItemValue: any
  ) => void;
  nonStaticDimensionsId: number;
  dataTypes: any[];
  getValidDataTypes: (dimensionTypes: string[], searchValue: string) => any;
  getSelectButtonLabel: (
    mappedValues: (string | number)[],
    multiple: boolean
  ) => any;
  handleButtonToggle: (id: string) => void;
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const validTypes = Object.keys(
    props.getValidDataTypes(props.dimension.validTypes, searchValue)
  );

  const selectedDimensions = Object.keys(
    props.getValidDataTypes(props.dimension.validTypes, "")
  )?.filter((mappingItemValue: string) =>
    props.dimension.mappedValues.includes(mappingItemValue)
  );

  return (
    <div
      key={`${props.dimension.id}`}
      css={`
        width: 100%;
        padding: 16px 16px 8px 16px;
        height: 100%;
        border-radius: 11px;
        background: #dfe3e5;
        margin-top: 16px;
      `}
      data-cy="nonstatic-dimension-container"
    >
      <div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 4px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              width: 72px;
              opacity: 0.5;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 5px;
              p {
                margin: 0;
              }
              svg {
                margin-top: 6px;
              }
            `}
          >
            {props.dimension.validTypes.map(
              (type: "string" | "number" | "date") => (
                <p key={type}>{typeIcon[type]}</p>
              )
            )}
          </div>
          <div
            css={`
              font-size: 14px;
              font-family: "GothamNarrow-Bold", sans-serif;

              color: #262c34;
            `}
          >
            {props.dimension.name}
          </div>
          <div
            css={`
              width: 72px;
              color: #ef1320;
              font-size: 32px;
              text-align: right;
              margin-bottom: -12px;
              visibility: ${props.dimension.required ? "visible" : "hidden"};
            `}
          >
            *
          </div>
        </div>

        {selectedDimensions.map((mappingItemValue: string, index: number) => {
          let type = props.getValidDataTypes(props.dimension.validTypes, "")[
            mappingItemValue
          ];
          return (
            <ChartToolBoxMappingItem
              key={mappingItemValue}
              testId={`mapping-item-${mappingItemValue}`}
              type={type}
              index={index}
              marginBottom="16px"
              mappingItemValue={mappingItemValue}
              dimension={props.dimension}
              handleNonStaticDimensionsUpdate={
                props.handleNonStaticDimensionsUpdate
              }
              dataTypes={props.dataTypes}
              nonStaticDimensionsId={props.dimension.id}
              nonStaticDimensionsIndex={props.dimensionIndex}
              nonStaticDimensions={props.nonStaticDimensions}
              displayCloseButton
              showAggregation
              handleButtonToggle={props.handleButtonToggle}
            />
          );
        })}
        <DimensionSelect
          dimension={props.dimension}
          getSelectButtonLabel={props.getSelectButtonLabel}
          handleButtonToggle={props.handleButtonToggle}
          index={0}
        />
      </div>
      {props.dimension?.mapValuesDisplayed && (
        <div
          css={`
            height: 100%;
            overflow-y: scroll;
            max-height: 253px;

            ::-webkit-scrollbar {
              width: 0px;
            }
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              width: 100%;
              background: #f1f3f5;
              border-radius: 24px;
              height: 31px;
              padding-right: 5px;

              margin-bottom: 12px;

              input {
                border: none;
                background: transparent;
                width: 90%;
                height: 100%;
                padding-left: 16px;
              }
            `}
          >
            <input
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <SearchIcon htmlColor="#868E96" />
          </div>

          {validTypes?.map((mappingItemValue: string, index: number) => {
            const type = props.getValidDataTypes(
              props.dimension.validTypes,
              searchValue
            )[mappingItemValue];

            return (
              <ChartToolBoxMappingItem
                key={mappingItemValue}
                testId={`mapping-item-${mappingItemValue}`}
                type={type}
                index={index}
                marginBottom="16px"
                mappingItemValue={mappingItemValue}
                dimension={props.dimension}
                handleNonStaticDimensionsUpdate={
                  props.handleNonStaticDimensionsUpdate
                }
                dataTypes={props.dataTypes}
                nonStaticDimensionsId={props.dimension.id}
                nonStaticDimensionsIndex={props.dimensionIndex}
                nonStaticDimensions={props.nonStaticDimensions}
                showAggregation={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DimensionSelect = (props: {
  dimension: any;
  getSelectButtonLabel: (
    mappedValues: (string | number)[],
    multiple: boolean
  ) => any;
  handleButtonToggle: (id: string) => void;
  index: number;
}) => {
  return (
    <>
      {!!props.dimension?.multiple || isEmpty(props.dimension.mappedValues) ? (
        <div
          css={`
            > span {
              font-size: 14px;
            }
            position: relative;
          `}
        >
          <Button
            disableTouchRipple
            onClick={() => props.handleButtonToggle(props.dimension.id)}
            css={mappingStyles.selectedButtoncss(props.dimension)}
            data-cy="chart-dimension-select"
          >
            <span>
              {props.getSelectButtonLabel(
                props.dimension.mappedValues,
                !!props.dimension?.multiple
              )}
            </span>
            <ArrowDropUpIcon
              css={`
                margin-right: -7px;
              `}
            />
          </Button>
        </div>
      ) : null}
    </>
  );
};

function ChartToolBoxMappingItem(
  props: Readonly<ChartToolBoxMappingItemProps>
) {
  const { index, dimension, dataTypes } = props;
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const mapping = useStoreState((state) => state.charts.mapping.value);

  const removeMappingValue = useStoreActions(
    (state) => state.charts.mapping.removeMappingValue
  );

  const item = {
    type: "card",
    index,
    id: props.mappingItemValue,
    dimensionId: dimension.id,
  };
  const columnDataType = getTypeName(dataTypes[item.id as any]);

  const handleClick = () => {
    //checking for props.aggregation cos it's only true for selected dimesions
    if (props.showAggregation) {
      props.handleButtonToggle?.(props.dimension?.id);
      return;
    }
    const isValid =
      dimension.validTypes?.length === 0 ||
      dimension.validTypes?.includes(columnDataType);

    if (isValid) {
      props.handleNonStaticDimensionsUpdate(
        props.nonStaticDimensionsId,
        props.mappingItemValue
      );

      const mappingFromStorage = get(
        JSON.parse(
          sessionStorage.getItem("[EasyPeasyStore][0][charts.mapping]") ?? ""
        ),
        "data.value",
        {}
      ) as { [key: string]: any };

      const localDimensionMapping = get(mappingFromStorage, dimension.id, {});

      const defaulAggregation = dimension.aggregation
        ? getDefaultDimensionAggregation(dimension, dataTypes[item.id as any])
        : null;

      if (
        props.nonStaticDimensions[props.nonStaticDimensionsIndex]
          .mappedValues &&
        !props.nonStaticDimensions[props.nonStaticDimensionsIndex]?.multiple
      ) {
        //replace mapping
        setMapping({
          [dimension.id]: {
            ids: [uniqueId()],
            value: [item.id],
            isValid: isValid,
            mappedType: columnDataType,
            config: dimension.aggregation
              ? {
                  aggregation: [defaulAggregation],
                }
              : undefined,
          },
        });
      } else {
        setMapping({
          [dimension.id]: {
            ids: (localDimensionMapping.ids || []).concat(uniqueId()),
            value: [...(localDimensionMapping.value || []), item.id],
            isValid: isValid,
            mappedType: columnDataType,
            config: dimension.aggregation
              ? {
                  aggregation: [
                    ...(get(localDimensionMapping, "config.aggregation") || []),
                    defaulAggregation,
                  ],
                }
              : undefined,
          },
        });
      }
    }
  };
  const onDeleteItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    removeMappingValue({ id: dimension.id, value: props.mappingItemValue });
  };

  const aggregators = getAggregatorNames();

  const dimensionMapping = get(mapping, props.dimension.id, {});
  const setAggregation = React.useCallback(
    (newAggregations) => {
      setMapping({
        [props.dimension.id]: {
          ...dimensionMapping,
          config: {
            aggregation: [...newAggregations],
          },
        },
      });
    },
    [mapping, setMapping, dimensionMapping]
  );

  const onChangeAggregation = React.useCallback(
    (i, aggregatorName) => {
      const aggregationsMappedHere = get(
        mapping,
        `${props.dimension.id}.config.aggregation`,
        []
      );
      const newAggregations = [...aggregationsMappedHere];
      newAggregations[i] = aggregatorName;
      setAggregation(newAggregations);
    },
    [mapping, setAggregation]
  );
  const relatedAggregation = React.useMemo(() => {
    if (props.dimension?.aggregation) {
      return dimensionMapping.config?.aggregation[props.index] || "sum";
    } else {
      return null;
    }
  }, [props.dimension, props.index, dimensionMapping]);

  return (
    <div
      key={props.mappingItemValue}
      id={props.testId}
      css={mappingStyles.mappingItemcss(props)}
      onClick={handleClick}
      data-cy="chart-dimension-mapping-item"
    >
      <div>
        <p>{typeIcon[props.type]}</p>

        <p
          css={`
            overflow: clip;
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: calc(100% - 40px);
            text-transform: capitalize;
          `}
        >
          {props.mappingItemValue}
        </p>
      </div>

      {props.displayCloseButton && (
        <IconButton onClick={onDeleteItem}>
          <CloseIcon htmlColor="#fff" fontSize="small" />
        </IconButton>
      )}

      {props.showAggregation &&
        props.dimension &&
        !!props.dimension?.aggregation &&
        props.dimension.mappedValues.length > 0 &&
        relatedAggregation &&
        aggregators && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Dropdown
              className="d-inline-block ml-2 raw-dropdown"
              id="rb-dropdown-menu"
              css={`
                margin-right: -7px;
                position: absolute;
                right: 55px;
                top: 2px;
                z-index: 2;
              `}
            >
              <Dropdown.Toggle
                css={`
                  width: 110px;
                  color: #262c34;
                  font-size: 14px;
                  border-style: none;
                  border-radius: 26px;
                  padding-right: 16px;
                  background: #cfd4da;
                  box-shadow: none !important;

                  &:hover,
                  &:active,
                  &:focus {
                    color: #262c34;
                    background: #cfd4da;
                  }
                `}
              >
                {get(
                  AGGREGATIONS_LABELS,
                  relatedAggregation,
                  relatedAggregation
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                css={`
                  min-width: 110px;
                  background: #dfe3e6;
                  border-radius: 13px;
                  box-shadow: none !important;
                  overflow: scroll;
                `}
              >
                {aggregators.map((aggregatorName: string) => (
                  <Dropdown.Item
                    key={aggregatorName}
                    onClick={() =>
                      onChangeAggregation &&
                      onChangeAggregation(props.index, aggregatorName)
                    }
                    css={`
                      color: #262c34;
                      font-size: 14px;
                      padding: 6px 12px !important;
                      border-bottom: 1px solid rgba(173, 181, 189, 0.5);
                    `}
                  >
                    {get(AGGREGATIONS_LABELS, aggregatorName, aggregatorName)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
    </div>
  );
}

const StaticDimensionContainer = (props: { dimension: any }) => {
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const loadedChartMappingValue = get(
    loadedChart,
    `mapping.${props.dimension.id}.value[0]`,
    ""
  );
  const mainKPImetric = props.dimension.id === "mainKPImetric";
  const [valueCount, setValueCount] = React.useState(0);
  const [value, setValue] = React.useState(
    //for the case of BNC, mapping doesn't come with complete values, hence we fallback to the loaded chart mapping.
    //TODO: replace loadedChartMappingValue with ""  when mapping for BNC is fixed
    get(mapping, `${props.dimension.id}.value[0]`, loadedChartMappingValue)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (mainKPImetric) {
      const re = /^[0-9\b+-]+$/;
      if (e.target.value === "" || re.test(e.target.value)) {
        setValue(e.target.value);
        setValueCount(e.target.value.length);
      }
    } else {
      setValue(e.target.value);
      setValueCount(e.target.value.length);
    }
  };

  const onValueChange = (value: string) => {
    const mappingFromStorage = get(
      JSON.parse(
        sessionStorage.getItem("[EasyPeasyStore][0][charts.mapping]") ?? ""
      ),
      "data.value",
      {}
    ) as { [key: string]: any };
    const localDimensionMapping = get(
      mappingFromStorage,
      props.dimension.id,
      {}
    );
    setMapping({
      [props.dimension.id]: {
        ids: (localDimensionMapping.ids || []).concat(uniqueId()),
        value: [value],
        isValid: true,
        mappedType: mainKPImetric ? "number" : "string",
      },
    });
  };
  const [,] = useDebounce(() => onValueChange(value), 1000, [value]);
  return (
    <div
      key={`${props.dimension.id}`}
      css={`
        width: 100%;
        padding: 16px 16px 8px 16px;
        height: 100%;
        overflow-y: hidden;
        border-radius: 11px;
        background: #dfe3e5;
        margin-top: 16px;
      `}
    >
      <div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 4px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              width: 72px;
              opacity: 0.5;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 5px;
              p {
                margin: 0;
              }
              svg {
                margin-top: 6px;
              }
            `}
          >
            <p>{mainKPImetric ? typeIcon["number"] : typeIcon["string"]}</p>
          </div>
          <div
            css={`
              font-size: 14px;
              color: #262c34;
              font-family: "GothamNarrow-Bold", sans-serif; ;
            `}
          >
            {props.dimension.name}
          </div>
          <div
            css={`
              width: 72px;
              color: #ef1320;
              font-size: 32px;
              text-align: right;
              margin-bottom: -12px;
              visibility: ${props.dimension.required ? "visible" : "hidden"};
            `}
          >
            *
          </div>
        </div>
      </div>
      <div
        css={`
          position: relative;
        `}
      >
        <textarea
          value={value}
          onChange={handleInputChange}
          maxLength={mainKPImetric ? 6 : 50}
          minLength={mainKPImetric ? 1 : 6}
          css={`
            width: 100%;
            min-height: 40px;
            resize: vertical;
            padding: 14px 8px;
            border-radius: 11px;
            border: 1px solid #231d2c;
          `}
        />
        <span
          css={`
            position: absolute;
            bottom: 4px;
            right: 13px;
            font-size: 12px;
          `}
        >
          {valueCount}/{mainKPImetric ? "6" : "50"}
        </span>
      </div>
      <div
        css={`
          color: #231d2c;
          font-size: 12px;
          margin-top: 2px;
          font-weight: 400;
          line-height: 15px;
        `}
      >
        {mainKPImetric
          ? "The main KPI metric must be between 0 and 6 characters in length. Main KPI metric will overwrite content from the dataset."
          : `The ${props.dimension.name} must be between 6 and 50 characters in
        length.`}
      </div>
    </div>
  );
};
