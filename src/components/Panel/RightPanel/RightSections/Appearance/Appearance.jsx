import "../../RightPanel.css";
import "../Layout/Layout.css";
import { useState, useEffect, useRef } from "react";
import corner from "../../../../../assets/RightPanel/corner.png";
import Top from "../../../../../assets/RightPanel/top_left.png";
import bottom from "../../../../../assets/RightPanel/top_right.png";
import right from "../../../../../assets/RightPanel/bottom_left.png";
import left from "../../../../../assets/RightPanel/bottom_right.png";
import shadow from "../../../../../assets/RightPanel/opacity.png";
import whiteIcon from "../../../../../assets/RightPanel/activeIcon.png"

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
  let isImage = false;
  let borderRadiusTopLeft = 0;
  let borderRadiusTopRight = 0;
  let borderRadiusBottomLeft = 0;
  let borderRadiusBottomRight = 0;
  let cornerRadiusTopLeft = 0;
  let cornerRadiusTopRight = 0;
  let cornerRadiusBottomLeft = 0;
  let cornerRadiusBottomRight = 0;

  if (isSingle) {
    const shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) {
      opacity = shape.opacity !== undefined ? Math.round(shape.opacity * 100) : 100;
      if (shape.type === "rectangle") {
        borderRadius = shape.borderRadius !== undefined ? shape.borderRadius : 0;
        borderRadiusTopLeft = shape.borderRadiusTopLeft ?? borderRadius;
        borderRadiusTopRight = shape.borderRadiusTopRight ?? borderRadius;
        borderRadiusBottomLeft = shape.borderRadiusBottomLeft ?? borderRadius;
        borderRadiusBottomRight = shape.borderRadiusBottomRight ?? borderRadius;
      } else if (shape.type === "image") {
        borderRadius = shape.cornerRadius !== undefined ? shape.cornerRadius : 0;
        isImage = true;
        cornerRadiusTopLeft = shape.cornerRadiusTopLeft ?? borderRadius;
        cornerRadiusTopRight = shape.cornerRadiusTopRight ?? borderRadius;
        cornerRadiusBottomLeft = shape.cornerRadiusBottomLeft ?? borderRadius;
        cornerRadiusBottomRight = shape.cornerRadiusBottomRight ?? borderRadius;
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
    const shapeIdx = drawnRectangles.findIndex((s) => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) return;
    let updated;
    if (isImage && !showRadiusControls) {
      updated = {
        ...drawnRectangles[shapeIdx],
        cornerRadius: value,
        cornerRadiusTopLeft: value,
        cornerRadiusTopRight: value,
        cornerRadiusBottomLeft: value,
        cornerRadiusBottomRight: value,
      };
    } else if (isImage && showRadiusControls) {
      // In individual mode, do not update here
      return;
    } else if (!isImage && !showRadiusControls) {
      updated = {
        ...drawnRectangles[shapeIdx],
        borderRadius: value,
        borderRadiusTopLeft: value,
        borderRadiusTopRight: value,
        borderRadiusBottomLeft: value,
        borderRadiusBottomRight: value,
      };
    } else {
      // In individual mode, do not update here
      return;
    }
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = updated;
    setDrawnRectangles(newRects);
  };

  const handleCornerChange = (corner, value) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex((s) => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    value = Number(value);
    if (isNaN(value) || value < 0) return;
    const updated = { ...drawnRectangles[shapeIdx], [corner]: value };
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
            style={{ transform: "translateX(-5%)", fontSize: "11px" }}
            onFocus={() => setFocusedInput("opacity")}
            onBlur={() => setFocusedInput(null)}
          />
          <span
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
              pointerEvents: "none",
            }}
          >
            %
          </span>
          {/* <span style={{ transform: "translateX(-90%)" }}>%</span> */}
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
            style={{ transform: "translateX(-20%)", fontSize: "11px" }}
            onFocus={() => setFocusedInput("borderRadius")}
            onBlur={() => setFocusedInput(null)}
            disabled={showRadiusControls && !isImage}
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
            src={isLocked ? whiteIcon : corner}
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
          }}
        >
          <div
            className="pos-box"
            style={{
              padding: "2px 2px",
              fontSize: "10px",
              height: "20px",
              marginLeft: -15,
              marginRight: 25
            }}
          >
            <img
              src={Top}
              alt="Border Radius"
              style={{
                width: 14,
                height: 12,
                marginLeft: "6px",
                transform: "translateY(-15%)",
              }}
            />
            <input
              type="number"
              min={0}
              value={isImage ? cornerRadiusTopLeft : borderRadiusTopLeft}
              onChange={e => handleCornerChange(isImage ? "cornerRadiusTopLeft" : "borderRadiusTopLeft", e.target.value)}
              style={{ transform: "translateX(-5%)", fontSize: "11px" }}
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
              marginRight: 30,
              marginLeft: -25,
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
              type="number"
              min={0}
              value={isImage ? cornerRadiusTopRight : borderRadiusTopRight}
              onChange={e => handleCornerChange(isImage ? "cornerRadiusTopRight" : "borderRadiusTopRight", e.target.value)}
              style={{ transform: "translateX(-5%)", fontSize: "11px" }}
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
              marginLeft: -15,
              marginRight: 25
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
              type="number"
              min={0}
              value={isImage ? cornerRadiusBottomLeft : borderRadiusBottomLeft}
              onChange={e => handleCornerChange(isImage ? "cornerRadiusBottomLeft" : "borderRadiusBottomLeft", e.target.value)}
              style={{ transform: "translateX(-5%)", fontSize: "11px" }}
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
              marginRight: 30,
              marginLeft: -25,
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
              type="number"
              min={0}
              value={isImage ? cornerRadiusBottomRight : borderRadiusBottomRight}
              onChange={e => handleCornerChange(isImage ? "cornerRadiusBottomRight" : "borderRadiusBottomRight", e.target.value)}
              style={{ transform: "translateX(-5%)", fontSize: "11px" }}
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
