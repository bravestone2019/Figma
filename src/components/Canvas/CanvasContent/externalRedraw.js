// externalRedraw.js
// Imperative redraw function for external triggers

import { redraw } from './redraw';

export function externalRedraw({
  canvasRef,
  position,
  scale,
  drawnRectangles,
  activeTool,
  hoveredShape,
  textInput,
  selectedShapes = [],
  drawingRectangle,
  drawingLine,
  drawingCircle,
  drawingTriangle,
  drawingImage,
  textBox,
}) {
  // Use the main redraw function to ensure consistency
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
  });
} 