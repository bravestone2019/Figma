import "../../RightPanel.css";
import { useRef } from "react";
import degrees from "../../../../../assets/RightPanel/degrees.png";
import horizontal from "../../../../../assets/RightPanel/horizontal-flip.png";
import Angle from "../../../../../assets/RightPanel/angle.png";

const Position = () => {
  const xInputRef = useRef(null);
  const yInputRef = useRef(null);
  const angleInputRef = useRef(null);

  // Helper function to focus an input
  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Optional: Select all text in the input field when it's focused
      inputRef.current.select();
    }
  };

  return (
    <>
      <div className="right-section-title">Position</div>
      <div className="position-grid">
        <div className="pos-box" style={{ gap: 6 }} onClick={() => focusInput(xInputRef)}>
          <span>X</span>
          <input type="number" defaultValue={1000} ref={xInputRef}/>
        </div>
        <div className="pos-box" style={{ gap: 6 }} onClick={() => focusInput(yInputRef)}>
          <span>Y</span>
          <input type="number" defaultValue={1000} ref={yInputRef} />
        </div>
        <div className="pos-box" style={{ gap: 6 }} onClick={() => focusInput(angleInputRef)}>
          <img src={Angle} alt={Angle} style={{ width: 13, height: 10 }} />
          <input type="number" defaultValue={0} ref={angleInputRef}/>
        </div>
        <div className="pos-box-button" style={{ display: "flex", gap: "10px",  }}>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              borderRight: "2px solid #fff",
            }}
          >
            <img
              src={degrees}
              alt={degrees}
              style={{ width: 13, height: 12, marginRight: "8px" }}
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
              src={horizontal}
              alt={horizontal}
              style={{ width: 13, height: 12, marginRight: "8px" }}
            />
          </button>
          <button style={{ background: "none", border: "none", padding: 0 }}>
            <img
              src={Angle}
              alt={Angle}
              style={{ width: 12, height: 10, marginLeft: "-5px" }}
            />
          </button>
        </div>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Position;
