// previewRenderer.js
// Handles drawing preview shapes during shape creation

export function drawPreviewShapes(ctx, previews, scale) {
  const {
    drawingRectangle,
    drawingLine,
    drawingCircle,
    drawingTriangle,
    drawingImage,
    textBox
  } = previews;

  // Draw rectangle preview
  if (drawingRectangle) {
    drawRectanglePreview(ctx, drawingRectangle, scale);
  }

  // Draw line preview
  if (drawingLine) {
    drawLinePreview(ctx, drawingLine, scale);
  }

  // Draw circle preview
  if (drawingCircle) {
    drawCirclePreview(ctx, drawingCircle, scale);
  }

  // Draw triangle preview
  if (drawingTriangle) {
    drawTrianglePreview(ctx, drawingTriangle, scale);
  }

  // Draw image preview
  if (drawingImage) {
    drawImagePreview(ctx, drawingImage, scale);
  }

  // Draw text box preview
  if (textBox) {
    drawTextBoxPreview(ctx, textBox, scale);
  }
}

function drawRectanglePreview(ctx, drawingRectangle, scale) {
  const { startX, startY, currentX, currentY } = drawingRectangle;
  const rectX = Math.min(startX, currentX);
  const rectY = Math.min(startY, currentY);
  const rectWidth = Math.abs(currentX - startX);
  const rectHeight = Math.abs(currentY - startY);
  
  ctx.save();
  ctx.fillStyle = "#D9D9D9";
  ctx.strokeStyle = "transparent";
  ctx.lineWidth = 1 / scale;
  ctx.globalAlpha = 1;
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  ctx.restore();
}

function drawLinePreview(ctx, drawingLine, scale) {
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2 / scale;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(drawingLine.startX, drawingLine.startY);
  ctx.lineTo(drawingLine.currentX, drawingLine.currentY);
  ctx.stroke();
  ctx.restore();
}

function drawCirclePreview(ctx, drawingCircle, scale) {
  const { startX, startY, currentX, currentY } = drawingCircle;
  const radius = Math.sqrt(
    Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
  );
  
  ctx.save();
  ctx.fillStyle = "#D9D9D9";
  ctx.strokeStyle = "transparent";
  ctx.lineWidth = 1 / scale;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTrianglePreview(ctx, drawingTriangle, scale) {
  const { startX, startY, currentX, currentY } = drawingTriangle;
  const dx = currentX - startX;
  const dy = currentY - startY;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);
  const x3 = startX + length * Math.cos(angle + Math.PI / 3);
  const y3 = startY + length * Math.sin(angle + Math.PI / 3);
  
  ctx.save();
  ctx.fillStyle = "#D9D9D9";
  ctx.strokeStyle = "transparent";
  ctx.lineWidth = 1 / scale;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawImagePreview(ctx, drawingImage, scale) {
  const { startX, startY, currentX, currentY } = drawingImage;
  const rectX = Math.min(startX, currentX);
  const rectY = Math.min(startY, currentY);
  const rectWidth = Math.abs(currentX - startX);
  const rectHeight = Math.abs(currentY - startY);
  
  ctx.save();
  ctx.fillStyle = "#D9D9D9";
  ctx.strokeStyle = "#6496ff";
  ctx.lineWidth = 2 / scale;
  ctx.globalAlpha = 1;
  ctx.setLineDash([5, 5]);
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  ctx.setLineDash([]);
  
  // Draw image icon
  ctx.fillStyle = "#6496ff";
  ctx.font = `${Math.min(rectWidth, rectHeight) / 4}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📷", rectX + rectWidth / 2, rectY + rectHeight / 2);
  ctx.restore();
}

function drawTextBoxPreview(ctx, textBox, scale) {
  const { startX, startY, currentX, currentY } = textBox;
  const rectX = Math.min(startX, currentX);
  const rectY = Math.min(startY, currentY);
  const rectWidth = Math.abs(currentX - startX);
  const rectHeight = Math.abs(currentY - startY);
  
  ctx.save();
  ctx.strokeStyle = "#808080";
  ctx.lineWidth = 1 / scale;
  ctx.globalAlpha = 1;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  ctx.setLineDash([]);
  ctx.restore();
} 