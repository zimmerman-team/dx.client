import React from "react";

function useAutosave(
  callback: () => void,
  delay: number,
  autoSave: boolean,
  deps = []
) {
  const savedCallback = React.useRef<() => void>(); // to save the current "fresh" callback

  // keep callback ref up to date
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // create the interval
  React.useEffect(() => {
    // function to call the callback
    function runCallback() {
      savedCallback.current?.();
    }
    if (autoSave === false) {
      // run the interval
      let interval = setInterval(runCallback, delay);
      // clean up on unmount or dependency change
      return () => clearInterval(interval);
    }
  }, [delay, autoSave, ...deps]);
}

export default useAutosave;
