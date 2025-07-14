import { STROKE_DEFAULTS, BORDER_SIDES } from './constants';

// Migration utility to ensure all per-side border properties are present
export function ensurePerSideBorders(rect) {
  if (rect.type !== 'rectangle') return rect;
  return {
    ...rect,
    borderTopColor: rect.borderTopColor ?? rect.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderRightColor: rect.borderRightColor ?? rect.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderBottomColor: rect.borderBottomColor ?? rect.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderLeftColor: rect.borderLeftColor ?? rect.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderTopWidth: rect.borderTopWidth ?? rect.borderWidth ?? STROKE_DEFAULTS.WIDTH,
    borderRightWidth: rect.borderRightWidth ?? rect.borderWidth ?? STROKE_DEFAULTS.WIDTH,
    borderBottomWidth: rect.borderBottomWidth ?? rect.borderWidth ?? STROKE_DEFAULTS.WIDTH,
    borderLeftWidth: rect.borderLeftWidth ?? rect.borderWidth ?? STROKE_DEFAULTS.WIDTH,
  };
}

// Migration utility for images
export function ensurePerSideBordersImage(img) {
  if (img.type !== 'image') return img;
  return {
    ...img,
    borderTopColor: img.borderTopColor ?? img.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderRightColor: img.borderRightColor ?? img.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderBottomColor: img.borderBottomColor ?? img.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderLeftColor: img.borderLeftColor ?? img.borderColor ?? STROKE_DEFAULTS.COLOR,
    borderTopWidth: img.borderTopWidth ?? img.borderWidth ?? STROKE_DEFAULTS.WIDTH,
    borderRightWidth: img.borderRightWidth ?? img.borderWidth ?? STROKE_DEFAULTS.WIDTH,
    borderBottomWidth: img.borderBottomWidth ?? img.borderWidth ?? STROKE_DEFAULTS.WIDTH,
    borderLeftWidth: img.borderLeftWidth ?? img.borderWidth ?? STROKE_DEFAULTS.WIDTH,
  };
}

// Stroke property getters
export function getInitialColor(isStrokeable, shapeType, shape) {
  if (!isStrokeable) return STROKE_DEFAULTS.COLOR;
  if (shapeType === "rectangle" || shapeType === "image")
    return shape.borderColor || STROKE_DEFAULTS.COLOR;
  if (shapeType === "text") return shape.strokeColor || STROKE_DEFAULTS.COLOR;
  if (shapeType === "line") return shape.color || STROKE_DEFAULTS.COLOR;
  return STROKE_DEFAULTS.COLOR;
}

export function getInitialOpacity(isStrokeable, shapeType, shape) {
  if (!isStrokeable) return STROKE_DEFAULTS.OPACITY;
  if (shapeType === "rectangle" || shapeType === "image") {
    if (shape && shape.borderOpacity !== undefined) return Math.round(shape.borderOpacity * 100);
  }
  if ((shapeType === "text" || shapeType === "line") && shape && shape.strokeOpacity !== undefined) {
    return Math.round(shape.strokeOpacity * 100);
  }
  return STROKE_DEFAULTS.OPACITY;
}

export function getInitialStrokeWidth(isStrokeable, shapeType, shape) {
  if (!isStrokeable) return STROKE_DEFAULTS.WIDTH;
  if (shapeType === "rectangle" || shapeType === "image") {
    if (shape.borderWidth !== undefined) return shape.borderWidth;
    if (shape.borderTopWidth !== undefined) return shape.borderTopWidth;
    if (shape.borderRightWidth !== undefined) return shape.borderRightWidth;
    if (shape.borderBottomWidth !== undefined) return shape.borderBottomWidth;
    if (shape.borderLeftWidth !== undefined) return shape.borderLeftWidth;
  }
  if (shapeType === "text" && shape.strokeWidth !== undefined) {
    return shape.strokeWidth;
  }
  if (shapeType === "line" && shape.width !== undefined) {
    return shape.width;
  }
  return STROKE_DEFAULTS.WIDTH;
}

