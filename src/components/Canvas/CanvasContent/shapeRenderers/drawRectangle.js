// drawRectangle.js
// Handles rectangle shape rendering with styling and state management

import { applyShapeStyling, drawShapeBorder } from './shapeStyling.js';

function drawRoundedRectPath(ctx, x, y, width, height, tl, tr, br, bl) {
  // Clamp each radius to half the smallest dimension
  const maxR = Math.min(width, height) / 2;
  tl = Math.max(0, Math.min(tl, maxR));
  tr = Math.max(0, Math.min(tr, maxR));
  br = Math.max(0, Math.min(br, maxR));
  bl = Math.max(0, Math.min(bl, maxR));
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
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

  // --- INSIDE/OUTSIDE/CENTER STROKE LOGIC ---
  const inside = shape.strokePosition === 'inside';
  const outside = shape.strokePosition === 'outside';
  const center = shape.strokePosition === 'center';
  const topWidth = shape.borderTopWidth ?? 0;
  const rightWidth = shape.borderRightWidth ?? 0;
  const bottomWidth = shape.borderBottomWidth ?? 0;
  const leftWidth = shape.borderLeftWidth ?? 0;
  const allWidthsEqual = topWidth === rightWidth && rightWidth === bottomWidth && bottomWidth === leftWidth;
  const topColor = shape.borderTopColor ?? shape.borderColor ?? "transparent";
  const rightColor = shape.borderRightColor ?? shape.borderColor ?? "transparent";
  const bottomColor = shape.borderBottomColor ?? shape.borderColor ?? "transparent";
  const leftColor = shape.borderLeftColor ?? shape.borderColor ?? "transparent";
  const allColorsEqual = topColor === rightColor && rightColor === bottomColor && bottomColor === leftColor;
  const borderWidth = topWidth; // all equal
  const borderColor = topColor; // all equal
  // Calculate offsets for different stroke positions
  const leftOffset = inside ? leftWidth : (outside ? -leftWidth : (center ? leftWidth / 2 : 0));
  const topOffset = inside ? topWidth : (outside ? -topWidth : (center ? topWidth / 2 : 0));
  const rightOffset = inside ? rightWidth : (outside ? -rightWidth : (center ? rightWidth / 2 : 0));
  const bottomOffset = inside ? bottomWidth : (outside ? -bottomWidth : (center ? bottomWidth / 2 : 0));
  let fillX = shape.x + leftOffset;
  let fillY = shape.y + topOffset;
  let fillW = shape.width - leftOffset - rightOffset;
  let fillH = shape.height - topOffset - bottomOffset;

  // Draw fill with rounded corners
  ctx.fillStyle = shape.backgroundColor;
  ctx.globalAlpha = (shape.fillOpacity !== undefined ? shape.fillOpacity : 1) * (shape.opacity !== undefined ? shape.opacity : 1);
  const tl = shape.borderRadiusTopLeft ?? shape.borderRadius ?? 0;
  const tr = shape.borderRadiusTopRight ?? shape.borderRadius ?? 0;
  const br = shape.borderRadiusBottomRight ?? shape.borderRadius ?? 0;
  const bl = shape.borderRadiusBottomLeft ?? shape.borderRadius ?? 0;
  drawRoundedRectPath(ctx, fillX, fillY, fillW, fillH, tl, tr, br, bl);
  ctx.fill();

  // Draw stroke
  const borderAlpha = shape.borderOpacity !== undefined ? shape.borderOpacity : 1;
  if (shape.type === "rectangle" && allWidthsEqual && allColorsEqual && borderWidth > 0 && borderColor !== 'transparent') {
    ctx.save();
    ctx.globalAlpha = borderAlpha;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    // Offset for inside/center/outside
    let strokeX = shape.x;
    let strokeY = shape.y;
    let strokeW = shape.width;
    let strokeH = shape.height;
    if (inside) {
      strokeX += borderWidth / 2;
      strokeY += borderWidth / 2;
      strokeW -= borderWidth;
      strokeH -= borderWidth;
    } else if (outside) {
      strokeX -= borderWidth / 2;
      strokeY -= borderWidth / 2;
      strokeW += borderWidth;
      strokeH += borderWidth;
    } else if (center) {
      strokeX += 0;
      strokeY += 0;
      // no change
    }
    drawRoundedRectPath(ctx, strokeX, strokeY, strokeW, strokeH, tl, tr, br, bl);
    ctx.stroke();
    ctx.restore();
  } else if (shape.type === "rectangle") {
    // Per-side fallback: always draw centered on the edge (ignore strokePosition)
    // Top
    if (topWidth > 0 && topColor !== 'transparent') {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = topColor;
      ctx.fillRect(shape.x, shape.y - topWidth / 2, shape.width, topWidth);
      ctx.restore();
    }
    // Right
    if (rightWidth > 0 && rightColor !== 'transparent') {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = rightColor;
      ctx.fillRect(shape.x + shape.width - rightWidth / 2, shape.y, rightWidth, shape.height);
      ctx.restore();
    }
    // Bottom
    if (bottomWidth > 0 && bottomColor !== 'transparent') {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = bottomColor;
      ctx.fillRect(shape.x, shape.y + shape.height - bottomWidth / 2, shape.width, bottomWidth);
      ctx.restore();
    }
    // Left
    if (leftWidth > 0 && leftColor !== 'transparent') {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = leftColor;
      ctx.fillRect(shape.x - leftWidth / 2, shape.y, leftWidth, shape.height);
      ctx.restore();
    }
  } else {
    // Fallback to old logic for other types
    drawShapeBorder(ctx, shape, isHovered, isLocked, scale, activeTool);
    ctx.stroke();
  }
  
  ctx.restore();
} 