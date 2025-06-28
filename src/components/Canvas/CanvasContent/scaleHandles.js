// scaleHandles.js
// Draws white scale handles (small rectangles) at the corners and midpoints of a bounding box

/**
 * Draws scale handles on the bounding box
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {{x: number, y: number, width: number, height: number}} bounds - The bounding box
 * @param {number} scale - The current canvas scale
 */
export function drawScaleHandles(ctx, bounds, scale) {
  const handleSize = 10 / scale; // Size of the handle (scaled)
  const half = handleSize / 2;
  const { x, y, width, height } = bounds;

  // 8 handle positions: corners and midpoints
  const positions = [
    // Corners
    { x: x, y: y }, // top-left
    { x: x + width, y: y }, // top-right
    { x: x, y: y + height }, // bottom-left
    { x: x + width, y: y + height }, // bottom-right
    // Sides
    { x: x + width / 2, y: y }, // top-middle
    { x: x + width / 2, y: y + height }, // bottom-middle
    { x: x, y: y + height / 2 }, // left-middle
    { x: x + width, y: y + height / 2 }, // right-middle
  ];

  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2196f3';
  ctx.lineWidth = 1.5 / scale;
  positions.forEach(pos => {
    ctx.beginPath();
    ctx.rect(pos.x - half, pos.y - half, handleSize, handleSize);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Returns the positions and types of all scale handles for a bounding box
 * @param {{x: number, y: number, width: number, height: number}} bounds
 * @returns {Array<{x: number, y: number, type: string}>}
 */
export function getScaleHandlePositions(bounds) {
  const { x, y, width, height } = bounds;
  return [
    { x: x, y: y, type: 'nw' }, // top-left
    { x: x + width, y: y, type: 'ne' }, // top-right
    { x: x, y: y + height, type: 'sw' }, // bottom-left
    { x: x + width, y: y + height, type: 'se' }, // bottom-right
    { x: x + width / 2, y: y, type: 'n' }, // top-middle
    { x: x + width / 2, y: y + height, type: 's' }, // bottom-middle
    { x: x, y: y + height / 2, type: 'w' }, // left-middle
    { x: x + width, y: y + height / 2, type: 'e' }, // right-middle
  ];
}

/**
 * Draws only the four corner scale handles (white rectangles) for a bounding box
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number, width: number, height: number}} bounds
 * @param {number} scale
 */
export function drawCornerScaleHandles(ctx, bounds, scale) {
  const handleSize = 10 / scale;
  const half = handleSize / 2;
  const { x, y, width, height } = bounds;
  const positions = [
    { x: x, y: y }, // top-left
    { x: x + width, y: y }, // top-right
    { x: x, y: y + height }, // bottom-left
    { x: x + width, y: y + height }, // bottom-right
  ];
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2196f3';
  ctx.lineWidth = 1.5 / scale;
  positions.forEach(pos => {
    ctx.beginPath();
    ctx.rect(pos.x - half, pos.y - half, handleSize, handleSize);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Draws two white handles at the endpoints of a line shape
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x1: number, y1: number, x2: number, y2: number}} line
 * @param {number} scale
 */
export function drawLineHandles(ctx, line, scale) {
  const handleSize = 10 / scale;
  const half = handleSize / 2;
  const positions = [
    { x: line.x1, y: line.y1 },
    { x: line.x2, y: line.y2 },
  ];
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2196f3';
  ctx.lineWidth = 1.5 / scale;
  positions.forEach(pos => {
    ctx.beginPath();
    ctx.rect(pos.x - half, pos.y - half, handleSize, handleSize);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Resizes a shape based on the handle being dragged and the new mouse position.
 * @param {Object} shape - The original shape object
 * @param {string} handleType - The handle type (e.g., 'nw', 'se', 'n', 'e', etc. or 'endpoint1', 'endpoint2' for lines)
 * @param {Object} origBounds - The original bounding box or points
 * @param {Object} mouse - The new mouse position {x, y}
 * @returns {Object} - The new shape object
 */
export function resizeShape(shape, handleType, origBounds, mouse) {
  if (shape.type === 'rectangle' || shape.type === 'text') {
    let { x, y, width, height } = origBounds;
    let newX = x, newY = y, newW = width, newH = height;
    switch (handleType) {
      case 'nw':
        newW = width + (x - mouse.x);
        newH = height + (y - mouse.y);
        newX = mouse.x;
        newY = mouse.y;
        break;
      case 'ne':
        newW = mouse.x - x;
        newH = height + (y - mouse.y);
        newY = mouse.y;
        break;
      case 'sw':
        newW = width + (x - mouse.x);
        newX = mouse.x;
        newH = mouse.y - y;
        break;
      case 'se':
        newW = mouse.x - x;
        newH = mouse.y - y;
        break;
      case 'n':
        newH = height + (y - mouse.y);
        newY = mouse.y;
        break;
      case 's':
        newH = mouse.y - y;
        break;
      case 'w':
        newW = width + (x - mouse.x);
        newX = mouse.x;
        break;
      case 'e':
        newW = mouse.x - x;
        break;
    }
    // Prevent negative width/height
    newW = Math.max(1, newW);
    newH = Math.max(1, newH);
    return { ...shape, x: newX, y: newY, width: newW, height: newH };
  } else if (shape.type === 'line') {
    if (handleType === 'endpoint1') {
      return { ...shape, x1: mouse.x, y1: mouse.y };
    } else if (handleType === 'endpoint2') {
      return { ...shape, x2: mouse.x, y2: mouse.y };
    }
  } else if (shape.type === 'circle') {
    // Resize from center (x, y) and radius
    const { x, y } = shape;
    const dx = mouse.x - x;
    const dy = mouse.y - y;
    const newRadius = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    return { ...shape, radius: newRadius };
  } else if (shape.type === 'triangle') {
    // Assume triangle is defined by three points; resize by moving the closest point
    const points = [
      { x: shape.x1, y: shape.y1 },
      { x: shape.x2, y: shape.y2 },
      { x: shape.x3, y: shape.y3 },
    ];
    let idx = 0;
    let minDist = Infinity;
    points.forEach((pt, i) => {
      const d = Math.hypot(pt.x - mouse.x, pt.y - mouse.y);
      if (d < minDist) {
        minDist = d;
        idx = i;
      }
    });
    points[idx] = { x: mouse.x, y: mouse.y };
    return { ...shape, x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y, x3: points[2].x, y3: points[2].y };
  } else if (shape.type === 'text') {
    // Already handled as rectangle above
    return shape;
  }
  return shape;
}

/**
 * Draws a single handle on the circumference of a circle for scaling
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number, radius: number}} circle
 * @param {number} scale
 */
export function drawCircleHandle(ctx, circle, scale) {
  const handleSize = 10 / scale;
  const half = handleSize / 2;
  // Place handle at (x + radius, y) (to the right of center)
  const pos = { x: circle.x + circle.radius, y: circle.y };
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2196f3';
  ctx.lineWidth = 1.5 / scale;
  ctx.beginPath();
  ctx.rect(pos.x - half, pos.y - half, handleSize, handleSize);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws handles at each vertex of a triangle
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x1: number, y1: number, x2: number, y2: number, x3: number, y3: number}} triangle
 * @param {number} scale
 */
export function drawTriangleHandles(ctx, triangle, scale) {
  const handleSize = 10 / scale;
  const half = handleSize / 2;
  const positions = [
    { x: triangle.x1, y: triangle.y1 },
    { x: triangle.x2, y: triangle.y2 },
    { x: triangle.x3, y: triangle.y3 },
  ];
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2196f3';
  ctx.lineWidth = 1.5 / scale;
  positions.forEach(pos => {
    ctx.beginPath();
    ctx.rect(pos.x - half, pos.y - half, handleSize, handleSize);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
} 