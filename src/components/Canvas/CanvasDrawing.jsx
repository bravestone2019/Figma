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
  drawingImage,
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
      drawingRectangle,
      drawingLine,
      drawingCircle,
      drawingTriangle,
      drawingImage,
      textBox,
      selectionBox,
    });
  }, [canvasRef, position, scale, drawnRectangles, activeTool, hoveredShape, textInput, selectedShapes, drawingRectangle, drawingLine, drawingCircle, drawingTriangle, drawingImage, textBox, selectionBox]);

  // Effect to handle initial render and updates
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Set up redraw callback for images
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.redrawCallback = drawCanvas;
    }
    
    return () => {
      if (canvasRef.current) {
        canvasRef.current.redrawCallback = null;
      }
    };
  }, [canvasRef, drawCanvas]);

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