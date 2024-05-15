import React from "react";
import update from "immutability-helper";
import { useUpdateEffect } from "react-use";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import { ReactComponent as RowFrameHandleAdornment } from "app/modules/report-module/asset/rowFrameHandleAdornment.svg";

import { IFramesArray } from "../../views/create/data";

interface Item {
  id: string;
  content: React.ReactNode;
}

interface ItemComponentProps {
  id: string;
  index: number;
  content: React.ReactNode;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  childrenData: any[];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemTypes = {
  CARD: "card",
};

const style = {
  transform: "translate(0px, 0px)",
};

function ItemComponent(props: ItemComponentProps) {
  const { id, content, index, moveCard } = props;

  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  drag(drop(ref));

  return (
    <div style={{ ...style, opacity }}>
      <div
        ref={ref}
        id={`item-${id}`}
        data-handler-id={handlerId}
        css={`
          top: -4px;
          left: -1rem;
          z-index: 1;
          width: 23px;
          cursor: grab;
          position: absolute;
          align-items: center;
          background: #adb5bd;
          border-radius: 3.45px;
          justify-content: center;
          height: calc(100% - 38px + 8px);
          display: ${props.childrenData[props.index]?.structure === null &&
          props.childrenData[props.index]?.content[0] !== "divider"
            ? "none"
            : "flex"};
        `}
      >
        <RowFrameHandleAdornment />
      </div>
      {content}
    </div>
  );
}

interface Props {
  enabled: boolean;
  children: React.ReactNode[];
  childrenData: any[];
  setFramesArray: (value: React.SetStateAction<IFramesArray[]>) => void;
}

export function ReportOrderContainer(props: Props) {
  const [items, setItems] = React.useState(
    props.children?.map((child: React.ReactNode, index: number) => ({
      content: child,
      id: props.childrenData[index].id,
    }))
  );

  const moveCard = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      props.setFramesArray((prevItems: IFramesArray[]) =>
        update(prevItems, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevItems[dragIndex]],
          ],
        })
      );
    },
    []
  );

  const renderItem = React.useCallback(
    (item: Item, index: number) => {
      return (
        <ItemComponent
          key={item.id}
          index={index}
          id={item.id}
          content={item.content}
          moveCard={moveCard}
          childrenData={props.childrenData}
        />
      );
    },
    [props.childrenData]
  );

  useUpdateEffect(() => {
    setItems(
      props.children.map((child: React.ReactNode, index: number) => ({
        content: child,
        id: props.childrenData[index].id,
      }))
    );
  }, [props.childrenData]);

  if (!props.enabled) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return (
    <React.Fragment>
      {items.map((item: Item, index: number) => renderItem(item, index))}
    </React.Fragment>
  );
}
