// Calculate new position and scale for pointer-centric zooming
export const calculateZoom = (event, currentPosition, currentScale, zoomFactor) => {
  // Get mouse position relative to the canvas
  const rect = event.target.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Calculate the mouse position in canvas space before zoom
  const canvasX = (mouseX - currentPosition.x) / currentScale;
  const canvasY = (mouseY - currentPosition.y) / currentScale;

  // Calculate new scale
  const newScale = Math.max(0.1, Math.min(5, currentScale * zoomFactor));

  // Calculate new position to keep the mouse point fixed
  const newX = mouseX - canvasX * newScale;
  const newY = mouseY - canvasY * newScale;

  return {
    position: { x: newX, y: newY },
    scale: newScale
  };
};

// Handle zoom with mouse wheel
export const handleZoom = (event, currentPosition, currentScale) => {
  event.preventDefault();
  
  // Determine zoom direction and factor
  const delta = event.deltaY;
  const zoomFactor = delta > 0 ? 0.9 : 1.1;

  return calculateZoom(event, currentPosition, currentScale, zoomFactor);
};

// Handle zoom with pinch gesture (for touch devices)
export const handlePinchZoom = (event, currentPosition, currentScale) => {
  event.preventDefault();
  
  if (event.touches.length !== 2) return null;

  const touch1 = event.touches[0];
  const touch2 = event.touches[1];

  // Calculate distance between touches
  const currentDistance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  );

  // Use the first touch point as the zoom center
  const zoomCenter = {
    clientX: touch1.clientX,
    clientY: touch1.clientY
  };

  // Calculate zoom factor based on touch movement
  const zoomFactor = currentDistance > 100 ? 1.1 : 0.9;

  return calculateZoom(zoomCenter, currentPosition, currentScale, zoomFactor);
}; 