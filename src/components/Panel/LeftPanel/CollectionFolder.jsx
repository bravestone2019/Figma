import React, { useState } from 'react';
import LayerListItem from './LayerListItem.jsx';

const CollectionFolder = ({
  col,
  colLayers,
  collectionOpen,
  selectedCollectionId,
  selectedShapes,
  renamingCollectionId,
  collectionRenameValue,
  collectionRenameInputRef,
  setRenamingCollectionId,
  setCollectionRenameValue,
  handleCollectionRenameSubmit,
  handleCollectionRenameInputKeyDown,
  handleCollectionHeaderClick,
  handleCollectionContextMenu,
  handleLayerContextMenu,
  handleShapeDragStart,
  handleShapeDragEnd,
  draggedShapeId,
  renamingId,
  renameValue,
  renameInputRef,
  setRenameValue,
  setRenamingId,
  handleRenameSubmit,
  setSelectedShapes,
  setSelectedCollectionId,
  collectionOpenState,
  handleCollectionDragOver,
  handleCollectionDrop,
  setCollections, // <-- add this prop
}) => {
  // Local state for drag-over index
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Handler for drag over a list item
  const handleItemDragOver = (e, index) => {
    setDragOverIndex(index);
  };
  // Handler for drag enter a list item
  const handleItemDragEnter = (e, index) => {
    setDragOverIndex(index);
  };
  // Handler for drop on a list item (reorder)
  const handleItemDrop = (e, dropIndex) => {
    if (draggedShapeId == null || dropIndex == null) return;
    // Only allow reorder if the dragged shape is already in this collection
    const fromIndex = col.shapeIds.findIndex(id => id === draggedShapeId);
    if (fromIndex === -1 || fromIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    setCollections(prev => {
      if (!Array.isArray(prev)) {
        // Defensive: if prev is not an array, return it as an array
        console.error('setCollections: prev is not an array!', prev);
        return [prev];
      }
      const updated = prev.map(collection => {
        if (collection.id !== col.id) return collection;
        const newShapeIds = [...collection.shapeIds];
        newShapeIds.splice(fromIndex, 1);
        newShapeIds.splice(dropIndex, 0, draggedShapeId);
        return { ...collection, shapeIds: newShapeIds };
      });
      // Log the updated collections array
      setTimeout(() => {
        console.log('collections after reorder:', JSON.stringify(updated));
      }, 200);
      return updated;
    });
    // Log all drawnRectangles IDs (after a tick to let state update)
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.__DRAWN_RECTANGLES__) {
        console.log('All drawnRectangles IDs:', window.__DRAWN_RECTANGLES__.map(s => s.id));
      }
    }, 100);
    setDragOverIndex(null);
  };

  return (
    <div
      className="collection-folder"
      key={col.id}
      onDragOver={e => handleCollectionDragOver(e, col.id)}
      onDrop={handleCollectionDrop(col.id, null)}
      style={{
        border: collectionOpenState.dragOverCollectionId === col.id ? '2px solid #a259f7' : undefined,
        borderRadius: 6,
      }}
    >
      <div
        className="collection-folder-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 500,
          color: selectedCollectionId === col.id ? '#fff' : '#a259f7',
          background: selectedCollectionId === col.id ? '#a259f7' : undefined,
          marginBottom: 2
        }}
        onClick={() => handleCollectionHeaderClick(col.id)}
        onDoubleClick={e => {
          e.stopPropagation();
          setRenamingCollectionId(col.id);
          setCollectionRenameValue(col.name);
        }}
        onContextMenu={e => handleCollectionContextMenu(e, col.id)}
      >
        <span style={{ fontSize: 14, marginRight: 4 }}>{collectionOpen ? '\u25bc' : '\u25b6'}</span>
        <span style={{ fontSize: 15, marginRight: 6 }}>&#9670;</span>
        {renamingCollectionId === col.id ? (
          <input
            ref={collectionRenameInputRef}
            value={collectionRenameValue}
            onChange={e => setCollectionRenameValue(e.target.value)}
            onBlur={() => handleCollectionRenameSubmit(col.id)}
            onKeyDown={e => { e.stopPropagation(); handleCollectionRenameInputKeyDown(e, col.id); }}
            style={{ fontSize: 'inherit', width: 120, marginLeft: 2 }}
            maxLength={32}
            onFocus={() => console.log('Collection rename input focused for', col.id)}
          />
        ) : col.name}
      </div>
      {collectionOpen && (
        <ul className="layer-list" style={{ marginBottom: 8, background: 'rgba(162,89,247,0.07)', borderRadius: 6, padding: 4 }}>
          {colLayers.map((shape, idx) => (
            <LayerListItem
              key={shape.id + '-shortcut-' + col.id}
              shape={shape}
              i={idx}
              flatList={colLayers}
              selectedShapes={selectedShapes}
              renamingId={renamingId}
              renameValue={renameValue}
              renameInputRef={renameInputRef}
              setRenameValue={setRenameValue}
              setRenamingId={setRenamingId}
              handleRenameSubmit={handleRenameSubmit}
              handleLayerClick={() => {
                setSelectedShapes([shape.id]);
                setSelectedCollectionId(null);
              }}
              handleLayerContextMenu={e => handleLayerContextMenu(e, shape.id)}
              handleShapeDragStart={() => handleShapeDragStart(shape.id, col.id)}
              handleShapeDragEnd={handleShapeDragEnd}
              draggedShapeId={draggedShapeId}
              getShapeIcon={s => <span className="collected-diamond">&#9670;</span>}
              onDragOver={handleItemDragOver}
              onDrop={handleItemDrop}
              onDragEnter={handleItemDragEnter}
              isCollected={true}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectionFolder; 