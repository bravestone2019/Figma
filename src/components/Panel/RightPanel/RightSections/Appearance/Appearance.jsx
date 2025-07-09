import "../../RightPanel.css";
import "../Layout/Layout.css"
import { useState, useEffect, useRef } from "react";
import corner from "../../../../../assets/RightPanel/corner.png";
import Top from "../../../../../assets/RightPanel/top_left.png";
import bottom from "../../../../../assets/RightPanel/top_right.png";
import right from "../../../../../assets/RightPanel/bottom_left.png";
import left from "../../../../../assets/RightPanel/bottom_right.png";
import shadow from "../../../../../assets/RightPanel/opacity.png";

const Appearance = ({
  selectedShapes,
  drawnRectangles,
  setDrawnRectangles,
}) => {
  const [showRadiusControls, setShowRadiusControls] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const wrapperRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);


  // Check if exactly one shape is selected
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let opacity = "";
  let borderRadius = "";
  // let shapeType = "";

  if (isSingle) {
    const shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) {
      // shapeType = shape.type;
      opacity =
        shape.opacity !== undefined ? Math.round(shape.opacity * 100) : 100;
      if (shape.type === "rectangle") {
        borderRadius =
          shape.borderRadius !== undefined ? shape.borderRadius : 0;
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFocusedInput(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpacityChange = (e) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0 || value > 100) return;
    const updated = { ...drawnRectangles[shapeIdx], opacity: value / 100 };
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = updated;
    setDrawnRectangles(newRects);
  };

  const handleCurveChange = (e) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) return;
    const updated = { ...drawnRectangles[shapeIdx], borderRadius: value };
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = updated;
    setDrawnRectangles(newRects);
  };

  return (
    <>
      <div className="right-section-title">Appearance</div>

      {/* Top Row: Opacity, Border Radius, Toggle Button */}
      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginLeft: "14px",
          marginTop: "6px",
        }}
      >
        {/* Opacity Box */}
        <div
          className={`pos-box ${
            focusedInput === "opacity" ? "selected-pos" : ""
          }`}
          style={{ padding: "1px 0" }}
          onClick={() => setFocusedInput("opacity")}
        >
          <img
            src={shadow}
            alt={shadow}
            style={{ width: 11, height: 11, marginLeft: "10px" }}
          />
          <input
            type="number"
            value={isSingle ? opacity : ""}
            disabled={!isSingle}
            onChange={handleOpacityChange}
            min={0}
            max={100}
            step={1}
            style={{ transform: "translateX(-5%)" }}
            onFocus={() => setFocusedInput("opacity")}
            onBlur={() => setFocusedInput(null)}
          />
          <span style={{ transform: "translateX(-90%)" }}>%</span>
          <span className="tooltip">Opacity</span>
        </div>

        {/* Border Radius Box */}
        <div
          className={`pos-box ${
            focusedInput === "borderRadius" ? "selected-pos" : ""
          }`}
          style={{ gap: 10, padding: "1px 0" }}
          onClick={() => setFocusedInput("borderRadius")}
        >
          <img
            src={corner}
            alt="Border Radius"
            style={{ width: 11, height: 11, marginLeft: "10px" }}
          />
          <input
            type="number"
            value={borderRadius}
            min={0}
            onChange={handleCurveChange}
            style={{ transform: "translateX(-20%)" }}
            onFocus={() => setFocusedInput("borderRadius")}
            onBlur={() => setFocusedInput(null)}
          />
          <span className="tooltip">Corners radius</span>
        </div>

        {/* Toggle Advanced Corner Controls */}
        <button
          className={`reset-size-btn ${isLocked ? "selected" : ""}`}
          style={{
            width: "20px",
            height: "18px",
            transform: "translateX(-10%)",
          }}
          onClick={() => {
            setIsLocked(!isLocked);
            setShowRadiusControls(!showRadiusControls);
          }}
        >
          <img
            src={corner}
            alt="Toggle Corners"
            style={{ width: 18, height: 16, marginBottom: 2 }}
          />
          <span className="tooltip">Individual corners</span>
        </button>
      </div>

      {/* Grid for 4 Corner Radius Inputs */}
      {showRadiusControls && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "12px",
            marginLeft: "29px",
            width: "60%",
          }}
        >
          <div
            className="pos-box"
            style={{
              padding: "2px 2px",
              fontSize: "10px",
              height: "20px",
              width: "90%",
            }}
          >
            <img
              src={Top}
              alt="Border Radius"
              style={{
                width: 14,
                height: 12,
                marginLeft: "8px",
                transform: "translateY(-15%)",
              }}
            />
            <input
              placeholder="0"
              type="number"
              min={0}
              style={{ transform: "translateX(-5%)" }}
            />
            <span className="tooltip" style={{ left: "-30px", bottom: "35px" }}>
              Top left corner radius
            </span>
          </div>
          <div
            className="pos-box"
            style={{
              padding: "2px 2px",
              fontSize: "10px",
              height: "20px",
              width: "90%",
            }}
          >
            <img
              src={bottom}
              alt="Border Radius"
              style={{
                width: 14,
                height: 12,
                marginLeft: "8px",
                transform: "translateY(-15%)",
              }}
            />
            <input
              placeholder="0"
              type="number"
              min={0}
              style={{ transform: "translateX(-5%)" }}
            />
            <span className="tooltip" style={{ left: "-30px", bottom: "35px" }}>
              Top right corner radius
            </span>
          </div>
          <div
            className="pos-box"
            style={{
              padding: "2px 2px",
              fontSize: "10px",
              height: "20px",
              width: "90%",
            }}
          >
            <img
              src={right}
              alt="Border Radius"
              style={{
                width: 14,
                height: 12,
                marginLeft: "8px",
                transform: "translateY(15%)",
              }}
            />
            <input
              placeholder="0"
              type="number"
              min={0}
              style={{ transform: "translateX(-5%)" }}
            />
            <span className="tooltip" style={{ left: "-30px", bottom: "35px" }}>
              Bottom left corner radius
            </span>
          </div>
          <div
            className="pos-box"
            style={{
              padding: "2px 2px",
              fontSize: "10px",
              height: "20px",
              width: "90%",
            }}
          >
            <img
              src={left}
              alt="Border Radius"
              style={{
                width: 14,
                height: 12,
                marginLeft: "8px",
                transform: "translateY(15%)",
              }}
            />
            <input
              placeholder="0"
              type="number"
              min={0}
              style={{ transform: "translateX(-5%)" }}
            />
            <span className="tooltip" style={{ left: "-30px", bottom: "35px" }}>
              Bottom right corner radius
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="section-divider" />
    </>
  );
};

export default Appearance;
