import { useState, useEffect, useRef } from "react";

// Panel keys
const PANEL_KEYS = ["fill", "stroke", "typography"];

// Default: all panels collapsed
const defaultPanelState = {
  fill: false,
  stroke: false,
  typography: false,
};

// Helper to determine if a panel should be open based on shape properties
function getInitialPanelStateForShape(shape) {
  if (!shape) return defaultPanelState;
  return {
    fill: !!(shape.fillColor && shape.fillColor !== "#000000"),
    stroke: !!(shape.strokeWidth && shape.strokeWidth !== 1),
    typography: shape.type === "text" && (
      (shape.fontFamily && shape.fontFamily !== "Arial") ||
      (shape.fontSize && shape.fontSize !== 16) ||
      (shape.fontWeight && shape.fontWeight !== "Regular") ||
      (shape.textAlign && shape.textAlign !== "left")
    ),
  };
}

function hasNonDefaultTypography(shape) {
  if (!shape || shape.type !== "text") return false;
  return (
    (shape.fontFamily && shape.fontFamily !== "Arial") ||
    (shape.fontSize && shape.fontSize !== 16) ||
    (shape.fontWeight && shape.fontWeight !== "Regular") ||
    (shape.textAlign && shape.textAlign !== "left")
  );
}

export function usePanelState(selectedShapeId, drawnRectangles) {
  // Store panel state per shape ID
  const panelStateMap = useRef({});
  // Local state for current shape
  const [panelState, setPanelState] = useState(defaultPanelState);

  useEffect(() => {
    if (!selectedShapeId) {
      setPanelState(defaultPanelState); // Collapse all if nothing selected
    } else {
      const shape = drawnRectangles?.find(s => s.id === selectedShapeId);
      if (shape && shape.type === "text" && hasNonDefaultTypography(shape)) {
        setPanelState(s => ({ ...s, typography: true }));
      } else if (panelStateMap.current[selectedShapeId]) {
        setPanelState(panelStateMap.current[selectedShapeId]);
      } else {
        setPanelState(defaultPanelState);
      }
    }
  }, [selectedShapeId, drawnRectangles]);

  // Save panel state when it changes (for current shape)
  useEffect(() => {
    if (selectedShapeId) {
      panelStateMap.current[selectedShapeId] = panelState;
    }
  }, [panelState, selectedShapeId]);

  // Setters for each panel
  const setFillOpen = (open) => setPanelState((s) => ({ ...s, fill: open }));
  const setStrokeOpen = (open) => setPanelState((s) => ({ ...s, stroke: open }));
  const setTypographyOpen = (open) => setPanelState((s) => ({ ...s, typography: open }));

  // Find the selected shape
  const shape = selectedShapeId && drawnRectangles
    ? drawnRectangles.find(s => s.id === selectedShapeId)
    : null;

  // Only force open Typography for text shapes with non-default values ONCE, when first selected
  const [hasForcedOpen, setHasForcedOpen] = useState(false);
  useEffect(() => {
    setHasForcedOpen(false);
  }, [selectedShapeId]);

  const isTypographyOpen = (() => {
    if (shape && shape.type === "text" && hasNonDefaultTypography(shape) && !hasForcedOpen) {
      setHasForcedOpen(true);
      return true;
    }
    return panelState.typography;
  })();

  return {
    isFillOpen: panelState.fill,
    setFillOpen,
    isStrokeOpen: panelState.stroke,
    setStrokeOpen,
    isTypographyOpen,
    setTypographyOpen,
  };
} 