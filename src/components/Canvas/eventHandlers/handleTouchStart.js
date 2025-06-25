import { useCallback } from "react";

const handleTouchStart = () =>
  useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  }, []);

export default handleTouchStart; 