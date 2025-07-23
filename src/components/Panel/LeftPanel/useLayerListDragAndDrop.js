import { useState } from 'react';

const useLayerListDragAndDrop = ({ setCollections, setSelectedShapes, removeShapeFromAllCollections }) => {
  const [draggedShapeId, setDraggedShapeId] = useState(null);
  const [dragOverCollectionId, setDragOverCollectionId] = useState(null);
  const [dragOverMainList, setDragOverMainList] = useState(false);

  // Drag handlers for main list items
  const handleShapeDragStart = (shapeId) => {
    setDraggedShapeId(shapeId);
  };
  const handleShapeDragEnd = () => {
    setDraggedShapeId(null);
    setDragOverCollectionId(null);
    setDragOverMainList(false);
  };

  // Drop on collection
  const handleCollectionDragOver = (e, colId) => {
    e.preventDefault();
    setDragOverCollectionId(colId);
  };
  const handleCollectionDrop = (e, colId) => {
    e.preventDefault();
    if (!draggedShapeId) return;
    setCollections(prev => prev.map(col =>
      col.id === colId && !col.shapeIds.includes(draggedShapeId)
        ? { ...col, shapeIds: [...col.shapeIds, draggedShapeId] }
        : { ...col, shapeIds: col.shapeIds.filter(id => id !== draggedShapeId) }
    ));
    setDraggedShapeId(null);
    setDragOverCollectionId(null);
  };

  // Drop on main list
  const handleMainListDragOver = (e) => {
    e.preventDefault();
    setDragOverMainList(true);
  };
  const handleMainListDrop = (e) => {
    e.preventDefault();
    if (!draggedShapeId) return;
    setCollections(prev => removeShapeFromAllCollections(prev, draggedShapeId));
    setDraggedShapeId(null);
    setDragOverMainList(false);
  };

  return {
    draggedShapeId,
    dragOverCollectionId,
    dragOverMainList,
    handleShapeDragStart,
    handleShapeDragEnd,
    handleCollectionDragOver,
    handleCollectionDrop,
    handleMainListDragOver,
    handleMainListDrop,
    setDraggedShapeId,
    setDragOverCollectionId,
    setDragOverMainList,
  };
};

export default useLayerListDragAndDrop; 