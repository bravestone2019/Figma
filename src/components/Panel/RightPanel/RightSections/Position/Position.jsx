import "../../RightPanel.css";
import degrees from "../../../../../assets/RightPanel/degrees.png";
import horizontal from "../../../../../assets/RightPanel/horizontal-flip.png";
import Angle from "../../../../../assets/RightPanel/angle.png";

const Position = () => {
  return (
    <>
      <div className="right-section-title">Position</div>
      <div className="position-grid">
        <div className="pos-box" style={{ gap: 6 }}>
          <span>X</span>
          <input type="number" defaultValue={1000} />
        </div>
        <div className="pos-box" style={{ gap: 6 }}>
          <span>Y</span>
          <input type="number" defaultValue={1000} />
        </div>
        <div className="pos-box" style={{ gap: 6 }}>
          <img src={Angle} alt={Angle} style={{ width: 13, height: 10 }} />
          <input type="number" defaultValue={0} />
        </div>
        <div className="pos-box" style={{ display: "flex", gap: "10px" }}>
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
