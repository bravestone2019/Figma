import { STROKE_DEFAULTS } from '../constants';

export const textStrokeHandler = {
  // Remove stroke completely
  removeStroke: (shape) => {
    return {
      ...shape,
      strokeColor: null,
      strokeWidth: 0,
      strokeOpacity: 0,
    };
  },

  // Add default stroke
  addStroke: (shape) => {
    return {
      ...shape,
      strokeColor: STROKE_DEFAULTS.COLOR,
      strokeWidth: STROKE_DEFAULTS.WIDTH,
      strokeOpacity: STROKE_DEFAULTS.OPACITY / 100,
    };
  },

  // Update color
  updateColor: (shape, color) => {
    return {
      ...shape,
      strokeColor: color,
    };
  },

  // Update opacity
  updateOpacity: (shape, opacity) => {
    return {
      ...shape,
      strokeOpacity: opacity / 100,
    };
  },

  // Update width
  updateWidth: (shape, width) => {
    return {
      ...shape,
      strokeWidth: width,
    };
  },

  // Update stroke position
  updatePosition: (shape, position) => {
    return {
      ...shape,
      strokePosition: position,
    };
  }
}; 