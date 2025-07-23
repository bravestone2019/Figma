import { STROKE_DEFAULTS } from '../constants';

export const lineStrokeHandler = {
  // Remove stroke completely
  removeStroke: (shape) => {
    return {
      ...shape,
      color: null,
      width: 0,
      opacity: 0,
    };
  },

  // Add default stroke
  addStroke: (shape) => {
    return {
      ...shape,
      color: STROKE_DEFAULTS.COLOR,
      width: STROKE_DEFAULTS.WIDTH,
      opacity: STROKE_DEFAULTS.OPACITY / 100,
    };
  },

  // Update color
  updateColor: (shape, color) => {
    return {
      ...shape,
      color: color,
    };
  },

  // Update opacity
  updateOpacity: (shape, opacity) => {
    return {
      ...shape,
      opacity: opacity / 100,
    };
  },

  // Update width
  updateWidth: (shape, width) => {
    return {
      ...shape,
      width: width,
    };
  }
}; 