import "./Layout.css";
import "../../RightPanel.css";
import Corner from "../../../../../assets/RightPanel/corner.png";

const Layout = () => {
  return (
    <>
      <div className="right-section-title">Layout</div>
      <div
        className="position-grid"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
        }}
      >
        <div className="pos-box">
          <span>W</span>
          <input type="number" defaultValue={100} />
        </div>
        <div className="pos-box">
          <span>H</span>
          <input type="number" defaultValue={100} />
        </div>
        <button className="reset-size-btn">
          <img src={Corner} alt={Corner} style={{ width: 18, height: 13 }} />
        </button>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default Layout;
