// externalRedraw.js
// Imperative redraw function for external triggers

export function externalRedraw({
  canvasRef,
  position,
  scale,
  drawnRectangles,
  activeTool,
  hoveredShape,
}) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawnRectangles.forEach((shape, i) => {
    ctx.save();
    if (shape.locked) {
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = "transparent";
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
        ctx.strokeStyle = "transparent";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
      } else {
        ctx.strokeStyle = "transparent";
        ctx.lineWidth = shape.width / scale;
      }
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "line") {
      ctx.globalAlpha = shape.opacity;
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      if (shape.locked) {
        ctx.strokeStyle = "transparent";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
      } else {
        ctx.strokeStyle =  "transparent";
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
        ctx.strokeStyle = "transparent";
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
        ctx.strokeStyle = "transparent";
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
      ctx.fillText(shape.text, shape.x, shape.y + (shape.fontSize || 16));
      const measuredWidth = ctx.measureText(shape.text).width;
      const measuredHeight = (shape.fontSize || 16) * 1.2;
      if (shape.locked) {
        ctx.strokeStyle = "transparent";
        ctx.lineWidth = 2 / scale;
        ctx.strokeRect(
          shape.x,
          shape.y,
          measuredWidth,
          measuredHeight
        );
      } else if (activeTool === "Move" && i === hoveredShape) {
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
        ctx.strokeRect(
          shape.x,
          shape.y,
          measuredWidth,
          measuredHeight
        );
      }
    }
    ctx.restore();
  });
  ctx.restore();
} 