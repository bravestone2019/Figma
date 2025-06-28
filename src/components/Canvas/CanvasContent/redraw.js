// redraw.js
// Redraws all shapes on the canvas when textInput or drawnRectangles changes

import { getBoundingRect } from './boundShape';
import { drawScaleHandles, drawCornerScaleHandles, drawLineHandles, drawCircleHandle, drawTriangleHandles } from './scaleHandles';

export function redraw({
  canvasRef,
  position,
  scale,
  drawnRectangles,
  activeTool,
  hoveredShape,
  textInput,
  selectedShapes = [],
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

  // Draw grid lines (before drawing shapes) in screen (pixel) units
  if (scale >= MIN_SCALE_FOR_GRID) {
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

  // Draw all shapes
  drawnRectangles.forEach((shape, i) => {
    // Skip the current text input shape to prevent double drawing
    if (textInput && 
        shape.type === "text" && 
        shape.x === textInput.x && 
        shape.y === textInput.y) {
      return;
    }

    ctx.save();
    if (shape.locked) {
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2 / scale;
    } else if (activeTool === "Move" && i === hoveredShape) {
      ctx.setLineDash([]);
      ctx.strokeStyle = "#2196f3";
      ctx.lineWidth = Math.max(2 / scale, 1);
      ctx.globalAlpha = 1;
    }

    if (shape.type === "rectangle") {
      ctx.fillStyle = shape.backgroundColor;
      ctx.globalAlpha = shape.opacity;
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      if (shape.locked) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
      } else {
        ctx.strokeStyle = shape.borderColor;
        ctx.lineWidth = shape.borderWidth / scale;
      }
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "line") {
      ctx.globalAlpha = shape.opacity;
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      if (shape.locked) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
      } else {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width / scale;
      }
      ctx.stroke();
    } else if (shape.type === "circle") {
      ctx.fillStyle = shape.backgroundColor;
      ctx.globalAlpha = shape.opacity;
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
      ctx.fill();
      if (shape.locked) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
      } else {
        ctx.strokeStyle = shape.borderColor;
        ctx.lineWidth = shape.borderWidth / scale;
      }
      ctx.stroke();
    } else if (shape.type === "triangle") {
      ctx.fillStyle = shape.backgroundColor;
      ctx.globalAlpha = shape.opacity;
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.lineTo(shape.x3, shape.y3);
      ctx.closePath();
      ctx.fill();
      if (shape.locked) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
      } else {
        ctx.strokeStyle = shape.borderColor;
        ctx.lineWidth = shape.borderWidth / scale;
      }
      ctx.stroke();
    } else if (shape.type === "text") {
      ctx.font = `${shape.fontSize || 16}px Arial`;
      ctx.fillStyle = shape.color;
      ctx.globalAlpha = shape.opacity;
      const lineHeight = (shape.fontSize || 16) * 1.2;
      drawWrappedText(ctx, shape.text, shape.x, shape.y + (shape.fontSize || 16), shape.width, lineHeight);
      // Draw bounding box for text if selected/locked
      const measuredHeight = measureWrappedTextHeight(ctx, shape.text, shape.width, lineHeight);
      if (shape.locked) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
        ctx.strokeRect(
          shape.x,
          shape.y,
          shape.width,
          measuredHeight
        );
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
        ctx.strokeRect(
          shape.x,
          shape.y,
          shape.width,
          measuredHeight
        );
      }
    }
    ctx.restore();
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

  // Restore the canvas state
  ctx.restore();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  let testLine = '';
  let testWidth = 0;
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    testLine = line + (line ? ' ' : '') + words[n];
    testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
  }
}

// Helper to measure the height of wrapped text (matches drawWrappedText logic)
function measureWrappedTextHeight(ctx, text, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  let testLine = '';
  let testWidth = 0;
  let lines = 0;
  for (let n = 0; n < words.length; n++) {
    testLine = line + (line ? ' ' : '') + words[n];
    testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines++;
      line = words[n];
    } else {
      line = testLine;
    }
  }
  if (line) lines++;
  return Math.max(lineHeight, lines * lineHeight);
} 