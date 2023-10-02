import React from "react";
import get from "lodash/get";
import { Dropdown } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import { ReactComponent as InfoIcon } from "app/modules/chart-module/assets/info.svg";
import axios from "axios";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

interface ChartToolBoxMappingProps {
  dataTypes: any;
}

const typeIcon = {
  string: "/icons/string.svg",
  number: "/icons/number.svg",
  date: "/icons/date.svg",
};
const SVGTypeIcon = {
  string: (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.3125 3.92871L2.01758 13H0.670898L4.46484 3.04688H5.33301L5.3125 3.92871ZM8.07422 13L4.77246 3.92871L4.75195 3.04688H5.62012L9.42773 13H8.07422ZM7.90332 9.31543V10.3955H2.31152V9.31543H7.90332ZM14.9307 11.7354V7.92773C14.9307 7.63607 14.8714 7.38314 14.7529 7.16895C14.639 6.9502 14.4658 6.78158 14.2334 6.66309C14.001 6.5446 13.7139 6.48535 13.3721 6.48535C13.0531 6.48535 12.7728 6.54004 12.5312 6.64941C12.2943 6.75879 12.1074 6.90234 11.9707 7.08008C11.8385 7.25781 11.7725 7.44922 11.7725 7.6543H10.5078C10.5078 7.38997 10.5762 7.12793 10.7129 6.86816C10.8496 6.6084 11.0456 6.3737 11.3008 6.16406C11.5605 5.94987 11.8704 5.78125 12.2305 5.6582C12.5951 5.5306 13.0007 5.4668 13.4473 5.4668C13.985 5.4668 14.459 5.55794 14.8691 5.74023C15.2839 5.92253 15.6074 6.19824 15.8398 6.56738C16.0768 6.93197 16.1953 7.38997 16.1953 7.94141V11.3867C16.1953 11.6328 16.2158 11.8949 16.2568 12.1729C16.3024 12.4508 16.3685 12.6901 16.4551 12.8906V13H15.1357C15.0719 12.8542 15.0218 12.6605 14.9854 12.4189C14.9489 12.1729 14.9307 11.945 14.9307 11.7354ZM15.1494 8.51562L15.1631 9.4043H13.8848C13.5247 9.4043 13.2035 9.43392 12.9209 9.49316C12.6383 9.54785 12.4014 9.63216 12.21 9.74609C12.0186 9.86003 11.8727 10.0036 11.7725 10.1768C11.6722 10.3454 11.6221 10.5436 11.6221 10.7715C11.6221 11.0039 11.6745 11.2158 11.7793 11.4072C11.8841 11.5986 12.0413 11.7513 12.251 11.8652C12.4652 11.9746 12.7272 12.0293 13.0371 12.0293C13.4245 12.0293 13.7663 11.9473 14.0625 11.7832C14.3587 11.6191 14.5934 11.4186 14.7666 11.1816C14.9443 10.9447 15.04 10.7145 15.0537 10.4912L15.5938 11.0996C15.5618 11.291 15.4753 11.5029 15.334 11.7354C15.1927 11.9678 15.0036 12.1911 14.7666 12.4053C14.5342 12.6149 14.2562 12.7904 13.9326 12.9316C13.6136 13.0684 13.2536 13.1367 12.8525 13.1367C12.3512 13.1367 11.9115 13.0387 11.5332 12.8428C11.1595 12.6468 10.8678 12.3848 10.6582 12.0566C10.4531 11.724 10.3506 11.3525 10.3506 10.9424C10.3506 10.5459 10.4281 10.1973 10.583 9.89648C10.738 9.59115 10.9613 9.33822 11.2529 9.1377C11.5446 8.93262 11.8955 8.77767 12.3057 8.67285C12.7158 8.56803 13.1738 8.51562 13.6797 8.51562H15.1494Z"
        fill="#231D2C"
      />
    </svg>
  ),
  number: (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.976 6.598V7.522H5.394L5.044 10H4.162L4.512 7.522H2.244L1.894 10H0.998L1.348 7.522H0.018V6.598H1.488L1.922 3.56H0.48V2.636H2.062L2.412 0.199999H3.294L2.944 2.636H5.212L5.562 0.199999H6.458L6.108 2.636H7.424V3.56H5.968L5.534 6.598H6.976ZM2.804 3.546L2.356 6.598H4.652L5.1 3.546H2.804Z"
        fill="#231D2C"
      />
    </svg>
  ),
  date: <AccessTimeIcon />,
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

export function ChartToolBoxMapping(props: ChartToolBoxMappingProps) {
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const chartType = useStoreState((state) => state.charts.chartType.value);

  const setReMapping = useStoreActions(
    (state) => state.charts.autoReMapping.setValue
  );
  let aiChartType: string | null = null;
  if (chartType === "echartsBarchart") {
    aiChartType = "barchart";
  } else if (chartType === "echartsLinechart") {
    aiChartType = "linechart";
  } else if (chartType === "echartsSankey") {
    aiChartType = "sankey";
  } else if (chartType === "echartsGeomap") {
    aiChartType = "geomap";
  } else if (chartType === "echartsTreemap") {
    aiChartType = "treemap";
  }

  const handleAutomap = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_BACKEND}/chart-suggest/ai-report-chart-suggest-from-existing`,
        {
          params: {
            id: dataset,
            chart: aiChartType,
          },
        }
      )
      .then((res) => {
        console.log(res);
        const mapValue = JSON.parse(res.data.result);
        setReMapping(mapValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      css={`
        width: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={`
          font-size: 14px;
          margin-bottom: 15px;
        `}
      >
        Dimensions
      </div>
      <div
        css={`
          width: 100%;
          display: flex;
          overflow-y: auto;
          padding-right: 88px;
          flex-direction: column;
          max-height: calc(100vh - 440px);

          &::-webkit-scrollbar {
            width: 4px;
            background: #495057;
          }
          &::-webkit-scrollbar-track {
            background: #f1f3f5;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: #495057;
          }
        `}
      >
        {Object.keys(props.dataTypes)?.map(
          (dataTypeName: string, index: number) => {
            let type = props.dataTypes[dataTypeName];
            if (typeof props.dataTypes[dataTypeName] === "object") {
              type = props.dataTypes[dataTypeName].type;
            }
            return (
              <ChartToolBoxMappingItem
                testId={`mapping-item-${dataTypeName}`}
                type={type}
                index={index}
                key={dataTypeName}
                marginBottom="16px"
                dataTypeName={dataTypeName}
              />
            );
          }
        )}
      </div>
      <button
        type="button"
        onClick={handleAutomap}
        css={`
          position: relative;
          border: none;
          outline: none;
          border-radius: 8px;
          background: #359c96;
          width: 264px;
          height: 45px;
          margin-top: 16px;
          padding-left: 22px;
          display: flex;
          gap: 8px;
          align-items: center;
          color: white;
          font-family: "Gotham Narrow", sans-serif;
          font-size: 14px;
          cursor: pointer;
        `}
      >
        <RotateRightIcon color="inherit" /> <b>Auto map again with AI </b>
        <InfoIcon
          css={`
            position: absolute;
            top: 11px;
            right: 10px;
          `}
        />
      </button>
    </div>
  );
}

