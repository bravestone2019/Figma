import { useState } from 'react';

const useLayerListUIState = () => {
  const [openGroups, setOpenGroups] = useState([]);
  const [collectionOpen, setCollectionOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, shapeId: null, collectionId: null, type: null });
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  return {
    openGroups,
    setOpenGroups,
    collectionOpen,
    setCollectionOpen,
    contextMenu,
    setContextMenu,
    selectedCollectionId,
    setSelectedCollectionId,
  };
};

export default useLayerListUIState; 