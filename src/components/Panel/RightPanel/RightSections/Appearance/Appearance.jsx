import "../../RightPanel.css";
import { useState } from "react";
import corner from "../../../../../assets/RightPanel/corner.png";

const Appearance = ({
  selectedShapes,
  drawnRectangles,
  setDrawnRectangles,
}) => {
  const [showRadiusControls, setShowRadiusControls] = useState(false);

  // Check if exactly one shape is selected
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let opacity = "";
  let borderRadius = "";
  // let shapeType = "";

  if (isSingle) {
    const shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) {
      // shapeType = shape.type;
      opacity = shape.opacity !== undefined ? shape.opacity : 1;
      if (shape.type === "rectangle") {
        borderRadius =
          shape.borderRadius !== undefined ? shape.borderRadius : 0;
      }
    }
  }

  const handleOpacityChange = (e) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0 || value > 1) return;
    const updated = { ...drawnRectangles[shapeIdx], opacity: value };
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
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginLeft: "20px",
          marginTop: "6px",
        }}
      >
        {/* Opacity Box */}
        <div className="pos-box" style={{ gap: 9, padding: "2px 0" }}>
          <img
            src={corner}
            alt="Opacity"
            style={{ width: 11, height: 11, marginLeft: "10px" }}
          />
          <input
            type="number"
            value={isSingle ? opacity : ""}
            disabled={!isSingle}
            onChange={handleOpacityChange}
            min={0}
            max={1}
            step={0.01}
          />
        </div>

        {/* Border Radius Box */}
        <div className="pos-box" style={{ gap: 10, padding: "2px 0" }}>
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
          />
        </div>

        {/* Toggle Advanced Corner Controls */}
        <button
          className="reset-size-btn"
          style={{ width: "36px", height: "24px", marginRight: 6 }}
          onClick={() => setShowRadiusControls(!showRadiusControls)}
        >
          <img
            src={corner}
            alt="Toggle Corners"
            style={{ width: 18, height: 13 }}
          />
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
            marginLeft: "25px",
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
              src={corner}
              alt="Border Radius"
              style={{ width: 14, height: 12, marginLeft: "10px" }}
            />
            <input placeholder="0" type="number" min={0} />
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
              src={corner}
              alt="Border Radius"
              style={{ width: 14, height: 12, marginLeft: "10px" }}
            />
            <input placeholder="0" type="number" min={0} />
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
              src={corner}
              alt="Border Radius"
              style={{ width: 14, height: 12, marginLeft: "10px" }}
            />
            <input placeholder="0" type="number" min={0} />
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
              src={corner}
              alt="Border Radius"
              style={{ width: 14, height: 12, marginLeft: "10px" }}
            />
            <input placeholder="0" type="number" min={0} />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="section-divider" />
    </>
  );
};

export default Appearance;