interface ChartToolBoxMappingItemProps {
  index: number;
  dimension?: any;
  testId: string;
  dataTypeName: string;
  marginBottom: string;
  backgroundColor?: string;
  onDeleteItem?: () => void;
  type: "string" | "number" | "date";
  relatedAggregation?: any;
  aggregators?: any;
  isValid?: boolean;
  onChangeAggregation?: (index: number, value: any) => void;
  onChangeDimension?: (index: number, item: any) => void;
  onMove?: (dragIndex: number, hoverIndex: number) => void;
  autoMapped?: boolean;
  replaceDimension?: (
    fromDimension: string,
    toDimension: string,
    fromIndex: number,
    toIndex: number,
    multiple?: boolean
  ) => void;
}

export function ChartToolBoxMappingItem(props: ChartToolBoxMappingItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { index, dimension, onMove, onChangeDimension, replaceDimension } =
    props;

  const [_, drop] = useDrop(() => ({
    accept: ["column", "card"],
    collect: (monitor) => {
      if (!dimension || !onMove || !onChangeDimension || !replaceDimension)
        return;
      return {
        // @ts-ignore
        isOver: monitor.isOver() && monitor.getItem().type === "column",
      };
    },
    // hover(item: any, monitor: any) {
    //   console.log("hover");
    //   if (!dimension || !onMove || !onChangeDimension || !replaceDimension)
    //     return;
    //   if (!dimension.multiple) {
    //     return;
    //   }
    //   if (!ref.current) {
    //     return;
    //   }

    //   const hoverIndex = index;

    //   //#TODO: for now we allow only dropping on "drop another dimension here" in case of multiple dimensions
    //   if (false && item.type === "column") {
    //     // onInsertColumn(hoverIndex, item);
    //     // item.type = "card";
    //     // item.dimensionId = dimension.id;
    //     // item.index = hoverIndex;
    //     // return;
    //   } else if (item.dimensionId === dimension.id) {
    //     const dragIndex = item.index;
    //     // Don't replace items with themselves
    //     if (dragIndex === hoverIndex) {
    //       return;
    //     }
    //     // Determine rectangle on screen
    //     const hoverBoundingRect = ref.current?.getBoundingClientRect();
    //     // Get vertical middle
    //     const hoverMiddleY =
    //       (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    //     // Determine mouse position
    //     const clientOffset = monitor.getClientOffset();
    //     // Get pixels to the top
    //     const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    //     // Only perform the move when the mouse has crossed half of the items height
    //     // When dragging downwards, only move when the cursor is below 50%
    //     // When dragging upwards, only move when the cursor is above 50%
    //     // Dragging downwards
    //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //       return;
    //     }
    //     // Dragging upwards
    //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //       return;
    //     }
    //     console.log("hover", "onMove");
    //     onMove(dragIndex, hoverIndex);
    //     // Note: we're mutating the monitor item here!
    //     // Generally it's better to avoid mutations,
    //     // but it's good here for the sake of performance
    //     // to avoid expensive index searches.
    //     item.index = hoverIndex;
    //   } else {
    //     //#TODO: for now we allow only dropping on "drop another dimension here" in case of multiple dimensions

    //     // replaceDimension(
    //     //   item.dimensionId,
    //     //   dimension.id,
    //     //   item.index,
    //     //   index,
    //     //   true
    //     // )
    //     // item.dimensionId = dimension.id
    //     // item.index = hoverIndex
    //     return;
    //   }
    // },
    drop: (item: any) => {
      if (!dimension || !onMove || !onChangeDimension || !replaceDimension)
        return;
      if (!dimension.multiple) {
        if (item.type === "column") {
          onChangeDimension(index, item);
        } else {
          replaceDimension(item.dimensionId, dimension.id, item.index, index);
        }
      }
    },
  }));
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dimension ? "card" : "column",
    item: dimension
      ? {
          type: "card",
          index,
          id: props.dataTypeName,
          dimensionId: dimension.id,
        }
      : { id: props.dataTypeName, type: "column" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (dimension && onMove && onChangeDimension && replaceDimension) {
    drop(ref);
  } else {
    drag(ref);
  }

  return (
    <div
      ref={ref}
      key={props.dataTypeName}
      id={props.testId}
      css={`
        height: 31px;
        display: flex;
        min-height: 31px;
        position: relative;
        padding-left: 16px;
        align-items: center;
        border-radius: 25px;
        z-index: 10;
        transform: translate(0px, 0px);
        margin-bottom: ${props.marginBottom};
        background: ${props.backgroundColor || "#cfd4da"};

        ${props.autoMapped &&
        "background: #359C96; color: white; svg{path{fill:white;}}"}

        cursor: ${isDragging
          ? "grabbing"
          : !props.onDeleteItem
          ? "grab"
          : "default"};

        &:last-child {
          margin-bottom: 0px;
        }
      `}
    >
      <div
        css={`
          margin-right: 13px;
          display: flex;
          align-items: center;
        `}
      >
        {SVGTypeIcon[props.type]}
      </div>

      <div
        css={`
          overflow: clip;
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: calc(100% - 40px);
          text-transform: capitalize;
        `}
      >
        {props.dataTypeName}
      </div>
      {dimension &&
        props.isValid &&
        dimension.aggregation &&
        props.relatedAggregation &&
        props.aggregators &&
        props.onChangeAggregation && (
          <Dropdown
            className="d-inline-block ml-2 raw-dropdown"
            id="rb-dropdown-menu"
            css={`
              margin-right: -7px;
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
                background: #868e96;
                box-shadow: none !important;

                &:hover,
                &:active,
                &:focus {
                  color: #fff;
                  background: #262c34;
                }
              `}
            >
              {get(
                AGGREGATIONS_LABELS,
                props.relatedAggregation,
                props.relatedAggregation
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu
              css={`
                min-width: 110px;
                background: #dfe3e6;
                border-radius: 13px;
                box-shadow: none !important;
              `}
            >
              {props.aggregators.map((aggregatorName: string) => (
                <Dropdown.Item
                  key={aggregatorName}
                  onClick={() =>
                    props.onChangeAggregation &&
                    props.onChangeAggregation(index, aggregatorName)
                  }
                  css={`
                    color: #262c34;
                    font-size: 14px;
                    padding: 6px 12px !important;
                    border-bottom: 1px solid rgba(173, 181, 189, 0.5);

                    &:hover {
                      color: #fff;
                      background: #262c34;
                    }
                  `}
                >
                  {get(AGGREGATIONS_LABELS, aggregatorName, aggregatorName)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      {props.onDeleteItem && (
        <IconButton
          onClick={props.onDeleteItem}
          css={`
            margin-right: -7px;
            transform: scale(0.7);
          `}
        >
          <Close />
        </IconButton>
      )}
    </div>
  );
}
