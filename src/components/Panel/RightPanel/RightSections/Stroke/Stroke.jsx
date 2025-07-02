import "../../RightPanel.css";
import "../Effects/Effects.css";
import { useState, useEffect, useRef } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import "./ColorPicker.css";
import { createPortal } from "react-dom";

const Stroke = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let shape = null;
  let shapeType = "";
  if (isSingle) {
    shape = drawnRectangles.find(s => s.id === selectedShapes[0]);
    if (shape) shapeType = shape.type;
  }
  // Supported: rectangle, text, image, line
  const isStrokeable = isSingle && ["rectangle", "text", "image", "line"].includes(shapeType);

  const getInitialColor = () => {
    if (!isStrokeable) return "#000000";
    if (shapeType === "rectangle" || shapeType === "image") return shape.borderColor || "#000000";
    if (shapeType === "text") return shape.strokeColor || "#000000";
    if (shapeType === "line") return shape.color || "#000000";
    return "#000000";
  };
  const getInitialWidth = () => {
    if (!isStrokeable) return 1;
    if (shapeType === "rectangle" || shapeType === "image") return shape.borderWidth || 1;
    if (shapeType === "text") return shape.strokeWidth || 1;
    if (shapeType === "line") return shape.width || 1;
    return 1;
  };

  const [isStrokeOpen, setIsStrokeOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [color, setColor] = useState(getInitialColor());
  const [width, setWidth] = useState(getInitialWidth());
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const pickerPosRef = useRef({ top: 0, left: 0 });
  const [dragging, setDragging] = useState(false);
  const dragData = useRef({ initialMouse: { x: 0, y: 0 }, initialPicker: { top: 0, left: 0 } });
  const colorBtnRef = useRef(null);
  const pickerRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    setColor(getInitialColor());
    setWidth(getInitialWidth());
    // eslint-disable-next-line
  }, [selectedShapes, drawnRectangles]);

  // Close picker on outside click
  useEffect(() => {
    if (!colorPickerOpen) return;
    const handleClick = (e) => {
      if (
        colorBtnRef.current &&
        !colorBtnRef.current.contains(e.target) &&
        !document.getElementById("floating-stroke-picker")?.contains(e.target)
      ) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [colorPickerOpen]);

  // Drag logic for color picker
  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      const { initialMouse, initialPicker } = dragData.current;
      const newTop = initialPicker.top + (e.clientY - initialMouse.y);
      const newLeft = initialPicker.left + (e.clientX - initialMouse.x);
      pickerPosRef.current = { top: newTop, left: newLeft };
      if (pickerRef.current) {
        pickerRef.current.style.top = `${newTop}px`;
        pickerRef.current.style.left = `${newLeft}px`;
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Update shape stroke color
  const handleColorChange = (newColor) => {
    setColor(newColor);
    // Debounce the update to the main state
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (!isStrokeable) return;
      const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
      if (shapeIdx === -1) return;
      let newShape = { ...drawnRectangles[shapeIdx] };
      if (shapeType === "rectangle" || shapeType === "image") newShape.borderColor = newColor;
      if (shapeType === "text") newShape.strokeColor = newColor;
      if (shapeType === "line") newShape.color = newColor;
      const newRects = [...drawnRectangles];
      newRects[shapeIdx] = newShape;
      setDrawnRectangles(newRects);
    }, 100); // 100ms debounce
  };

  // Update shape stroke width
  const handleWidthChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 1;
    val = Math.max(1, val);
    setWidth(val);
    if (!isStrokeable) return;
    const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    let newShape = { ...drawnRectangles[shapeIdx] };
    if (shapeType === "rectangle" || shapeType === "image") newShape.borderWidth = val;
    if (shapeType === "text") newShape.strokeWidth = val;
    if (shapeType === "line") newShape.width = val;
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
      pickerPosRef.current = newPos;
    }
    setColorPickerOpen(!colorPickerOpen);
  };

  // Start dragging (only from grip)
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      dragData.current = {
        initialMouse: { x: e.clientX, y: e.clientY },
        initialPicker: { top: pickerPos.top, left: pickerPos.left }
      };
      setDragging(true);
    }
  };

  // Floating color picker portal
  const colorPickerPortal = colorPickerOpen
    ? createPortal(
        <div
          id="floating-stroke-picker"
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
            cursor: dragging ? "move" : "default"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              userSelect: "none",
              pointerEvents: "none"
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
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                border: "1px solid #ccc",
                pointerEvents: "auto"
              }}
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); handleDragStart(e); }}
              title="Drag picker"
            >
              <svg width="14" height="14" viewBox="0 0 16 16"><circle cx="4" cy="4" r="1.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/></svg>
            </div>
            <span style={{ fontWeight: 600, flex: 1, pointerEvents: "auto" }}>Stroke Color</span>
            <button
              style={{
                border: "none",
                background: "none",
                fontSize: 18,
                cursor: "pointer",
                marginLeft: 8,
                pointerEvents: "auto"
              }}
              onClick={e => { e.stopPropagation(); setColorPickerOpen(false); }}
              aria-label="Close stroke color picker"
              tabIndex={0}
            >
              ×
            </button>
          </div>
          <HexColorPicker color={color} onChange={handleColorChange} />
          <div className="picker-inputs">
            <select className="picker-mode" disabled>
              <option>Hex</option>
            </select>
            <HexColorInput
              color={color}
              onChange={handleColorChange}
              prefixed
              className="hex-input"
            />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsStrokeOpen(!isStrokeOpen)}
      >
        Stroke
        <button
          className="expand-collapse-btn"
          onClick={() => setIsStrokeOpen(!isStrokeOpen)}
          aria-label={isStrokeOpen ? "Add Stroke" : "Remove Stroke"}
        >
          {isStrokeOpen ? "-" : "+"}
        </button>
      </div>

      {isStrokeOpen && (
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
              aria-label="Select stroke color"
              onClick={handleColorBtnClick}
              disabled={!isStrokeable}
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
                value={width}
                onChange={handleWidthChange}
                min={1}
                disabled={!isStrokeable}
              />
              <div>px</div>
            </div>
          </div>
        </div>
      )}

      {/* Thin grey line divider */}
      {!isStrokeOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Stroke;
