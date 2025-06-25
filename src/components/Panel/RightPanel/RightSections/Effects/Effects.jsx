import "../../RightPanel.css";
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
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            marginLeft: "auto",
          }}
          onClick={() => setIsEffectsOpen(!isEffectsOpen)}
          aria-label={isEffectsOpen ? "Add Effects" : "Remove Effects"}
        >
          {isEffectsOpen ? "-" : "+"}
        </button>
      </div>

      {isEffectsOpen && (
        <div className="position-grid">
          <div className="pos-box-fill">
            <span>100</span>
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
