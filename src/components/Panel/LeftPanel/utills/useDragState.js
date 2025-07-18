import { useState } from 'react';

const useDragState = () => {
  const [draggedShapeId, setDraggedShapeId] = useState(null);
  const [isCollectionDragOver, setIsCollectionDragOver] = useState(false);

  return {
    draggedShapeId,
    setDraggedShapeId,
    isCollectionDragOver,
    setIsCollectionDragOver,
  };
};

export default useDragState; 