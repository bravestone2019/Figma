// shapeStyling.js
// Shared styling utilities for shape renderers

export function applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool) {
  if (isLocked) {
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / scale;
  } else if (activeTool === "Move" && isHovered) {
    ctx.setLineDash([]);
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
    ctx.globalAlpha = 1;
  }
}

export function drawShapeBorder(ctx, shape, isHovered, isLocked, scale, activeTool) {
  if (isLocked) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / scale;
  } else if (activeTool === "Move" && isHovered) {
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
  } else {
    ctx.strokeStyle = shape.borderColor;
    ctx.lineWidth = shape.borderWidth / scale;
  }
}

export function drawLineStroke(ctx, shape, isHovered, isLocked, scale, activeTool) {
  if (isLocked) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / scale;
  } else if (activeTool === "Move" && isHovered) {
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
  } else {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width / scale;
  }
} 