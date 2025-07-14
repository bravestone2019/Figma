
import "../../RightPanel.css";
import "../Effects/Effects.css";
import "../Layout/Layout.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import MiniColorPicker from "./color/MiniColorPicker";
import ColorPanel from "./color/color";
import Hide from "../../../../../assets/RightPanel/hide.png";
import Show from "../../../../../assets/RightPanel/show.png";

const DEFAULT_OPACITY = 100;
const DEFAULT_COLOR = "#D9D9D9";

const Fill = ({ selectedShapes, drawnRectangles, setDrawnRectangles, isOpen, setOpen }) => {
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
    if (!colorStr) return '#D9D9D9';
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
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
    return '#D9D9D9';
  }

  const getInitialColor = useCallback(() => {
    if (!isFillable) return "#D9D9D9"; // Default grey if no fillable shape selected
    if (shapeType === "rectangle") return parseColorToHex(shape.backgroundColor) || "#D9D9D9";
    if (shapeType === "text") return parseColorToHex(shape.color) || "#000000";
    return "#D9D9D9";
  }, [isFillable, shapeType, shape]);

  const getInitialOpacity = useCallback(() => {
    if (!isFillable) return DEFAULT_OPACITY;
    // Use fillOpacity if available, otherwise default to 1
    return shape.fillOpacity !== undefined
      ? Math.round(shape.fillOpacity * 100)
      : DEFAULT_OPACITY;
  }, [isFillable, shape]);

  const [colorPanel, setColorPanel] = useState(false);
  const [coords, setCoords] = useState(null);
  const PanelInputRef = useRef(null);
  const [color, setColor] = useState(getInitialColor());
  const [opacity, setOpacity] = useState(getInitialOpacity());
  const [isShown, setIsShown] = useState(true); // true = show icon, false = hide icon
  // const [showColor, setShowColor] = useState(null);
  const showColorRef = useRef(null);
  const initializedRef = useRef(false);

  // Reset to default when panel is minimized
  useEffect(() => {
    if (!isFillable) return;
    if (!shape) return;
    // Set color/opacity based on the shape's current values
    if (shapeType === "rectangle") {
      setColor(parseColorToHex(shape.backgroundColor) || DEFAULT_COLOR);
    } else if (shapeType === "text") {
      setColor(parseColorToHex(shape.color) || "#000000");
    }
    setOpacity(shape.fillOpacity !== undefined ? Math.round(shape.fillOpacity * 100) : DEFAULT_OPACITY);
    // eslint-disable-next-line
  }, [selectedShapes, isFillable, shapeType]);

  useEffect(() => {
    const initialColor = getInitialColor();
    const initialOpacity = getInitialOpacity();

    if (color !== initialColor) setColor(initialColor);
    if (opacity !== initialOpacity) setOpacity(initialOpacity);
    // eslint-disable-next-line
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
        top: rect.bottom + window.scrollY - 150,
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

  // Helper to convert rgb/rgba to hex
  function rgbToHex({ r, g, b }) {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  const handleColorUpdate = useCallback(
    (newColor) => {
      let hexColor = '#000000';
      if (typeof newColor === 'string' && /^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor)) {
        hexColor = newColor.toUpperCase();
      } else if (newColor.hex && /^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor.hex)) {
        hexColor = newColor.hex.toUpperCase();
      } else if (newColor.rgb) {
        hexColor = rgbToHex(newColor.rgb);
      }
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
        newShape.fillOpacity = newColor.rgb.a;
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
        fillOpacity: newOpacity / 100,
      };
      const newRects = [...drawnRectangles];
      newRects[shapeIdx] = newShape;
      setDrawnRectangles(newRects);
    },
    [isFillable, selectedShapes, drawnRectangles, setDrawnRectangles]
  );

  const handleFillToggle = () => {
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1 || !isFillable) return;

    const updatedShape = { ...drawnRectangles[shapeIdx] };
    const newRects = [...drawnRectangles];

    if (isShown) {
      // Save color
      showColorRef.current =
        shapeType === "rectangle"
          ? updatedShape.backgroundColor
          : updatedShape.color;

      // Hide fill
      if (shapeType === "rectangle")
        updatedShape.backgroundColor = "transparent";
      if (shapeType === "text") updatedShape.color = "transparent";
    } else {
      // Restore saved color
      const restoredColor =
        showColorRef.current ||
        (shapeType === "rectangle" ? DEFAULT_COLOR : "#000000");

      if (shapeType === "rectangle")
        updatedShape.backgroundColor = restoredColor;
      if (shapeType === "text") updatedShape.color = restoredColor;

      // Update color state so swatch reflects correct restored color
      setColor(restoredColor);
    }

    newRects[shapeIdx] = updatedShape;
    setDrawnRectangles(newRects);
    setIsShown((prev) => !prev);
  };

  const handleExpandCollapse = () => {
  const shapeIdx = drawnRectangles.findIndex(
    (s) => s.id === selectedShapes[0]
  );

  if (!isFillable || shapeIdx === -1) {
    setOpen((prev) => !prev);
    return;
  }

  const updatedShape = { ...drawnRectangles[shapeIdx] };
  const newRects = [...drawnRectangles];

  const isCurrentlyOpen = isOpen;

  if (isCurrentlyOpen) {
    // COLLAPSE: Make shape transparent
    if (shapeType === "rectangle") updatedShape.backgroundColor = "transparent";
    if (shapeType === "text") updatedShape.color = "transparent";
    updatedShape.fillOpacity = 1;
    setIsShown(false);
  } else {
    // EXPAND: Only set to default if shape is transparent or undefined
    let shouldSetDefault = false;
    if (shapeType === "rectangle" && (!updatedShape.backgroundColor || updatedShape.backgroundColor === "transparent")) {
      shouldSetDefault = true;
    }
    if (shapeType === "text" && (!updatedShape.color || updatedShape.color === "transparent")) {
      shouldSetDefault = true;
    }
    if (shouldSetDefault) {
      const defaultColor = shapeType === "rectangle" ? DEFAULT_COLOR : "#000000";
      if (shapeType === "rectangle") updatedShape.backgroundColor = defaultColor;
      if (shapeType === "text") updatedShape.color = defaultColor;
      updatedShape.fillOpacity = DEFAULT_OPACITY / 100;
      setColor(defaultColor);
      setOpacity(DEFAULT_OPACITY);
    } else {
      // Restore the current color/opacity
      if (shapeType === "rectangle") setColor(parseColorToHex(updatedShape.backgroundColor) || DEFAULT_COLOR);
      if (shapeType === "text") setColor(parseColorToHex(updatedShape.color) || "#000000");
      setOpacity(updatedShape.fillOpacity !== undefined ? Math.round(updatedShape.fillOpacity * 100) : DEFAULT_OPACITY);
    }
    setIsShown(true);
  }

  newRects[shapeIdx] = updatedShape;
  setDrawnRectangles(newRects);
  setOpen(!isCurrentlyOpen);
};


  return (
    <>
      <div className="right-section-title clickable">
        Fill
        <button
          className="expand-collapse-btn"
          // onClick={() => setOpen(!isOpen)}
          onClick={handleExpandCollapse}
        >
          {isOpen ? "−" : "+"}
          <span className="tooltip" style={{ left: "82%" }}>
            {isOpen ? "Remove Fill" : "Add Fill"}
          </span>
        </button>
      </div>

      {isOpen && (
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
              flex: 1,
              border: "1px solid #e0e0e0",
              filter: isShown ? "none" : "blur(0.1px)",
              opacity: isShown ? 1 : 0.4,
              pointerEvents: isShown ? "auto" : "none",
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
                flex: 1,
              }}
            >
              <input
                type="text"
                value={color.startsWith('#') ? color.substring(1).toUpperCase() : color.toUpperCase()}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  // Only allow valid hex codes (3 or 6 hex digits, no #)
                  if (/^([0-9A-Fa-f]{3}){1,2}$/.test(val)) {
                    setColor('#' + val.toUpperCase());
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
                  value={opacity}
                  min={0}
                  max={100}
                  onChange={(e) => handleOpacityUpdate(Number(e.target.value))}
                  style={{
                    width: "40px",
                    textAlign: "center",
                    fontSize: "11px",
                  }}
                  disabled={!isFillable}
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
            // ref={showColorRef}
            onClick={handleFillToggle}
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
              {isShown ? "Hide Fill" : "Show Fill"}
            </span>
          </button>
        </div>
      )}

      {/* Thin Grey Divider */}
      {!isOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Fill;
