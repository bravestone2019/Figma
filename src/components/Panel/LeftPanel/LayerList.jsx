import React, { useState, useRef, useEffect } from 'react';
import LayerListItem from './LayerListItem.jsx';
import CollectionFolder from './CollectionFolder.jsx';
import LayerContextMenu from './LayerContextMenu.jsx';
import useLayerListDragAndDrop from './useLayerListDragAndDrop.js';
import useLayerListSelection from './useLayerListSelection.js';
import useLayerListRenaming from './useLayerListRenaming.js';
import useLayerListShortcuts from './useLayerListShortcuts.js';
import useLayerListUIState from './useLayerListUIState.js';
import { getShapeById, flattenShapes, removeShapeFromAllCollections, setActiveCollectionShapeIds } from './layerListHelpers.js';
import { bringForward, sendBackward, bringToFront, sendToBack } from './layerZOrderHelpers.js';

const LayerList = ({
  drawnRectangles,
  selectedShapes,
  setSelectedShapes,
  setDrawnRectangles,
  setActiveTool,
  collection,
  setCollection,
  collections, // add this
  setCollections, // add this
  handleUngroup,
}) => {
  // Move the hook call to the top
  const {
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
  } = useLayerListRenaming({ setDrawnRectangles, setCollections, drawnRectangles, collections, setActiveTool });

  // Use the UI state hook
  const {
    openGroups,
    setOpenGroups,
    collectionOpen,
    setCollectionOpen,
    contextMenu,
    setContextMenu,
    selectedCollectionId,
    setSelectedCollectionId,
  } = useLayerListUIState();

  // Per-collection open/close state
  const [openCollections, setOpenCollections] = useState({});

  // Map of layerId to ref for scrolling
  const layerRefs = useRef({});

  // State for drag-and-drop reordering in the main list
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Handler for drag-and-drop reordering within a collection
  const [dragOverCollectionIndex, setDragOverCollectionIndex] = useState({}); // { [colId]: index }

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
    const fromIndex = flatList.findIndex(s => s.id === draggedShapeId);
    if (fromIndex === -1 || fromIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    // Reorder flatList and update drawnRectangles
    const newFlatList = [...flatList];
    const [moved] = newFlatList.splice(fromIndex, 1);
    newFlatList.splice(dropIndex, 0, moved);
    // Now, update drawnRectangles to reflect the new order for non-collected shapes
    const allCollectedIds = collections.flatMap(col => col.shapeIds);
    const collected = drawnRectangles.filter(shape => allCollectedIds.includes(shape.id));
    setDrawnRectangles([...newFlatList, ...collected]);
    setDragOverIndex(null);
  };

  // Handler for drag-and-drop reordering within a collection
  const handleCollectionItemDragOver = (colId) => (e, index) => {
    setDragOverCollectionIndex(prev => ({ ...prev, [colId]: index }));
  };
  const handleCollectionItemDragEnter = (colId) => (e, index) => {
    setDragOverCollectionIndex(prev => ({ ...prev, [colId]: index }));
  };
  const handleCollectionItemDrop = (colId) => (e, dropIndex) => {
    if (draggedShapeId == null || dropIndex == null) return;
    setCollections(prev => prev.map(col => {
      if (col.id !== colId) return col;
      const fromIndex = col.shapeIds.findIndex(id => id === draggedShapeId);
      if (fromIndex === -1 || fromIndex === dropIndex) return col;
      const newShapeIds = [...col.shapeIds];
      newShapeIds.splice(fromIndex, 1);
      newShapeIds.splice(dropIndex, 0, draggedShapeId);
      return { ...col, shapeIds: newShapeIds };
    }));
    setDragOverCollectionIndex(prev => ({ ...prev, [colId]: null }));
  };

  // Helper to get shapes by id (for group rendering)
  // Helper to get icon for shape type
  const getShapeIcon = (shape) => {
    switch (shape.type) {
      case 'rectangle': return <span className="layer-icon">▭</span>;
      case 'circle': return <span className="layer-icon">◯</span>;
      case 'line': return <span className="layer-icon">/</span>;
      case 'triangle': return <span className="layer-icon">△</span>;
      case 'image': return <span className="layer-icon">🖼️</span>;
      case 'text': return <span className="layer-icon">T</span>;
      case 'group': return <span className="layer-icon">📁</span>;
      default: return <span className="layer-icon">?</span>;
    }
  };

  // Remove old drag-and-drop state and handlers, and use the hook instead
  const {
    draggedShapeId,
    dragOverCollectionId,
    dragOverMainList,
    handleShapeDragStart,
    handleCollectionDragOver,
    handleMainListDragOver,
    setDraggedShapeId,
    setDragOverCollectionId,
    setDragOverMainList,
  } = useLayerListDragAndDrop({ setCollections, setSelectedShapes, removeShapeFromAllCollections });

  // Remove old selection state and handlers, and use the hook instead
  const {
    lastSelectedIndex,
    setLastSelectedIndex,
    handleLayerClick,
  } = useLayerListSelection({ setSelectedShapes });

  // Toggle open/close for a specific collection
  const handleCollectionHeaderClick = (colId) => {
    setOpenCollections(prev => ({
      ...prev,
      [colId]: !prev[colId]
    }));
    setSelectedCollectionId(colId);
    setSelectedShapes([]);
  };

  // Use collections[0].shapeIds as the new collection array
  const activeCollection = collections && collections.length > 0 ? collections[0] : { shapeIds: [] };
  // Remove inline definitions of getShapeById, flattenShapes, removeShapeFromAllCollections, setActiveCollectionShapeIds
  // Use the imported helpers instead

  // Prepare the flat list for rendering (show only shapes NOT in any collection)
  const allCollectedIds = collections.flatMap(col => col.shapeIds);
  const flatList = drawnRectangles.filter(shape => !allCollectedIds.includes(shape.id));

  // Debug logging
  // console.log('allCollectedIds:', allCollectedIds);
  // console.log('flatList:', flatList.map(s => s.id));
  // console.log('collections:', collections.map(col => col.shapeIds));

  // Add the keyboard shortcuts hook
  useLayerListShortcuts({
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
  });

  // Scroll to the real layer when a collection shortcut is clicked
  const handleCollectionShortcutClick = (id) => {
    setSelectedShapes([id]);
    setTimeout(() => {
      const ref = layerRefs.current[id];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };

  // Handle right-click on shape
  const handleLayerContextMenu = (e, shapeId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, shapeId, collectionId: null, type: 'shape' });
    if (!selectedShapes || !selectedShapes.includes(shapeId)) {
      setSelectedShapes([shapeId]);
    }
    // Auto-scroll the right-clicked shape into view
    if (layerRefs.current[shapeId] && layerRefs.current[shapeId].current) {
      layerRefs.current[shapeId].current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  // Update selection logic: selecting a collection deselects shapes, selecting a shape deselects collection
  useEffect(() => {
    if (selectedShapes && selectedShapes.length > 0) {
      setSelectedCollectionId(null);
    }
  }, [selectedShapes]);

  // Handle right-click on collection
  const handleCollectionContextMenu = (e, collectionId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, shapeId: null, collectionId, type: 'collection' });
    setRenamingCollectionId(null); // Ensure not already renaming
    // Only select if not already selected
    if (selectedCollectionId !== collectionId) {
      setSelectedCollectionId(collectionId);
      setSelectedShapes([]);
    }
  };

  // Hide context menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    if (contextMenu.visible) {
      window.addEventListener('mousedown', handleClick);
      return () => window.removeEventListener('mousedown', handleClick);
    }
  }, [contextMenu.visible]);

  // Handle rename from context menu
  const handleContextMenuRename = () => {
    if (contextMenu.type === 'shape' && contextMenu.shapeId) {
      setTimeout(() => {
        setRenamingId(contextMenu.shapeId);
        setRenameValue(getShapeById(drawnRectangles, contextMenu.shapeId)?.name || '');
      }, 0);
      setTimeout(() => setContextMenu(c => ({ ...c, visible: false })), 0);
    } else if (contextMenu.type === 'collection' && contextMenu.collectionId) {
      setTimeout(() => {
        setRenamingCollectionId(contextMenu.collectionId);
        const col = collections.find(c => c.id === contextMenu.collectionId);
        setCollectionRenameValue(col ? col.name : '');
      }, 0);
      setTimeout(() => setContextMenu(c => ({ ...c, visible: false })), 0);
    } else {
      setContextMenu(c => ({ ...c, visible: false }));
    }
  };

  // Update Ctrl+R shortcut for rename
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
        if (selectedShapes && selectedShapes.length === 1) {
          setRenamingId(selectedShapes[0]);
          setRenameValue(getShapeById(drawnRectangles, selectedShapes[0])?.name || '');
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

  // Add to new collection from context menu
  const handleAddToNewCollection = () => {
    // Always use the right-clicked shape for the new collection
    let shapesToAdd = [];
    if (contextMenu.shapeId) {
      shapesToAdd = [contextMenu.shapeId];
      setSelectedShapes([contextMenu.shapeId]);
    }
    // Prevent creating empty collections
    if (shapesToAdd.length === 0) {
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }
    setCollections(prev => [
      ...prev,
      {
        id: `col-${Date.now()}`,
        name: `Collection ${prev.length + 1}`,
        shapeIds: [...shapesToAdd],
      },
    ]);
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Auto-delete empty collections
  useEffect(() => {
    if (collections.some(col => col.shapeIds.length === 0)) {
      setCollections(prev => prev.filter(col => col.shapeIds.length > 0));
    }
  }, [collections]);

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

  // Z-order handler functions
  const handleBringForward = (id) => {
    setDrawnRectangles(prev => bringForward(prev, id));
  };
  const handleSendBackward = (id) => {
    setDrawnRectangles(prev => sendBackward(prev, id));
  };
  const handleBringToFront = (id) => {
    setDrawnRectangles(prev => bringToFront(prev, id));
  };
  const handleSendToBack = (id) => {
    setDrawnRectangles(prev => sendToBack(prev, id));
  };

  // Track drag source: { type: 'main' | 'collection', collectionId: string | null }
  const [dragSource, setDragSource] = useState({ type: null, collectionId: null });

  // Handler for drag start in main list
  const handleMainListShapeDragStart = (shapeId) => {
    setDraggedShapeId(shapeId);
    setDragSource({ type: 'main', collectionId: null });
  };
  // Handler for drag start in collection
  const handleCollectionShapeDragStart = (shapeId, collectionId) => {
    setDraggedShapeId(shapeId);
    setDragSource({ type: 'collection', collectionId });
  };
  // Handler for drag end
  const handleShapeDragEnd = () => {
    setDraggedShapeId(null);
    setDragSource({ type: null, collectionId: null });
    setDragOverIndex(null);
    setDragOverCollectionIndex({});
  };

  // Handler for drop on main list (move from collection to main)
  const handleMainListDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedShapeId) return;
    if (dragSource.type === 'collection' && dragSource.collectionId) {
      // Remove from collection
      setCollections(prev => prev.map(col =>
        col.id === dragSource.collectionId
          ? { ...col, shapeIds: col.shapeIds.filter(id => id !== draggedShapeId) }
          : col
      ));
    }
    setDragOverIndex(null);
    setDragOverMainList(false);
  };

  // Handler for drop on collection (move from main or another collection)
  const handleCollectionDrop = (colId, dropIndex) => (e) => {
    e.preventDefault();
    if (!draggedShapeId) return;
    setCollections(prev => prev.map(col => {
      if (col.id === colId) {
        // Remove if already present (for reorder or move)
        let newShapeIds = col.shapeIds.filter(id => id !== draggedShapeId);
        // Insert at dropIndex
        if (dropIndex == null || dropIndex > newShapeIds.length) {
          newShapeIds.push(draggedShapeId);
        } else {
          newShapeIds.splice(dropIndex, 0, draggedShapeId);
        }
        return { ...col, shapeIds: newShapeIds };
      } else if (dragSource.type === 'collection' && col.id === dragSource.collectionId) {
        // Remove from source collection if moving between collections
        return { ...col, shapeIds: col.shapeIds.filter(id => id !== draggedShapeId) };
      }
      return col;
    }));
    setDragOverCollectionIndex(prev => ({ ...prev, [colId]: null }));
  };

  // Helper to render the flat list with Figma-style multi-select highlight
  const renderLayerListWithBlockSelection = (flatList, handleShapeDragStart, handleShapeDragEnd, draggedShapeId) => {
    const result = [];
    let i = 0;
    while (i < flatList.length) {
      if (selectedShapes && selectedShapes.includes(flatList[i].id)) {
        let j = i;
        while (j < flatList.length && selectedShapes.includes(flatList[j].id)) {
          j++;
        }
        result.push(
          <div key={"block-" + i} style={{ background: '#1976d2', borderRadius: 4, margin: '2px 0' }}>
            {flatList.slice(i, j).map((shape, idx) => (
              <LayerListItem
                key={shape.id + '-collected'}
                shape={shape}
                i={i + idx}
                flatList={flatList}
                selectedShapes={selectedShapes}
                renamingId={renamingId}
                renameValue={renameValue}
                renameInputRef={renameInputRef}
                setRenameValue={setRenameValue}
                setRenamingId={setRenamingId}
                handleRenameSubmit={handleRenameSubmit}
                handleLayerClick={handleLayerClick}
                handleLayerContextMenu={handleLayerContextMenu}
                handleShapeDragStart={() => handleMainListShapeDragStart(shape.id)}
                handleShapeDragEnd={handleShapeDragEnd}
                draggedShapeId={draggedShapeId}
                getShapeIcon={getShapeIcon}
                onDragOver={handleItemDragOver}
                onDrop={handleItemDrop}
                onDragEnter={handleItemDragEnter}
              />
            ))}
          </div>
        );
        i = j;
      } else {
        const shape = flatList[i];
        result.push(
          <LayerListItem
            key={shape.id + '-collected'}
            shape={shape}
            i={i}
            flatList={flatList}
            selectedShapes={selectedShapes}
            renamingId={renamingId}
            renameValue={renameValue}
            renameInputRef={renameInputRef}
            setRenameValue={setRenameValue}
            setRenamingId={setRenamingId}
            handleRenameSubmit={handleRenameSubmit}
            handleLayerClick={handleLayerClick}
            handleLayerContextMenu={handleLayerContextMenu}
            handleShapeDragStart={() => handleMainListShapeDragStart(shape.id)}
            handleShapeDragEnd={handleShapeDragEnd}
            draggedShapeId={draggedShapeId}
            getShapeIcon={getShapeIcon}
            onDragOver={handleItemDragOver}
            onDrop={handleItemDrop}
            onDragEnter={handleItemDragEnter}
          />
        );
        i++;
      }
    }
    return <ul className="layer-list">{result}</ul>;
  };

  // Handler for context menu role change
  const handleSetRole = (role) => {
    if (!contextMenu.shapeId) return;
    setSelectedShapes([contextMenu.shapeId]); // Ensure selection is up to date
    setDrawnRectangles(prev => {
      const updated = prev.map(shape =>
        shape.id === contextMenu.shapeId ? { ...shape, role } : shape
      );
      return updated;
    });
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div className="layer-list-container">
      {/* Context menu */}
      <LayerContextMenu
        contextMenu={contextMenu}
        onRename={handleContextMenuRename}
        onAddToNewCollection={handleAddToNewCollection}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        // Connect context menu to role assignment
        onSetRole={handleSetRole}
      />
      {/* Render all collections at the top (show all non-empty collections) */}
      {collections.filter(col => col.shapeIds.length > 0).map((col, idx) => {
        const colLayers = col.shapeIds.map(id => getShapeById(drawnRectangles, id)).filter(Boolean);
        return (
          <CollectionFolder
            key={col.id}
            col={col}
            colLayers={colLayers}
            collectionOpen={!!openCollections[col.id]}
            selectedCollectionId={selectedCollectionId}
            selectedShapes={selectedShapes}
            renamingCollectionId={renamingCollectionId}
            collectionRenameValue={collectionRenameValue}
            collectionRenameInputRef={collectionRenameInputRef}
            setRenamingCollectionId={setRenamingCollectionId}
            setCollectionRenameValue={setCollectionRenameValue}
            handleCollectionRenameSubmit={handleCollectionRenameSubmit}
            handleCollectionRenameInputKeyDown={handleCollectionRenameInputKeyDown}
            handleCollectionHeaderClick={handleCollectionHeaderClick}
            handleCollectionContextMenu={handleCollectionContextMenu}
            handleLayerContextMenu={handleLayerContextMenu}
            handleShapeDragStart={handleCollectionShapeDragStart}
            handleShapeDragEnd={handleShapeDragEnd}
            draggedShapeId={draggedShapeId}
            renamingId={renamingId}
            renameValue={renameValue}
            renameInputRef={renameInputRef}
            setRenameValue={setRenameValue}
            setRenamingId={setRenamingId}
            handleRenameSubmit={handleRenameSubmit}
            setSelectedShapes={setSelectedShapes}
            setSelectedCollectionId={setSelectedCollectionId}
            collectionOpenState={{ dragOverCollectionId }}
            handleCollectionDragOver={handleCollectionDragOver}
            handleCollectionDrop={handleCollectionDrop}
            setCollections={setCollections}
            getShapeIcon={getShapeIcon}
            // Pass isCollected to LayerListItem
            isCollected={true}
          />
        );
      })}
      {/* Main layers list with drop target */}
      <div
        onDragOver={handleMainListDragOver}
        onDrop={handleMainListDrop}
        style={{
          // No border highlight for drop area
          borderRadius: 6,
          marginTop: 8,
          minHeight: flatList.length === 0 ? 40 : undefined, // Always allow drop, even if empty
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: dragOverMainList ? 'rgba(25, 118, 210, 0.07)' : undefined,
        }}
      >
        {flatList.length > 0 && renderLayerListWithBlockSelection(flatList, handleMainListShapeDragStart, handleShapeDragEnd, draggedShapeId)}
      </div>
    </div>
  );
};

export default LayerList; 