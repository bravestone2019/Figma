import "../../RightPanel.css";
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
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            marginLeft: "auto",
          }}
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

            <input type="number" defaultValue={100} />
            <span>%</span>
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
