// drawRectangle.js
// Handles rectangle shape rendering with styling and state management

import { applyShapeStyling, drawShapeBorder } from './shapeStyling.js';

function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  // Clamp radius to half the smallest dimension
  radius = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export function drawRectangle(ctx, shape, options = {}) {
  const { 
    isHovered = false, 
    isLocked = false, 
    scale = 1,
    activeTool = null,
    x, y, width, height, rotation = 0
  } = options;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  
  // Apply shape styling based on state
  applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool);
  
  // Draw fill with rounded corners
  ctx.fillStyle = shape.backgroundColor;
  ctx.globalAlpha = shape.opacity;
  drawRoundedRectPath(ctx, shape.x, shape.y, shape.width, shape.height, shape.borderRadius || 0);
  ctx.fill();
  
  // Draw border
  drawShapeBorder(ctx, shape, isHovered, isLocked, scale, activeTool);
  ctx.stroke();
  
  ctx.restore();
} 