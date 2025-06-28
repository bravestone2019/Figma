import { useCallback } from "react";

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
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - position.x) / scale;
      const mouseY = (e.clientY - rect.top - position.y) / scale;
      if (selectionBox) {
        const { startX, startY, currentX, currentY } = selectionBox;
        const x1 = Math.min(startX, currentX);
        const y1 = Math.min(startY, currentY);
        const x2 = Math.max(startX, currentX);
        const y2 = Math.max(startY, currentY);
        const selected = drawnRectangles.map((shape, i) => {
          if (shape.type === "rectangle") {
            return (
              shape.x >= x1 && shape.y >= y1 &&
              shape.x + shape.width <= x2 && shape.y + shape.height <= y2
            );
          } else if (shape.type === "circle") {
            return (
              shape.x - shape.radius >= x1 && shape.y - shape.radius >= y1 &&
              shape.x + shape.radius <= x2 && shape.y + shape.radius <= y2
            );
          } else if (shape.type === "line") {
            return (
              shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
              shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2
            );
          } else if (shape.type === "triangle") {
            return (
              shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
              shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2 &&
              shape.x3 >= x1 && shape.x3 <= x2 && shape.y3 >= y1 && shape.y3 <= y2
            );
          } else if (shape.type === "text") {
            return (
              shape.x >= x1 && shape.y >= y1 &&
              shape.x + (shape.width || 50) <= x2 && shape.y + (shape.height || 20) <= y2
            );
          }
          return false;
        })
        .map((inside, i) => inside ? i : null)
        .filter(i => i !== null);
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
            type: "rectangle",
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
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
            type: "line",
            x1: startX,
            y1: startY,
            x2: currentX,
            y2: currentY,
            color: "#000000",
            width: 2,
            opacity: 1,
            locked: false,
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
        });
        setTextBox(null);
        if (setActiveTool) setActiveTool("Move");
        return;
      }
    }, [textInput, setIsDragging, setMovingShape, canvasRef, position, scale, selectionBox, setSelectedShapes, setSelectionBox, drawnRectangles, setDrawnRectangles, drawingRectangle, setDrawingRectangle, drawingLine, setDrawingLine, drawingCircle, setDrawingCircle, drawingTriangle, setDrawingTriangle, textBox, setTextBox, setActiveTool, setTextInput, activeTool, scalingHandle, setScalingHandle]);

export default handleMouseUp; 