import "../../RightPanel.css";
import "../Effects/Effects.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import MiniColorPicker from "./color/MiniColorPicker"; 
import ColorPanel from "./color/color"; 

const Fill = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let shape = null;
  let shapeType = "";
  if (isSingle) {
    shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) shapeType = shape.type;
  }
  const isFillable =
    isSingle && (shapeType === "rectangle" || shapeType === "text");

  const getInitialColor = useCallback(() => {
    if (!isFillable) return "#D9D9D9"; // Default grey if no fillable shape selected
    if (shapeType === "rectangle") return shape.backgroundColor || "#D9D9D9";
    if (shapeType === "text") return shape.color || "#000000";
    return "#D9D9D9";
  }, [isFillable, shapeType, shape]);

  const getInitialOpacity = useCallback(() => {
    if (!isFillable) return 100;
    return shape.opacity !== undefined ? Math.round(shape.opacity * 100) : 100;
  }, [isFillable, shape]);

  const [isFillOpen, setIsFillOpen] = useState(false);
  const [colorPanel, setColorPanel] = useState(false);
  const [coords, setCoords] = useState(null);
  const PanelInputRef = useRef(null);
  const [color, setColor] = useState(getInitialColor());
  const [opacity, setOpacity] = useState(getInitialOpacity());

  // Update color and opacity when selected shape changes
  useEffect(() => {
    setColor(getInitialColor());
    setOpacity(getInitialOpacity());
  }, [getInitialColor, getInitialOpacity, selectedShapes]);

  // Create a combined color object for MiniColorPicker including opacity
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

  // Positioning logic
  useEffect(() => {
    if (colorPanel && PanelInputRef.current) {
      const rect = PanelInputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY - 350,
        left: rect.left + window.scrollX - 250 - 40,
      });
    } else if (!colorPanel) {
      setCoords(null);
    }
  }, [colorPanel]);

  // Outside click to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorPanel &&
        PanelInputRef.current &&
        !PanelInputRef.current.contains(e.target) &&
        !document.getElementById("floating-color-picker")?.contains(e.target)
      ) {
        setColorPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorPanel]);

  const handleColorUpdate = useCallback(
    (newColor) => {
      const hexColor = typeof newColor === "string" ? newColor : newColor.hex;
      setColor(hexColor);

      // Update opacity if provided by the color picker (e.g., from alpha slider)
      if (newColor.rgb?.a !== undefined) {
        setOpacity(Math.round(newColor.rgb.a * 100));
      }

      if (!isFillable) return;
      const shapeIdx = drawnRectangles.findIndex(
        (s) => s.id === selectedShapes[0]
      );
      if (shapeIdx === -1) return;

      const newShape = { ...drawnRectangles[shapeIdx] };
      if (shapeType === "rectangle") newShape.backgroundColor = hexColor;
      if (shapeType === "text") newShape.color = hexColor;
      if (newColor.rgb?.a !== undefined) {
        newShape.opacity = newColor.rgb.a;
      }

      const newRects = [...drawnRectangles];
      newRects[shapeIdx] = newShape;
      setDrawnRectangles(newRects);
    },
    [isFillable, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType]
  );

  const handleOpacityUpdate = useCallback(
    (val) => {
      let newOpacity = parseInt(val);
      if (isNaN(newOpacity)) newOpacity = 100;
      newOpacity = Math.max(0, Math.min(100, newOpacity));
      setOpacity(newOpacity);

      if (!isFillable) return;
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
    [isFillable, selectedShapes, drawnRectangles, setDrawnRectangles]
  );

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
          <div className="pos-box-fill" ref={PanelInputRef}style={{ background: "#ffffff", border: "2px solid #e0e0e0"}}>
            <button
              style={{
                width: "22px",
                height: "22px",
                border: "1.5px solid #ddd",
                borderRadius: "6px",
                background: color,
                display: "inline-block",
                padding: 0,
              }}
              aria-label="Select color"
              onClick={() => setColorPanel(!colorPanel)}
              disabled={!isFillable}
            />
            {colorPanel && coords && (
              <ColorPanel
                top={coords.top}
                left={coords.left}
                setColorPickerOpen={setColorPanel}
                color={color}
                opacity={opacity}
                setColor={handleColorUpdate}
                setOpacity={handleOpacityUpdate}
              >
                <MiniColorPicker
                  color={currentFullColor}
                  onChange={handleColorUpdate}
                />
                {/* Optional Opacity Slider */}
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
                disabled={!isFillable}
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
                  onChange={(e) => handleOpacityUpdate(Number(e.target.value))}
                  style={{ width: "40px", textAlign: "center" }}
                  disabled={!isFillable}  
                />
                <div>%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thin Grey Divider */}
      {!isFillOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Fill;
