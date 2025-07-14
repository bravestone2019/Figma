// drawCircle.js
// Handles circle shape rendering with styling and state management

import { applyShapeStyling, drawShapeBorder } from './shapeStyling.js';

export function drawCircle(ctx, shape, options = {}) {
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
  ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw border
  ctx.globalAlpha = shape.borderOpacity !== undefined ? shape.borderOpacity : (shape.opacity !== undefined ? shape.opacity : 1);
  ctx.strokeStyle = shape.borderColor || "transparent";
  ctx.lineWidth = (shape.borderWidth || 1) / scale;
  drawShapeBorder(ctx, shape, isHovered, isLocked, scale, activeTool);
  ctx.stroke();
  
  ctx.restore();
} 