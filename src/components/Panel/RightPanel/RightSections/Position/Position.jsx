import "../../RightPanel.css";
import { useRef } from "react";
import degrees from "../../../../../assets/RightPanel/degrees.png";
import horizontal from "../../../../../assets/RightPanel/horizontal-flip.png";
import vertical from "../../../../../assets/RightPanel/vertical.png";
import Angle from "../../../../../assets/RightPanel/angle.png";
import { useState, useEffect } from "react";

const Position = ({
  selectedShapes,
  // setSelectedShapes,
  drawnRectangles,
  setDrawnRectangles,
}) => {
  const xInputRef = useRef(null);
  const yInputRef = useRef(null);
  const angleInputRef = useRef(null);

  // Get the first selected shape by ID (if any)
  const selectedShapeId =
    selectedShapes && selectedShapes.length > 0 ? selectedShapes[0] : null;
  const selectedRect = drawnRectangles.find(
    (rect) => rect.id === selectedShapeId
  );
  let rectX = "",
    rectY = "",
    rectRotation = 0;
  if (selectedRect) {
    if (selectedRect.type === "line") {
      rectX = (selectedRect.x1 + selectedRect.x2) / 2;
      rectY = (selectedRect.y1 + selectedRect.y2) / 2;
      rectRotation = selectedRect.rotation || 0;
    } else {
      rectX = selectedRect.x;
      rectY = selectedRect.y;
      rectRotation = selectedRect.rotation || 0;
    }
  }

  // Local state for input editing
  const [inputX, setInputX] = useState(rectX);
  const [inputY, setInputY] = useState(rectY);
  const [inputRotation, setInputRotation] = useState(rectRotation);

  // Helper function to focus an input
  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Optional: Select all text in the input field when it's focused
      inputRef.current.select();
    }
  };

  // Sync local state with rectangle value when selection or rectangle changes
  useEffect(() => {
    if (rectX !== "") {
      setInputX(
        rectRotation !== 0
          ? parseFloat(rectX).toFixed(2)
          : parseInt(rectX).toString()
      );
    } else {
      setInputX("");
    }
  }, [rectX, rectRotation, selectedShapeId]);
  useEffect(() => {
    if (rectY !== "") {
      setInputY(
        rectRotation !== 0
          ? parseFloat(rectY).toFixed(2)
          : parseInt(rectY).toString()
      );
    } else {
      setInputY("");
    }
  }, [rectY, rectRotation, selectedShapeId]);
  useEffect(() => {
    setInputRotation(rectRotation);
  }, [rectRotation, selectedShapeId]);

  // Handlers for input changes
  const handleXChange = (e) => {
    setInputX(e.target.value);
    if (!selectedRect) return;
    const newX = parseInt(e.target.value, 10);
    if (!isNaN(newX)) {
      let updatedRectangles;
      if (selectedRect.type === "line") {
        const dx = newX - (selectedRect.x1 + selectedRect.x2) / 2;
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId
            ? { ...rect, x1: rect.x1 + dx, x2: rect.x2 + dx }
            : rect
        );
      } else {
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId ? { ...rect, x: newX } : rect
        );
      }
      setDrawnRectangles(updatedRectangles);
    }
  };
  const handleYChange = (e) => {
    setInputY(e.target.value);
    if (!selectedRect) return;
    const newY = parseInt(e.target.value, 10);
    if (!isNaN(newY)) {
      let updatedRectangles;
      if (selectedRect.type === "line") {
        const dy = newY - (selectedRect.y1 + selectedRect.y2) / 2;
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId
            ? { ...rect, y1: rect.y1 + dy, y2: rect.y2 + dy }
            : rect
        );
      } else {
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId ? { ...rect, y: newY } : rect
        );
      }
      setDrawnRectangles(updatedRectangles);
    }
  };
  const handleRotationChange = (value) => {
    setInputRotation(value);
    if (!selectedRect) return;
    let newRotation = parseFloat(value);
    if (!isNaN(newRotation)) {
      // Normalize to between -179 and 180
      if (newRotation > 180) newRotation -= 360;
      if (newRotation <= -180) newRotation += 360;

      let updatedRectangles;
      if (selectedRect.type === "line") {
        const cx = (selectedRect.x1 + selectedRect.x2) / 2;
        const cy = (selectedRect.y1 + selectedRect.y2) / 2;
        const angle =
          ((newRotation - (selectedRect.rotation || 0)) * Math.PI) / 180;
        const rotatePoint = (x, y) => {
          const dx = x - cx;
          const dy = y - cy;
          return {
            x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
            y: cy + dx * Math.sin(angle) + dy * Math.cos(angle),
          };
        };
        const p1 = rotatePoint(selectedRect.x1, selectedRect.y1);
        const p2 = rotatePoint(selectedRect.x2, selectedRect.y2);
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId
            ? {
                ...rect,
                x1: p1.x,
                y1: p1.y,
                x2: p2.x,
                y2: p2.y,
                rotation: newRotation,
              }
            : rect
        );
      } else {
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId
            ? { ...rect, rotation: newRotation }
            : rect
        );
      }
      setDrawnRectangles(updatedRectangles);
    }
  };

  return (
    <>
      <div className="right-section-title">Position</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
          gap: 10,
        }}
      >
        {/* X-Position */}
        <div
          className="pos-box"
          style={{
            position: "relative",
            padding: " 1px 10px 2px 30px",
            marginRight: 15,
          }}
          onClick={() => focusInput(xInputRef)}
        >
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "10px",
              color: "#666",
              background: "none",
            }}
          >
            X
          </span>
          <input
            type="number"
            value={inputX}
            onChange={handleXChange}
            ref={xInputRef}
            style={{ transform: "translateX(-25%)", fontSize: "11px" }}
          />
          <span className="tooltip">X-position</span>
        </div>
        {/* Y-Position */}
        <div
          className="pos-box"
          style={{
            position: "relative",
            padding: "1px 10px 2px 30px",
            marginRight: 28,
            marginLeft: -15,
          }}
          onClick={() => focusInput(yInputRef)}
        >
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "10px",
              color: "#666",
              background: "none",
            }}
          >
            Y
          </span>
          <input
            type="number"
            value={inputY}
            onChange={handleYChange}
            ref={yInputRef}
            style={{ transform: "translateX(-25%)", fontSize: "11px" }}
          />
          <span className="tooltip">Y-position</span>
        </div>
        {/* Rotation-Position */}
        <div
          className="pos-box"
          style={{
            position: "relative",
            padding: "1px 15px 2px 30px",
            marginRight: 15,
          }}
          onClick={() => focusInput(angleInputRef)}
        >
          <img
            src={Angle}
            alt="angle"
            className="angle-icon"
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
              background: "none",
            }}
          />
          <input
            type="number"
            value={inputRotation}
            onChange={(e) => handleRotationChange(e.target.value)}
            ref={angleInputRef}
            style={{ transform: "translateX(-20%)", fontSize: "11px" }}
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
            °
          </span>
          {/* <span className="degree-symbol">°</span> */}
          <span className="tooltip">Rotation</span>
        </div>

        {/* Icon buttons for rotation and flipping */}
        <div className="pos-button-container">
          <button className="pos-action-btn">
            <img src={degrees} alt="Rotate" />
            <span className="tooltip">Rotate</span>
          </button>
          <button className="pos-action-btn">
            <img src={vertical} alt="Flip Vertical" />
            <span className="tooltip">Flip Vertical</span>
          </button>
          <button className="pos-action-btn">
            <img src={horizontal} alt="Flip Horizontal" />
            <span className="tooltip">Flip Horizontal</span>
          </button>
        </div>
      </div>

      {/* Thin grey divider */}
      <div className="section-divider" />
    </>
  );
};

