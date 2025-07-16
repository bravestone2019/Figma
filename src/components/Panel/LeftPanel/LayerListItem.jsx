import React from 'react';

const LayerListItem = ({
  shape,
  i,
  flatList,
  selectedShapes,
  renamingId,
  renameValue,
  renameInputRef,
  setRenameValue,
  setRenamingId,
  handleRenameSubmit,
  handleLayerClick,
  handleLayerContextMenu,
  handleShapeDragStart,
  handleShapeDragEnd,
  draggedShapeId,
  getShapeIcon,
  // New z-order handlers
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  // New drag-and-drop handlers
  onDragOver,
  onDrop,
  onDragEnter,
  isCollected,
}) => {
  if (!shape) return null;
  const isSelected = selectedShapes && selectedShapes.includes(shape.id);
  return (
    <li
      key={shape.id + '-collected'}
      ref={renameInputRef}
      className={isSelected ? 'selected' : ''}
      onClick={e => handleLayerClick(e, shape.id, i, flatList)}
      onContextMenu={e => handleLayerContextMenu(e, shape.id)}
      style={{
        cursor: 'pointer',
        opacity: draggedShapeId === shape.id ? 0.5 : 1,
        background: isSelected ? '#a259f7' : undefined, // purple highlight
        border: isSelected ? '2px solid #a259f7' : undefined, // purple border
        borderRadius: isSelected ? 6 : undefined,
      }}
      draggable
      onDragStart={() => handleShapeDragStart(shape.id)}
      onDragEnd={handleShapeDragEnd}
      onDragOver={e => { e.preventDefault(); onDragOver && onDragOver(e, i); }}
      onDrop={e => { e.preventDefault(); onDrop && onDrop(e, i); }}
      onDragEnter={e => { e.preventDefault(); onDragEnter && onDragEnter(e, i); }}
    >
      {isCollected ? (
        <>
          {getShapeIcon(shape)}
          {shape.role === 'placeholder' && <span style={{color: '#a259f7', marginRight: 4}} title="Placeholder">▲</span>}
          {shape.role === 'default' && <span style={{color: '#a259f7', marginRight: 4}} title="Default">■</span>}
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
                  onFocus={() => console.log('Shape rename input focused for', shape.id)}
                />
              </form>
            ) : shape.name}
          </span>
        </>
      ) : (
        <>
          {getShapeIcon(shape)}
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
                  onFocus={() => console.log('Shape rename input focused for', shape.id)}
                />
              </form>
            ) : shape.name}
          </span>
        </>
      )}
      {/* Z-order controls, only show if selected */}
    </li>
  );
};

export default LayerListItem; 