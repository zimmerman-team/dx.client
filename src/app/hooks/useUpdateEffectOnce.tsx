import React from "react";

// This hook is used to run an effect only once after the first render.
export function useUpdateEffectOnce(
  effect: Function,
  dependencies: Array<any>
) {
  const isInitialMount = React.useRef(true);
  const [didRunOnFirstUpdate, setDidRunOnFirstUpdate] = React.useState(false);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!didRunOnFirstUpdate) {
      setDidRunOnFirstUpdate(true);
      effect();
    }
  }, [dependencies]);
}
