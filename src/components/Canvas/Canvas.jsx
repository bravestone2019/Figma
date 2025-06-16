import { useEffect, useRef, useState } from 'react';
import './Canvas.css';
import { handleZoom, handlePinchZoom } from '../../utils/zoom';
import { handleHorizontalPan, handleVerticalPan } from '../../utils/panning';

const Canvas = ({ activeTool, setActiveTool, position, setPosition, scale, setScale, drawnRectangles, setDrawnRectangles }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [drawingRectangle, setDrawingRectangle] = useState(null); // New state for dynamic rectangle drawing

  // Grid configuration
  const GRID_SIZE = 5; // Size of each grid cell in pixels
  const GRID_COLOR = '#e0e0e0'; // Light gray color for grid lines
  const MIN_SCALE_FOR_GRID = 2; // Minimum scale to show grid lines

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCanvasContent();
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Prevent browser zoom
    const preventBrowserZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Add event listener for wheel with passive: false to allow preventDefault
    window.addEventListener('wheel', preventBrowserZoom, { passive: false });
    window.addEventListener('keydown', preventBrowserZoom);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('wheel', preventBrowserZoom);
      window.removeEventListener('keydown', preventBrowserZoom);
    };
  }, []);

  // Draw grid lines and shapes
  const drawCanvasContent = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    if (scale >= MIN_SCALE_FOR_GRID) {
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 0.5;

      const offsetX = position.x % (GRID_SIZE * scale);
      const offsetY = position.y % (GRID_SIZE * scale);

      for (let x = offsetX; x < width; x += GRID_SIZE * scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = offsetY; y < height; y += GRID_SIZE * scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw existing rectangles
    drawnRectangles.forEach(rect => {
      ctx.fillStyle = rect.backgroundColor;
      ctx.strokeStyle = rect.borderColor;
      ctx.lineWidth = rect.borderWidth;
      ctx.globalAlpha = rect.opacity;
      ctx.fillRect(
        (rect.x + position.x) * scale, 
        (rect.y + position.y) * scale, 
        rect.width * scale, 
        rect.height * scale
      );
      ctx.strokeRect(
        (rect.x + position.x) * scale, 
        (rect.y + position.y) * scale, 
        rect.width * scale, 
        rect.height * scale
      );
    });

    // Draw the rectangle being currently drawn (dynamic preview)
    if (drawingRectangle) {
      const startX = drawingRectangle.startX;
      const startY = drawingRectangle.startY;
      const currentX = drawingRectangle.currentX;
      const currentY = drawingRectangle.currentY;

      const rectX = Math.min(startX, currentX);
      const rectY = Math.min(startY, currentY);
      const rectWidth = Math.abs(currentX - startX);
      const rectHeight = Math.abs(currentY - startY);

      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'; // Semi-transparent red
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;

      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    }
  };

  // Re-draw canvas content when position, scale, or drawnRectangles changes
  useEffect(() => {
    drawCanvasContent();
  }, [position, scale, drawnRectangles, drawingRectangle]); // Add drawingRectangle to dependencies

  // Handle mouse wheel for zooming and panning
  const handleWheel = (e) => {
    e.preventDefault();

    if (e.shiftKey) {
      const horizontalPan = handleHorizontalPan(e, position);
      if (horizontalPan) {
        setPosition(horizontalPan);
        return;
      }
    }

    if (e.ctrlKey) {
      const verticalPan = handleVerticalPan(e, position);
      if (verticalPan) {
        setPosition(verticalPan);
        return;
      }
    }

    const result = handleZoom(e, position, scale);
    if (result) {
      setPosition(result.position);
      setScale(result.scale);
    }
  };

  // Handle touch events for pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const result = handlePinchZoom(e, position, scale);
      if (result) {
        setPosition(result.position);
        setScale(result.scale);
      }
    }
  };

  // Handle mouse down for panning or starting rectangle draw
  const handleMouseDown = (e) => {
    if (activeTool === 'Hand') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    } else if (activeTool === 'Rectangle') {
      setDrawingRectangle({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    }
  };

  // Handle mouse move for panning or drawing rectangle
  const handleMouseMove = (e) => {
    if (isDragging && activeTool === 'Hand') {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    } else if (drawingRectangle && activeTool === 'Rectangle') {
      setDrawingRectangle(prev => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
    }
  };

  // Handle mouse up to stop panning or finalize rectangle drawing
  const handleMouseUp = (e) => {
    setIsDragging(false);
    if (drawingRectangle && activeTool === 'Rectangle') {
      const startX = drawingRectangle.startX;
      const startY = drawingRectangle.startY;
      const endX = e.clientX;
      const endY = e.clientY;

      const rectX = Math.min(startX, endX);
      const rectY = Math.min(startY, endY);
      const rectWidth = Math.abs(endX - startX);
      const rectHeight = Math.abs(endY - startY);

      // Add the new rectangle to the list of drawn rectangles
      setDrawnRectangles(prev => [...prev, {
        x: (rectX - position.x) / scale, // Adjust for pan and scale
        y: (rectY - position.y) / scale, // Adjust for pan and scale
        width: rectWidth / scale, // Adjust for scale
        height: rectHeight / scale, // Adjust for scale
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderColor: '#ff0000',
        borderWidth: 1,
        opacity: 1,
      }]);
      setDrawingRectangle(null); // Reset drawing state
    }
  };

  // Handle mouse leave to stop panning or drawing
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDrawingRectangle(null); // Also reset drawing if mouse leaves canvas
  };

  return (
    <canvas
      ref={canvasRef}
      className={`canvas ${activeTool === 'Hand' ? 'hand-tool' : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    />
  );
};

export default Canvas; 