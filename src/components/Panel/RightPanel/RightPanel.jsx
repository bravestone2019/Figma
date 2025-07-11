import "./RightPanel.css";
import Fill from "./RightSections/Fill/Fill";
import Stroke from "./RightSections/Stroke/Stroke";
import Layout from "./RightSections/Layout/Layout";
import Effects from "./RightSections/Effects/Effects";
import Position from "./RightSections/Position/Position";
import Appearance from "./RightSections/Appearance/Appearance";
import TextPropertiesPanel from "./RightSections/Tyopography/Tyopography";

const RightPanel = ({
  collapsed,
  selectedShapes,
  setSelectedShapes,
  drawnRectangles,
  setDrawnRectangles,
}) => {
  // const selectedShapeId =
  //   selectedShapes && selectedShapes.length === 1 ? selectedShapes[0] : null;
  // // Find the selected shape object
  // const selectedShape = selectedShapeId
  //   ? drawnRectangles.find((s) => s.id === selectedShapeId)
  //   : null;

  return (
    <div className={`right-panel ${collapsed ? "collapsed" : ""}`}>
      {!collapsed && (
        <div className="right-panel-content">
          <div className="right-panel-header">
            <div className="right-section-header">
              <div
                style={{
                  padding: "6px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.08)",
                }}
              >
                Design
              </div>
            </div>
          </div>
          <div className="right-header-divider" />

          <div className="right-panel-scrollable">
            <Position
              selectedShapes={selectedShapes}
              setSelectedShapes={setSelectedShapes}
              drawnRectangles={drawnRectangles}
              setDrawnRectangles={setDrawnRectangles}
            />
            <Layout
              selectedShapes={selectedShapes}
              drawnRectangles={drawnRectangles}
              setDrawnRectangles={setDrawnRectangles}
            />
            <Appearance
              selectedShapes={selectedShapes}
              drawnRectangles={drawnRectangles}
              setDrawnRectangles={setDrawnRectangles}
            />
            {/* {selectedShape && selectedShape.type === "text" && ( */}
              <TextPropertiesPanel />
            {/* )} */}

            <Fill
              selectedShapes={selectedShapes}
              drawnRectangles={drawnRectangles}
              setDrawnRectangles={setDrawnRectangles}
            />
            <Stroke
              selectedShapes={selectedShapes}
              drawnRectangles={drawnRectangles}
              setDrawnRectangles={setDrawnRectangles}
            />
            <Effects />
            <div style={{ padding: 20 }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
