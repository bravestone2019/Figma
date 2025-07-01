import "../../RightPanel.css";
import degrees from "../../../../../assets/RightPanel/degrees.png";
import horizontal from "../../../../../assets/RightPanel/horizontal-flip.png";
import Angle from "../../../../../assets/RightPanel/angle.png";
import { useState, useEffect } from "react";

const Position = ({ selectedShapes, setSelectedShapes, drawnRectangles, setDrawnRectangles }) => {
  // Get the first selected shape by ID (if any)
  const selectedShapeId = selectedShapes && selectedShapes.length > 0 ? selectedShapes[0] : null;
  const selectedRect = drawnRectangles.find(rect => rect.id === selectedShapeId);
  let rectX = '', rectY = '', rectRotation = 0;
  if (selectedRect) {
    if (selectedRect.type === 'line') {
      rectX = ((selectedRect.x1 + selectedRect.x2) / 2).toFixed(0);
      rectY = ((selectedRect.y1 + selectedRect.y2) / 2).toFixed(0);
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

  // Sync local state with rectangle value when selection or rectangle changes
  useEffect(() => {
    setInputX(rectX);
  }, [rectX, selectedShapeId]);
  useEffect(() => {
    setInputY(rectY);
  }, [rectY, selectedShapeId]);
  useEffect(() => { setInputRotation(rectRotation); }, [rectRotation, selectedShapeId]);

  // Handlers for input changes
  const handleXChange = (e) => {
    setInputX(e.target.value);
    if (!selectedRect) return;
    const newX = parseInt(e.target.value, 10);
    if (!isNaN(newX)) {
      let updatedRectangles;
      if (selectedRect.type === 'line') {
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
      if (selectedRect.type === 'line') {
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
  const handleRotationChange = (e) => {
    setInputRotation(e.target.value);
    if (!selectedRect) return;
    const newRotation = parseFloat(e.target.value);
    if (!isNaN(newRotation)) {
      let updatedRectangles;
      if (selectedRect.type === 'line') {
        // Rotate both endpoints around center
        const cx = (selectedRect.x1 + selectedRect.x2) / 2;
        const cy = (selectedRect.y1 + selectedRect.y2) / 2;
        const angle = ((newRotation - (selectedRect.rotation || 0)) * Math.PI) / 180;
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
            ? { ...rect, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, rotation: newRotation }
            : rect
        );
      } else {
        updatedRectangles = drawnRectangles.map((rect) =>
          rect.id === selectedShapeId ? { ...rect, rotation: newRotation } : rect
        );
      }
      setDrawnRectangles(updatedRectangles);
    }
  };

  return (
    <>
      <div className="right-section-title">Position</div>
      <div className="position-grid">
        <div className="pos-box" style={{ gap: 6 }}>
          <span>X</span>
          <input type="number" value={inputX} onChange={handleXChange} />
        </div>
        <div className="pos-box" style={{ gap: 6 }}>
          <span>Y</span>
          <input type="number" value={inputY} onChange={handleYChange} />
        </div>
        <div className="pos-box" style={{ gap: 6 }}>
          <img src={Angle} alt="Rotate" style={{ width: 13, height: 10, marginRight: 6 }} />
          <input
            type="number"
            value={inputRotation}
            onChange={handleRotationChange}
          />
        </div>
        <div className="pos-box" style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              borderRight: "2px solid #fff",
            }}
          >
            <img
              src={degrees}
              alt={degrees}
              style={{ width: 13, height: 12, marginRight: "8px" }}
            />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              borderRight: "2px solid #fff",
              marginRight: "5px",
            }}
          >
            <img
              src={horizontal}
              alt={horizontal}
              style={{ width: 13, height: 12, marginRight: "8px" }}
            />
          </button>
          <button style={{ background: "none", border: "none", padding: 0 }}>
            <img
              src={Angle}
              alt={Angle}
              style={{ width: 12, height: 10, marginLeft: "-5px" }}
            />
          </button>
        </div>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Position;
