import { useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { redraw } from "./CanvasContent/redraw";

const CanvasDrawing = forwardRef(({
  canvasRef,
  previewRef,
  position,
  scale,
  drawnRectangles,
  drawingRectangle,
  drawingLine,
  drawingCircle,
  drawingTriangle,
  textBox,
  hoveredShape,
  activeTool,
  selectionBox,
  selectedShapes,
  textInput,
}, ref) => {

  // Main drawing function
  const drawCanvas = useCallback(() => {
    redraw({
      canvasRef,
      position,
      scale,
      drawnRectangles,
      activeTool,
      hoveredShape,
      textInput,
      selectedShapes,
    });
  }, [canvasRef, position, scale, drawnRectangles, activeTool, hoveredShape, textInput, selectedShapes]);

  // Effect to handle initial render and updates
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Expose redraw method
  useImperativeHandle(ref, () => ({
    redrawAllShapes: drawCanvas
  }));

  // Expose preview draw function
  if (previewRef) {
    previewRef.currentDrawPreview = drawCanvas;
  }

  return null;
});

export default CanvasDrawing; 