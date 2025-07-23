import { STROKE_DEFAULTS, BORDER_SIDES } from '../constants';

export const rectangleStrokeHandler = {
  // Remove stroke completely
  removeStroke: (shape) => {
    return {
      ...shape,
      borderColor: null,
      borderTopColor: null,
      borderRightColor: null,
      borderBottomColor: null,
      borderLeftColor: null,
      borderWidth: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderOpacity: 0,
    };
  },

  // Add default stroke
  addStroke: (shape) => {
    return {
      ...shape,
      borderColor: STROKE_DEFAULTS.COLOR,
      borderTopColor: STROKE_DEFAULTS.COLOR,
      borderRightColor: STROKE_DEFAULTS.COLOR,
      borderBottomColor: STROKE_DEFAULTS.COLOR,
      borderLeftColor: STROKE_DEFAULTS.COLOR,
      borderWidth: STROKE_DEFAULTS.WIDTH,
      borderTopWidth: STROKE_DEFAULTS.WIDTH,
      borderRightWidth: STROKE_DEFAULTS.WIDTH,
      borderBottomWidth: STROKE_DEFAULTS.WIDTH,
      borderLeftWidth: STROKE_DEFAULTS.WIDTH,
      borderOpacity: STROKE_DEFAULTS.OPACITY / 100,
    };
  },

  // Update color for specific border side
  updateColor: (shape, color, selectedBorderSide) => {
    const updatedShape = { ...shape };
    
    if (selectedBorderSide === BORDER_SIDES.ALL) {
      updatedShape.borderColor = color;
      updatedShape.borderTopColor = color;
      updatedShape.borderRightColor = color;
      updatedShape.borderBottomColor = color;
      updatedShape.borderLeftColor = color;
    } else {
      updatedShape.borderTopColor = selectedBorderSide === BORDER_SIDES.TOP ? color : "transparent";
      updatedShape.borderRightColor = selectedBorderSide === BORDER_SIDES.RIGHT ? color : "transparent";
      updatedShape.borderBottomColor = selectedBorderSide === BORDER_SIDES.BOTTOM ? color : "transparent";
      updatedShape.borderLeftColor = selectedBorderSide === BORDER_SIDES.LEFT ? color : "transparent";
    }
    
    return updatedShape;
  },

  // Update opacity
  updateOpacity: (shape, opacity) => {
    return {
      ...shape,
      borderOpacity: opacity / 100,
    };
  },

  // Update width for specific border side
  updateWidth: (shape, width, selectedBorderSide) => {
    const updatedShape = { ...shape };
    
    if (selectedBorderSide === BORDER_SIDES.ALL) {
      updatedShape.borderWidth = width;
      updatedShape.borderTopWidth = width;
      updatedShape.borderRightWidth = width;
      updatedShape.borderBottomWidth = width;
      updatedShape.borderLeftWidth = width;
    } else if (selectedBorderSide === BORDER_SIDES.TOP) {
      updatedShape.borderTopWidth = width;
    } else if (selectedBorderSide === BORDER_SIDES.RIGHT) {
      updatedShape.borderRightWidth = width;
    } else if (selectedBorderSide === BORDER_SIDES.BOTTOM) {
      updatedShape.borderBottomWidth = width;
    } else if (selectedBorderSide === BORDER_SIDES.LEFT) {
      updatedShape.borderLeftWidth = width;
    }
    
    return updatedShape;
  },

  // Update border side selection
  updateBorderSide: (shape, side, { color, width }, lastUniformStrokePosition) => {
    const updatedShape = { ...shape };
    
    if (side === BORDER_SIDES.ALL) {
      if (color) {
        updatedShape.borderColor = color;
        updatedShape.borderTopColor = color;
        updatedShape.borderRightColor = color;
        updatedShape.borderBottomColor = color;
        updatedShape.borderLeftColor = color;
      }
      if (width) {
        updatedShape.borderWidth = width;
        updatedShape.borderTopWidth = width;
        updatedShape.borderRightWidth = width;
        updatedShape.borderBottomWidth = width;
        updatedShape.borderLeftWidth = width;
      }
      updatedShape.strokePosition = lastUniformStrokePosition || STROKE_DEFAULTS.POSITION;
    } else {
      const cap = side.charAt(0).toUpperCase() + side.slice(1);
      if (color) updatedShape[`border${cap}Color`] = color;
      if (width) updatedShape[`border${cap}Width`] = width;
    }
    
    // Ensure all per-side properties are present
    updatedShape.borderTopColor = updatedShape.borderTopColor ?? updatedShape.borderColor ?? STROKE_DEFAULTS.COLOR;
    updatedShape.borderRightColor = updatedShape.borderRightColor ?? updatedShape.borderColor ?? STROKE_DEFAULTS.COLOR;
    updatedShape.borderBottomColor = updatedShape.borderBottomColor ?? updatedShape.borderColor ?? STROKE_DEFAULTS.COLOR;
    updatedShape.borderLeftColor = updatedShape.borderLeftColor ?? updatedShape.borderColor ?? STROKE_DEFAULTS.COLOR;
    updatedShape.borderTopWidth = updatedShape.borderTopWidth ?? updatedShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
    updatedShape.borderRightWidth = updatedShape.borderRightWidth ?? updatedShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
    updatedShape.borderBottomWidth = updatedShape.borderBottomWidth ?? updatedShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
    updatedShape.borderLeftWidth = updatedShape.borderLeftWidth ?? updatedShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
    
    return updatedShape;
  },

  // Toggle stroke visibility
  toggleStroke: (shape, isShown, strokeWidth, prevWidthsRef) => {
    if (isShown) {
      // Hide: store current widths and set all to 0
      prevWidthsRef.current = {
        borderTopWidth: shape.borderTopWidth,
        borderRightWidth: shape.borderRightWidth,
        borderBottomWidth: shape.borderBottomWidth,
        borderLeftWidth: shape.borderLeftWidth,
      };
      return {
        ...shape,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
      };
    } else {
      // Show: restore previous widths or use strokeWidth
      const prev = prevWidthsRef.current;
      return {
        ...shape,
        borderTopWidth: prev.borderTopWidth ?? strokeWidth,
        borderRightWidth: prev.borderRightWidth ?? strokeWidth,
        borderBottomWidth: prev.borderBottomWidth ?? strokeWidth,
        borderLeftWidth: prev.borderLeftWidth ?? strokeWidth,
      };
    }
  }
}; 