import "./RightPanel.css";
import Fill from "./RightSections/Fill/Fill";
import Stroke from "./RightSections/Stroke/Stroke";
import Layout from "./RightSections/Layout/Layout";
import Effects from "./RightSections/Effects/Effects";
import Position from "./RightSections/Position/Position";
import Appearance from "./RightSections/Appearance/Appearance";
import TextPropertiesPanel from "./RightSections/Tyopography/Tyopography";
import Page from "./RightSections/Page/Page";
import { usePanelState } from "./usePanelState";

const RightPanel = ({
  collapsed,
  selectedShapes,
  setSelectedShapes,
  drawnRectangles,
  setDrawnRectangles,
  backgroundColor,
  setBackgroundColor,
  backgroundOpacity,
  setBackgroundOpacity
}) => {
  const selectedShapeId = selectedShapes && selectedShapes.length === 1 ? selectedShapes[0] : null;
  // Find the selected shape object
  const selectedShape = selectedShapeId ? drawnRectangles.find(s => s.id === selectedShapeId) : null;

  // Only pass drawnRectangles to usePanelState for text shapes
  const panelState = selectedShape && selectedShape.type === "text"
    ? usePanelState(selectedShapeId, drawnRectangles)
    : usePanelState(selectedShapeId);

  const {
    isFillOpen, setFillOpen,
    isStrokeOpen, setStrokeOpen,
    isTypographyOpen, setTypographyOpen
  } = panelState;

  const nothingSelected = !selectedShapes || selectedShapes.length === 0;

  return (
    <div className={`right-panel ${collapsed ? "collapsed" : ""}`}>
      {collapsed && (
        <></>
      )}

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
            {nothingSelected ? (
              <Page
                selectedShapes={selectedShapes}
                drawnRectangles={drawnRectangles}
                setDrawnRectangles={setDrawnRectangles}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                backgroundOpacity={backgroundOpacity}
                setBackgroundOpacity={setBackgroundOpacity}
              />
            ) : (
              <>
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
                {/* Only show Typography panel for text shapes */}
                {selectedShape && selectedShape.type === "text" && (
                  <TextPropertiesPanel
                    selectedShapes={selectedShapes}
                    drawnRectangles={drawnRectangles}
                    setDrawnRectangles={setDrawnRectangles}
                    isOpen={isTypographyOpen}
                    setOpen={setTypographyOpen}
                  />
                )}
                <Fill 
                  selectedShapes={selectedShapes}
                  drawnRectangles={drawnRectangles}
                  setDrawnRectangles={setDrawnRectangles}
                  isOpen={isFillOpen}
                  setOpen={setFillOpen}
                />
                <Stroke 
                  selectedShapes={selectedShapes}
                  drawnRectangles={drawnRectangles}
                  setDrawnRectangles={setDrawnRectangles}
                  isOpen={isStrokeOpen}
                  setOpen={setStrokeOpen}
                />
                <Effects />
                <div style={{ padding: 20 }}></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
