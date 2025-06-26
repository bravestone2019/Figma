import { useCallback } from "react";

const handleContextMenu = (
  canvasRef,
  position,
  scale,
  drawnRectangles,
  isPointInShape,
  setDrawnRectangles
) =>
  useCallback(
    (e) => {
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - position.x) / scale;
      const mouseY = (e.clientY - rect.top - position.y) / scale;
      for (let i = drawnRectangles.length - 1; i >= 0; i--) {
        const shape = drawnRectangles[i];
        if (isPointInShape(shape, mouseX, mouseY)) {
          setDrawnRectangles((prev) =>
            prev.map((s, idx) =>
              idx === i ? { ...s, locked: !s.locked } : s
            )
          );
          return;
        }
      }
    },
    [canvasRef, position, scale, drawnRectangles, isPointInShape, setDrawnRectangles]
  );

export default handleContextMenu; 