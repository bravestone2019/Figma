import { useEffect } from 'react';

const isEditing = (event) => {
  const el = document.activeElement;
  const target = event && event.target;
  const check = (elem) =>
    elem && (
      elem.tagName === 'INPUT' ||
      elem.tagName === 'TEXTAREA' ||
      elem.isContentEditable
    );
  return check(el) || check(target);
};

const useShapeShortcuts = ({
  selectedShapes,
  drawnRectangles,
  setRenamingId,
  setRenameValue,
  setActiveTool,
  renamingId,
  setCollection,
  handleUngroup,
  renamingPageId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when editing/renaming
      if (isEditing(e)) {
        return;
      }
      // Rename: Shift+R
      if (e.shiftKey && (e.key === 'R' || e.key === 'r') && !renamingPageId) {
        if (selectedShapes && selectedShapes.length === 1) {
          const shapeId = selectedShapes[0];
          const shape = drawnRectangles.find((s) => s.id === shapeId);
          if (shape) {
            setRenamingId(shapeId);
            setRenameValue(shape.name || '');
            e.preventDefault();
          }
        }
      }
      // Escape to cancel rename
      if (renamingId && e.key === 'Escape') {
        setRenamingId(null);
        if (setActiveTool) setActiveTool('Move');
      }
      // Group: Ctrl+G
      if (e.ctrlKey && (e.key === 'G' || e.key === 'g')) {
        if (selectedShapes && selectedShapes.length > 0) {
          setCollection(prev => {
            const newIds = selectedShapes.filter(id => !prev.includes(id));
            return [...prev, ...newIds];
          });
        }
        e.preventDefault();
      }
      // Ungroup: Ctrl+Shift+G
      if (e.ctrlKey && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
        if (selectedShapes && selectedShapes.length > 0) {
          let didUngroup = false;
          selectedShapes.forEach(id => {
            const shape = drawnRectangles.find(s => s.id === id);
            if (shape && shape.type === 'group') {
              handleUngroup(shape.id);
              didUngroup = true;
            }
          });
          if (!didUngroup) {
            setCollection(prev => prev.filter(id => !selectedShapes.includes(id)));
          }
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapes, drawnRectangles, renamingId, setActiveTool, setCollection, setRenamingId, setRenameValue, handleUngroup, renamingPageId]);
};

export default useShapeShortcuts; 