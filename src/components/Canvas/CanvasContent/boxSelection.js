// boxSelection.js
// Handles box selection (marquee selection) functionality

/**
 * Creates a new selection box
 * @param {number} mouseX - Mouse X coordinate in canvas space
 * @param {number} mouseY - Mouse Y coordinate in canvas space
 * @returns {Object} Selection box object with start and current coordinates
 */
export function createSelectionBox(mouseX, mouseY) {
  return {
    startX: mouseX,
    startY: mouseY,
    currentX: mouseX,
    currentY: mouseY,
  };
}

/**
 * Updates the current position of a selection box
 * @param {Object} selectionBox - Current selection box
 * @param {number} mouseX - New mouse X coordinate
 * @param {number} mouseY - New mouse Y coordinate
 * @returns {Object} Updated selection box
 */
export function updateSelectionBox(selectionBox, mouseX, mouseY) {
  return {
    ...selectionBox,
    currentX: mouseX,
    currentY: mouseY,
  };
}

/**
 * Checks if a shape is completely contained within the selection box
 * @param {Object} shape - Shape to check
 * @param {Object} selectionBox - Selection box bounds
 * @returns {boolean} True if shape is contained within selection box
 */
export function isShapeInSelectionBox(shape, selectionBox) {
  const { startX, startY, currentX, currentY } = selectionBox;
  const x1 = Math.min(startX, currentX);
  const y1 = Math.min(startY, currentY);
  const x2 = Math.max(startX, currentX);
  const y2 = Math.max(startY, currentY);

  switch (shape.type) {
    case "rectangle":
    case "image":
      return (
        shape.x >= x1 && shape.y >= y1 &&
        shape.x + shape.width <= x2 && shape.y + shape.height <= y2
      );

    case "circle":
      return (
        shape.x - shape.radius >= x1 && shape.y - shape.radius >= y1 &&
        shape.x + shape.radius <= x2 && shape.y + shape.radius <= y2
      );

    case "line":
      return (
        shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
        shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2
      );

    case "triangle":
      return (
        shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
        shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2 &&
        shape.x3 >= x1 && shape.x3 <= x2 && shape.y3 >= y1 && shape.y3 <= y2
      );

    case "text":
      return (
        shape.x >= x1 && shape.y >= y1 &&
        shape.x + (shape.width || 50) <= x2 && shape.y + (shape.height || 20) <= y2
      );

    default:
      return false;
  }
}

/**
 * Gets all shapes that are contained within the selection box
 * @param {Array} drawnRectangles - Array of all shapes
 * @param {Object} selectionBox - Selection box bounds
 * @returns {Array} Array of shape indices that are selected
 */
export function getShapesInSelectionBox(drawnRectangles, selectionBox) {
  return drawnRectangles
    .map((shape, i) => ({
      shape,
      index: i,
      isSelected: isShapeInSelectionBox(shape, selectionBox)
    }))
    .filter(item => item.isSelected && !item.shape.locked)
    .map(item => item.index);
}

/**
 * Renders the selection box on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} selectionBox - Selection box to render
 * @param {number} scale - Current canvas scale
 */
export function drawSelectionBox(ctx, selectionBox, scale) {
  if (!selectionBox) return;

  const { startX, startY, currentX, currentY } = selectionBox;
  const rectX = Math.min(startX, currentX);
  const rectY = Math.min(startY, currentY);
  const rectWidth = Math.abs(currentX - startX);
  const rectHeight = Math.abs(currentY - startY);
  
  ctx.save();
  ctx.fillStyle = "rgba(33, 150, 243, 0.1)";
  ctx.strokeStyle = "#2196f3";
  ctx.lineWidth = 1 / scale;
  ctx.setLineDash([5, 5]);
  ctx.globalAlpha = 1;
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  ctx.setLineDash([]);
  ctx.restore();
}

/**
 * Checks if the selection box should be activated based on mouse event
 * @param {string} activeTool - Currently active tool
 * @param {number} button - Mouse button pressed
 * @returns {boolean} True if selection box should be activated
 */
export function shouldActivateSelectionBox(activeTool, button) {
  return activeTool === "Move" && button === 2; // Right mouse button
}

/**
 * Gets the bounds of the selection box
 * @param {Object} selectionBox - Selection box object
 * @returns {Object} Bounds object with x1, y1, x2, y2 coordinates
 */
export function getSelectionBoxBounds(selectionBox) {
  const { startX, startY, currentX, currentY } = selectionBox;
  return {
    x1: Math.min(startX, currentX),
    y1: Math.min(startY, currentY),
    x2: Math.max(startX, currentX),
    y2: Math.max(startY, currentY),
  };
} 