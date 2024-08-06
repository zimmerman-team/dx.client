import { IFramesArray } from "app/modules/report-module/views/create/data";
import { Updater } from "use-immer";

export const usehandleRowFrameItemResize = (
  updateFramesArray: Updater<IFramesArray[]>
) => {
  const handleRowFrameItemResize = (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => {
    updateFramesArray((draft) => {
      const frameIndex = draft.findIndex((frame) => frame.id === rowId);
      if (frameIndex === -1) {
        return draft;
      }
      const contentContainer = document.getElementById("content-container");
      const percentage =
        ((width + (draft[frameIndex].structure !== "oneByOne" ? 30 : 0)) /
          contentContainer!.offsetWidth) *
        100;
      draft[frameIndex].contentWidths[itemIndex] = percentage;
      if (draft[frameIndex].content.length > 1) {
        let remainingWidth = 100 - percentage;
        draft[frameIndex].content.forEach((_, index) => {
          if (index < itemIndex) {
            remainingWidth -= draft[frameIndex].contentWidths[index];
          }
          if (index > itemIndex) {
            draft[frameIndex].contentWidths[index] =
              remainingWidth / (draft[frameIndex].content.length - index);
          }
        });
      }
      if (draft[frameIndex].contentHeights) {
        draft[frameIndex].contentHeights[itemIndex] = height;
      } else {
        draft[frameIndex].contentHeights = [];
        draft[frameIndex].contentHeights[itemIndex] = height;
      }
    });
  };

  return { handleRowFrameItemResize };
};
