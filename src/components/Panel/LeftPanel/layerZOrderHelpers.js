// Z-order (layer stack) helpers for shapes

// Move shape up one position
export function bringForward(shapes, id) {
  const idx = shapes.findIndex(s => s.id === id);
  if (idx === -1 || idx === shapes.length - 1) return shapes;
  const newArr = [...shapes];
  [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
  return newArr;
}

// Move shape down one position
export function sendBackward(shapes, id) {
  const idx = shapes.findIndex(s => s.id === id);
  if (idx <= 0) return shapes;
  const newArr = [...shapes];
  [newArr[idx], newArr[idx - 1]] = [newArr[idx - 1], newArr[idx]];
  return newArr;
}

// Move shape to the top/front
export function bringToFront(shapes, id) {
  const idx = shapes.findIndex(s => s.id === id);
  if (idx === -1 || idx === shapes.length - 1) return shapes;
  const newArr = [...shapes];
  const [item] = newArr.splice(idx, 1);
  newArr.push(item);
  return newArr;
}

// Move shape to the bottom/back
export function sendToBack(shapes, id) {
  const idx = shapes.findIndex(s => s.id === id);
  if (idx <= 0) return shapes;
  const newArr = [...shapes];
  const [item] = newArr.splice(idx, 1);
  newArr.unshift(item);
  return newArr;
} 