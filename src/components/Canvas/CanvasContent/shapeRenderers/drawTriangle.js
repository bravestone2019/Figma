// drawTriangle.js
// Handles triangle shape rendering with styling and state management

import { applyShapeStyling, drawShapeBorder } from './shapeStyling.js';

export function drawTriangle(ctx, shape, options = {}) {
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
  ctx.globalAlpha = (shape.fillOpacity !== undefined ? shape.fillOpacity : 1) * (shape.opacity !== undefined ? shape.opacity : 1);
  ctx.beginPath();
  ctx.moveTo(shape.x1, shape.y1);
  ctx.lineTo(shape.x2, shape.y2);
  ctx.lineTo(shape.x3, shape.y3);
  ctx.closePath();
  ctx.fill();
  
  // Draw border
  shape.borderColor = shape.borderColor || "transparent";
  shape.borderWidth = shape.borderWidth || 1;
  ctx.globalAlpha = shape.borderOpacity !== undefined ? shape.borderOpacity : (shape.opacity !== undefined ? shape.opacity : 1);
  drawShapeBorder(ctx, shape, isHovered, isLocked, scale, activeTool);
  ctx.stroke();
  
  ctx.restore();
} 