export function getCurrentStrokeColor(isStrokeable, shapeType, shape, selectedBorderSide) {
  if (!isStrokeable) return STROKE_DEFAULTS.COLOR;
  if (shapeType === "rectangle") {
    if (selectedBorderSide === BORDER_SIDES.ALL) return shape.borderColor || STROKE_DEFAULTS.COLOR;
    if (selectedBorderSide === BORDER_SIDES.TOP) return shape.borderTopColor || STROKE_DEFAULTS.COLOR;
    if (selectedBorderSide === BORDER_SIDES.RIGHT) return shape.borderRightColor || STROKE_DEFAULTS.COLOR;
    if (selectedBorderSide === BORDER_SIDES.BOTTOM) return shape.borderBottomColor || STROKE_DEFAULTS.COLOR;
    if (selectedBorderSide === BORDER_SIDES.LEFT) return shape.borderLeftColor || STROKE_DEFAULTS.COLOR;
  }
  if (shapeType === "text") return shape.strokeColor || STROKE_DEFAULTS.COLOR;
  if (shapeType === "line") return shape.color || STROKE_DEFAULTS.COLOR;
  if (shapeType === "image") return shape.borderColor || STROKE_DEFAULTS.COLOR;
  return STROKE_DEFAULTS.COLOR;
}

export function getCurrentStrokeWidth(isStrokeable, shapeType, shape, selectedBorderSide) {
  if (!isStrokeable) return STROKE_DEFAULTS.WIDTH;
  if (shapeType === "rectangle" || shapeType === "image") {
    if (selectedBorderSide === BORDER_SIDES.ALL) {
      return shape.borderWidth ?? shape.borderTopWidth ?? STROKE_DEFAULTS.WIDTH;
    } else if (selectedBorderSide === BORDER_SIDES.TOP) {
      return shape.borderTopWidth ?? STROKE_DEFAULTS.WIDTH;
    } else if (selectedBorderSide === BORDER_SIDES.RIGHT) {
      return shape.borderRightWidth ?? STROKE_DEFAULTS.WIDTH;
    } else if (selectedBorderSide === BORDER_SIDES.BOTTOM) {
      return shape.borderBottomWidth ?? STROKE_DEFAULTS.WIDTH;
    } else if (selectedBorderSide === BORDER_SIDES.LEFT) {
      return shape.borderLeftWidth ?? STROKE_DEFAULTS.WIDTH;
    }
  }
  if (shapeType === "text" && shape.strokeWidth !== undefined) {
    return shape.strokeWidth;
  }
  if (shapeType === "line" && shape.width !== undefined) {
    return shape.width;
  }
  return STROKE_DEFAULTS.WIDTH;
}

// Validation & checks
export function isUniformBorder(shape, selectedBorderSide) {
  if (!shape) return false;
  if (shape.type === 'rectangle' || shape.type === 'image') {
    const w = [shape.borderTopWidth, shape.borderRightWidth, shape.borderBottomWidth, shape.borderLeftWidth];
    const c = [shape.borderTopColor, shape.borderRightColor, shape.borderBottomColor, shape.borderLeftColor];
    return w.every(v => v === w[0]) && c.every(v => v === c[0]);
  }
  if (shape.type === 'text') {
    return selectedBorderSide === BORDER_SIDES.ALL;
  }
  return false;
}

export function hasStroke(shape, shapeType) {
  if (shapeType === "rectangle" || shapeType === "image") {
    return shape.borderWidth > 0 || 
           shape.borderTopWidth > 0 || 
           shape.borderRightWidth > 0 || 
           shape.borderBottomWidth > 0 || 
           shape.borderLeftWidth > 0;
  } else if (shapeType === "text") {
    return shape.strokeWidth && shape.strokeWidth > 0;
  } else if (shapeType === "line") {
    return shape.width && shape.width > 0;
  }
  return false;
}

export function isStrokeable(isSingle, shapeType) {
  return isSingle && ["rectangle", "text", "image", "line"].includes(shapeType);
}

// Color utilities
export function hexToRgb(hex) {
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
}

export function rgbToHex({ r, g, b }) {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

export function parseColorToHex(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') return null;
  
  // Handle hex colors
  if (colorStr.startsWith('#')) {
    return colorStr;
  }
  
  // Handle rgb/rgba colors
  if (colorStr.startsWith('rgb')) {
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const [, r, g, b] = match;
      return rgbToHex({ r: parseInt(r), g: parseInt(g), b: parseInt(b) });
    }
  }
  
  return null;
} 