import { useEffect } from 'react';

const useLayerListShortcuts = ({
  selectedShapes,
  setActiveCollectionShapeIds,
  setSelectedCollectionId,
  setCollections,
  selectedCollectionId,
  collections,
  setContextMenu,
  setRenamingId,
  setRenameValue,
  getShapeById,
  renamingId,
  renamingCollectionId,
  setRenamingCollectionId,
  setCollectionRenameValue,
}) => {
  // Add to collection (Ctrl+G)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'G' || e.key === 'g')) {
        if (selectedShapes && selectedShapes.length > 0) {
          setActiveCollectionShapeIds(prev => {
            const newIds = selectedShapes.filter(id => !prev.includes(id));
            return [...prev, ...newIds];
          });
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapes]);

  // Remove from collection (Ctrl+Shift+G)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
        if (selectedShapes && selectedShapes.length > 0) {
          setActiveCollectionShapeIds(prev => prev.filter(id => !selectedShapes.includes(id)));
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapes]);

  // Rename (Ctrl+R)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
        if (selectedShapes && selectedShapes.length === 1) {
          setRenamingId(selectedShapes[0]);
          setRenameValue(getShapeById(selectedShapes[0])?.name || '');
          e.preventDefault();
        } else if (selectedCollectionId) {
          const col = collections.find(c => c.id === selectedCollectionId);
          if (col) {
            setRenamingCollectionId(col.id);
            setCollectionRenameValue(col.name);
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapes, collections, renamingCollectionId, selectedCollectionId]);

  // Delete selected collection with Delete key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedCollectionId) {
        setCollections(prev => prev.filter(col => col.id !== selectedCollectionId));
        setSelectedCollectionId(null);
        setContextMenu(c => ({ ...c, visible: false }));
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCollectionId, setCollections]);
};

export default useLayerListShortcuts; 