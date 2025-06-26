// CanvasContent.jsx
// This file contains the drawCanvasContent function extracted from CanvasDrawing.jsx

function drawCanvasContent({
  canvasRef,
  position,
  scale,
  drawnRectangles,
  drawingRectangle,
  drawingLine,
  drawingCircle,
  drawingTriangle,
  textBox,
  hoveredShape,
  activeTool,
  selectionBox,
  selectedShapes,
  textInput,
}) {
  // Grid configuration
  const GRID_SIZE = 5;
  const GRID_COLOR = "#e0e0e0";
  const MIN_SCALE_FOR_GRID = 2;

  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // Only clear if not in text input mode
  if (!textInput) {
    ctx.clearRect(0, 0, width, height);
  }
  
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.scale(scale, scale);

  // Draw grid only if not in text input mode
  if (!textInput && scale >= MIN_SCALE_FOR_GRID) {
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5 / scale;
    const offsetX = position.x % (GRID_SIZE * scale);
    const offsetY = position.y % (GRID_SIZE * scale);
    for (let x = offsetX; x < width; x += GRID_SIZE * scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = offsetY; y < height; y += GRID_SIZE * scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Draw existing shapes
  drawnRectangles.forEach((shape, i) => {
    ctx.save();
    if (shape.locked) {
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2 / scale;
    } else if (activeTool === "Move" && i === hoveredShape) {
      ctx.setLineDash([]);
      ctx.strokeStyle = "#2196f3";
      ctx.lineWidth = Math.max(2 / scale, 1);
      ctx.globalAlpha = 1;
    }
    
    // Ensure proper rendering during text input
    const isActiveTextInput = textInput && shape.type === "text" && 
      shape.x === textInput.x && shape.y === textInput.y;
    
    if (!isActiveTextInput) {
      if (shape.type === "rectangle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.globalAlpha = shape.opacity;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
        } else if (activeTool === "Move" && i === hoveredShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
        } else {
          ctx.strokeStyle = shape.borderColor;
          ctx.lineWidth = shape.borderWidth / scale;
        }
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "line") {
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
        } else if (activeTool === "Move" && i === hoveredShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
        } else {
          ctx.strokeStyle = shape.color;
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
          ctx.strokeStyle = "red";
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
          ctx.strokeStyle = "red";
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
          ctx.strokeStyle = "red";
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
    }
    ctx.restore();
  });

  // Only draw dynamic previews if not in text input mode
  if (!textInput) {
    // Draw the rectangle being currently drawn (dynamic preview)
    if (drawingRectangle) {
      const startX = drawingRectangle.startX;
      const startY = drawingRectangle.startY;
      const currentX = drawingRectangle.currentX;
      const currentY = drawingRectangle.currentY;
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
    }
    // Draw the line being currently drawn (dynamic preview)
    if (drawingLine) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2 / scale;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(drawingLine.startX, drawingLine.startY);
      ctx.lineTo(drawingLine.currentX, drawingLine.currentY);
      ctx.stroke();
    }
    // Draw the circle being currently drawn (dynamic preview)
    if (drawingCircle) {
      const startX = drawingCircle.startX;
      const startY = drawingCircle.startY;
      const currentX = drawingCircle.currentX;
      const currentY = drawingCircle.currentY;
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
    }
    // Draw the triangle being currently drawn (dynamic preview)
    if (drawingTriangle) {
      const startX = drawingTriangle.startX;
      const startY = drawingTriangle.startY;
      const currentX = drawingTriangle.currentX;
      const currentY = drawingTriangle.currentY;
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
    }
    // Draw the text box being currently drawn
    if (textBox) {
      const startX = textBox.startX;
      const startY = textBox.startY;
      const currentX = textBox.currentX;
      const currentY = textBox.currentY;
      const rectX = Math.min(startX, currentX);
      const rectY = Math.min(startY, currentY);
      const rectWidth = Math.abs(currentX - startX);
      const rectHeight = Math.abs(currentY - startY);
      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 1 / scale;
      ctx.globalAlpha = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    }
  }
  
  ctx.restore();
}

export default drawCanvasContent; 