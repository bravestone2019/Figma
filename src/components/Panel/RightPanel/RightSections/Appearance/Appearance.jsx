import "../../RightPanel.css"
import clock from "../../../../../assets/RightPanel/clock.png";
import corner from "../../../../../assets/RightPanel/corner.png";

const Appearance = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  // Only show controls if exactly one shape is selected
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let opacity = "";
  let borderRadius = "";
  let shapeType = "";
  if (isSingle) {
    const shape = drawnRectangles.find(s => s.id === selectedShapes[0]);
    if (shape) {
      shapeType = shape.type;
      opacity = shape.opacity !== undefined ? shape.opacity : 100;
      if (shape.type === "rectangle") {
        borderRadius = shape.borderRadius !== undefined ? shape.borderRadius : 0;
      }
    }
  }

  const handleOpacityChange = (e) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    let value = Number(e.target.value);
    if (isNaN(value) || value < 0 || value > 1) return;
    const newShape = { ...drawnRectangles[shapeIdx], opacity: value };
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  };

  const handleCurveChange = (e) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    let value = Number(e.target.value);
    if (isNaN(value) || value < 0) return;
    const newShape = { ...drawnRectangles[shapeIdx], borderRadius: value };
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  };

  return (
    <>
      <div className="right-section-title">Appearance</div>
      <div
        className="position-grid"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
        }}
      >
        <div className="pos-box" style={{ gap: 10 }}>
          <img
            src={clock}
            alt="Opacity"
            style={{ width: 16, height: 16, marginRight: 4 }}
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
        {isSingle && shapeType === "rectangle" && (
        <div className="pos-box" style={{ gap: 10 }}>
          <img
              src={corner}
              alt="Curve"
              style={{ width: 16, height: 16, marginRight: 4 }}
          />
            <input
              type="number"
              value={borderRadius}
              min={0}
              onChange={handleCurveChange}
            />
        </div>
        )}
        <button
          className="reset-size-btn"
          style={{ width: "36px", height: "24px" }}
          disabled
        >
          <img src={clock} alt={clock} style={{ width: 18, height: 13 }} />
        </button>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Appearance;
