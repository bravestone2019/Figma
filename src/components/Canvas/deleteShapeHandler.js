// deleteShapeHandler.js
// Handles deletion of selected shapes from the canvas using Delete or Backspace keys

/**
 * Handles keydown events to delete selected shapes from the canvas.
 * @param {KeyboardEvent} e
 * @param {Array} drawnRectangles
 * @param {Array} selectedShapes
 * @param {Function} setDrawnRectangles
 * @param {Function} setSelectedShapes
 */
export function handleDeleteShapeKey(e, drawnRectangles, selectedShapes, setDrawnRectangles, setSelectedShapes) {
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapes.length > 0) {
    e.preventDefault();
    const newShapes = drawnRectangles.filter((shape) => !selectedShapes.includes(shape.id));
    setDrawnRectangles(newShapes);
    setSelectedShapes([]);
  }
} 