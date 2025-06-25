import { useCallback } from "react";

const handleMouseDown = (
  position,
  scale,
  activeTool,
  setIsDragging,
  setDragStart,
  setSelectionBox,
  drawnRectangles,
  setDrawnRectangles,
  isPointInShape,
  selectedShapes,
  setMovingShape,
  setSelectedShapes,
  setDrawingRectangle,
  setDrawingLine,
  setDrawingCircle,
  setDrawingTriangle,
  setTextBox
) =>
  useCallback(
    (e) => {
      const rect = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : { left: 0, top: 0 };
      const mouseX = (e.clientX - rect.left - position.x) / scale;
      const mouseY = (e.clientY - rect.top - position.y) / scale;
      // Clear all preview states before starting a new one
      setDrawingRectangle(null);
      setDrawingLine(null);
      setDrawingCircle(null);
      setDrawingTriangle(null);
      setTextBox(null);
      if (activeTool === "Hand") {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        return;
      }
      if (activeTool === "Move" && e.button === 2) {
        setSelectionBox({
          startX: mouseX,
          startY: mouseY,
          currentX: mouseX,
          currentY: mouseY,
        });
        return;
      }
      if (activeTool === "Move") {
        for (let i = drawnRectangles.length - 1; i >= 0; i--) {
          const shape = drawnRectangles[i];
          if (!shape.locked && isPointInShape(shape, mouseX, mouseY)) {
            let offsetX = 0, offsetY = 0;
            if (shape.type === "rectangle" || shape.type === "text") {
              offsetX = mouseX - shape.x;
              offsetY = mouseY - shape.y;
            } else if (shape.type === "circle") {
              offsetX = mouseX - shape.x;
              offsetY = mouseY - shape.y;
            } else if (shape.type === "line") {
              offsetX = mouseX - shape.x1;
              offsetY = mouseY - shape.y1;
            } else if (shape.type === "triangle") {
              offsetX = mouseX - shape.x1;
              offsetY = mouseY - shape.y1;
            }
            if (selectedShapes.includes(i)) {
              const originalPositions = {};
              selectedShapes.forEach(shapeIndex => {
                const shape = drawnRectangles[shapeIndex];
                if (shape.type === "rectangle" || shape.type === "text" || shape.type === "circle") {
                  originalPositions[shapeIndex] = { x: shape.x, y: shape.y };
                } else if (shape.type === "line") {
                  originalPositions[shapeIndex] = { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2 };
                } else if (shape.type === "triangle") {
                  originalPositions[shapeIndex] = { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2, x3: shape.x3, y3: shape.y3 };
                }
              });
              setMovingShape({ 
                index: i, 
                offsetX, 
                offsetY, 
                multi: true, 
                originalPositions,
                mouseStart: { x: mouseX, y: mouseY }
              });
            } else {
              setMovingShape({ index: i, offsetX, offsetY });
              setSelectedShapes([]);
            }
            return;
          }
        }
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      } else if (activeTool === "Rectangle") {
        setDrawingRectangle({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Line") {
        setDrawingLine({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Circle") {
        setDrawingCircle({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Triangle") {
        setDrawingTriangle({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Text") {
        setTextBox({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      }
    }, [position, scale, activeTool, setIsDragging, setDragStart, setSelectionBox, drawnRectangles, setDrawnRectangles, isPointInShape, selectedShapes, setMovingShape, setSelectedShapes, setDrawingRectangle, setDrawingLine, setDrawingCircle, setDrawingTriangle, setTextBox]);

export default handleMouseDown; 