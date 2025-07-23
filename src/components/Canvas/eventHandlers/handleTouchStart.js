import { useCallback } from "react";

const useHandleTouchStart = () =>
  useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  }, []);

export default useHandleTouchStart; 