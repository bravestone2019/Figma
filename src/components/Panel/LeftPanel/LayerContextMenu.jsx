import React from 'react';

const LayerContextMenu = ({
  contextMenu,
  onRename,
  onAddToNewCollection,
  onClose,
  onSetRole,
}) => {
  if (!contextMenu.visible) return null;
  return (
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
      onMouseLeave={onClose}
    >
      <div
        style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500, background: '#1976d2' }}
        onMouseDown={onRename}
      >
        Rename
      </div>
      {contextMenu.type === 'shape' && (
        <>
          <div
            style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
            onMouseDown={onAddToNewCollection}
          >
            Add to new collection
          </div>
          <div
            style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
            onMouseDown={() => onSetRole && onSetRole('placeholder')}
          >
            Assign Placeholder
          </div>
          <div
            style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
            onMouseDown={() => onSetRole && onSetRole('default')}
          >
            Assign Default
          </div>
          <div
            style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
            onMouseDown={() => onSetRole && onSetRole(null)}
          >
            Remove Role
          </div>
        </>
      )}
    </div>
  );
};

export default LayerContextMenu; 