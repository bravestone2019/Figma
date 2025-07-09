import "./Layout.css";
import { useState, useRef, useEffect } from "react";
import "../../RightPanel.css";
import Ratio from "../../../../../assets/RightPanel/increase.png";

const Layout = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const widthInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const wrapperRef = useRef(null);


  // Only show controls if exactly one shape is selected
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let width = "";
  let height = "";
  let shapeType = "";
  if (isSingle) {
    const shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) {
      shapeType = shape.type;
      if (shape.type === "circle") {
        width = height = shape.radius ? (shape.radius * 2).toString() : "";
      } else if (shape.type === "line") {
        width = Math.abs(shape.x2 - shape.x1).toString();
        height = Math.abs(shape.y2 - shape.y1).toString();
      } else if (shape.type === "triangle") {
        // For triangle, show bounding box width/height
        const xs = [shape.x1, shape.x2, shape.x3];
        const ys = [shape.y1, shape.y2, shape.y3];
        width = (Math.max(...xs) - Math.min(...xs)).toString();
        height = (Math.max(...ys) - Math.min(...ys)).toString();
      } else {
        width = shape.width?.toString();
        height = shape.height?.toString();
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
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const handleChange = (e, prop) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;
    const shape = drawnRectangles[shapeIdx];
    let newShape = { ...shape };
    let value = Math.round(Number(e.target.value));
    if (isNaN(value) || value <= 0) return;
    if (shape.type === "circle") {
      // For circle, width/height = diameter
      newShape.radius = value / 2;
    } else if (shape.type === "line") {
      // For line, adjust x2/y2 to set width/height
      if (prop === "width") {
        const dx = shape.x2 - shape.x1;
        const sign = dx >= 0 ? 1 : -1;
        newShape.x2 = shape.x1 + sign * value;
      } else if (prop === "height") {
        const dy = shape.y2 - shape.y1;
        const sign = dy >= 0 ? 1 : -1;
        newShape.y2 = shape.y1 + sign * value;
      }
    } else if (shape.type === "triangle") {
      // For triangle, do nothing (or could scale points, but skipping for now)
      return;
    } else {
      newShape[prop] = value;
    }
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  };

  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  return (
    <>
      <div className="right-section-title">Layout</div>
      <div
        // className="position-grid"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
          gap: 10
        }}
        ref={wrapperRef}
      >
        <div
          className={`pos-box ${
            focusedInput === "width" ? "selected-pos" : ""
          }`}
          style={{ position: "relative", padding: " 1px 15px 2px 30px" }}
          onClick={() => {
            focusInput(widthInputRef);
            setFocusedInput("width");
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "11px",
              color: "#666",
            }}
          >
            W
          </span>
          <input
            type="number"
            value={isSingle ? width : ""}
            disabled={!isSingle || shapeType === "triangle"}
            onChange={(e) => handleChange(e, "width")}
            min={1}
            style={{ transform: "translateX(-20%)" }}
            onFocus={() => setFocusedInput("width")}
            onBlur={() => setFocusedInput(null)}
          />
          <span className="tooltip">Width</span>
        </div>

        <div
          className={`pos-box ${
            focusedInput === "height" ? "selected-pos" : ""
          }`}
          style={{ position: "relative", padding: " 1px 15px 2px 30px" }}
          onClick={() => {
            focusInput(heightInputRef);
            setFocusedInput("height");
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "11px",
              color: "#666",
            }}
          >
            H
          </span>
          <input
            type="number"
            value={isSingle ? height : ""}
            disabled={!isSingle || shapeType === "triangle"}
            onChange={(e) => handleChange(e, "height")}
            min={1}
            style={{ transform: "translateX(-20%)" }}
            onFocus={() => setFocusedInput("height")}
            onBlur={() => setFocusedInput(null)}
          />
          <span className="tooltip">Height</span>
        </div>
        <button
          className={`reset-size-btn ${isLocked ? "selected" : ""}`}
          onClick={() => setIsLocked((prev) => !prev)}
          style={{
            width: "20px",
            height: "18px",
            transform: "translateX(-10%)",
          }}
        >
          <img
            src={Ratio}
            alt={Ratio}
            style={{ width: 13, height: 12, marginBottom: 2 }}
          />
          <span className="tooltip">Lock aspect ratio</span>
        </button>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Layout;
