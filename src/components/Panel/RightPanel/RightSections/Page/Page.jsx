import "../../RightPanel.css";
import "../Effects/Effects.css";
import "../Layout/Layout.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import MiniColorPicker from "../Fill/color/MiniColorPicker";
import ColorPanel from "./PageColorPanel";
import Hide from "../../../../../assets/RightPanel/hide.png";
import Show from "../../../../../assets/RightPanel/show.png";

const DEFAULT_COLOR = "#D9D9D9";
const DEFAULT_OPACITY = 100;

const Page = ({ selectedShapes, drawnRectangles, setDrawnRectangles, backgroundColor, setBackgroundColor, backgroundOpacity, setBackgroundOpacity }) => {
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let shape = null;
  let shapeType = "";
  if (isSingle) {
    shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) shapeType = shape.type;
  }
  const isFillable =
    isSingle && (shapeType === "rectangle" || shapeType === "text");

  // Helper to convert rgb/rgba string to hex
  function parseColorToHex(colorStr) {
    if (!colorStr) return DEFAULT_COLOR;
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(colorStr)) {
      return colorStr.toUpperCase();
    }
    // Match rgb or rgba
    const match = colorStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
    return DEFAULT_COLOR;
  }

  const getInitialColor = useCallback(() => {
    if (!isFillable) return DEFAULT_COLOR;
    if (shapeType === "rectangle")
      return parseColorToHex(shape.backgroundColor) || DEFAULT_COLOR;
    if (shapeType === "text") return parseColorToHex(shape.color) || "#000000";
    return DEFAULT_COLOR;
  }, [isFillable, shapeType, shape]);

  const getInitialOpacity = useCallback(() => {
    if (!isFillable) return DEFAULT_OPACITY;
    return shape.opacity !== undefined
      ? Math.round(shape.opacity * 100)
      : DEFAULT_OPACITY;
  }, [isFillable, shape]);

  const [colorPanel, setColorPanel] = useState(false);
  // Store panel position persistently
  const [coords, setCoords] = useState(null);
  const PanelInputRef = useRef(null);
  const [color, setColor] = useState(() => {
    if (!selectedShapes || selectedShapes.length === 0) {
      return backgroundColor || DEFAULT_COLOR;
    }
    return getInitialColor();
  });
  const [opacity, setOpacity] = useState(() => {
    if (!selectedShapes || selectedShapes.length === 0) {
      return backgroundOpacity !== undefined ? backgroundOpacity : DEFAULT_OPACITY;
    }
    return getInitialOpacity();
  });
  const [isShown, setIsShown] = useState(true); // true = show icon, false = hide icon

  // Reset to default when panel is minimized
  useEffect(() => {
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
  }, [
    isFillable,
    selectedShapes,
    drawnRectangles,
    setDrawnRectangles,
    shapeType,
  ]);

  useEffect(() => {
    if (!selectedShapes || selectedShapes.length === 0) {
      setColor(backgroundColor || DEFAULT_COLOR);
      // Remove setOpacity here, let it be controlled by prop
    } else {
      setColor(getInitialColor());
      setOpacity(getInitialOpacity());
    }
  }, [backgroundColor, backgroundOpacity, getInitialColor, getInitialOpacity, selectedShapes]);

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

  // Track previous open state to detect open transitions
  const prevColorPanelRef = useRef(false);
  useEffect(() => {
    // Only set position when opening (transition from closed to open)
    if (colorPanel && !prevColorPanelRef.current && !coords && PanelInputRef.current) {
      const rect = PanelInputRef.current.getBoundingClientRect();
      const rawTop = rect.bottom + window.scrollY - 350;
      const rawLeft = rect.left + window.scrollX - 290;
      const clampedTop = Math.max(10, rawTop);
      const clampedLeft = Math.max(10, rawLeft);
      setCoords({
        top: clampedTop,
        left: clampedLeft,
      });
    }
    prevColorPanelRef.current = colorPanel;
  }, [colorPanel, coords]);

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

  // Helper to convert rgb/rgba to hex
  function rgbToHex({ r, g, b }) {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  const handleColorUpdate = useCallback(
    (newColor) => {
      let hexColor = "#000000";
      if (
        typeof newColor === "string" &&
        /^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor)
      ) {
        hexColor = newColor.toUpperCase();
      } else if (
        newColor.hex &&
        /^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor.hex)
      ) {
        hexColor = newColor.hex.toUpperCase();
      } else if (newColor.rgb) {
        hexColor = rgbToHex(newColor.rgb);
      }
      setColor(hexColor);

      if (!selectedShapes || selectedShapes.length === 0) {
        setBackgroundColor(hexColor);
        return;
      }

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
    [isFillable, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType, setBackgroundColor]
  );

  const handleOpacityUpdate = useCallback(
    (val) => {
      let newOpacity = parseInt(val);
      if (isNaN(newOpacity)) newOpacity = 100;
      newOpacity = Math.max(0, Math.min(100, newOpacity));
      if (!selectedShapes || selectedShapes.length === 0) {
        setBackgroundOpacity(newOpacity);
        return;
      }
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
    [isFillable, selectedShapes, drawnRectangles, setDrawnRectangles, setBackgroundOpacity]
  );

  return (
    <>
      <div className="right-section-title clickable">Page</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 15,
          marginRight: 5,
          gap: 8,
        }}
      >
        <div
          className="pos-box-fill"
          ref={PanelInputRef}
          style={{
            border: "1px solid #e0e0e0",
            flex: 1,
            filter: isShown ? "none" : "blur(0.1px)",
            opacity: isShown ? 1 : 0.4,
            pointerEvents: isShown ? "auto" : "none"
          }}
        >
          <button
            style={{
              width: "17px",
              height: "17px",
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              background: color,
              display: "inline-block",
              padding: 0,
              zIndex: 10,
            }}
            onClick={() => setColorPanel(!colorPanel)}
          />
          {colorPanel && coords && (
            <ColorPanel
              top={coords.top}
              left={coords.left}
              setColorPickerOpen={setColorPanel}
              setPanelCoords={setCoords} // Pass setter for drag
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
              flex: 1,
            }}
          >
            <input
              type="text"
              value={
                color.startsWith("#")
                  ? color.substring(1).toUpperCase()
                  : color.toUpperCase()
              }
              onChange={(e) => {
                let val = e.target.value.trim();
                // Only allow valid hex codes (3 or 6 hex digits, no #)
                if (/^([0-9A-Fa-f]{3}){1,2}$/.test(val)) {
                  setColor("#" + val.toUpperCase());
                }
              }}
              style={{
                width: "70px",
                padding: "2px 0",
                fontSize: "11px",
                textAlign: "center",
                color: "#333",
                marginLeft: -6,
              }}
              disabled={!isFillable}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <input
                type="number"
                value={!selectedShapes || selectedShapes.length === 0 ? backgroundOpacity : opacity}
                min={0}
                max={100}
                onChange={(e) => handleOpacityUpdate(Number(e.target.value))}
                style={{
                  width: "40px",
                  textAlign: "center",
                  fontSize: "11px",
                }}
                disabled={false}
              />
              <div
                style={{
                  marginLeft: -8,
                  zIndex: 10,
                  fontSize: "12px",
                  color: "#666",
                  background: "none",
                }}
              >
                %
              </div>
            </div>
          </div>
        </div>
        <button
          className="reset-size-btn"
          onClick={() => setIsShown((prev) => !prev)}
          style={{
            width: "33px",
            height: "15px",
            marginBottom: "-2px",
            marginRight: -3,
          }}
        >
          <img
            src={isShown ? Show : Hide}
            alt={isShown ? "Show" : "Hide"}
            style={{ width: 15, height: 15, marginBottom: 2 }}
          />
          <span className="tooltip" style={{ left: 2 }}>
            {isShown ? "Show Fill" : "Hide Fill"}
          </span>
        </button>
      </div>

      {/* Thin Grey Divider */}
      <div className="section-divider" />
    </>
  );
};

export default Page;
