import { useEffect, useRef, useState } from "react";
import "./Canvas.css";
// import { handleZoom, handlePinchZoom } from "../../utils/zoom";
// import { handleHorizontalPan, handleVerticalPan } from "../../utils/panning";
import CanvasDrawing from "./CanvasDrawing";
import TextInputOverlay from "./TextInputOverlay";
import useCanvasEventHandlers from "./eventHandlers/useCanvasEventHandlers";
import isPointInShape from "./isPointInShape";
import useKeyboardShortcuts from "./useKeyboardShortcuts";
import { handleDeleteShapeKey } from "./deleteShapeHandler";
import { v4 as uuidv4 } from 'uuid';

const Canvas = ({
  activeTool,
  setActiveTool,
  position,
  setPosition,
  scale,
  setScale,
  drawnRectangles,
  setDrawnRectangles,
  selectedShapes,
  setSelectedShapes,
  backgroundColor,
  backgroundOpacity,
}) => {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const canvasDrawingRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [drawingRectangle, setDrawingRectangle] = useState(null);
  const [drawingLine, setDrawingLine] = useState(null);
  const [drawingCircle, setDrawingCircle] = useState(null);
  const [drawingTriangle, setDrawingTriangle] = useState(null);
  const [drawingImage, setDrawingImage] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [textBox, setTextBox] = useState(null);
  const [movingShape, setMovingShape] = useState(null);
  const [hoveredShape, setHoveredShape] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [scalingHandle, setScalingHandle] = useState(null);
  const clipboardRef = useRef([]);

  // Copy selected shapes to clipboard
  const handleCopy = () => {
    if (!selectedShapes || selectedShapes.length === 0) return;
    const copiedShapes = drawnRectangles.filter(shape => selectedShapes.includes(shape.id));
    clipboardRef.current = copiedShapes.map(shape => ({ ...shape }));
  };

  // Paste shapes from clipboard with offset and new IDs
  const handlePaste = () => {
    if (!clipboardRef.current || clipboardRef.current.length === 0) return;
    const OFFSET = 20;
    const newShapes = clipboardRef.current.map(shape => {
      const newShape = { ...shape, id: uuidv4() };
      // Offset position for each shape type
      if (newShape.type === 'rectangle' || newShape.type === 'image' || newShape.type === 'text') {
        newShape.x += OFFSET;
        newShape.y += OFFSET;
      } else if (newShape.type === 'circle') {
        newShape.x += OFFSET;
        newShape.y += OFFSET;
      } else if (newShape.type === 'line') {
        newShape.x1 += OFFSET;
        newShape.y1 += OFFSET;
        newShape.x2 += OFFSET;
        newShape.y2 += OFFSET;
      } else if (newShape.type === 'triangle') {
        newShape.x1 += OFFSET;
        newShape.y1 += OFFSET;
        newShape.x2 += OFFSET;
        newShape.y2 += OFFSET;
        newShape.x3 += OFFSET;
        newShape.y3 += OFFSET;
      }
      return newShape;
    });
    setDrawnRectangles(prev => [...prev, ...newShapes]);
    setSelectedShapes(newShapes.map(s => s.id));
  };

  // Grid configuration
  const GRID_SIZE = 5; // Size of each grid cell in pixels
  const GRID_COLOR = "#e0e0e0"; // Light gray color for grid lines
  const MIN_SCALE_FOR_GRID = 2; // Minimum scale to show grid lines

  // Use the custom hook for keyboard shortcuts
  useKeyboardShortcuts(setActiveTool, textInput, handleCopy, handlePaste);

  // Use the custom hook for event handlers
  const {
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
  } = useCanvasEventHandlers({
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
    drawingImage,
    setDrawingImage,
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
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);

    // Prevent browser zoom only when not in text input
    const preventBrowserZoom = (e) => {
      // Allow all keyboard events when in text input mode
      if (textInput) return;

      // Only prevent browser zoom when not in text input
      if (e.ctrlKey && !e.target.closest(".text-input-container")) {
        e.preventDefault();
      }
    };

    // Add event listener for wheel with passive: false to allow preventDefault
    window.addEventListener("wheel", preventBrowserZoom, { passive: false });
    window.addEventListener("keydown", preventBrowserZoom);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", preventBrowserZoom);
      window.removeEventListener("keydown", preventBrowserZoom);
    };
  }, [textInput ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handler = (e) => handleWheel(e);
    canvas.addEventListener("wheel", handler, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handler, { passive: false });
    };
  }, [handleWheel]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (!isInput) {
        handleDeleteShapeKey(e, drawnRectangles, selectedShapes, setDrawnRectangles, setSelectedShapes);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawnRectangles, selectedShapes]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        className={`canvas ${activeTool === "Hand" ? "hand-tool" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onContextMenu={handleContextMenu}
      />
      <CanvasDrawing
        ref={canvasDrawingRef}
        canvasRef={canvasRef}
        previewRef={previewRef}
        position={position}
        scale={scale}
        drawnRectangles={drawnRectangles}
        drawingRectangle={drawingRectangle}
        drawingLine={drawingLine}
        drawingCircle={drawingCircle}
        drawingTriangle={drawingTriangle}
        drawingImage={drawingImage}
        textBox={textBox}
        hoveredShape={hoveredShape}
        activeTool={activeTool}
        selectionBox={selectionBox}
        selectedShapes={selectedShapes}
        textInput={textInput}
        backgroundColor={backgroundColor}
        backgroundOpacity={backgroundOpacity}
      />
      <TextInputOverlay
        textInput={textInput}
        setTextInput={setTextInput}
        setDrawnRectangles={setDrawnRectangles}
        setSelectedShapes={setSelectedShapes} // Pass this prop
        scale={scale}
        position={position}
        redrawAllShapes={canvasDrawingRef}
      />
    </div>
  );
};


export default Canvas;
