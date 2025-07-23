// Utility to extract and sort front/back shapes from collections and drawnRectangles
// Returns an array of shapes with .side = 'front' or 'back'
export function extractFrontBackShapes(collections, drawnRectangles) {
  if (!collections || !drawnRectangles) return [];
  // Find front/back collections
  const frontBackCollections = collections.filter(
    col => col.name === 'front' || col.name === 'back'
  );
  // Gather all shape IDs in order, and annotate with side
  let shapes = [];
  frontBackCollections.forEach(col => {
    const side = col.name; // 'front' or 'back'
    col.shapeIds.forEach(id => {
      const shape = drawnRectangles.find(s => s.id === id);
      if (shape) {
        shapes.push({ ...shape, side });
      }
    });
  });
  // Sort by zorder (ascending, lower zorder drawn first)
  shapes = shapes.sort((a, b) => (a.zorder ?? 0) - (b.zorder ?? 0));
  return shapes;
} 