import "../../RightPanel.css";
import "./Effects.css"
import { useState } from "react";

const Effects = () => {
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsEffectsOpen(!isEffectsOpen)}
      >
        Effects
        <button
          className="expand-collapse-btn"
          onClick={() => setIsEffectsOpen(!isEffectsOpen)}
          aria-label={isEffectsOpen ? "Add Effects" : "Remove Effects"}
        >
          {isEffectsOpen ? "-" : "+"}
        </button>
      </div>

      {isEffectsOpen && (
        <div className="position-grid">
          <div className="pos-box-fill">
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
      {!isEffectsOpen ? (
                <div className="section-divider" style={{ marginTop: "1px" }} />
            ) : (
                <div className="section-divider" />
            )}
    </>
  );
};

export default Effects;
