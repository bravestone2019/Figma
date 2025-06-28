// boundShape.js
// Utility to compute the bounding rectangle for various shape types

/**
 * Returns the bounding rectangle for a given shape object.
 * @param {Object} shape - The shape object (must have a 'type' property)
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function getBoundingRect(shape) {
  switch (shape.type) {
    case 'rectangle': {
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    }
    case 'circle': {
      return {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };
    }
    case 'line': {
      const x = Math.min(shape.x1, shape.x2);
      const y = Math.min(shape.y1, shape.y2);
      const width = Math.abs(shape.x2 - shape.x1);
      const height = Math.abs(shape.y2 - shape.y1);
      return { x, y, width, height };
    }
    case 'triangle': {
      // Assume triangle is defined by three points: (x1, y1), (x2, y2), (x3, y3)
      const xs = [shape.x1, shape.x2, shape.x3];
      const ys = [shape.y1, shape.y2, shape.y3];
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      const width = Math.max(...xs) - x;
      const height = Math.max(...ys) - y;
      return { x, y, width, height };
    }
    case 'text': {
      // For text, we need width and height, which may be stored or measured elsewhere
      // Here, we assume shape has x, y, width, height (fallback to fontSize if not)
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width || (shape.text ? shape.text.length * (shape.fontSize || 16) * 0.6 : 50),
        height: shape.height || (shape.fontSize || 16) * 1.2,
      };
    }
    case 'polygon': {
      // Assume shape.points is an array of {x, y}
      if (!shape.points || shape.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
      const xs = shape.points.map(p => p.x);
      const ys = shape.points.map(p => p.y);
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      const width = Math.max(...xs) - x;
      const height = Math.max(...ys) - y;
      return { x, y, width, height };
    }
    default:
      return { x: 0, y: 0, width: 0, height: 0 };
  }
} 