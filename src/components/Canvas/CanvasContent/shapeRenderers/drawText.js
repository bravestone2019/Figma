// drawText.js
// Handles text shape rendering with wrapping, measurement, and state management

import { applyShapeStyling } from './shapeStyling.js';

// Function to convert font weight names to CSS font-weight values
function getFontWeightValue(weightName) {
  const weightMap = {
    "Thin": 100,
    "ExtraLight": 200,
    "Light": 300,
    "Regular": 400,
    "Medium": 500,
    "SemiBold": 600,
    "Bold": 700,
    "Thin Italic": 100,
    "ExtraLight Italic": 200,
    "Light Italic": 300,
    "Italic": 400,
    "Medium Italic": 500,
    "SemiBold Italic": 600,
    "Bold Italic": 700,
  };
  return weightMap[weightName] || 400;
}

// Function to check if font weight includes italic
function isItalic(weightName) {
  return weightName && weightName.includes("Italic");
}

export function drawText(ctx, shape, options = {}) {
  const { 
    isHovered = false, 
    isLocked = false, 
    scale = 1,
    activeTool = null,
    x, y, width, height, rotation = 0
  } = options;

  const centerX = x + (width || 50) / 2;
  const centerY = y + (height || 20) / 2;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  
  // Set up text styling
  const fontWeight = getFontWeightValue(shape.fontWeight);
  const fontStyle = isItalic(shape.fontWeight) ? "italic" : "normal";
  ctx.font = `${fontStyle} ${fontWeight} ${shape.fontSize || 16}px ${shape.fontFamily || "Arial"}`;
  ctx.fillStyle = shape.color;
  ctx.globalAlpha = shape.opacity;
  ctx.textAlign = shape.textAlign || "left";
  
  // Draw wrapped text (fill)
  const lineHeight = (shape.fontSize || 16) * 1.2;
  const lines = getWrappedLines(ctx, shape.text, shape.width);
  let currentY = shape.y + (shape.fontSize || 16);
  
  // Calculate text position based on alignment
  const getTextX = (line) => {
    if (shape.textAlign === "center") {
      return shape.x + shape.width / 2;
    } else if (shape.textAlign === "right") {
      return shape.x + shape.width;
    } else {
      return shape.x; // left alignment
    }
  };
  
  lines.forEach(line => {
    const textX = getTextX(line);
    ctx.fillText(line, textX, currentY);
    currentY += lineHeight;
  });

  // Draw wrapped text (stroke)
  if (shape.strokeColor) {
    ctx.save();
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = shape.strokeWidth && shape.strokeWidth > 0 ? shape.strokeWidth : 1;
    ctx.globalAlpha = shape.opacity;
    ctx.font = `${fontStyle} ${fontWeight} ${shape.fontSize || 16}px ${shape.fontFamily || "Arial"}`;
    ctx.textAlign = shape.textAlign || "left";
    currentY = shape.y + (shape.fontSize || 16);
    lines.forEach(line => {
      const textX = getTextX(line);
      ctx.strokeText(line, textX, currentY);
      currentY += lineHeight;
    });
    ctx.restore();
  }

  // Draw bounding box for text if selected/locked
  const measuredHeight = measureWrappedTextHeight(ctx, shape.text, shape.width, lineHeight);
  drawTextBorder(ctx, shape, measuredHeight, isHovered, isLocked, scale, activeTool);
  
  ctx.restore();
}

function drawTextBorder(ctx, shape, measuredHeight, isHovered, isLocked, scale, activeTool) {
  // Use shared styling for line dash, line width, and globalAlpha
  applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool);
  // Colors remain unchanged
  if (isLocked) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / scale;
    ctx.strokeRect(
      shape.x,
      shape.y,
      shape.width,
      measuredHeight
    );
  } else if (activeTool === "Move" && isHovered) {
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
    ctx.strokeRect(
      shape.x,
      shape.y,
      shape.width,
      measuredHeight
    );
  }
}

function getWrappedLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  let lines = [];
  let line = '';
  let testLine = '';
  let testWidth = 0;
  for (let n = 0; n < words.length; n++) {
    testLine = line + (line ? ' ' : '') + words[n];
    testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Helper to measure the height of wrapped text (matches drawWrappedText logic)
function measureWrappedTextHeight(ctx, text, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  let testLine = '';
  let testWidth = 0;
  let lines = 0;
  for (let n = 0; n < words.length; n++) {
    testLine = line + (line ? ' ' : '') + words[n];
    testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines++;
      line = words[n];
    } else {
      line = testLine;
    }
  }
  if (line) lines++;
  return Math.max(lineHeight, lines * lineHeight);
} 