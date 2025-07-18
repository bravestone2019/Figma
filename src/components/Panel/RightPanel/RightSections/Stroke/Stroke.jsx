
import "../../RightPanel.css";
import "../Effects/Effects.css";

// Import refactored modules
import { STROKE_DEFAULTS } from './constants';
import { isUniformBorder } from './utils';
import { 
  useStrokeState, 
  useStrokeSync, 
  usePanelPositioning, 
  useStrokeHandlers 
} from './hooks';
import { 
  StrokeHeader, 
  ColorPicker, 
  StrokeToggle, 
  StrokeControls 
} from './components';

const Stroke = ({
  selectedShapes,
  drawnRectangles,
  setDrawnRectangles,
  isOpen,
  setOpen,
}) => {
  // Use custom hooks for state management
  const state = useStrokeState(selectedShapes, drawnRectangles);
  
  const setters = {
    setColor: state.setColor,
    setOpacity: state.setOpacity,
    setStrokeWidth: state.setStrokeWidth,
    setStrokePosition: state.setStrokePosition,
    setIsShown: state.setIsShown,
    setColorPanelOpen: state.setColorPanelOpen,
    setShowBorderPanel: state.setShowBorderPanel,
    setStrokePanelOpen: state.setStrokePanelOpen,
    setCoords: state.setCoords,
    setBorderPanelCoords: state.setBorderPanelCoords,
    setStrokePanelCoords: state.setStrokePanelCoords,
  };

  // Use custom hooks for handlers and effects
  const handlers = useStrokeHandlers(state, setters, selectedShapes, drawnRectangles, setDrawnRectangles);
  
  // Sync UI state with shape data
  useStrokeSync(state, setters, drawnRectangles, setDrawnRectangles);
  
  // Handle panel positioning
  usePanelPositioning(state, setters);

  // Handle expand/collapse with stroke control
  const handleExpandCollapse = () => {
    handlers.handleExpandCollapse(isOpen, setOpen);
  };

  // Handle stroke position change
  const handlePositionChange = (pos) => {
    state.setStrokePosition(pos);
    // Update the shape's strokePosition property
    if (state.isStrokeable && state.isSingle) {
      const shapeIdx = drawnRectangles.findIndex((s) => s.id === selectedShapes[0]);
      if (shapeIdx !== -1) {
        const updated = [...drawnRectangles];
        updated[shapeIdx] = { ...updated[shapeIdx], strokePosition: pos };
        setDrawnRectangles(updated);
      }
    }
  };

  // Handle border side change
  const handleBorderSideChange = (side) => {
    state.setSelectedBorderSide(side);
    handlers.handleBorderEdit(side, {});
  };

  // Handle stroke width change
  const handleWidthChange = (e) => {
    handlers.handleStrokeWidthChange(e);
  };

  // Check if border is uniform for stroke position control
  const isUniformBorderShape = isUniformBorder(state.shape, state.selectedBorderSide);

  return (
    <>
      <StrokeHeader 
        isOpen={isOpen} 
        onExpandCollapse={handleExpandCollapse} 
      />

      {isOpen && (
        <>
          {/* Top FLEX ROW */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 15,
              marginRight: 5,
              gap: 8,
            }}
          >
            <ColorPicker 
              color={state.color}
              opacity={state.opacity}
              onColorChange={handlers.handleColorUpdate}
              onOpacityChange={handlers.handleOpacityUpdate}
              colorPanelOpen={state.colorPanelOpen}
              onColorPanelToggle={() => state.setColorPanelOpen(!state.colorPanelOpen)}
              coords={state.coords}
              panelInputRef={state.panelInputRef}
              disabled={!state.isStrokeable}
            />

            <StrokeToggle 
              isShown={state.isShown}
              onToggle={handlers.handleToggleStroke}
              disabled={!state.isStrokeable}
            />
          </div>

          {/* BOTTOM GRID BLOCK */}
          <StrokeControls 
            strokePosition={state.strokePosition}
            strokeWidth={state.strokeWidth}
            selectedBorderSide={state.selectedBorderSide}
            onPositionChange={handlePositionChange}
            onWidthChange={handleWidthChange}
            onBorderSideChange={handleBorderSideChange}
            isUniformBorder={isUniformBorderShape}
            strokePanelOpen={state.strokePanelOpen}
            strokePanelCoords={state.strokePanelCoords}
            showBorderPanel={state.showBorderPanel}
            borderPanelCoords={state.borderPanelCoords}
            borderRef={state.borderRef}
            strokeDropdownRef={state.strokeDropdownRef}
            borderDropdownRef={state.borderDropdownRef}
            onStrokePanelToggle={() => state.setStrokePanelOpen(!state.strokePanelOpen)}
            onBorderPanelToggle={() => state.setShowBorderPanel(!state.showBorderPanel)}
          />
        </>
      )}

      {/* Thin Grey Divider */}
      {!isOpen ? (
        <div className="section-divider" style={{ marginTop: "1px" }} />
      ) : (
        <div className="section-divider" />
      )}
    </>
  );
};

export default Stroke;

