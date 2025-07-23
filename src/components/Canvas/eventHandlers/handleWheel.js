import { useCallback } from "react";
import { handleZoom } from "../../../utils/zoom";
import { handleHorizontalPan, handleVerticalPan } from "../../../utils/panning";

const useHandleWheel = (position, scale, setPosition, setScale) =>
  useCallback((e) => {
    // The textInput check should be handled in the parent hook
    e.preventDefault();
    if (e.shiftKey) {
      const horizontalPan = handleHorizontalPan(e, position);
      if (horizontalPan) {
        setPosition(horizontalPan);
        return;
      }
    }
    if (e.ctrlKey) {
      const verticalPan = handleVerticalPan(e, position);
      if (verticalPan) {
        setPosition(verticalPan);
        return;
      }
    }
    const result = handleZoom(e, position, scale);
    if (result) {
      setPosition(result.position);
      setScale(result.scale);
    }
  }, [position, scale, setPosition, setScale]);

export default useHandleWheel; 