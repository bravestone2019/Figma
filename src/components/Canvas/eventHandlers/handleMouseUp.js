import { useCallback } from "react";
import { getShapesInSelectionBox } from '../CanvasContent/boxSelection';

const handleMouseUp = (
  textInput,
  setIsDragging,
  setMovingShape,
  canvasRef,
  position,
  scale,
  selectionBox,
  setSelectedShapes,
  setSelectionBox,
  drawnRectangles,
  setDrawnRectangles,
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
  setActiveTool,
  setTextInput,
  activeTool,
  scalingHandle,
  setScalingHandle
) =>
  useCallback(
    (e) => {
      if (textInput) return;
      setIsDragging(false);
      setMovingShape(null);
      if (setScalingHandle) setScalingHandle(null);
      // Clear global scaling handle state
      window.scalingHandle = null;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - position.x) / scale;
      const mouseY = (e.clientY - rect.top - position.y) / scale;
      if (selectionBox) {
        const selected = getShapesInSelectionBox(drawnRectangles, selectionBox);
        setSelectedShapes(selected);
        setSelectionBox(null);
        return;
      }
      if (drawingRectangle) {
        const { startX, startY, currentX, currentY } = drawingRectangle;
        const rectX = Math.min(startX, currentX);
        const rectY = Math.min(startY, currentY);
        const rectWidth = Math.abs(currentX - startX);
        const rectHeight = Math.abs(currentY - startY);
        setDrawnRectangles((prev) => [
          ...prev,
          {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + Math.random()).toString(),
            type: "rectangle",
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            rotation: 0,
            backgroundColor: "rgba(128, 128, 128, 0.2)",
            borderColor: "#808080",
            borderWidth: 1,
            opacity: 1,
            locked: false,
          },
        ]);
        setDrawingRectangle(null);
        if (setActiveTool) setActiveTool("Move");
        return;
      }
      if (drawingLine) {
        const { startX, startY, currentX, currentY } = drawingLine;
        setDrawnRectangles((prev) => [
          ...prev,
          {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + Math.random()).toString(),
            type: "line",
            x1: startX,
            y1: startY,
            x2: currentX,
            y2: currentY,
            color: "#000000",
            width: 2,
            opacity: 1,
            locked: false,
            rotation: 0
          },
        ]);
        setDrawingLine(null);
        if (setActiveTool) setActiveTool("Move");
        return;
      }
      if (drawingCircle) {
        const { startX, startY, currentX, currentY } = drawingCircle;
        const radius = Math.sqrt(
          Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
        );
        setDrawnRectangles((prev) => [
          ...prev,
          {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + Math.random()).toString(),
            type: "circle",
            x: startX,
            y: startY,
            radius: radius,
            backgroundColor: "rgba(128, 128, 128, 0.2)",
            borderColor: "#808080",
            borderWidth: 1,
            opacity: 1,
            locked: false,
          },
        ]);
        setDrawingCircle(null);
        if (setActiveTool) setActiveTool("Move");
        return;
      }
      if (drawingTriangle) {
        const { startX, startY, currentX, currentY } = drawingTriangle;
        const dx = currentX - startX;
        const dy = currentY - startY;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);
        const x3 = startX + length * Math.cos(angle + Math.PI / 3);
        const y3 = startY + length * Math.sin(angle + Math.PI / 3);
        setDrawnRectangles((prev) => [
          ...prev,
          {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + Math.random()).toString(),
            type: "triangle",
            x1: startX,
            y1: startY,
            x2: currentX,
            y2: currentY,
            x3: x3,
            y3: y3,
            backgroundColor: "rgba(128, 128, 128, 0.2)",
            borderColor: "#808080",
            borderWidth: 1,
            opacity: 1,
            locked: false,
          },
        ]);
        setDrawingTriangle(null);
        if (setActiveTool) setActiveTool("Move");
        return;
      }
      if (drawingImage) {
        // For image preview, we need to trigger file selection
        // The actual image placement will be handled by the Image component
        // We'll use a custom event to signal that file selection should be triggered
        const imagePlacementEvent = new CustomEvent('imagePlacementRequested', {
          detail: {
            startX: drawingImage.startX,
            startY: drawingImage.startY,
            currentX: drawingImage.currentX,
            currentY: drawingImage.currentY
          }
        });
        document.dispatchEvent(imagePlacementEvent);
        setDrawingImage(null);
        if (setActiveTool) setActiveTool("Move");
        // Add a placeholder image shape with rotation
        setDrawnRectangles((prev) => [
          ...prev,
          {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + Math.random()).toString(),
            type: "image",
            x: drawingImage.startX,
            y: drawingImage.startY,
            width: Math.abs(drawingImage.currentX - drawingImage.startX),
            height: Math.abs(drawingImage.currentY - drawingImage.startY),
            src: '',
            rotation: 0,
            opacity: 1,
            locked: false,
          },
        ]);
        return;
      }
      if (textBox) {
        const { startX, startY, currentX, currentY } = textBox;
        const rectX = Math.min(startX, currentX);
        const rectY = Math.min(startY, currentY);
        const rectWidth = Math.abs(currentX - startX);
        const rectHeight = Math.abs(currentY - startY);
        setTextInput({
          x: rectX,
          y: rectY,
          width: rectWidth,
          height: rectHeight,
          text: "",
          fontSize: 16,
          color: "#000000",
          opacity: 1,
          locked: false,
          rotation: 0,
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + Math.random()).toString(),
        });
        setTextBox(null);
        if (setActiveTool) setActiveTool("Move");
        return;
      }
    }, [textInput, setIsDragging, setMovingShape, canvasRef, position, scale, selectionBox, setSelectedShapes, setSelectionBox, drawnRectangles, setDrawnRectangles, drawingRectangle, setDrawingRectangle, drawingLine, setDrawingLine, drawingCircle, setDrawingCircle, drawingTriangle, setDrawingTriangle, drawingImage, setDrawingImage, textBox, setTextBox, setActiveTool, setTextInput, activeTool, scalingHandle, setScalingHandle]);

export default handleMouseUp; 