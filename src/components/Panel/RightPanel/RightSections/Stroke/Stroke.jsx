
import "../../RightPanel.css";
import "../Effects/Effects.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ColorPanel from "./StrokePanel/strokePanel";
import StrokeBorder from "./StrokePanel/strokeBorder";
import StrokePositionPanel from "./StrokePanel/StrokeSelection";
import MiniColorPicker from "../Fill/color/MiniColorPicker";

import All from "../../../../../assets/RightPanel/border.png";
import Left from "../../../../../assets/RightPanel/border_left.png";
import Right from "../../../../../assets/RightPanel/border_right.png";
import Bottom from "../../../../../assets/RightPanel/bottom_border.png";
import Top from "../../../../../assets/RightPanel/top_border.png";
import Weight from "../../../../../assets/RightPanel/weight.png";
import Hide from "../../../../../assets/RightPanel/hide.png";
import Show from "../../../../../assets/RightPanel/show.png";
import Dropdown from "../../../../../assets/down.png";

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

const Stroke = ({
  selectedShapes,
  drawnRectangles,
  setDrawnRectangles,
  isOpen,
  setOpen,
}) => {
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
    if (!isStrokeable) return DEFAULT_STROKE_COLOR;
    if (shapeType === "rectangle" || shapeType === "image")
      return shape.borderColor || DEFAULT_STROKE_COLOR;
    if (shapeType === "text") return shape.strokeColor || DEFAULT_STROKE_COLOR;
    if (shapeType === "line") return shape.color || DEFAULT_STROKE_COLOR;
    return DEFAULT_STROKE_COLOR;
  }, [isStrokeable, shapeType, shape]);

  const getInitialOpacity = useCallback(() => {
    if (!isStrokeable) return DEFAULT_STROKE_OPACITY;
    return shape.strokeOpacity !== undefined
      ? Math.round(shape.strokeOpacity * 100)
      : DEFAULT_STROKE_OPACITY;
  }, [isStrokeable, shape]);

  const getInitialStrokeWidth = useCallback(() => {
    if (!isStrokeable) return DEFAULT_STROKE_WIDTH;
    return shape.strokeWidth !== undefined
      ? shape.strokeWidth
      : DEFAULT_STROKE_WIDTH;
  }, [isStrokeable, shape]);

  const [colorPanelOpen, setColorPanelOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const panelInputRef = useRef(null);
  const [color, setColor] = useState(getInitialColor());
  const [opacity, setOpacity] = useState(getInitialOpacity());
  const [strokeWidth, setStrokeWidth] = useState(1);

  const [showBorderPanel, setShowBorderPanel] = useState(false);
  const [selectedBorderSide, setSelectedBorderSide] = useState("all");
  const borderRef = useRef(null);
  const borderDropdownRef = useRef(null);
  const [borderPanelCoords, setBorderPanelCoords] = useState(null);

  const [strokePosition, setStrokePosition] = useState("inside");
  const [strokePanelOpen, setStrokePanelOpen] = useState(false);
  const strokeDropdownRef = useRef(null);
  const [strokePanelCoords, setStrokePanelCoords] = useState(null);

  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    setColor(getInitialColor());
    setOpacity(getInitialOpacity());
    setStrokeWidth(getInitialStrokeWidth());
  }, [
    getInitialColor,
    getInitialOpacity,
    getInitialStrokeWidth,
    selectedShapes,
  ]);

  // Color Panel Positioning
  useEffect(() => {
    if (colorPanelOpen && panelInputRef.current) {
      const rect = panelInputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY - 250,
        left: rect.left + window.scrollX - 250 - 40,
      });
    } else if (!colorPanelOpen) {
      setCoords(null);
    }
  }, [colorPanelOpen]);

  // Color Panel Click Outside the Panel
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

  // Border Panel Positioning
  useEffect(() => {
    if (showBorderPanel && borderRef.current) {
      const rect = borderRef.current.getBoundingClientRect();
      setBorderPanelCoords({
        top: rect.bottom + window.scrollY - 100,
        left: rect.left + window.scrollX - 30 - 50,
      });
    }
  }, [showBorderPanel]);

  // Border Panel lick Outside the Panel
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

  // Sync strokeWidth when selection changes
  // useEffect(() => {
  //   if (isStrokeable && shape?.strokeWidth !== undefined) {
  //     setStrokeWidth(shape.strokeWidth);
  //   }
  // }, [isStrokeable, shape]);

  useEffect(() => {
    if (strokePanelOpen && borderRef.current) {
      const rect = borderRef.current.getBoundingClientRect();
      setStrokePanelCoords({
        top: rect.bottom + window.scrollY - 60,
        left: rect.left + window.scrollX - 50 - 155,
      });
    }
  }, [strokePanelOpen]);

  useEffect(() => {
    if (!isOpen) {
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
    isOpen,
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

  // const handleStrokeWidthChange = (e) => {
  //   let newWidth = parseInt(e.target.value);
  //   if (isNaN(newWidth) || newWidth < 1) newWidth = 1;
  //   setStrokeWidth(newWidth);

  //   // Only update shapes if a strokeable shape is selected
  //   if (isStrokeable) {
  //     const shapeIdx = drawnRectangles.findIndex(
  //       (s) => s.id === selectedShapes[0]
  //     );
  //     if (shapeIdx !== -1) {
  //       const updated = [...drawnRectangles];
  //       const shape = { ...updated[shapeIdx] };
  //       if (shape.type === "rectangle" || shape.type === "image") {
  //         shape.borderWidth = newWidth;
  //       } else if (shape.type === "line") {
  //         shape.width = newWidth;
  //       } else if (shape.type === "text") {
  //         shape.width = newWidth;
  //       }
  //       updated[shapeIdx] = shape;
  //       setDrawnRectangles(updated);
  //     }
  //   }
  // };

  const handleStrokeWidthChange = (e) => {
    let newWidth = parseInt(e.target.value);
    if (isNaN(newWidth) || newWidth < 1) newWidth = 1;
    setStrokeWidth(newWidth);

    if (!isStrokeable) return;

    const shapeIdx = drawnRectangles.findIndex((s) => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;

    const updated = [...drawnRectangles];
    const shape = { ...updated[shapeIdx] };

    shape.strokeWidth = newWidth;

    // Optional: Update borderWidth for rectangle/image
    if (shape.type === "rectangle" || shape.type === "image") {
      shape.borderWidth = newWidth;
    }

    updated[shapeIdx] = shape;
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
      <div className="right-section-title clickable">
        Stroke
        <button
          className="expand-collapse-btn"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? "−" : "+"}
          <span className="tooltip" style={{ left: "80%" }}>
            {isOpen ? "Remove Stroke" : "Add Stroke"}
          </span>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Top FLEX ROW */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "flex-start",
              marginLeft: 15,
              marginRight: 5,
              gap: 8,
            }}
          >
            <div
              className="pos-box-fill"
              ref={panelInputRef}
              style={{
                border: "1px solid #e0e0e0",
                flex: 1,
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
                  flex: 1,
                }}
              >
                <input
                  type="text"
                  value={(color || "#000000").replace("#", "").toUpperCase()}
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
                  disabled={!isStrokeable}
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
                    onChange={(e) =>
                      handleOpacityUpdate(Number(e.target.value))
                    }
                    style={{
                      width: "40px",
                      textAlign: "center",
                      fontSize: "11px",
                    }}
                    disabled={!isStrokeable}
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
                marginBottom: "-3px",
                marginRight: -3,
              }}
            >
              <img
                src={isShown ? Show : Hide}
                alt={isShown ? "Show" : "Hide"}
                style={{ width: 15, height: 15, marginBottom: 2 }}
              />
              <span className="tooltip" style={{ left: -1 }}>
                {isShown ? "Show Stroke" : "Hide Stroke"}
              </span>
            </button>
          </div>

          {/* BOTTOM GRID BLOCK */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              gap: "2px",
              marginLeft: "15px",
              alignsItems: "center",
            }}
          >
            {/* Stroke Selection Dropdown */}
            <div
              ref={borderRef}
              onClick={() => setStrokePanelOpen(true)}
              style={{
                flex: 1,
                display: "flex",
                background: "transparent",
                border: "1px solid #e0e0e0",
                padding: "7px 10px",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 6,
                marginRight: "28%",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {strokePosition.charAt(0).toUpperCase() +
                  strokePosition.slice(1)}
              </span>
              <img
                src={Dropdown}
                alt={Dropdown}
                style={{
                  width: "12px",
                  height: "12px",
                  marginLeft: "5px",
                }}
              />
              <span className="tooltip" style={{ bottom: "35px" }}>
                Stroke selection
              </span>
            </div>
            {strokePanelOpen && strokePanelCoords && (
              <StrokePositionPanel
                top={strokePanelCoords.top}
                left={strokePanelCoords.left}
                onClose={() => setStrokePanelOpen(false)}
                onSelect={setStrokePosition}
                selectedValue={strokePosition}
                dropdownRef={strokeDropdownRef}
              />
            )}

            {/* Stroke Weight Input */}
            <div
              style={{
                flex: 1,
                display: "flex",
                background: "transparent",
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                marginLeft: "-25%",
                marginRight: 25,
                alignItems: "center",
              }}
            >
              <img
                src={Weight}
                alt={Weight}
                style={{
                  width: "14px",
                  height: "17px",
                  paddingLeft: 10,
                  marginRight: "5px",
                }}
              />
              <input
                type="number"
                value={strokeWidth}
                onChange={handleStrokeWidthChange}
                style={{
                  flex: 1,
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#333",
                  marginRight: "-150px",
                  borderRadius: "4px",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                }}
              />

              <span className="tooltip" style={{ bottom: "35px" }}>
                Stroke weight
              </span>
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

            <button
              className="reset-size-btn"
              ref={borderRef}
              onClick={() => setShowBorderPanel((prev) => !prev)}
              style={{
                width: "33px",
                height: "15px",
                marginBottom: "-2px",
                marginLeft: -21,
              }}
            >
              <img
                src={borderIcons[selectedBorderSide]}
                alt={selectedBorderSide}
                style={{ width: 15, height: 15, marginBottom: 2 }}
              />
              <span className="tooltip" style={{ left: -25 }}>
                Individual Strokes
              </span>
            </button>
          </div>
        </>
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

export default Stroke;

