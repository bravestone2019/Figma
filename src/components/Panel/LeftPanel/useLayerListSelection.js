import { useState } from 'react';

const useLayerListSelection = ({ setSelectedShapes }) => {
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  // Handles click, shift-click, ctrl-click for selecting shapes
  const handleLayerClick = (e, id, index, flatList, selectedShapes) => {
    if (e.shiftKey && selectedShapes && selectedShapes.length > 0 && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = flatList.slice(start, end + 1).map(s => s.id);
      setSelectedShapes(Array.from(new Set([...(selectedShapes || []), ...rangeIds])));
    } else if (e.ctrlKey || e.metaKey) {
      if (selectedShapes && selectedShapes.includes(id)) {
        setSelectedShapes(selectedShapes.filter(sid => sid !== id));
      } else {
        setSelectedShapes([...(selectedShapes || []), id]);
      }
      setLastSelectedIndex(index);
    } else {
      setSelectedShapes([id]);
      setLastSelectedIndex(index);
    }
  };

  return {
    lastSelectedIndex,
    setLastSelectedIndex,
    handleLayerClick,
  };
};

export default useLayerListSelection; 