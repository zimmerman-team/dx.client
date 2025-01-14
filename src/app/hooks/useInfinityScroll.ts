import { useState, useEffect } from "react";
export const useInfinityScroll = (
  observerTarget: React.MutableRefObject<null>,
  threshold: number = 1
) => {
  const [isObserved, setIsObserved] = useState(false);

  useEffect(() => {
    //handle infinity scroll with IntersectionObserver api

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsObserved(true);
        } else {
          setIsObserved(false);
        }
      },
      { threshold }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, []);
  return { isObserved };
};
