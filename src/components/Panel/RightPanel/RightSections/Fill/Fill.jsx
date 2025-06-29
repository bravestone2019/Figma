import "../../RightPanel.css";
import "../Effects/Effects.css";
import { useState } from "react";
import { RgbaColorPicker, HexColorInput, HexColorPicker } from "react-colorful";
import "./ColorPicker.css";

const Fill = () => {
  const [isFillOpen, setIsFillOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [color, setColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(100);

  return (
    <>
      <div
        className="right-section-title clickable"
        onClick={() => setIsFillOpen(!isFillOpen)}
      >
        Fill{" "}
        <button
          className="expand-collapse-btn"
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
                display: "inline-block",
                padding: 0,
              }}
              aria-label="Select color"
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
            />
            {colorPickerOpen && (
              <div className="custom-color-picker">
                <HexColorPicker color={color} onChange={setColor} />
                <div className="picker-inputs">
                  <select className="picker-mode" disabled>
                    <option>Hex</option>
                  </select>
                  <HexColorInput
                    color={color}
                    onChange={setColor}
                    prefixed
                    className="hex-input"
                  />
                  <input
                    type="number"
                    value={opacity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val)) val = 100;
                      val = Math.max(0, Math.min(100, val));
                      setOpacity(val);
                    }}
                    className="opacity-input"
                  />
                  <span>%</span>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
                flex: 1,
              }}
            >
              <input
                type="number"
                value={opacity}
                onChange={(e) =>
                  setOpacity(
                    Math.max(0, Math.min(100, parseInt(e.target.value)))
                  )
                }
              />
              <div>%</div>
            </div>
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
