import "../LeftPanel.css"
const CollectionPanel = ({
  collection,
  setCollection,
  collectionOpen,
  setCollectionOpen,
  isCollectionDragOver,
  setIsCollectionDragOver,
  draggedShapeId,
  setDraggedShapeId,
  onRemoveItem,
  onDropItem,
}) => {
  return (
    <div className={`collection-panel${collectionOpen ? '' : ' collapsed'}`}> 
      <div className="collection-header" onClick={() => setCollectionOpen(!collectionOpen)}>
        <span>Collection</span>
        <span>{collectionOpen ? '▼' : '▶'}</span>
      </div>
      {collectionOpen && (
        <ul
          className={`collection-list${isCollectionDragOver ? ' drag-over' : ''}`}
          onDragOver={e => {
            e.preventDefault();
            setIsCollectionDragOver(true);
          }}
          onDragLeave={() => setIsCollectionDragOver(false)}
          onDrop={() => {
            setIsCollectionDragOver(false);
            if (onDropItem) onDropItem(draggedShapeId);
          }}
        >
          {collection.length === 0 && <li className="empty">No items in collection</li>}
          {collection.map(id => (
            <li key={id} className="collection-item">
              <span>{id}</span>
              <button onClick={() => onRemoveItem && onRemoveItem(id)} style={{ marginLeft: 8 }}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectionPanel; 