import { useState, useRef, useCallback } from 'react';
import { STROKE_DEFAULTS, BORDER_SIDES } from '../constants';
import { 
  getInitialColor, 
  getInitialOpacity, 
  getInitialStrokeWidth,
  isStrokeable 
} from '../utils';

export const useStrokeState = (selectedShapes, drawnRectangles) => {
  const isSingle = selectedShapes && selectedShapes.length === 1;
  let shape = null;
  let shapeType = "";
  
  if (isSingle) {
    shape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (shape) shapeType = shape.type;
  }

  const isStrokeableShape = isStrokeable(isSingle, shapeType);

  // Color, opacity, width state
  const [color, setColor] = useState(() => getInitialColor(isStrokeableShape, shapeType, shape));
  const [opacity, setOpacity] = useState(() => getInitialOpacity(isStrokeableShape, shapeType, shape));
  const [strokeWidth, setStrokeWidth] = useState(() => getInitialStrokeWidth(isStrokeableShape, shapeType, shape));

  // Panel open/close state
  const [colorPanelOpen, setColorPanelOpen] = useState(false);
  const [showBorderPanel, setShowBorderPanel] = useState(false);
  const [strokePanelOpen, setStrokePanelOpen] = useState(false);

  // Border side selection state
  const [selectedBorderSide, setSelectedBorderSide] = useState(BORDER_SIDES.ALL);

  // Stroke position state
  const [strokePosition, setStrokePosition] = useState(STROKE_DEFAULTS.POSITION);

  // Visibility state
  const [isShown, setIsShown] = useState(true);

  // Refs
  const panelInputRef = useRef(null);
  const borderRef = useRef(null);
  const borderDropdownRef = useRef(null);
  const strokeDropdownRef = useRef(null);
  const prevWidthsRef = useRef({});
  const lastUniformStrokePosition = useRef(STROKE_DEFAULTS.POSITION);

  // Coordinates for panel positioning
  const [coords, setCoords] = useState(null);
  const [borderPanelCoords, setBorderPanelCoords] = useState(null);
  const [strokePanelCoords, setStrokePanelCoords] = useState(null);

  // Computed values
  const currentFullColor = useCallback(() => {
    const hexToRgb = (hex) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return { r, g, b };
    };
    return { ...hexToRgb(color), a: opacity / 100 };
  }, [color, opacity]);

  return {
    // Shape info
    isSingle,
    shape,
    shapeType,
    isStrokeable: isStrokeableShape,

    // Stroke properties
    color,
    setColor,
    opacity,
    setOpacity,
    strokeWidth,
    setStrokeWidth,

    // Panel states
    colorPanelOpen,
    setColorPanelOpen,
    showBorderPanel,
    setShowBorderPanel,
    strokePanelOpen,
    setStrokePanelOpen,

    // Border selection
    selectedBorderSide,
    setSelectedBorderSide,

    // Stroke position
    strokePosition,
    setStrokePosition,

    // Visibility
    isShown,
    setIsShown,

    // Refs
    panelInputRef,
    borderRef,
    borderDropdownRef,
    strokeDropdownRef,
    prevWidthsRef,
    lastUniformStrokePosition,

    // Coordinates
    coords,
    setCoords,
    borderPanelCoords,
    setBorderPanelCoords,
    strokePanelCoords,
    setStrokePanelCoords,

    // Computed
    currentFullColor
  };
}; 