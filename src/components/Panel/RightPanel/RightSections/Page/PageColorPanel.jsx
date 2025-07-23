import { createPortal } from "react-dom";
import { useRef, useCallback } from "react";

const ColorPanel = ({
  top,
  left,
  setColorPickerOpen,
  setPanelCoords, // NEW: setter for position
  children, // optional: for injecting color pickers or controls inside
  color,
  opacity,
  setColor,
  setOpacity,
}) => {
  const panelRef = useRef(null);
  const dragData = useRef(null);

  const handleHexInputChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid hex characters up to 6
    if (/^[0-9A-Fa-f]{0,6}$/.test(value)) {
      setColor("#" + value); // Update the color state in Fill.jsx
    }
  };

  const handleOpacityInputChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value)));
    setOpacity(value); // Update the opacity state in Fill.jsx
  };

  // Drag Handlers
  const handleDragging = useCallback((e) => {
    if (!dragData.current) return;
    const { startX, startY, origTop, origLeft } = dragData.current;
    const newTop = origTop + (e.clientY - startY);
    const newLeft = origLeft + (e.clientX - startX);
    if (setPanelCoords) {
      setPanelCoords({ top: newTop, left: newLeft });
    }
  }, [setPanelCoords]);

  const handleDragEnd = useCallback(() => {
    dragData.current = null;
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", handleDragEnd);
    document.body.style.userSelect = "";
  }, [handleDragging]);

  const handleDragStart = useCallback(
    (e) => {
      e.preventDefault();
      if (!panelRef.current) return;

      dragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        origTop: panelRef.current.offsetTop,
        origLeft: panelRef.current.offsetLeft,
      };

      document.addEventListener("mousemove", handleDragging);
      document.addEventListener("mouseup", handleDragEnd);
      document.body.style.userSelect = "none";
    },
    [handleDragging, handleDragEnd]
  );

  const handlePanelClick = (e) => {
    e.stopPropagation(); // Prevent clicks from closing the panel
  };

  return createPortal(
    <div
      id="floating-color-picker"
      style={{
        position: "absolute",
        top: top,
        left: left,
        zIndex: 9999,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        padding: 12,
        minWidth: 220,
      }}
      ref={panelRef}
      onClick={handlePanelClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
        onMouseDown={handleDragStart}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#333",
            marginLeft: "6px",
            marginTop: "6px",
          }}
        >
          Page
        </span>
        <button
          style={{
            border: "none",
            background: "transparent",
            fontSize: "18px",
            color: "#888",
            fontWeight: "bold",
            marginRight: "4px",
          }}
          onClick={() => setColorPickerOpen(false)}
          aria-label="Close color picker"
        >
          ×
        </button>
      </div>

      <div
        style={{
          height: "1px",
          background: "#e0e0e0",
          margin: "8px -12px",
        }}
      ></div>

      {/* Optional children: Add color picker components here */}
      {children}

      {/* Hex and Opacity Inputs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        {/* Hex Input */}
        <input
          type="text"
          value={/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color.toUpperCase() : '#000000'}
          onChange={handleHexInputChange}
          style={{
            width: "80px",
            padding: "4px 5px",
            fontSize: "12px",
            textAlign: "center",
            border: "none",
            borderRadius: 4,
            background : "#e0e0e0"
          }}
        />

        {/* Opacity Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <div style={{borderRadius: 4, background: "#e0e0e0", }}>
            <input
            type="number"
            value={opacity} 
            onChange={handleOpacityInputChange} 
            min={0}
            max={100}
            style={{
              width: "50px",
              padding: "4px",
              fontSize: "12px",
              textAlign: "end",
              border: "none",
              background: "none",
            }}
          />
          <span style={{ fontSize: "12px", marginRight: "20px"}}>%</span>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ColorPanel;
