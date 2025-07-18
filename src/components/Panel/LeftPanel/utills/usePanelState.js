import { useState } from 'react';

const usePanelState = () => {
  const [openGroups, setOpenGroups] = useState([]);
  const [collectionOpen, setCollectionOpen] = useState(true);

  return {
    openGroups,
    setOpenGroups,
    collectionOpen,
    setCollectionOpen,
  };
};

export default usePanelState; 