export default Position;

/* <div
  className="pos-box-button icon-group"
  style={{
    // position: "relative",
    // padding: "1px 10px 2px 30px",
    display: "inline-flex",
    justifyContent: "flex-start",
    padding: "4px 10px",
    gap: "10px",
    marginRight: 28,
    marginLeft: -15,
  }}
>
  <button className="icon-button">
    <img src={degrees} alt="Rotate" style={{ marginBottom: "-1px" }} />
    <span className="tooltip">Rotate 90° Right</span>
  </button>
  <button className="icon-button">
    <img src={vertical} alt="Vertical Flip" style={{ marginBottom: "-1px" }} />
    <span className="tooltip">Flip Vertical</span>
  </button>
  <button className="icon-button">
    <img
      src={horizontal}
      alt="Horizontal Flip"
      style={{ marginBottom: "-1px" }}
    />
    <span className="tooltip">Flip Horizontal</span>
  </button>
</div>; */
// }

// <div className="pos-box-button">
//   <button className="icon-button">
//     <img src={degrees} alt="Rotate" />
//     <span className="tooltip">Rotate 90° Right</span>
//   </button>
//   <button className="icon-button">
//     <img src={vertical} alt="Flip Vertical" />
//     <span className="tooltip">Flip Vertical</span>
//   </button>
//   <button className="icon-button">
//     <img src={horizontal} alt="Horizontal Flip" />
//     <span className="tooltip">Flip Horizontal</span>
//   </button>
// </div>

{
  /* <button className="icon-button">
          <img src={degrees} alt="Rotate" />
          <span className="tooltip">Rotate 90° Right</span>
        </button>
        <button className="icon-button">
          <img src={degrees} alt="Rotate" />
          <span className="tooltip">Rotate 90° Right</span>
        </button> */
}
