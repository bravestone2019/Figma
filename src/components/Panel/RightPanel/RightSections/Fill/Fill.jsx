import "../../RightPanel.css";
import { useState } from "react";

const Fill = () => {
  const [isFillOpen, setIsFillOpen] = useState(false);

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsFillOpen(!isFillOpen)}
      >
        Fill{" "}
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            marginLeft: "auto",
          }}
          onClick={() => setIsFillOpen(!isFillOpen)}
          aria-label={isFillOpen ? "Collapse Fill" : "Expand Fill"}
        >
          {isFillOpen ? "−" : "+"}
        </button>
      </div>

      {/* <div className="pos-box-fill" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Small color button */}

      {isFillOpen && (
        <div className="position-grid">
          <div className="pos-box-fill">
            <button
              style={{
                width: "22px",
                height: "22px",
                border: "1.5px solid #ddd",
                borderRadius: "4px",
                background: "#fff",
                // marginRight: "6px",
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

            <input
              type="number"
              defaultValue={100}
            />
            <span>%</span>
          </div>
        </div>
      )}

      {/* Thin grey line divider */}
      {!isFillOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Fill;