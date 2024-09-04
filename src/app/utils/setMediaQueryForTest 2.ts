import React from "react";
import mediaQuery from "css-mediaquery";

function createMatchMedia(width: number) {
  return (query: string) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
    media: "",
    onchange: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
export function setMediaQueryForTest(width: number) {
  window.matchMedia = createMatchMedia(width);
}
