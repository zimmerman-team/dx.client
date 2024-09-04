export const handleDragOverScroll = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const cursor = { y: e.pageY }; // Cursor YPos
  const papaWindow = window;
  const pxFromTop = papaWindow.scrollY;
  const userScreenHeight = papaWindow.innerHeight;
  const pageHeight = userScreenHeight + pxFromTop;
  if (cursor.y > pageHeight - (100 + 98)) {
    window.scrollBy({
      top: 1,
      // behavior: "instant",
    });
  } else if (pageHeight + 100 + 98 - userScreenHeight > cursor.y) {
    window.scrollBy({
      top: -1,
      // behavior: "instant",
    });
  }
};
