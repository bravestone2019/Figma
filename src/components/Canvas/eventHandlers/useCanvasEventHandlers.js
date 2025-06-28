import { useCallback } from "react";
import { handleZoom, handlePinchZoom } from "../../../utils/zoom";
import { handleHorizontalPan, handleVerticalPan } from "../../../utils/panning";
import handleWheel from "./handleWheel";
import handleTouchStart from "./handleTouchStart";
import handleMouseDown from "./handleMouseDown";
import handleMouseMove from "./handleMouseMove";
import handleContextMenu from "./handleContextMenu";
import handleMouseUp from "./handleMouseUp";

const useCanvasEventHandlers = ({
  canvasRef,
  previewRef,
  activeTool,
  setActiveTool,
  position,
  setPosition,
  scale,
  setScale,
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
  textInput,
  setTextInput,
  textBox,
  setTextBox,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  movingShape,
  setMovingShape,
  hoveredShape,
  setHoveredShape,
  selectionBox,
  setSelectionBox,
  selectedShapes,
  setSelectedShapes,
  isPointInShape,
  scalingHandle,
  setScalingHandle,
}) => {
  // Handle mouse wheel for zooming and panning
  const _handleWheel = handleWheel(position, scale, setPosition, setScale);
  const handleWheelWithTextInput = useCallback(
    (e) => {
      if (textInput) return;
      _handleWheel(e);
    },
    [textInput, _handleWheel]
  );

  // Handle touch events for pinch zoom
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      const result = handlePinchZoom(e, position, scale);
      if (result) {
        setPosition(result.position);
        setScale(result.scale);
      }
    }
  }, [position, scale, setPosition, setScale]);

  // Handle mouse down for panning or starting shape draw
  const handleMouseDownCb = handleMouseDown(position, scale, activeTool, setIsDragging, setDragStart, setSelectionBox, drawnRectangles, setDrawnRectangles, isPointInShape, selectedShapes, setMovingShape, setSelectedShapes, setDrawingRectangle, setDrawingLine, setDrawingCircle, setDrawingTriangle, setTextBox, setScalingHandle);

  // Handle mouse move for panning or drawing shapes
  const handleMouseMoveCb = handleMouseMove(position, scale, canvasRef, textInput, selectionBox, setSelectionBox, activeTool, movingShape, setHoveredShape, drawnRectangles, isPointInShape, setDrawnRectangles, selectedShapes, isDragging, dragStart, setPosition, drawingRectangle, setDrawingRectangle, drawingLine, setDrawingLine, drawingCircle, setDrawingCircle, drawingTriangle, setDrawingTriangle, textBox, setTextBox, scalingHandle, setScalingHandle);

  // Handle mouse up to stop panning or finalize shape drawing
  const handleMouseUpCb = handleMouseUp(
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
  );

  // Handle mouse leave to stop panning or drawing
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setMovingShape(null);
    setHoveredShape(null);
    setDrawingRectangle(null);
    setDrawingLine(null);
    setDrawingCircle(null);
    setDrawingTriangle(null);
    setTextBox(null);
    setSelectionBox(null);
    setSelectedShapes([]);
  }, [setIsDragging, setMovingShape, setHoveredShape, setDrawingRectangle, setDrawingLine, setDrawingCircle, setDrawingTriangle, setTextBox, setSelectionBox, setSelectedShapes]);

  // Add context menu handler for locking shapes
  const handleContextMenuCb = handleContextMenu(canvasRef, position, scale, drawnRectangles, isPointInShape, setDrawnRectangles);

  const handleTouchStartCb = handleTouchStart();

  return {
    handleWheel: handleWheelWithTextInput,
    handleTouchStart: handleTouchStartCb,
    handleTouchMove,
    handleMouseDown: handleMouseDownCb,
    handleMouseMove: handleMouseMoveCb,
    handleMouseUp: handleMouseUpCb,
    handleMouseLeave,
    handleContextMenu: handleContextMenuCb,
  };
};

export default useCanvasEventHandlers; 