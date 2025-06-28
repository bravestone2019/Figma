// Utility to check if a point is inside a shape
const isPointInShape = (shape, x, y, ctx = null, scale = 1) => {
  if (shape.type === "rectangle") {
    return (
      x >= shape.x &&
      x <= shape.x + shape.width &&
      y >= shape.y &&
      y <= shape.y + shape.height
    );
  } else if (shape.type === "circle") {
    const dx = x - shape.x;
    const dy = y - shape.y;
    return dx * dx + dy * dy <= shape.radius * shape.radius;
  } else if (shape.type === "line") {
    const dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const d1 = dist(shape.x1, shape.y1, x, y);
    const d2 = dist(shape.x2, shape.y2, x, y);
    const lineLen = dist(shape.x1, shape.y1, shape.x2, shape.y2);
    return Math.abs(d1 + d2 - lineLen) < 2;
  } else if (shape.type === "triangle") {
    const { x1, y1, x2, y2, x3, y3 } = shape;
    const area = (x1, y1, x2, y2, x3, y3) =>
      Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    const A = area(x1, y1, x2, y2, x3, y3);
    const A1 = area(x, y, x2, y2, x3, y3);
    const A2 = area(x1, y1, x, y, x3, y3);
    const A3 = area(x1, y1, x2, y2, x, y);
    return Math.abs(A - (A1 + A2 + A3)) < 0.5;
  } else if (shape.type === "text") {
    let width = shape.width || 50;
    let height = shape.height || 20;
    if (ctx) {
      ctx.save();
      ctx.font = `${shape.fontSize || 16}px Arial`;
      const lineHeight = (shape.fontSize || 16) * 1.2;
      height = measureWrappedTextHeight(ctx, shape.text, width, lineHeight);
      ctx.restore();
    }
    return (
      x >= shape.x &&
      x <= shape.x + width &&
      y >= shape.y &&
      y <= shape.y + height
    );
  }
  return false;
};

// Helper to measure the height of wrapped text (matches drawWrappedText logic)
function measureWrappedTextHeight(ctx, text, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  let testLine = '';
  let testWidth = 0;
  let lines = 0;
  for (let n = 0; n < words.length; n++) {
    testLine = line + (line ? ' ' : '') + words[n];
    testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines++;
      line = words[n];
    } else {
      line = testLine;
    }
  }
  if (line) lines++;
  return Math.max(lineHeight, lines * lineHeight);
}

export default isPointInShape; 