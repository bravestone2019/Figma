// Handle horizontal panning with Shift + Wheel
export const handleHorizontalPan = (event, currentPosition) => {
  if (!event.shiftKey) return null;
  
  const delta = event.deltaY;
  const panAmount = delta > 0 ? 100 : -100; // Increased pan amount for better visibility
  
  return {
    x: currentPosition.x + panAmount,
    y: currentPosition.y
  };
};

// Handle vertical panning with Ctrl + Wheel
export const handleVerticalPan = (event, currentPosition) => {
  if (!event.ctrlKey) return null;
  
  const delta = event.deltaY;
  const panAmount = delta > 0 ? 100 : -100; // Increased pan amount for better visibility
  
  return {
    x: currentPosition.x,
    y: currentPosition.y + panAmount
  };
}; 