import { useCallback } from "react";
import { resizeShape } from '../CanvasContent/scaleHandles';
import { updateSelectionBox } from '../CanvasContent/boxSelection';

const handleMouseMove = (
  position,
  scale,
  canvasRef,
  textInput,
  selectionBox,
  setSelectionBox,
  activeTool,
  movingShape,
  setHoveredShape,
  drawnRectangles,
  isPointInShape,
  setDrawnRectangles,
  selectedShapes,
  isDragging,
  dragStart,
  setPosition,
  drawingRectangle,
  setDrawingRectangle,
  drawingLine,
  setDrawingLine,
  drawingCircle,
  setDrawingCircle,
  drawingTriangle,
  setDrawingTriangle,
  drawingImage,
  setDrawingImage,
  textBox,
  setTextBox,
  scalingHandle,
  setScalingHandle
) =>
  useCallback(
    (e) => {
      if (textInput) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - position.x) / scale;
      const mouseY = (e.clientY - rect.top - position.y) / scale;
      if (scalingHandle) {
        setHoveredShape(null);
        setDrawnRectangles((prev) =>
          prev.map((shape, idx) => {
            if (idx === scalingHandle.shapeIdx) {
              return resizeShape(
                shape,
                scalingHandle.handleType,
                scalingHandle.origBounds,
                { x: mouseX, y: mouseY },
                scalingHandle.preserveAspectRatio,
                scalingHandle.aspectRatio
              );
            }
            return shape;
          })
        );
        return;
      }
      if (selectionBox) {
        setSelectionBox(updateSelectionBox(selectionBox, mouseX, mouseY));
        return;
      }
      if (activeTool === "Move" && !movingShape) {
        let found = null;
        const ctx = canvasRef.current.getContext("2d");
        
        // Check shapes from top to bottom (reverse order for proper layering)
        for (let i = drawnRectangles.length - 1; i >= 0; i--) {
          const shape = drawnRectangles[i];
          if (!shape.locked && isPointInShape(shape, mouseX, mouseY, ctx, scale)) {
            found = i;
            break;
          }
        }
        
        // Update hover state
        setHoveredShape(found);
      } else {
        setHoveredShape(null);
      }
      if (movingShape) {
        setDrawnRectangles((prev) =>
          prev.map((shape, idx) => {
            if (movingShape.multi && selectedShapes.includes(idx)) {
              const dx = mouseX - movingShape.mouseStart.x;
              const dy = mouseY - movingShape.mouseStart.y;
              if (shape.type === "rectangle" || shape.type === "text" || shape.type === "circle") {
                const orig = movingShape.originalPositions[idx];
                if (orig) {
                  return { ...shape, x: orig.x + dx, y: orig.y + dy };
                }
              } else if (shape.type === "line") {
                const orig = movingShape.originalPositions[idx];
                if (orig) {
                  return {
                    ...shape,
                    x1: orig.x1 + dx,
                    y1: orig.y1 + dy,
                    x2: orig.x2 + dx,
                    y2: orig.y2 + dy,
                  };
                }
              } else if (shape.type === "triangle") {
                const orig = movingShape.originalPositions[idx];
                if (orig) {
                  return {
                    ...shape,
                    x1: orig.x1 + dx,
                    y1: orig.y1 + dy,
                    x2: orig.x2 + dx,
                    y2: orig.y2 + dy,
                    x3: orig.x3 + dx,
                    y3: orig.y3 + dy,
                  };
                }
              } else if (shape.type === "image") {
                const orig = movingShape.originalPositions[idx];
                if (orig) {
                  return { ...shape, x: orig.x + dx, y: orig.y + dy };
                }
              }
            } else if (idx === movingShape.index) {
              if (shape.type === "rectangle" || shape.type === "text") {
                return { ...shape, x: mouseX - movingShape.offsetX, y: mouseY - movingShape.offsetY };
              } else if (shape.type === "circle") {
                return { ...shape, x: mouseX - movingShape.offsetX, y: mouseY - movingShape.offsetY };
              } else if (shape.type === "line") {
                const dx = mouseX - movingShape.offsetX - shape.x1;
                const dy = mouseY - movingShape.offsetY - shape.y1;
                return {
                  ...shape,
                  x1: shape.x1 + dx,
                  y1: shape.y1 + dy,
                  x2: shape.x2 + dx,
                  y2: shape.y2 + dy,
                };
              } else if (shape.type === "triangle") {
                const dx = mouseX - movingShape.offsetX - shape.x1;
                const dy = mouseY - movingShape.offsetY - shape.y1;
                return {
                  ...shape,
                  x1: shape.x1 + dx,
                  y1: shape.y1 + dy,
                  x2: shape.x2 + dx,
                  y2: shape.y2 + dy,
                  x3: shape.x3 + dx,
                  y3: shape.y3 + dy,
                };
              } else if (shape.type === "image") {
                return { ...shape, x: mouseX - movingShape.offsetX, y: mouseY - movingShape.offsetY };
              }
            }
            return shape;
          })
        );
        return;
      }
      if (isDragging && activeTool === "Hand") {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
      } else if (activeTool === "Rectangle" && drawingRectangle) {
        setDrawingRectangle({ ...drawingRectangle, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Line" && drawingLine) {
        setDrawingLine({ ...drawingLine, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Circle" && drawingCircle) {
        setDrawingCircle({ ...drawingCircle, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Triangle" && drawingTriangle) {
        setDrawingTriangle({ ...drawingTriangle, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Image" && drawingImage) {
        setDrawingImage({ ...drawingImage, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Text" && textBox) {
        setTextBox({ ...textBox, currentX: mouseX, currentY: mouseY });
      }
    }, [textInput, canvasRef, position, scale, selectionBox, setSelectionBox, activeTool, movingShape, setHoveredShape, drawnRectangles, isPointInShape, setDrawnRectangles, selectedShapes, isDragging, dragStart, setPosition, drawingRectangle, setDrawingRectangle, drawingLine, setDrawingLine, drawingCircle, setDrawingCircle, drawingTriangle, setDrawingTriangle, drawingImage, setDrawingImage, textBox, setTextBox, scalingHandle, setScalingHandle]);

export default handleMouseMove; 