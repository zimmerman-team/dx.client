import { IFramesArray } from "app/modules/report-module/views/create/data";

export const usehandleRowFrameItemResize = (
  setFramesArray: React.Dispatch<React.SetStateAction<IFramesArray[]>>
) => {
  const handleRowFrameItemResize = (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => {
    setFramesArray((prev) => {
      const tempPrev = prev.map((item) => ({ ...item }));
      const frameIndex = tempPrev.findIndex((frame) => frame.id === rowId);
      if (frameIndex === -1) {
        return prev;
      }
      const contentContainer = document.getElementById("content-container");
      const percentage =
        ((width + (tempPrev[frameIndex].structure !== "oneByOne" ? 30 : 0)) /
          contentContainer!.offsetWidth) *
        100;
      tempPrev[frameIndex].contentWidths[itemIndex] = percentage;
      if (tempPrev[frameIndex].content.length > 1) {
        let remainingWidth = 100 - percentage;
        tempPrev[frameIndex].content.forEach((_, index) => {
          if (index < itemIndex) {
            remainingWidth -= tempPrev[frameIndex].contentWidths[index];
          }
          if (index > itemIndex) {
            tempPrev[frameIndex].contentWidths[index] =
              remainingWidth / (tempPrev[frameIndex].content.length - index);
          }
        });
      }
      if (tempPrev[frameIndex].contentHeights) {
        tempPrev[frameIndex].contentHeights[itemIndex] = height;
      } else {
        tempPrev[frameIndex].contentHeights = [];
        tempPrev[frameIndex].contentHeights[itemIndex] = height;
      }
      return [...tempPrev];
    });
  };

  return { handleRowFrameItemResize };
};
