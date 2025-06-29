// drawLine.js
// Handles line shape rendering with styling and state management

import { applyShapeStyling, drawLineStroke } from './shapeStyling.js';

export function drawLine(ctx, shape, options = {}) {
  const { 
    isHovered = false, 
    isLocked = false, 
    scale = 1,
    activeTool = null 
  } = options;

  ctx.save();
  
  // Apply shape styling based on state
  applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool);
  
  // Draw line
  ctx.globalAlpha = shape.opacity;
  ctx.beginPath();
  ctx.moveTo(shape.x1, shape.y1);
  ctx.lineTo(shape.x2, shape.y2);
  
  // Apply stroke styling
  drawLineStroke(ctx, shape, isHovered, isLocked, scale, activeTool);
  ctx.stroke();
  
  ctx.restore();
} 