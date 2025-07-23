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
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 2 / scale;
  } else if (activeTool === "Move" && isHovered) {
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
  } else {
    // Use correct stroke color and width for each shape type
    if (shape.type === "rectangle" || shape.type === "image") {
      ctx.strokeStyle = shape.borderColor || "transparent";
      ctx.lineWidth = (shape.borderWidth || 1) / scale;
    } else if (shape.type === "text") {
      ctx.strokeStyle = shape.strokeColor || "transparent";
      ctx.lineWidth = (shape.strokeWidth || 1) / scale;
    } else {
      ctx.strokeStyle = "transparent";
      ctx.lineWidth = 1;
    }
  }
}

export function drawLineStroke(ctx, shape, isHovered, isLocked, scale, activeTool) {
  if (isLocked) {
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 2 / scale;
  } else if (activeTool === "Move" && isHovered) {
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
  } else {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width / scale;
  }
} 