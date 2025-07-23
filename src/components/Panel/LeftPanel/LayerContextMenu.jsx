import './leftSection/LayerContextMenu.css';

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
      className="context-menu"
      style={{ top: contextMenu.y - 48, left: contextMenu.x - 10 }}
      onMouseLeave={onClose}
    >
      <div className="context-menu-item primary" onMouseDown={onRename}>
        Rename
      </div>
      {contextMenu.type === 'shape' && (
        <>
          <div className="context-menu-item" onMouseDown={onAddToNewCollection}>
            Add to new collection
          </div>
          <div className="context-menu-item" onMouseDown={() => onSetRole?.('placeholder')}>
            Assign Placeholder
          </div>
          <div className="context-menu-item" onMouseDown={() => onSetRole?.('default')}>
            Assign Default
          </div>
          <div className="context-menu-item" onMouseDown={() => onSetRole?.(null)}>
            Remove Role
          </div>
        </>
      )}
    </div>
  );
};

export default LayerContextMenu;
