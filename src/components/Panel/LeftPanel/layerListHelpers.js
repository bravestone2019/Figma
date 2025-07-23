// Utility functions for LayerList

// Get shape by id
export const getShapeById = (drawnRectangles, id) => drawnRectangles.find(s => s.id === id);

// Flatten shapes (including groups)
export const flattenShapes = (shapes, getShapeById) => {
  let flat = [];
  for (const s of shapes) {
    if (!s) continue;
    flat.push(s);
    if (s.type === 'group' && s.children) {
      const children = s.children.map(id => getShapeById(id)).filter(Boolean);
      flat = flat.concat(flattenShapes(children, getShapeById));
    }
  }
  return flat;
};

// Remove a shape from all collections
export const removeShapeFromAllCollections = (collections, shapeId) =>
  Array.isArray(collections)
    ? collections.map(col => ({ ...col, shapeIds: col.shapeIds.filter(id => id !== shapeId) }))
    : [];

// Set active collection shape IDs
export const setActiveCollectionShapeIds = (collections, setCollections, updater) => {
  if (!collections || collections.length === 0) return;
  setCollections(prev => {
    const updated = [...prev];
    updated[0] = { ...updated[0], shapeIds: typeof updater === 'function' ? updater(updated[0].shapeIds) : updater };
    return updated;
  });
}; 