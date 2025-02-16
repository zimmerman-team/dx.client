import React from "react";
import { PlaceholderProps } from "app/modules/story-module/views/create/data";
import { StoryElementsType } from "app/modules/story-module/components/right-panel-create-view";
import { useDrop } from "react-dnd";
import { isDividerOrRowFrameDraggingAtom } from "app/state/recoil/atoms";
import { useRecoilValue } from "recoil";
import { v4 } from "uuid";

const PlaceHolder = (props: PlaceholderProps) => {
  const moveCard = React.useCallback((itemId: string) => {
    props.updateFramesArray((draft) => {
      const dragIndex = draft.findIndex((frame) => frame.id === itemId);

      const dropIndex =
        props.index ?? draft.findIndex((frame) => frame.id === props.rowId) + 1;

      const fakeId = v4();
      const tempItem = { ...draft[dragIndex] };
      draft[dragIndex].id = fakeId;

      draft.splice(dropIndex, 0, tempItem);
      const fakeIndex = draft.findIndex((frame) => frame.id === fakeId);
      draft.splice(fakeIndex, 1);
    });
  }, []);
  const [{ isOver, handlerId, item: dragItem }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: [
      StoryElementsType.DIVIDER,
      StoryElementsType.ROWFRAME,
      StoryElementsType.ROW,
    ],
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
      handlerId: monitor.getHandlerId(),
    }),
    drop: (item: any, monitor) => {
      if (item.type === StoryElementsType.ROW) {
        moveCard(item.id);
      } else {
        props.updateFramesArray((draft) => {
          const tempIndex =
            props.index ??
            draft.findIndex((frame) => frame.id === props.rowId) + 1;

          const id = v4();
          draft.splice(tempIndex, 0, {
            id,
            frame: {
              rowId: id,
              rowIndex: tempIndex,

              type: item.type,
            },
            content:
              item.type === StoryElementsType.ROWFRAME ? [] : ["divider"],
            contentWidths: [],
            contentHeights: [],
            contentTypes:
              item.type === StoryElementsType.ROWFRAME ? [] : ["divider"],
            structure: null,
          });
        });
      }
    },
  }));

  const isItemDragging = useRecoilValue(isDividerOrRowFrameDraggingAtom);

  const itemDragIndex = props.framesArray.findIndex(
    (frame) => frame.id === isItemDragging.rowId
  );

  const placeholderIndex =
    props.index ??
    props.framesArray.findIndex((frame) => frame.id === props.rowId) + 1;

  const dragIndex = props.framesArray.findIndex(
    (frame) => frame.id === (dragItem as any)?.id
  );

  const placeholderActive = () => {
    if (isOver) {
      if (dragIndex === -1) {
        return true;
      }
      if (placeholderIndex === dragIndex) {
        return false;
      }
      return placeholderIndex - 1 !== dragIndex;
    }
    return false;
  };

  const isDroppable = () => {
    if (isItemDragging.state) {
      if (itemDragIndex === -1) {
        return true;
      }
      if (placeholderIndex === itemDragIndex) {
        return false;
      }
      return placeholderIndex - 1 !== itemDragIndex;
    }
    return false;
  };
  return (
    <div
      data-cy={`story-row-placeholder`}
      data-handler-id={handlerId}
      ref={drop}
      css={`
        width: 100%;
        height: 10px;
        display: ${isItemDragging.state ? "block" : "none"};
        background-color: ${placeholderActive() ? "#6061E5" : "#262c34"};
        opacity: ${isDroppable() ? 1 : 0.5};
        margin-bottom: 10px;
      `}
    />
  );
};

export default PlaceHolder;
