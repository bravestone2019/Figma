import "../../RightPanel.css";
import "../Effects/Effects.css";
import "../Layout/Layout.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import MiniColorPicker from "./color/MiniColorPicker";
import ColorPanel from "./color/color";
import Hide from "../../../../../assets/RightPanel/hide.png";
import Show from "../../../../../assets/RightPanel/show.png";

const DEFAULT_COLOR = "#D9D9D9";
const DEFAULT_OPACITY = 100;

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
    if (!isFillable) return DEFAULT_COLOR;
    if (shapeType === "rectangle")
      return shape.backgroundColor || DEFAULT_COLOR;
    if (shapeType === "text") return shape.color || "#000000";
    return DEFAULT_COLOR;
  }, [isFillable, shapeType, shape]);

  const getInitialOpacity = useCallback(() => {
    if (!isFillable) return DEFAULT_OPACITY;
    return shape.opacity !== undefined
      ? Math.round(shape.opacity * 100)
      : DEFAULT_OPACITY;
  }, [isFillable, shape]);

  const [isFillOpen, setIsFillOpen] = useState(false);
  const [colorPanel, setColorPanel] = useState(false);
  const [coords, setCoords] = useState(null);
  const PanelInputRef = useRef(null);
  const [color, setColor] = useState(getInitialColor());
  const [opacity, setOpacity] = useState(getInitialOpacity());
  const [isShown, setIsShown] = useState(true); // true = show icon, false = hide icon

  // Reset to default when panel is minimized
  useEffect(() => {
    if (!isFillOpen) {
      setColor(DEFAULT_COLOR);
      setOpacity(DEFAULT_OPACITY);

      if (isFillable) {
        const shapeIdx = drawnRectangles.findIndex(
          (s) => s.id === selectedShapes[0]
        );
        if (shapeIdx !== -1) {
          const updatedShape = { ...drawnRectangles[shapeIdx] };
          if (shapeType === "rectangle")
            updatedShape.backgroundColor = DEFAULT_COLOR;
          if (shapeType === "text") updatedShape.color = DEFAULT_COLOR;
          updatedShape.opacity = DEFAULT_OPACITY / 100;

          const newRects = [...drawnRectangles];
          newRects[shapeIdx] = updatedShape;
          setDrawnRectangles(newRects);
        }
      }
    }
  }, [
    isFillOpen,
    isFillable,
    selectedShapes,
    drawnRectangles,
    setDrawnRectangles,
    shapeType,
  ]);

  useEffect(() => {
    setColor(getInitialColor());
    setOpacity(getInitialOpacity());
  }, [getInitialColor, getInitialOpacity, selectedShapes]);

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

  useEffect(() => {
    if (colorPanel && PanelInputRef.current) {
      const rect = PanelInputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY - 350,
        left: rect.left + window.scrollX - 290,
      });
    } else if (!colorPanel) {
      setCoords(null);
    }
  }, [colorPanel]);

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
        >
          {isFillOpen ? "−" : "+"}
          <span className="tooltip"
          style={{ left: "82%" }}>
            {isFillOpen ? "Remove Fill" : "Add Fill"}
          </span>
        </button>
      </div>

      {isFillOpen && (
        <div
          className="position-grid"
          style={{ alignItems: "center", marginLeft: 20 }}
        >
          <div
            className="pos-box-fill"
            ref={PanelInputRef}
            style={{
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              flex: 1,
            }}
          >
            <button
              style={{
                width: "18px",
                height: "18px",
                border: "1px solid #ddd",
                borderRadius: "5px",
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

          <button
            className="reset-size-btn"
            onClick={() => setIsShown((prev) => !prev)}
            style={{
              width: "33px",
              height: "15px",
              transform: "translateX(55%)",
              marginBottom: "-2px",
              marginLeft: "1px",
            }}
          >
            <img
              src={isShown ? Show : Hide}
              alt={isShown ? "Show" : "Hide"}
              style={{ width: 15, height: 15, marginBottom: 2 }}
            />
            <span className="tooltip" style={{ left: 2}}>
              {isShown ? "Show Fill" : "Hide Fill"}
            </span>
          </button>
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
