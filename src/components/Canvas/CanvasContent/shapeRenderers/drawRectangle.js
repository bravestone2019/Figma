// drawRectangle.js
// Handles rectangle shape rendering with styling and state management

import { applyShapeStyling, drawShapeBorder } from './shapeStyling.js';

export function drawRectangle(ctx, shape, options = {}) {
  const { 
    isHovered = false, 
    isLocked = false, 
    scale = 1,
    activeTool = null 
  } = options;

  ctx.save();
  
  // Apply shape styling based on state
  applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool);
  
  // Draw fill
  ctx.fillStyle = shape.backgroundColor;
  ctx.globalAlpha = shape.opacity;
  ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  
  // Draw border
  drawShapeBorder(ctx, shape, isHovered, isLocked, scale, activeTool);
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  
  ctx.restore();
} 