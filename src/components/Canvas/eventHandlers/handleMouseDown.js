import { useCallback } from "react";
import { getScaleHandlePositions } from '../CanvasContent/scaleHandles';
import { createSelectionBox, shouldActivateSelectionBox } from '../CanvasContent/boxSelection';

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
  setDrawingImage,
  setTextBox,
  setScalingHandle
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
      setDrawingImage(null);
      setTextBox(null);
      if (activeTool === "Hand") {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        return;
      }
      if (shouldActivateSelectionBox(activeTool, e.button)) {
        setSelectionBox(createSelectionBox(mouseX, mouseY));
        return;
      }
      // --- SCALE HANDLE LOGIC ---
      if (activeTool === "Move" && selectedShapes.length === 1) {
        const shapeIdx = selectedShapes[0];
        const shape = drawnRectangles[shapeIdx];
        if (shape) {
          if (shape.type === 'line') {
            // Check endpoints
            const handleSize = 10 / scale;
            const half = handleSize / 2;
            const endpoints = [
              { x: shape.x1, y: shape.y1, type: 'endpoint1' },
              { x: shape.x2, y: shape.y2, type: 'endpoint2' },
            ];
            for (const handle of endpoints) {
              if (
                mouseX >= handle.x - half && mouseX <= handle.x + half &&
                mouseY >= handle.y - half && mouseY <= handle.y + half
              ) {
                setScalingHandle({ shapeIdx, handleType: handle.type, startX: mouseX, startY: mouseY, origBounds: { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2 } });
                return;
              }
            }
          } else {
            const bounds = (typeof getBoundingRect !== 'undefined') ? getBoundingRect(shape) : { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
            const handles = getScaleHandlePositions(bounds);
            const handleSize = 10 / scale;
            const half = handleSize / 2;
            for (const handle of handles) {
              if (
                mouseX >= handle.x - half && mouseX <= handle.x + half &&
                mouseY >= handle.y - half && mouseY <= handle.y + half
              ) {
                // Store aspect ratio for rectangles, text, and images when Shift is held
                let aspectRatio = null;
                if (e.shiftKey && (shape.type === 'rectangle' || shape.type === 'text' || shape.type === 'image')) {
                  aspectRatio = shape.width / shape.height;
                }
                
                setScalingHandle({ 
                  shapeIdx, 
                  handleType: handle.type, 
                  startX: mouseX, 
                  startY: mouseY, 
                  origBounds: bounds,
                  preserveAspectRatio: e.shiftKey,
                  aspectRatio: aspectRatio
                });
                // Store globally for visual indicator access
                window.scalingHandle = { 
                  shapeIdx, 
                  handleType: handle.type, 
                  startX: mouseX, 
                  startY: mouseY, 
                  origBounds: bounds,
                  preserveAspectRatio: e.shiftKey,
                  aspectRatio: aspectRatio
                };
                return;
              }
            }
          }
        }
      }
      // --- END SCALE HANDLE LOGIC ---
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
            } else if (shape.type === "image") {
              offsetX = mouseX - shape.x;
              offsetY = mouseY - shape.y;
            }
            
            // Check if this shape is already selected
            const isAlreadySelected = selectedShapes.includes(i);
            
            // Select the shape if not already selected
            if (!isAlreadySelected) {
              setSelectedShapes([i]);
            }
            
            // Always start moving the shape, whether it was already selected or not
            if (isAlreadySelected && selectedShapes.length > 1) {
              // Multi-selection move - move all selected shapes
              const originalPositions = {};
              selectedShapes.forEach(shapeIndex => {
                const selectedShape = drawnRectangles[shapeIndex];
                if (selectedShape.type === "rectangle" || selectedShape.type === "text" || selectedShape.type === "circle" || selectedShape.type === "image") {
                  originalPositions[shapeIndex] = { x: selectedShape.x, y: selectedShape.y };
                } else if (selectedShape.type === "line") {
                  originalPositions[shapeIndex] = { x1: selectedShape.x1, y1: selectedShape.y1, x2: selectedShape.x2, y2: selectedShape.y2 };
                } else if (selectedShape.type === "triangle") {
                  originalPositions[shapeIndex] = { x1: selectedShape.x1, y1: selectedShape.y1, x2: selectedShape.x2, y2: selectedShape.y2, x3: selectedShape.x3, y3: selectedShape.y3 };
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
              // Single shape move
              setMovingShape({ index: i, offsetX, offsetY });
            }
            return;
          }
        }
        // If no shape is clicked, clear selection
        setSelectedShapes([]);
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
      } else if (activeTool === "Image") {
        setDrawingImage({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      } else if (activeTool === "Text") {
        setTextBox({ startX: mouseX, startY: mouseY, currentX: mouseX, currentY: mouseY });
      }
    }, [position, scale, activeTool, setIsDragging, setDragStart, setSelectionBox, drawnRectangles, setDrawnRectangles, isPointInShape, selectedShapes, setMovingShape, setSelectedShapes, setDrawingRectangle, setDrawingLine, setDrawingCircle, setDrawingTriangle, setDrawingImage, setTextBox, setScalingHandle]);

export default handleMouseDown; 