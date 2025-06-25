import "../../RightPanel.css"
import clock from "../../../../../assets/clock.png";

const Appearance = () => {
  return (
    <>
      <div className="right-section-title">Appearance</div>
      <div
        className="position-grid"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
        }}
      >
        <div className="pos-box" style={{ gap: 10 }}>
          <img
            src={clock}
            alt={clock}
            style={{ width: 12, height: 10, marginLeft: "-2px" }}
          />
          <input type="number" defaultValue={100} />
        </div>
        <div className="pos-box" style={{ gap: 10 }}>
          <img
            src={clock}
            alt={clock}
            style={{ width: 12, height: 10, marginLeft: "-2px" }}
          />
          <input type="number" defaultValue={100} />
        </div>
        <button
          className="reset-size-btn"
          style={{ width: "36px", height: "24px" }}
        >
          <img src={clock} alt={clock} style={{ width: 18, height: 13 }} />
        </button>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Appearance;
