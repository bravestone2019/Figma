import { useState, useRef, useEffect } from 'react';

const useLayerListRenaming = ({ setDrawnRectangles, setCollections, drawnRectangles, collections, setActiveTool }) => {
  // Shape renaming
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  // Collection renaming
  const [renamingCollectionId, setRenamingCollectionId] = useState(null);
  const [collectionRenameValue, setCollectionRenameValue] = useState("");
  const collectionRenameInputRef = useRef(null);

  // Focus input when entering rename mode
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  useEffect(() => {
    if (renamingCollectionId && collectionRenameInputRef.current) {
      collectionRenameInputRef.current.focus();
      collectionRenameInputRef.current.select();
    }
  }, [renamingCollectionId]);

  // Handlers
  const handleRenameSubmit = (e) => {
    if (e) e.preventDefault();
    if (renameValue.trim() && renamingId) {
      setDrawnRectangles((prev) =>
        prev.map((shape) =>
          shape.id === renamingId
            ? { ...shape, name: renameValue.trim() }
            : shape
        )
      );
    }
    setRenamingId(null);
    if (setActiveTool) setActiveTool("Move");
  };

  const handleCollectionRenameSubmit = (colId) => {
    if (collectionRenameValue.trim()) {
      setCollections(prev => prev.map(col =>
        col.id === colId ? { ...col, name: collectionRenameValue.trim() } : col
      ));
    }
    setRenamingCollectionId(null);
    setCollectionRenameValue("");
  };

  const handleCollectionRenameInputKeyDown = (e, colId) => {
    if (e.key === 'Enter') {
      handleCollectionRenameSubmit(colId);
    } else if (e.key === 'Escape') {
      setRenamingCollectionId(null);
      setCollectionRenameValue("");
    }
  };

  return {
    renamingId,
    setRenamingId,
    renameValue,
    setRenameValue,
    renameInputRef,
    renamingCollectionId,
    setRenamingCollectionId,
    collectionRenameValue,
    setCollectionRenameValue,
    collectionRenameInputRef,
    handleRenameSubmit,
    handleCollectionRenameSubmit,
    handleCollectionRenameInputKeyDown,
  };
};

export default useLayerListRenaming; 