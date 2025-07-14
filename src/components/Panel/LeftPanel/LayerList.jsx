import React, { useState, useRef, useEffect } from 'react';

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
  renamingId,
  setRenamingId,
  renameValue,
  setRenameValue,
  renameInputRef,
}) => {
  const [openGroups, setOpenGroups] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  // State for drag-and-drop
  const [draggedShapeId, setDraggedShapeId] = useState(null);
  const [dragOverCollectionId, setDragOverCollectionId] = useState(null);
  const [dragOverMainList, setDragOverMainList] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(true);
  // Map of layerId to ref for scrolling
  const layerRefs = useRef({});

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, shapeId: null, collectionId: null, type: null });

  // State for renaming collections
  const [renamingCollectionId, setRenamingCollectionId] = useState(null);
  const [collectionRenameValue, setCollectionRenameValue] = useState("");
  const collectionRenameInputRef = useRef(null);

  // State for selected collection
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // Focus input when entering collection rename mode
  useEffect(() => {
    if (renamingCollectionId && collectionRenameInputRef.current) {
      collectionRenameInputRef.current.focus();
      collectionRenameInputRef.current.select();
    }
  }, [renamingCollectionId]);

  // Helper to get shapes by id (for group rendering)
  const getShapeById = (id) => drawnRectangles.find(s => s.id === id);

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

  const handleRenameSubmit = (e) => {
    e.preventDefault();
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

  // Handle collection rename submit
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

  // Helper: Remove a shape from all collections
  const removeShapeFromAllCollections = (shapeId) =>
    collections.map(col => ({ ...col, shapeIds: col.shapeIds.filter(id => id !== shapeId) }));

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
    setCollections(prev => removeShapeFromAllCollections(draggedShapeId));
    setDraggedShapeId(null);
    setDragOverMainList(false);
  };

  // Render a single layer (used for both main list and collection folder)
  const renderLayerListItem = (shape, i, flatList, handleShapeDragStart, handleShapeDragEnd, draggedShapeId) => {
    const isCollected = allCollectedIds.includes(shape.id);
    if (!shape) return null;
    // Attach a ref to each real layer row for scrolling
    if (!layerRefs.current[shape.id]) {
      layerRefs.current[shape.id] = React.createRef();
    }
    return (
      <li
        key={shape.id + '-collected'}
        ref={layerRefs.current[shape.id]}
        className={selectedShapes && selectedShapes.includes(shape.id) ? "selected" : ""}
        onClick={e => handleLayerClick(e, shape.id, i, flatList)}
        onContextMenu={e => handleLayerContextMenu(e, shape.id)}
        style={{ cursor: "pointer", opacity: draggedShapeId === shape.id ? 0.5 : 1 }}
        draggable
        onDragStart={() => handleShapeDragStart(shape.id)}
        onDragEnd={handleShapeDragEnd}
      >
        {getShapeIcon(shape)}
        <span>
          {isCollected && <span className="collected-diamond">◆</span>}
          {renamingId === shape.id ? (
            <form onSubmit={handleRenameSubmit} style={{ display: 'inline' }}>
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={e => { e.stopPropagation(); }} // Prevent global shortcuts while editing
                style={{ width: '90%', fontSize: 'inherit' }}
                maxLength={32}
                onFocus={() => console.log('Shape rename input focused for', shape.id)}
              />
            </form>
          ) : shape.name}
        </span>
      </li>
    );
  };

  // Helper to flatten the drawnRectangles for index-based selection, skipping collected shapes
  // (FIX: Do NOT skip collected shapes; show all in main list)
  const flattenShapes = (shapes) => {
    let flat = [];
    for (const s of shapes) {
      if (!s) continue;
      flat.push(s);
      if (s.type === 'group' && s.children) {
        const children = s.children.map(id => getShapeById(id)).filter(Boolean);
        flat = flat.concat(flattenShapes(children));
      }
    }
    return flat;
  };

  const handleLayerClick = (e, id, index, flatList) => {
    if (e.shiftKey && selectedShapes && selectedShapes.length > 0 && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = flatList.slice(start, end + 1).map(s => s.id);
      setSelectedShapes(Array.from(new Set([...selectedShapes, ...rangeIds])));
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

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Use collections[0].shapeIds as the new collection array
  const activeCollection = collections && collections.length > 0 ? collections[0] : { shapeIds: [] };
  const setActiveCollectionShapeIds = (updater) => {
    if (!collections || collections.length === 0) return;
    setCollections(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], shapeIds: typeof updater === 'function' ? updater(updated[0].shapeIds) : updater };
      return updated;
    });
  };

  // Collected layers for the new collection (no groups, just direct collected layers)
  const collectedLayers = activeCollection.shapeIds
    .map(id => getShapeById(id))
    .filter(Boolean);

  // Prepare the flat list for rendering (show only shapes NOT in any collection)
  const allCollectedIds = collections.flatMap(col => col.shapeIds);
  const flatList = flattenShapes(drawnRectangles).filter(shape => !allCollectedIds.includes(shape.id));

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
  const handleCollectionHeaderClick = (colId) => {
    setSelectedCollectionId(colId);
    setSelectedShapes([]);
  };
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
    setSelectedCollectionId(collectionId);
    setSelectedShapes([]);
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
    console.log('handleContextMenuRename called', contextMenu);
    if (contextMenu.type === 'shape' && contextMenu.shapeId) {
      setTimeout(() => {
        setRenamingId(contextMenu.shapeId);
        setRenameValue(getShapeById(contextMenu.shapeId)?.name || '');
      }, 0);
      setTimeout(() => setContextMenu(c => ({ ...c, visible: false })), 0);
      console.log('Set renamingId for shape', contextMenu.shapeId);
    } else if (contextMenu.type === 'collection' && contextMenu.collectionId) {
      setTimeout(() => {
        setRenamingCollectionId(contextMenu.collectionId);
        const col = collections.find(c => c.id === contextMenu.collectionId);
        setCollectionRenameValue(col ? col.name : '');
      }, 0);
      setTimeout(() => setContextMenu(c => ({ ...c, visible: false })), 0);
      console.log('Set renamingCollectionId for collection', contextMenu.collectionId);
    } else {
      setContextMenu(c => ({ ...c, visible: false }));
      console.log('Context menu closed without rename');
    }
  };

  // Update Ctrl+R shortcut for rename
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
            {flatList.slice(i, j).map((shape, idx) => renderLayerListItem(shape, i + idx, flatList, handleShapeDragStart, handleShapeDragEnd, draggedShapeId))}
          </div>
        );
        i = j;
      } else {
        result.push(renderLayerListItem(flatList[i], i, flatList, handleShapeDragStart, handleShapeDragEnd, draggedShapeId));
        i++;
      }
    }
    return <ul className="layer-list">{result}</ul>;
  };

  return (
    <div className="layer-list-container">
      {/* Context menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y - 48, // Move menu above the cursor (48px is menu height, adjust as needed)
            left: contextMenu.x,
            background: '#222',
            color: '#fff',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: 180,
            padding: '4px 0',
          }}
        >
          <div
            style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500, background: '#1976d2' }}
            onMouseDown={handleContextMenuRename}
          >
            Rename
          </div>
          {contextMenu.type === 'shape' && (
            <div
              style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
              onMouseDown={handleAddToNewCollection}
            >
              Add to new collection
            </div>
          )}
        </div>
      )}
      {/* Render all collections at the top (show all non-empty collections) */}
      {collections.filter(col => col.shapeIds.length > 0).map((col, idx) => {
        const colLayers = col.shapeIds.map(id => getShapeById(id)).filter(Boolean);
        return (
          <div
            className="collection-folder"
            key={col.id}
            onDragOver={e => handleCollectionDragOver(e, col.id)}
            onDrop={e => handleCollectionDrop(e, col.id)}
            style={{
              border: dragOverCollectionId === col.id ? '2px solid #a259f7' : undefined,
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
              <span style={{ fontSize: 14, marginRight: 4 }}>{collectionOpen ? '▼' : '▶'}</span>
              <span style={{ fontSize: 15, marginRight: 6 }}>◆</span>
              {renamingCollectionId === col.id ? (
                <input
                  ref={collectionRenameInputRef}
                  value={collectionRenameValue}
                  onChange={e => setCollectionRenameValue(e.target.value)}
                  onBlur={() => handleCollectionRenameSubmit(col.id)}
                  onKeyDown={e => { e.stopPropagation(); handleCollectionRenameInputKeyDown(e, col.id); }} // Prevent global shortcuts while editing
                  style={{ fontSize: 'inherit', width: 120, marginLeft: 2 }}
                  maxLength={32}
                  onFocus={() => console.log('Collection rename input focused for', col.id)}
                />
              ) : col.name}
            </div>
            {collectionOpen && (
              <ul className="layer-list" style={{ marginBottom: 8, background: 'rgba(162,89,247,0.07)', borderRadius: 6, padding: 4 }}>
                {colLayers.map((shape) => (
                  <li
                    key={shape.id + '-shortcut-' + col.id}
                    className={selectedShapes && selectedShapes.includes(shape.id) ? 'selected' : ''}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: 6,
                      opacity: draggedShapeId === shape.id ? 0.5 : 1,
                      background: selectedShapes && selectedShapes.includes(shape.id) ? '#a259f7' : undefined,
                      color: selectedShapes && selectedShapes.includes(shape.id) ? '#fff' : undefined,
                    }}
                    onClick={() => {
                      setSelectedShapes([shape.id]);
                      setSelectedCollectionId(null);
                    }}
                    onContextMenu={e => handleLayerContextMenu(e, shape.id)}
                    draggable
                    onDragStart={() => handleShapeDragStart(shape.id)}
                    onDragEnd={handleShapeDragEnd}
                  >
                    <span className="collected-diamond">◆</span>
                    <span>
                      {renamingId === shape.id ? (
                        <form onSubmit={handleRenameSubmit} style={{ display: 'inline' }}>
                          <input
                            ref={renameInputRef}
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onBlur={handleRenameSubmit}
                            onKeyDown={e => { e.stopPropagation(); }}
                            style={{ width: '90%', fontSize: 'inherit' }}
                            maxLength={32}
                          />
                        </form>
                      ) : shape.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
        {flatList.length > 0 && renderLayerListWithBlockSelection(flatList, handleShapeDragStart, handleShapeDragEnd, draggedShapeId)}
      </div>
    </div>
  );
};

export default LayerList; 