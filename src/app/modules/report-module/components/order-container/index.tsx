import React from "react";
import { useUpdateEffect } from "react-use";
import { useDrag } from "react-dnd";
import { ReactComponent as RowFrameHandleAdornment } from "app/modules/report-module/asset/rowFrameHandleAdornment.svg";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view/";
import { useRecoilState } from "recoil";
import { isDividerOrRowFrameDraggingAtom } from "app/state/recoil/atoms";

interface Item {
  id: string;
  content: React.ReactNode;
}

interface ItemComponentProps {
  id: string;
  index: number;
  content: React.ReactNode;
  childrenData: any[];
}

const style = {
  transform: "translate(0px, 0px)",
};

function ItemComponent(props: ItemComponentProps) {
  const { id, content, index } = props;

  const [{ isDragging }, drag] = useDrag({
    type: ReportElementsType.ROW,
    item: () => {
      return { id, index, type: ReportElementsType.ROW };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  const [isItemDragging, setIsItemDragging] = useRecoilState(
    isDividerOrRowFrameDraggingAtom
  );

  React.useEffect(() => {
    if (isDragging !== isItemDragging) {
      setIsItemDragging(isDragging);
    }
  }, [isDragging]);

  return (
    <div
      style={{ ...style, opacity }}
      css={`
        position: relative;
      `}
    >
      <div
        ref={drag}
        id={`item-${id}`}
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
          height: calc(100% - 16px + 8px);
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

  const renderItem = React.useCallback(
    (item: Item, index: number) => {
      return (
        <ItemComponent
          key={item.id}
          index={index}
          id={item.id}
          content={item.content}
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
