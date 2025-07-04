import "./Layout.css";
import "../../RightPanel.css";
import Corner from "../../../../../assets/RightPanel/corner.png";

const Layout = ({ selectedShapes, drawnRectangles, setDrawnRectangles }) => {
  // Only show controls if exactly one shape is selected
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let width = "";
  let height = "";
  let shapeType = "";
  if (isSingle) {
    const shape = drawnRectangles.find(s => s.id === selectedShapes[0]);
    if (shape) {
      shapeType = shape.type;
      if (shape.type === "circle") {
        width = height = shape.radius ? shape.radius * 2 : "";
      } else if (shape.type === "line") {
        width = Math.abs(shape.x2 - shape.x1);
        height = Math.abs(shape.y2 - shape.y1);
      } else if (shape.type === "triangle") {
        // For triangle, show bounding box width/height
        const xs = [shape.x1, shape.x2, shape.x3];
        const ys = [shape.y1, shape.y2, shape.y3];
        width = Math.max(...xs) - Math.min(...xs);
        height = Math.max(...ys) - Math.min(...ys);
      } else {
        width = shape.width;
        height = shape.height;
      }
    }
  }

  const handleChange = (e, prop) => {
    if (!isSingle) return;
    const shapeIdx = drawnRectangles.findIndex(s => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    const shape = drawnRectangles[shapeIdx];
    let newShape = { ...shape };
    let value = Number(e.target.value);
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

  return (
    <>
      <div className="right-section-title">Layout</div>
      <div
        className="position-grid"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
        }}
      >
        <div className="pos-box">
          <span>W</span>
          <input
            type="number"
            value={isSingle ? width : ""}
            disabled={!isSingle || shapeType === "triangle"}
            onChange={e => handleChange(e, "width")}
            min={1}
          />
        </div>
        <div className="pos-box">
          <span>H</span>
          <input
            type="number"
            value={isSingle ? height : ""}
            disabled={!isSingle || shapeType === "triangle"}
            onChange={e => handleChange(e, "height")}
            min={1}
          />
        </div>
        <button className="reset-size-btn" disabled>
          <img src={Corner} alt={Corner} style={{ width: 18, height: 13 }} />
        </button>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Layout;
