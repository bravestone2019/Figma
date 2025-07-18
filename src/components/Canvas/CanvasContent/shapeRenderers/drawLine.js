// drawLine.js
// Handles line shape rendering with styling and state management

import { applyShapeStyling } from './shapeStyling.js';

export function drawLine(ctx, shape, options = {}) {
  const { 
    isHovered = false, 
    isLocked = false, 
    scale = 1,
    activeTool = null,
    x1, y1, x2, y2, rotation = 0
  } = options;

  // Calculate center
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const angle = (rotation * Math.PI) / 180;
  const rotatePoint = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
      y: cy + dx * Math.sin(angle) + dy * Math.cos(angle),
    };
  };
  const p1 = rotation ? rotatePoint(x1, y1) : { x: x1, y: y1 };
  const p2 = rotation ? rotatePoint(x2, y2) : { x: x2, y: y2 };

  ctx.save();
  // No need to rotate context, just use rotated points
  applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool);
  ctx.globalAlpha = shape.strokeOpacity !== undefined ? shape.strokeOpacity : (shape.opacity !== undefined ? shape.opacity : 1);
  ctx.strokeStyle = shape.color || "transparent";
  ctx.lineWidth = (shape.width || 1) / scale;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  // Removed drawLineStroke for solid lines only
  ctx.stroke();
  // Draw solid red stroke if locked (remove any dash effect)
  if (isLocked) {
    ctx.save();
    ctx.setLineDash([]); // Remove any dashed styling
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(2 / scale, 1);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}