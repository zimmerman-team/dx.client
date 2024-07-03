import React from "react";
import { useDrag } from "react-dnd";
import { ReactComponent as RowFrameHandleAdornment } from "app/modules/report-module/asset/rowFrameHandleAdornment.svg";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view/";
import { useRecoilState } from "recoil";
import { isDividerOrRowFrameDraggingAtom } from "app/state/recoil/atoms";

interface ItemComponentProps {
  id: string;
  index: number;
  children: React.ReactNode;
  childrenData: any[];
}

const style = {
  transform: "translate(0px, 0px)",
};

export function ItemComponent(props: ItemComponentProps) {
  const { id, children: content, index } = props;

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
    if (isDragging !== isItemDragging.state) {
      setIsItemDragging({
        state: isDragging,
        rowId: isDragging ? id : null,
      });
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
          top: 0px;
          left: -1rem;
          z-index: 1;
          width: 23px;
          cursor: grab;
          position: absolute;
          align-items: center;
          background: #adb5bd;
          border-radius: 3.45px 0px 0px 3.45px;
          justify-content: center;
          height: 100%;
          display: ${props.childrenData[props.index]?.structure === null
            ? "none"
            : "flex"};
        `}
        data-cy="row-frame-handle"
      >
        <RowFrameHandleAdornment />
      </div>
      {content}
    </div>
  );
}
