import "../../RightPanel.css";
import "../Effects/Effects.css"
import { useState } from "react";

const Stroke = () => {
    const [isStrokeOpen, setIsStrokeOpen] = useState(false);

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsStrokeOpen(!isStrokeOpen)}
      >
        Stroke
        <button
          className="expand-collapse-btn"
          onClick={() => setIsStrokeOpen(!isStrokeOpen)}
          aria-label={isStrokeOpen ? "Add Stroke" : "Remove Stroke"}
        >
          {isStrokeOpen ? "-" : "+"}
        </button>
      </div>

      {isStrokeOpen && (
        <div className="position-grid">
          <div className="pos-box-fill">
            <button
              style={{
                width: "22px",
                height: "22px",
                border: "1.5px solid #ddd",
                borderRadius: "4px",
                background: "#fff",
                display: "inline-block",
                padding: 0,
              }}
              aria-label="Select color"
            />
            {/* For Color Selection */}
            {/* <input
                        type="number"
                        defaultValue={Math.round(position.y)}
                    /> */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
                flex: 1,
              }}
            >
              <input type="number" defaultValue={100} />
              <div>%</div>
            </div>
          </div>
        </div>
      )}

      {/* Thin grey line divider */}
      {!isStrokeOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Stroke;
