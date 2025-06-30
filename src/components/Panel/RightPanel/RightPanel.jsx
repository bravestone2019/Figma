import "./RightPanel.css";
import Fill from "./RightSections/Fill/Fill";
import Stroke from "./RightSections/Stroke/Stroke";
import Layout from "./RightSections/Layout/Layout";
import Effects from "./RightSections/Effects/Effects";
import Position from "./RightSections/Position/Position";
import Appearance from "./RightSections/Appearance/Appearance";

const RightPanel = ({ collapsed }) => {
  // const zoomPercent = Math.round((scale || 1) * 100); scale

  return (
    <div className={`right-panel ${collapsed ? "collapsed" : ""}`}>
      {collapsed && (
        <>
        </>
        // <div className="zoom-collapsed-panel">
        //   <div className="zoom-collapsed-indicator">{zoomPercent}%</div>
        // </div>
      )}

      {!collapsed && (
        <div className="right-panel-content">
          <div className="right-panel-header">
            <div className="right-section-header">Design</div>
            {/* <div className="zoom-indicator">{zoomPercent}%</div> */}
          </div>
          <div className="right-header-divider" />

          {/* <div className="right-panel-scrollable"> */}
          <Position />
          <Layout />
          <Appearance />
          <Fill />
          <Stroke />
          <Effects />
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default RightPanel;
