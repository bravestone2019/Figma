import "../../RightPanel.css";
import "../Effects/Effects.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ColorPanel from "./strokePanel";
import StrokeBorder from "./strokeBorder";
import MiniColorPicker from "../Fill/color/MiniColorPicker";
import All from "../../../../../assets/RightPanel/border.png";
import Left from "../../../../../assets/RightPanel/border_left.png";
import Right from "../../../../../assets/RightPanel/border_right.png";
import Bottom from "../../../../../assets/RightPanel/bottom_border.png";
import Top from "../../../../../assets/RightPanel/top_border.png";
import Weight from "../../../../../assets/RightPanel/weight.png";

const DEFAULT_STROKE_COLOR = "#000000";
const DEFAULT_STROKE_OPACITY = 100;
const DEFAULT_STROKE_WIDTH = 1;

const borderIcons = {
  all: All,
  top: Top,
  bottom: Bottom,
  left: Left,
  right: Right,
};

const Stroke = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let shape = null;
  let shapeType = "";
  if (isSingle) {
    shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) shapeType = shape.type;
  }

  const isStrokeable =
    isSingle && ["rectangle", "text", "image", "line"].includes(shapeType);

  const getInitialColor = useCallback(() => {
    if (!isStrokeable) return "#000000";
    if (shapeType === "rectangle" || shapeType === "image")
      return shape.borderColor || "#000000";
    if (shapeType === "text") return shape.strokeColor || "#000000";
    if (shapeType === "line") return shape.color || "#000000";
    return "#000000";
  }, [isStrokeable, shapeType, shape]);

  const getInitialOpacity = useCallback(() => {
    if (!isStrokeable) return 100;
    return shape.strokeOpacity !== undefined
      ? Math.round(shape.strokeOpacity * 100)
      : 100;
  }, [isStrokeable, shape]);

  const [isStrokeOpen, setIsStrokeOpen] = useState(false);
  const [colorPanelOpen, setColorPanelOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const panelInputRef = useRef(null);
  const [color, setColor] = useState(getInitialColor());
  const [opacity, setOpacity] = useState(getInitialOpacity());

  const [strokeWidth, setStrokeWidth] = useState(
    isStrokeable && shape?.strokeWidth !== undefined ? shape.strokeWidth : 1
  );

  const [showBorderPanel, setShowBorderPanel] = useState(false);
  const [selectedBorderSide, setSelectedBorderSide] = useState("all");
  const borderRef = useRef(null);
  const borderDropdownRef = useRef(null);
  const [borderPanelCoords, setBorderPanelCoords] = useState(null);

  useEffect(() => {
    setColor(getInitialColor());
    setOpacity(getInitialOpacity());
  }, [getInitialColor, getInitialOpacity, selectedShapes]);

  useEffect(() => {
    if (colorPanelOpen && panelInputRef.current) {
      const rect = panelInputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY - 350,
        left: rect.left + window.scrollX - 250 - 40,
      });
    } else if (!colorPanelOpen) {
      setCoords(null);
    }
  }, [colorPanelOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorPanelOpen &&
        panelInputRef.current &&
        !panelInputRef.current.contains(e.target) &&
        !document.getElementById("floating-color-picker")?.contains(e.target)
      ) {
        setColorPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorPanelOpen]);

  // Sync strokeWidth when selection changes
  useEffect(() => {
    if (isStrokeable && shape?.strokeWidth !== undefined) {
      setStrokeWidth(shape.strokeWidth);
    }
  }, [isStrokeable, shape]);

  // On click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showBorderPanel &&
        borderRef.current &&
        !borderRef.current.contains(e.target) &&
        !borderDropdownRef.current?.contains(e.target)
      ) {
        setShowBorderPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBorderPanel]);

  // Positioning
  useEffect(() => {
    if (showBorderPanel && borderRef.current) {
      const rect = borderRef.current.getBoundingClientRect();
      setBorderPanelCoords({
        top: rect.bottom + window.scrollY - 200,
        left: rect.left + window.scrollX - 30 - 10,
      });
    }
  }, [showBorderPanel]);

  useEffect(() => {
    if (!isStrokeOpen) {
      setColor(DEFAULT_STROKE_COLOR);
      setOpacity(DEFAULT_STROKE_OPACITY);
      setStrokeWidth(DEFAULT_STROKE_WIDTH);

      if (isStrokeable) {
        const shapeIdx = drawnRectangles.findIndex(
          (s) => s.id === selectedShapes[0]
        );
        if (shapeIdx !== -1) {
          const newShape = { ...drawnRectangles[shapeIdx] };

          if (shapeType === "rectangle" || shapeType === "image")
            newShape.borderColor = DEFAULT_STROKE_COLOR;
          if (shapeType === "text") newShape.strokeColor = DEFAULT_STROKE_COLOR;
          if (shapeType === "line") newShape.color = DEFAULT_STROKE_COLOR;

          newShape.strokeOpacity = DEFAULT_STROKE_OPACITY / 100;
          newShape.strokeWidth = DEFAULT_STROKE_WIDTH;

          const newRects = [...drawnRectangles];
          newRects[shapeIdx] = newShape;
          setDrawnRectangles(newRects);
        }
      }
    }
  }, [
    isStrokeOpen,
    isStrokeable,
    selectedShapes,
    drawnRectangles,
    setDrawnRectangles,
    shapeType,
  ]);

  const handleColorUpdate = useCallback(
    (newColor) => {
      const hexColor = typeof newColor === "string" ? newColor : newColor.hex;
      setColor(hexColor);

      if (newColor.rgb?.a !== undefined) {
        setOpacity(Math.round(newColor.rgb.a * 100));
      }

      if (!isStrokeable) return;
      const shapeIdx = drawnRectangles.findIndex(
        (s) => s.id === selectedShapes[0]
      );
      if (shapeIdx === -1) return;

      const newShape = { ...drawnRectangles[shapeIdx] };
      if (shapeType === "rectangle" || shapeType === "image")
        newShape.borderColor = hexColor;
      if (shapeType === "text") newShape.strokeColor = hexColor;
      if (shapeType === "line") newShape.color = hexColor;

      if (newColor.rgb?.a !== undefined) {
        newShape.strokeOpacity = newColor.rgb.a;
      }

      const newRects = [...drawnRectangles];
      newRects[shapeIdx] = newShape;
      setDrawnRectangles(newRects);
    },
    [
      isStrokeable,
      selectedShapes,
      drawnRectangles,
      setDrawnRectangles,
      shapeType,
    ]
  );

  const handleOpacityUpdate = useCallback(
    (val) => {
      let newOpacity = parseInt(val);
      if (isNaN(newOpacity)) newOpacity = 100;
      newOpacity = Math.max(0, Math.min(100, newOpacity));
      setOpacity(newOpacity);

      if (!isStrokeable) return;
      const shapeIdx = drawnRectangles.findIndex(
        (s) => s.id === selectedShapes[0]
      );
      if (shapeIdx === -1) return;

      const newShape = {
        ...drawnRectangles[shapeIdx],
        opacity: newOpacity / 100,
      };
      const newRects = [...drawnRectangles];
      newRects[shapeIdx] = newShape;
      setDrawnRectangles(newRects);
    },
    [isStrokeable, selectedShapes, drawnRectangles, setDrawnRectangles]
  );

  const handleStrokeWidthChange = (e) => {
    let newWidth = parseInt(e.target.value);
    if (isNaN(newWidth) || newWidth < 1) newWidth = 1;
    setStrokeWidth(newWidth);

    if (!isStrokeable) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;

    const updated = [...drawnRectangles];
    updated[shapeIdx] = {
      ...updated[shapeIdx],
      strokeWidth: newWidth,
    };
    setDrawnRectangles(updated);
  };

  const currentFullColor = useMemo(() => {
    const hexToRgb = (hex) => {
      let r = 0,
        g = 0,
        b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return { r, g, b };
    };
    return { ...hexToRgb(color), a: opacity / 100 };
  }, [color, opacity]);

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
          aria-label={isStrokeOpen ? "Collapse Stroke" : "Expand Stroke"}
        >
          {isStrokeOpen ? "−" : "+"}
        </button>
      </div>

      {isStrokeOpen && (
        <div className="position-grid">
          <div style={{ marginBottom: "-10px" }}>
            <div
              className="pos-box-fill"
              ref={panelInputRef}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "none",
                border: "2px solid #e0e0e0",
                width: "100%",
                height: "auto",
                padding: "6px 10px",
                margin: "5px 0 20px -5px",
                gap: "8px",
              }}
            >
              <button
                style={{
                  width: "20px",
                  height: "20px",
                  border: "1.5px solid #ddd",
                  borderRadius: "6px",
                  background: color,
                  display: "inline-block",
                  padding: 0,
                }}
                aria-label="Select stroke color"
                onClick={() => setColorPanelOpen(!colorPanelOpen)}
                disabled={!isStrokeable}
              />
              {colorPanelOpen && coords && (
                <ColorPanel
                  top={coords.top}
                  left={coords.left}
                  setColorPickerOpen={setColorPanelOpen}
                  color={color}
                  opacity={opacity}
                  setColor={handleColorUpdate}
                  setOpacity={handleOpacityUpdate}
                >
                  <MiniColorPicker
                    color={currentFullColor}
                    onChange={handleColorUpdate}
                  />
                </ColorPanel>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flex: 1,
                }}
              >
                <input
                  type="text"
                  value={(color || "#000000").replace("#", "").toUpperCase()}
                  onChange={(e) => setColor("#" + e.target.value)}
                  style={{
                    width: "50px",
                    padding: "2px 5px",
                    fontSize: "12px",
                    textAlign: "center",
                    color: "#333",
                  }}
                  disabled={!isStrokeable}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flex: 1,
                    marginLeft: "2px",
                  }}
                >
                  <input
                    type="number"
                    value={opacity}
                    min={0}
                    max={100}
                    onChange={(e) =>
                      handleOpacityUpdate(Number(e.target.value))
                    }
                    style={{ width: "40px", textAlign: "center" }}
                    disabled={!isStrokeable}
                  />
                  <div>%</div>
                </div>
              </div>
            </div>

            <div
              className="position-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                width: "50%",
                height: "75%",
                marginLeft: "35px",
                marginTop: "-15px",
              }}
            >
              <div
                className="pos-box"
                style={{
                  width: "100%",
                  height: "10%",
                  gap: "25px",
                  marginLeft: "-38px",
                  background: "transparent",
                  border: "2px solid #e0e0e0",
                  padding: "11px 12px",
                }}
              >
                <img
                  src={Weight}
                  alt={Weight}
                  style={{ width: "12px", height: "12px" }}
                />
                <input
                  type="number"
                  min={1}
                  value={strokeWidth}
                  onChange={handleStrokeWidthChange}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                  }}
                  disabled={!isStrokeable}
                />
                <span className="tooltip" style={{ bottom : "35px"}}>Stroke weight</span>
              </div>

              <div
                className="pos-box"
                ref={borderRef}
                onClick={() => setShowBorderPanel((prev) => !prev)}
                style={{
                  width: "90%",
                  height: "10%",
                  marginRight: "30px",
                  background: "transparent",
                  border: "2px solid #e0e0e0",
                  padding: "12px 12px",
                  position: "relative",
                }}
              >
                <img
                  src={borderIcons[selectedBorderSide]}
                  alt={selectedBorderSide}
                  style={{ width: "12px", height: "12px" }}
                />
                <input
                  type="text"
                  value={
                    selectedBorderSide.charAt(0).toUpperCase() +
                    selectedBorderSide.slice(1)
                  }
                  readOnly
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    textTransform: "capitalize",
                  }}
                />
                <span className="tooltip" style={{ bottom : "35px"}}>Individual strokes</span>
              </div>
              {showBorderPanel && borderPanelCoords && (
                <StrokeBorder
                  top={borderPanelCoords.top}
                  left={borderPanelCoords.left}
                  onClose={() => setShowBorderPanel(false)}
                  onSelect={setSelectedBorderSide}
                  selectedKey={selectedBorderSide}
                  dropdownRef={borderDropdownRef}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thin Grey Divider */}
      {!isStrokeOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Stroke;
