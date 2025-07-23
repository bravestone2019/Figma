import "./LeftPanel.css";
import "./leftSection/PageList.css";
import Default from "../../../assets/LeftPanel/default.png";
import Polder from "../../../assets/LeftPanel/placeholder.png";
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
  onDragOver,
  onDrop,
  onDragEnter,
  isCollected,
}) => {
  if (!shape) return null;
  const isSelected = selectedShapes && selectedShapes.includes(shape.id);

  return (
    <li
      key={shape.id + "-collected"}
      ref={renameInputRef}
      className={isSelected ? "selected" : ""}
      onClick={(e) => handleLayerClick(e, shape.id, i, flatList)}
      onContextMenu={(e) => handleLayerContextMenu(e, shape.id)}
      style={{
        borderRadius: 10,
        padding: "4px 0",
        // marginLeft: "-6px",
        fontSize: 14,
        display: "flex",
        flex: 1,
        alignItems: "center",
        gap: "6px",
        // opacity: draggedShapeId === shape.id ? 0.5 : 1,
      }}
      draggable
      onDragStart={() => handleShapeDragStart(shape.id)}
      onDragEnd={handleShapeDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver && onDragOver(e, i);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop && onDrop(e, i);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter && onDragEnter(e, i);
      }}
    >
      {isCollected ? (
        <div className={`layer-list-content ${isSelected ? "selected" : ""}`}>
          {/* {getShapeIcon(shape)} */}
          {shape.role === "placeholder" && (
            <img
              src={Default}
              alt=""
              style={{ width: 14, height: 14 }}
              title="Placeholder"
            />
          )}
          {shape.role === "default" && (
            <img
              src={Polder}
              alt=""
              style={{ width: 14, height: 14 }}
              title="Default"
            />
          )}
          <span>
            {renamingId === shape.id ? (
              <form onSubmit={handleRenameSubmit}>
                <input
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  // style={{ width: "90%", fontSize: "inherit" }}
                  maxLength={32}
                  onFocus={() =>
                    console.log("Shape rename input focused for", shape.id)
                  }
                />
              </form>
            ) : (
              shape.name
            )}
          </span>
        </div>
      ) : (
        <div className={`layer-item-wrapper ${isSelected ? "selected" : ""}`}>
          <span style={{ marginLeft: 0 }}>{getShapeIcon(shape)}</span>
          <span style={{ marginLeft: 4 }}>
            {renamingId === shape.id ? (
              <form onSubmit={handleRenameSubmit}>
                <input
            
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  maxLength={32}
                  onFocus={() =>
                    console.log("Shape rename input focused for", shape.id)
                  }
                />
              </form>
            ) : (
              shape.name
            )}
          </span>
        </div>
      )}
      {/* Z-order controls, only show if selected */}
    </li>
  );
};

export default LayerListItem;
