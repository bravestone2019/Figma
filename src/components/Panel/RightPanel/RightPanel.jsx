import "./RightPanel.css";
import Fill from "./RightSections/Fill/Fill";
import Stroke from "./RightSections/Stroke/Stroke";
import Layout from "./RightSections/Layout/Layout";
import Effects from "./RightSections/Effects/Effects";
import Position from "./RightSections/Position/Position";
import Appearance from "./RightSections/Appearance/Appearance";

const RightPanel = ({ collapsed, selectedShapes, setSelectedShapes, drawnRectangles, setDrawnRectangles }) => {
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
            {/*
            <div className="toggle-wrapper" onClick={toggleCollapsed}>
              <img src={Minimize} alt="Minimize" className="toggle-icon" />
              <span className="left-toggle">
                {collapsed ? "Expand UI" : "Minimize UI"}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shift+/
              </span>
            </div>
            */}
          </div>
          <div className="right-header-divider" />

          {/* <div className="right-panel-scrollable"> */}
          <Position 
            selectedShapes={selectedShapes}
            setSelectedShapes={setSelectedShapes}
            drawnRectangles={drawnRectangles}
            setDrawnRectangles={setDrawnRectangles}
          />
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
