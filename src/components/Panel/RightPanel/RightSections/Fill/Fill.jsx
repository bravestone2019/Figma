import "../../RightPanel.css";
import "../Effects/Effects.css";
import { useState, useEffect, useRef } from "react";
import { RgbaColorPicker, HexColorInput, HexColorPicker } from "react-colorful";
import "./ColorPicker.css";
import { createPortal } from "react-dom";

const Fill = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  // Only show controls if exactly one shape is selected and is rectangle or text
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let shape = null;
  let shapeType = "";
  if (isSingle) {
    shape = drawnRectangles.find(s => s.id === selectedShapes[0]);
    if (shape) shapeType = shape.type;
  }
  const isFillable = isSingle && (shapeType === "rectangle" || shapeType === "text");

  // Sync color and opacity with selected shape
  const getInitialColor = () => {
    if (!isFillable) return "#ff0000";
    if (shapeType === "rectangle") return shape.backgroundColor || "#ff0000";
    if (shapeType === "text") return shape.color || "#000000";
    return "#ff0000";
  };
  const getInitialOpacity = () => {
    if (!isFillable) return 100;
    return shape.opacity !== undefined ? Math.round(shape.opacity * 100) : 100;
  };

  const [isFillOpen, setIsFillOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [color, setColor] = useState(getInitialColor());
  const [opacity, setOpacity] = useState(getInitialOpacity());
  const [pickerPos, setPickerPos] = useState({ top: 100, left: 100 });
  const pickerRef = useRef(null);
  const dragData = useRef(null);
  const debounceTimeout = useRef(null);

  // Update color/opacity state when selection changes
  useEffect(() => {
    setColor(getInitialColor());
    setOpacity(getInitialOpacity());
    // eslint-disable-next-line
  }, [selectedShapes, drawnRectangles]);

  // Close picker on outside click
  useEffect(() => {
    if (!colorPickerOpen) return;
    const handleClick = (e) => {
      if (
        colorBtnRef.current &&
        !colorBtnRef.current.contains(e.target) &&
        !document.getElementById("floating-color-picker")?.contains(e.target)
      ) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [colorPickerOpen]);

  // Only use DOM manipulation for drag
  function handleDragStart(e) {
    e.preventDefault();
    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      origTop: pickerPos.top,
      origLeft: pickerPos.left,
    };
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  }

  function handleDrag(e) {
    if (!dragData.current) return;
    const { startX, startY, origTop, origLeft } = dragData.current;
    const newTop = origTop + (e.clientY - startY);
    const newLeft = origLeft + (e.clientX - startX);
    if (pickerRef.current) {
      pickerRef.current.style.top = `${newTop}px`;
      pickerRef.current.style.left = `${newLeft}px`;
    }
  }

  function handleDragEnd(e) {
    if (!dragData.current) return;
    const { startX, startY, origTop, origLeft } = dragData.current;
    const newTop = origTop + (e.clientY - startY);
    const newLeft = origLeft + (e.clientX - startX);
    setPickerPos({ top: newTop, left: newLeft }); // Only update React state at the end
    dragData.current = null;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
  }

  // Update shape color
  const handleColorChange = (newColor) => {
    setColor(newColor); // local state for the picker UI

    // Debounce the update to the main state
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (!isFillable) return;
      const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
      if (shapeIdx === -1) return;
      let newShape = { ...drawnRectangles[shapeIdx] };
      if (shapeType === "rectangle") newShape.backgroundColor = newColor;
      if (shapeType === "text") newShape.color = newColor;
      const newRects = [...drawnRectangles];
      newRects[shapeIdx] = newShape;
      setDrawnRectangles(newRects);
    }, 100); // 100ms debounce
  };

  // Update shape opacity
  const handleOpacityChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 100;
    val = Math.max(0, Math.min(100, val));
    setOpacity(val);
    if (!isFillable) return;
    const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    let newShape = { ...drawnRectangles[shapeIdx], opacity: val / 100 };
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  };

  // Open color picker and set its position
  const handleColorBtnClick = () => {
    if (colorBtnRef.current) {
      const rect = colorBtnRef.current.getBoundingClientRect();
      const newPos = {
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      };
      setPickerPos(newPos);
    }
    setColorPickerOpen(!colorPickerOpen);
  };

  const colorBtnRef = useRef(null);

  // Floating color picker portal
  const colorPickerPortal = colorPickerOpen
    ? createPortal(
        <div
          id="floating-color-picker"
          ref={pickerRef}
          style={{
            position: "absolute",
            top: pickerPos.top,
            left: pickerPos.left,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            padding: 12,
            minWidth: 200,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
                marginRight: 8,
                background: "#eee",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
              onMouseDown={handleDragStart}
              title="Drag picker"
            >
              <svg width="14" height="14" viewBox="0 0 16 16">
                <circle cx="4" cy="4" r="1.5" />
                <circle cx="12" cy="4" r="1.5" />
                <circle cx="4" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
              </svg>
            </div>
            <span style={{ fontWeight: 600, flex: 1 }}>Color Picker</span>
            <button
              style={{
                border: "none",
                background: "none",
                fontSize: 18,
                cursor: "pointer",
                marginLeft: 8,
              }}
              onClick={() => setColorPickerOpen(false)}
              aria-label="Close color picker"
            >
              ×
            </button>
          </div>
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsFillOpen(!isFillOpen)}
      >
        Fill{" "}
        <button
          className="expand-collapse-btn"
          onClick={() => setIsFillOpen(!isFillOpen)}
          aria-label={isFillOpen ? "Collapse Fill" : "Expand Fill"}
        >
          {isFillOpen ? "−" : "+"}
        </button>
      </div>

      {isFillOpen && (
        <div className="position-grid">
          <div className="pos-box-fill">
            <button
              ref={colorBtnRef}
              style={{
                width: "22px",
                height: "22px",
                border: "1.5px solid #ddd",
                borderRadius: "4px",
                background: color,
                display: "inline-block",
                padding: 0,
              }}
              aria-label="Select color"
              onClick={handleColorBtnClick}
              disabled={!isFillable}
            />
            {colorPickerPortal}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
                flex: 1,
              }}
            >
              <input
                type="number"
                value={opacity}
                onChange={handleOpacityChange}
                disabled={!isFillable}
              />
              <div>%</div>
            </div>
          </div>
        </div>
      )}

      {/* Thin grey line divider */}
      {!isFillOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Fill;
