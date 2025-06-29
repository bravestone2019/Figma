// redraw.js
// Redraws all shapes on the canvas when textInput or drawnRectangles changes

import { getBoundingRect } from './boundShape';
import { drawScaleHandles, drawCornerScaleHandles, drawLineHandles, drawCircleHandle, drawTriangleHandles } from './scaleHandles';
import { 
  drawRectangle, 
  drawLine, 
  drawCircle, 
  drawTriangle, 
  drawImage, 
  drawText 
} from './shapeRenderers';
import { drawPreviewShapes } from './previewRenderer';
import { drawSelectionBox } from './boxSelection';

export function redraw({
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
  selectionBox,
}) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Save the current canvas state
  ctx.save();
  
  // Clear and setup transform
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(position.x, position.y);
  ctx.scale(scale, scale);

  // Grid configuration
  const GRID_SIZE = 5; // Size of each grid cell in pixels
  const GRID_COLOR = "#e0e0e0"; // Light gray color for grid lines
  const MIN_SCALE_FOR_GRID = 2; // Minimum scale to show grid lines

  // Utility function to draw the grid
  function drawGrid(ctx, canvas, position, scale) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for grid
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;
    const width = canvas.width;
    const height = canvas.height;
    // Offset so grid moves with pan
    const offsetX = (position.x % (GRID_SIZE * scale));
    const offsetY = (position.y % (GRID_SIZE * scale));
    for (let x = offsetX; x < width; x += GRID_SIZE * scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = offsetY; y < height; y += GRID_SIZE * scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw grid lines (before drawing shapes) in screen (pixel) units
  if (scale >= MIN_SCALE_FOR_GRID) {
    drawGrid(ctx, canvas, position, scale);
  }

  // Draw all shapes using the new shape renderer modules
  drawnRectangles.forEach((shape, i) => {
    // Skip the current text input shape to prevent double drawing
    if (textInput && 
        shape.type === "text" && 
        shape.x === textInput.x && 
        shape.y === textInput.y) {
      return;
    }

    const renderOptions = {
      isHovered: activeTool === "Move" && i === hoveredShape,
      isLocked: shape.locked,
      scale,
      activeTool,
      canvas
    };

    // Use the appropriate shape renderer based on shape type
    switch (shape.type) {
      case "rectangle":
        drawRectangle(ctx, shape, renderOptions);
        break;
      case "line":
        drawLine(ctx, shape, renderOptions);
        break;
      case "circle":
        drawCircle(ctx, shape, renderOptions);
        break;
      case "triangle":
        drawTriangle(ctx, shape, renderOptions);
        break;
      case "image":
        drawImage(ctx, shape, renderOptions);
        break;
      case "text":
        drawText(ctx, shape, renderOptions);
        break;
      default:
        console.warn(`Unknown shape type: ${shape.type}`);
    }
  });

  // Draw bounding boxes for selected shapes (draw on top of all shapes)
  if (selectedShapes && selectedShapes.length > 0) {
    selectedShapes.forEach((i) => {
      const shape = drawnRectangles[i];
      if (!shape) return;
      if (shape.type === 'line') {
        drawLineHandles(ctx, shape, scale);
      } else if (shape.type === 'circle') {
        drawCircleHandle(ctx, shape, scale);
      } else if (shape.type === 'triangle') {
        drawTriangleHandles(ctx, shape, scale);
      } else {
        const bounds = getBoundingRect(shape);
        ctx.save();
        ctx.setLineDash([6, 3]);
        ctx.strokeStyle = '#2196f3';
        ctx.lineWidth = 2 / scale;
        ctx.globalAlpha = 1;
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.restore();
        drawCornerScaleHandles(ctx, bounds, scale);
      }
    });
  }

  // Draw aspect ratio preservation indicator if scaling handle is active with preserveAspectRatio
  if (window.scalingHandle && window.scalingHandle.preserveAspectRatio) {
    const shape = drawnRectangles[window.scalingHandle.shapeIdx];
    if (shape && (shape.type === 'rectangle' || shape.type === 'text' || shape.type === 'image')) {
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#2196f3';
      ctx.lineWidth = 2 / scale;
      ctx.globalAlpha = 0.8;
      
      // Draw diagonal line from top-left to bottom-right
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      ctx.stroke();
      
      // Draw diagonal line from top-right to bottom-left
      ctx.beginPath();
      ctx.moveTo(shape.x + shape.width, shape.y);
      ctx.lineTo(shape.x, shape.y + shape.height);
      ctx.stroke();
      
      ctx.restore();
    }
  }

  // Draw selection box using the dedicated module
  drawSelectionBox(ctx, selectionBox, scale);

  // Draw preview shapes on top of all committed shapes
  if (!textInput) {
    const previews = {
      drawingRectangle,
      drawingLine,
      drawingCircle,
      drawingTriangle,
      drawingImage,
      textBox
    };
    drawPreviewShapes(ctx, previews, scale);
  }

  // Restore the canvas state
  ctx.restore();
} 