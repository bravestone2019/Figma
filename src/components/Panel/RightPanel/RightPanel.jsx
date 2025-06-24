import "./RightPanel.css";
import { useState } from "react";
import Angle from "../../../assets/angle.png";
import Appearance from "../../../assets/clock.png";
import Corner from "../../../assets/corner.png";

const RightPanel = ({ collapsed, scale, position = { x: 100, y: 100 } }) => {
  const zoomPercent = Math.round((scale || 1) * 100);
  const [isFillOpen, setIsFillOpen] = useState(false);
  const [isStrokeOpen, setIsStrokeOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  // const [strokeAlign, setStrokeAlign] = useState("Inside");
  // const [showStrokeAlignDropdown, setShowStrokeAlignDropdown] = useState(false);


  return (
    <div className={`right-panel ${collapsed ? "collapsed" : ""}`}>
      {!collapsed && (
        <div className="right-panel-content">
          <div className="right-panel-header">
            <div className="right-section-header">Design</div>
            <div className="zoom-indicator">{zoomPercent}%</div>
          </div>
          <div className="right-header-divider" />

          {/* <div className="right-panel-scrollable"> */}

            {/* Position */}
            <div className="right-section-title">Position</div>
            <div className="position-grid">
              <div className="pos-box" style={{ gap: 6 }}>
                <span>X</span>
                <input
                  type="number"
                  defaultValue={Math.round(position.y)}
                  // className="pos-box input"
                />
              </div>
              <div className="pos-box" style={{ gap: 6 }}>
                <span>Y</span>
                <input
                  type="number"
                  defaultValue={Math.round(position.y)}
                  // className="pos-box input"
                />
              </div>
              <div className="pos-box" style={{ gap: 10 }}>
                <img
                  src={Angle}
                  alt="Angle"
                  style={{ width: 12, height: 10 }}
                />
                <input
                  type="number"
                  defaultValue="0"
                  // className="pos-box input"
                />
              </div>
              <div
                className="pos-box"
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    borderRight: "2px solid #fff",
                  }}
                >
                  <img
                    src={Angle}
                    alt="Angle"
                    style={{ width: 12, height: 10, marginRight: "8px" }}
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
                    src={Angle}
                    alt="Angle"
                    style={{ width: 12, height: 10, marginRight: "8px" }}
                  />
                </button>
                <button
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <img
                    src={Angle}
                    alt="Angle"
                    style={{ width: 12, height: 10, marginLeft: "-5px" }}
                  />
                </button>
              </div>
            </div>

            {/* Thin grey line divider */}
            <div className="section-divider" />

            <div className="right-section-title">Layout</div>
            <div
                className="position-grid"
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start", 
                marginLeft: "40px"
                }}
                >
                <div className="pos-box">
                <span>W</span>
                <input
                    type="number"
                    defaultValue={Math.round(position.y)}
                  // className="pos-box input"
                />
              </div>
              <div className="pos-box">
                <span>H</span>
                <input
                  type="number"
                  defaultValue={Math.round(position.y)}
                  // className="pos-box input"
                />
              </div>
              <button className="reset-size-btn" style={{ width: "36px", height: "24px" }}>
                <img
                  src={Corner}
                  alt="Corner"
                  style={{ width: 18, height: 13 }}
                />
                </button>
            </div>

            {/* Thin grey line divider */}
            <div className="section-divider" />

            <div className="right-section-title">Appearance</div>
            <div className="position-grid">
              <div className="pos-box" style={{ gap: 10 }}>
                <img
                  src={Appearance}
                  alt="Appearance"
                  style={{ width: 12, height: 10, marginLeft: "-2px" }}
                />
                <input
                  type="number"
                  defaultValue="100"
                  // className="pos-box-input"
                />
              </div>
              <div className="pos-box" style={{ gap: 10 }}>
                <img
                  src={Corner}
                  alt="Corner"
                  style={{ width: 12, height: 10, marginLeft: "-2px" }}
                />
                <input
                  type="number"
                  defaultValue={Math.round(position.y)}
                  // className="pos-box-input"
                />
              </div>
            </div>

            {/* Thin grey line divider */}
            <div className="section-divider" />

              <div
                className="right-section-title clickable"
                onClick={() => setIsFillOpen(!isFillOpen)}
              >
                Fill{" "}
                <button style={{ background: "none", border: "none",fontSize: "16px",
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
                        defaultValue={Math.max(0, Math.min(100, Math.round(position.y)))}
                        min={0}
                        max={100}
                        onInput={event => {
                            let value = Number(event.target.value);
                            if (value > 100) value = 100;
                            if (value < 0) value = 0;
                            event.target.value = value;
                        }}
                    />
                    <span>%</span>
                    
                    </div>
                </div>
              )}


            {!isFillOpen ? (
                <div className="section-divider" style={{ marginTop: "1px" }} />
            ) : (
                <div className="section-divider" />
            )}

            <div className="right-section-title clickable" onClick={() => setIsStrokeOpen(!isStrokeOpen)}>
              Stroke
              <button style={{ background: "none", border: "none",fontSize: "16px",
                      marginLeft: "auto",
                    }}
                    onClick={() => setIsStrokeOpen(!isStrokeOpen)}
                    aria-label={isFillOpen ? "Collapse Fill" : "Expand Fill"}
                  >
                    {isStrokeOpen ? "−" : "+"}
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
                        defaultValue={Math.max(0, Math.min(100, Math.round(position.y)))}
                        min={0}
                        max={100}
                        onInput={event => {
                            let value = Number(event.target.value);
                            if (value > 100) value = 100;
                            if (value < 0) value = 0;
                            event.target.value = value;
                        }}
                    />
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

            <div className="right-section-title clickable" onClick={() => setIsEffectsOpen(!isEffectsOpen)}>
              Effects
              <button style={{ background: "none", border: "none",fontSize: "16px",
                      marginLeft: "auto",
                    }}
                    onClick={() => setIsEffectsOpen(!isEffectsOpen)}
                    aria-label={isFillOpen ? "Collapse Fill" : "Expand Fill"}
                  >
                    {isEffectsOpen ? "−" : "+"}
                  </button>
            </div>

            {isEffectsOpen && (
              <div className="position-grid">
                <div className="pos-box-fill">
                    {/* <span>X</span> */}
                    <span>{Math.round(position.x)}</span>
                  </div>
              </div>
            )}

            {!isEffectsOpen ? (
                <div className="section-divider" style={{ marginTop: "1px" }} />
            ) : (
                <div className="section-divider" />
            )}

          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default RightPanel;
