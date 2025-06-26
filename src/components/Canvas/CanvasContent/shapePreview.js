// shapePreview.js
// Draws the preview shape on the canvas (rectangle, line, circle, triangle, text box)

export function shapePreview({
  preview,
  canvasRef,
  scale
}) {
  if (!preview || !canvasRef || !canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Clear the canvas before drawing the preview
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, 0); // Assume position is handled elsewhere if needed
  ctx.scale(scale, scale);
  // Draw the preview shape on top
  if (preview.type === "rectangle") {
    const { startX, startY, currentX, currentY } = preview;
    const rectX = Math.min(startX, currentX);
    const rectY = Math.min(startY, currentY);
    const rectWidth = Math.abs(currentX - startX);
    const rectHeight = Math.abs(currentY - startY);
    ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 1 / scale;
    ctx.globalAlpha = 1;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  } else if (preview.type === "line") {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2 / scale;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(preview.startX, preview.startY);
    ctx.lineTo(preview.currentX, preview.currentY);
    ctx.stroke();
  } else if (preview.type === "circle") {
    const { startX, startY, currentX, currentY } = preview;
    const radius = Math.sqrt(
      Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
    );
    ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 1 / scale;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (preview.type === "triangle") {
    const { startX, startY, currentX, currentY } = preview;
    const dx = currentX - startX;
    const dy = currentY - startY;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    const x3 = startX + length * Math.cos(angle + Math.PI / 3);
    const y3 = startY + length * Math.sin(angle + Math.PI / 3);
    ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 1 / scale;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (preview.type === "text") {
    const { startX, startY, currentX, currentY } = preview;
    const rectX = Math.min(startX, currentX);
    const rectY = Math.min(startY, currentY);
    const rectWidth = Math.abs(currentX - startX);
    const rectHeight = Math.abs(currentY - startY);
    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 1 / scale;
    ctx.globalAlpha = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    ctx.setLineDash([]);
  }
  ctx.restore();
} 