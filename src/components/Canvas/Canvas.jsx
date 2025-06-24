import { useEffect, useRef, useState, useCallback } from "react";
import "./Canvas.css";
import { handleZoom, handlePinchZoom } from "../../utils/zoom";
import { handleHorizontalPan, handleVerticalPan } from "../../utils/panning";

const Canvas = ({
  activeTool,
  setActiveTool,
  position,
  setPosition,
  scale,
  setScale,
  drawnRectangles,
  setDrawnRectangles,
}) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [drawingRectangle, setDrawingRectangle] = useState(null);
  const [drawingLine, setDrawingLine] = useState(null);
  const [drawingCircle, setDrawingCircle] = useState(null);
  const [drawingTriangle, setDrawingTriangle] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [textBox, setTextBox] = useState(null);
  const [movingShape, setMovingShape] = useState(null);
  const [hoveredShape, setHoveredShape] = useState(null);
  // 1. Add state for selectionBox and selectedShapes
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [drawnImages, setDrawnImages] = useState([]); 
  const [pendingImagePos, setPendingImagePos] = useState(null);
  const fileInputRef = useRef(null);

  // Grid configuration
  const GRID_SIZE = 5; // Size of each grid cell in pixels
  const GRID_COLOR = "#e0e0e0"; // Light gray color for grid lines
  const MIN_SCALE_FOR_GRID = 2; // Minimum scale to show grid lines

  useEffect(() => {
    const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCanvasContent();
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);

    // Prevent browser zoom only when not in text input
    const preventBrowserZoom = (e) => {
      // Allow all keyboard events when in text input mode
      if (textInput) return;

      // Only prevent browser zoom when not in text input
      if (e.ctrlKey && !e.target.closest(".text-input-container")) {
        e.preventDefault();
      }
    };

    // Add event listener for wheel with passive: false to allow preventDefault
    window.addEventListener("wheel", preventBrowserZoom, { passive: false });
    window.addEventListener("keydown", preventBrowserZoom);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", preventBrowserZoom);
      window.removeEventListener("keydown", preventBrowserZoom);
    };
  }, [textInput ]);

  // Draw grid lines and shapes
  
  const drawCanvasContent = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save the current context state
    ctx.save();

    // Apply transformations
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);

    // Draw grid
    if (scale >= MIN_SCALE_FOR_GRID) {
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 0.5 / scale;

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

    // Draw existing shapes
    drawnRectangles.forEach((shape, i) => {
      ctx.save();
      
      // Apply hover or locked styling
      if (shape.locked) {
        ctx.setLineDash([4, 2]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / scale;
      } else if (activeTool === "Move" && i === hoveredShape && !movingShape) {
        ctx.setLineDash([]);
        ctx.strokeStyle = "#2196f3";
        ctx.lineWidth = Math.max(2 / scale, 1);
        ctx.globalAlpha = 1;
      }
      
      if (shape.type === "rectangle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.globalAlpha = shape.opacity;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        
        // Apply stroke with proper styling
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
        } else if (activeTool === "Move" && i === hoveredShape && !movingShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
        } else {
          ctx.strokeStyle = shape.borderColor;
          ctx.lineWidth = shape.borderWidth / scale;
        }
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "line") {
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        
        // Apply stroke with proper styling
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
        } else if (activeTool === "Move" && i === hoveredShape && !movingShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
        } else {
          ctx.strokeStyle = shape.color;
          ctx.lineWidth = shape.width / scale;
        }
        ctx.stroke();
      } else if (shape.type === "circle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Apply stroke with proper styling
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
        } else if (activeTool === "Move" && i === hoveredShape && !movingShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
        } else {
          ctx.strokeStyle = shape.borderColor;
          ctx.lineWidth = shape.borderWidth / scale;
        }
        ctx.stroke();
      } else if (shape.type === "triangle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.lineTo(shape.x3, shape.y3);
        ctx.closePath();
        ctx.fill();
        
        // Apply stroke with proper styling
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
        } else if (activeTool === "Move" && i === hoveredShape && !movingShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
        } else {
          ctx.strokeStyle = shape.borderColor;
          ctx.lineWidth = shape.borderWidth / scale;
        }
        ctx.stroke();
      } else if (shape.type === "text") {
        ctx.font = `${shape.fontSize || 16}px Arial`;
        ctx.fillStyle = shape.color;
        ctx.globalAlpha = shape.opacity;
        ctx.fillText(shape.text, shape.x, shape.y + (shape.fontSize || 16));
        
        // Measure text width/height
        const measuredWidth = ctx.measureText(shape.text).width;
        const measuredHeight = (shape.fontSize || 16) * 1.2;
        
        // Apply border for locked or hovered text
        if (shape.locked) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 / scale;
          ctx.strokeRect(
            shape.x,
            shape.y,
            measuredWidth,
            measuredHeight
          );
        } else if (activeTool === "Move" && i === hoveredShape && !movingShape) {
          ctx.strokeStyle = "#2196f3";
          ctx.lineWidth = Math.max(2 / scale, 1);
          ctx.strokeRect(
            shape.x,
            shape.y,
            measuredWidth,
            measuredHeight
          );
        }
      }
      ctx.restore();
    });

    // Draw images
    drawnImages.forEach(img => {
      if (img.imageObj) {
        ctx.globalAlpha = img.opacity || 1;
        ctx.drawImage(
          img.imageObj,
          (img.x + position.x) * scale,
          (img.y + position.y) * scale,
          img.width * scale,
          img.height * scale
        );
        ctx.globalAlpha = 1;
      }
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

      ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 1 / scale;
      ctx.globalAlpha = 1;

      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    }
  }, [position, scale, drawnRectangles, drawingRectangle, drawnImages, activeTool, hoveredShape, movingShape]);
  // Re-draw canvas content when position, scale, or drawnRectangles changes
  useEffect(() => {
    drawCanvasContent();
  }, [drawCanvasContent]);
// Add drawingRectangle to dependencies

  // Handle mouse wheel for zooming and panning
  const handleWheel = (e) => {
    // Don't handle wheel events if in text input mode
    if (textInput) return;

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
    // Don't handle mouse down if in text input mode
    if (textInput) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;

    if (activeTool === "Hand") {
      // Always start panning, even if clicking on a shape
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      return;
    }
    // Right mouse button (button === 2) for box selection
    if (activeTool === "Move" && e.button === 2) {
      setSelectionBox({
        startX: mouseX,
        startY: mouseY,
        currentX: mouseX,
        currentY: mouseY,
      });
      return;
    }
    if (activeTool === "Move") {
      // Try to select a shape for moving (topmost, not locked)
      for (let i = drawnRectangles.length - 1; i >= 0; i--) {
        const shape = drawnRectangles[i];
        if (!shape.locked && isPointInShape(shape, mouseX, mouseY)) {
          let offsetX = 0, offsetY = 0;
          if (shape.type === "rectangle" || shape.type === "text") {
            offsetX = mouseX - shape.x;
            offsetY = mouseY - shape.y;
          } else if (shape.type === "circle") {
            offsetX = mouseX - shape.x;
            offsetY = mouseY - shape.y;
          } else if (shape.type === "line") {
            // Move both endpoints by same delta
            offsetX = mouseX - shape.x1;
            offsetY = mouseY - shape.y1;
          } else if (shape.type === "triangle") {
            offsetX = mouseX - shape.x1;
            offsetY = mouseY - shape.y1;
          }
          // If this shape is in selectedShapes, start dragging all selected
          if (selectedShapes.includes(i)) {
            // Store original positions of all selected shapes for multi-drag
            const originalPositions = {};
            selectedShapes.forEach(shapeIndex => {
              const shape = drawnRectangles[shapeIndex];
              if (shape.type === "rectangle" || shape.type === "text" || shape.type === "circle") {
                originalPositions[shapeIndex] = { x: shape.x, y: shape.y };
              } else if (shape.type === "line") {
                originalPositions[shapeIndex] = { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2 };
              } else if (shape.type === "triangle") {
                originalPositions[shapeIndex] = { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2, x3: shape.x3, y3: shape.y3 };
              }
            });
            setMovingShape({ 
              index: i, 
              offsetX, 
              offsetY, 
              multi: true, 
              originalPositions,
              mouseStart: { x: mouseX, y: mouseY }
            });
          } else {
            setMovingShape({ index: i, offsetX, offsetY });
            setSelectedShapes([]); // Deselect others
          }
          return;
        }
      }
      // If not on a shape, start panning
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    } else if (activeTool === "Rectangle") {
      setDrawingRectangle({
        startX: mouseX,
        startY: mouseY,
        currentX: mouseX,
        currentY: mouseY,
      });
    } else if (activeTool === "Line") {
      setDrawingLine({
        startX: mouseX,
        startY: mouseY,
        currentX: mouseX,
        currentY: mouseY,
      });
    } else if (activeTool === "Circle") {
      setDrawingCircle({
        startX: mouseX,
        startY: mouseY,
        currentX: mouseX,
        currentY: mouseY,
      });
    } else if (activeTool === "Triangle") {
      setDrawingTriangle({
        startX: mouseX,
        startY: mouseY,
        currentX: mouseX,
        currentY: mouseY,
      });
    } else if (activeTool === "Text") {
      setTextBox({
        startX: mouseX,
        startY: mouseY,
        currentX: mouseX,
        currentY: mouseY,
      });
    } else if (activeTool === 'Image') {
      // Store click position and trigger file input
      setPendingImagePos({ x: e.clientX, y: e.clientY });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }
  };

  // Handle file input change for image placement
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !pendingImagePos) return;
    const reader = new window.FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        // Default size: 100x100 or image natural size (scaled down if too large)
        const maxDim = 100;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = width * scale;
          height = height * scale;
        }
        setDrawnImages(prev => [
          ...prev,
          {
            x: (pendingImagePos.x - position.x) / scale,
            y: (pendingImagePos.y - position.y) / scale,
            width,
            height,
            imageObj: img,
            opacity: 1,
          },
        ]);
        setPendingImagePos(null);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle mouse move for panning or drawing shapes
  const handleMouseMove = (e) => {
    // Don't handle mouse move if in text input mode
    if (textInput) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;
    
    // If selection box is active, update it
    if (selectionBox) {
      setSelectionBox((prev) => ({ ...prev, currentX: mouseX, currentY: mouseY }));
      return;
    }
    
    // Only set hover if Move tool is active and not dragging a shape
    if (activeTool === "Move" && !movingShape) {
      let found = null;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      for (let i = drawnRectangles.length - 1; i >= 0; i--) {
        const shape = drawnRectangles[i];
        if (!shape.locked && isPointInShape(shape, mouseX, mouseY, ctx, scale)) {
          found = i;
          break;
        }
      }
      setHoveredShape(found);
    } else {
      setHoveredShape(null);
    }

    // Handle moving shapes
    if (movingShape) {
      setDrawnRectangles((prev) =>
        prev.map((shape, idx) => {
          // If this is a multi-drag (moving selected shapes together)
          if (movingShape.multi && selectedShapes.includes(idx)) {
            const dx = mouseX - movingShape.mouseStart.x;
            const dy = mouseY - movingShape.mouseStart.y;
            
            if (shape.type === "rectangle" || shape.type === "text" || shape.type === "circle") {
              const orig = movingShape.originalPositions[idx];
              return { ...shape, x: orig.x + dx, y: orig.y + dy };
            } else if (shape.type === "line") {
              const orig = movingShape.originalPositions[idx];
              return {
                ...shape,
                x1: orig.x1 + dx,
                y1: orig.y1 + dy,
                x2: orig.x2 + dx,
                y2: orig.y2 + dy,
              };
            } else if (shape.type === "triangle") {
              const orig = movingShape.originalPositions[idx];
              return {
                ...shape,
                x1: orig.x1 + dx,
                y1: orig.y1 + dy,
                x2: orig.x2 + dx,
                y2: orig.y2 + dy,
                x3: orig.x3 + dx,
                y3: orig.y3 + dy,
              };
            }
          }
          // Single shape drag (original logic)
          else if (idx === movingShape.index) {
            // Move shape by mouse - offset
            if (shape.type === "rectangle" || shape.type === "text") {
              return { ...shape, x: mouseX - movingShape.offsetX, y: mouseY - movingShape.offsetY };
            } else if (shape.type === "circle") {
              return { ...shape, x: mouseX - movingShape.offsetX, y: mouseY - movingShape.offsetY };
            } else if (shape.type === "line") {
              const dx = mouseX - movingShape.offsetX - shape.x1;
              const dy = mouseY - movingShape.offsetY - shape.y1;
              return {
                ...shape,
                x1: shape.x1 + dx,
                y1: shape.y1 + dy,
                x2: shape.x2 + dx,
                y2: shape.y2 + dy,
              };
            } else if (shape.type === "triangle") {
              const dx = mouseX - movingShape.offsetX - shape.x1;
              const dy = mouseY - movingShape.offsetY - shape.y1;
              return {
                ...shape,
                x1: shape.x1 + dx,
                y1: shape.y1 + dy,
                x2: shape.x2 + dx,
                y2: shape.y2 + dy,
                x3: shape.x3 + dx,
                y3: shape.y3 + dy,
              };
            }
          }
          return shape;
        })
      );
      return;
    }

    // Handle panning
    if (isDragging && activeTool === "Hand") {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    } 
    // Handle drawing previews
    else if (drawingRectangle && activeTool === "Rectangle") {
      setDrawingRectangle((prev) => ({
        ...prev,
        currentX: mouseX,
        currentY: mouseY,
      }));
    } else if (drawingLine && activeTool === "Line") {
      setDrawingLine((prev) => ({
        ...prev,
        currentX: mouseX,
        currentY: mouseY,
      }));
    } else if (drawingCircle && activeTool === "Circle") {
      setDrawingCircle((prev) => ({
        ...prev,
        currentX: mouseX,
        currentY: mouseY,
      }));
    } else if (drawingTriangle && activeTool === "Triangle") {
      setDrawingTriangle((prev) => ({
        ...prev,
        currentX: mouseX,
        currentY: mouseY,
      }));
    } else if (textBox && activeTool === "Text") {
      setTextBox((prev) => ({
        ...prev,
        currentX: mouseX,
        currentY: mouseY,
      }));
    }
  };

  // Handle mouse up to stop panning or finalize shape drawing
  const handleMouseUp = (e) => {
    // Don't handle mouse up if in text input mode
    if (textInput) return;

    setIsDragging(false);
    setMovingShape(null);
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;

    if (selectionBox) {
      // Compute selection rectangle
      const { startX, startY, currentX, currentY } = selectionBox;
      const x1 = Math.min(startX, currentX);
      const y1 = Math.min(startY, currentY);
      const x2 = Math.max(startX, currentX);
      const y2 = Math.max(startY, currentY);
      // Select all shapes fully inside the box
      const selected = drawnRectangles.map((shape) => {
        if (shape.type === "rectangle") {
          return (
            shape.x >= x1 && shape.y >= y1 &&
            shape.x + shape.width <= x2 && shape.y + shape.height <= y2
          );
        } else if (shape.type === "circle") {
          return (
            shape.x - shape.radius >= x1 && shape.y - shape.radius >= y1 &&
            shape.x + shape.radius <= x2 && shape.y + shape.radius <= y2
          );
        } else if (shape.type === "line") {
          return (
            shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
            shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2
          );
        } else if (shape.type === "triangle") {
          return (
            shape.x1 >= x1 && shape.x1 <= x2 && shape.y1 >= y1 && shape.y1 <= y2 &&
            shape.x2 >= x1 && shape.x2 <= x2 && shape.y2 >= y1 && shape.y2 <= y2 &&
            shape.x3 >= x1 && shape.x3 <= x2 && shape.y3 >= y1 && shape.y3 <= y2
          );
        } else if (shape.type === "text") {
          return (
            shape.x >= x1 && shape.y >= y1 &&
            shape.x + (shape.width || 50) <= x2 && shape.y + (shape.height || 20) <= y2
          );
        }
        return false;
      })
      .map((inside, i) => inside ? i : null)
      .filter(i => i !== null);
      setSelectedShapes(selected);
      setSelectionBox(null);
      return;
    }
    // ... rest of handleMouseUp unchanged ...
    if (drawingRectangle && activeTool === "Rectangle") {
      const startX = drawingRectangle.startX;
      const startY = drawingRectangle.startY;
      const endX = mouseX;
      const endY = mouseY;

      const rectX = Math.min(startX, endX);
      const rectY = Math.min(startY, endY);
      const rectWidth = Math.abs(endX - startX);
      const rectHeight = Math.abs(endY - startY);

      setDrawnRectangles((prev) => [
        ...prev,
        {
          type: "rectangle",
          x: rectX,
          y: rectY,
          width: rectWidth,
          height: rectHeight,
          backgroundColor: "rgba(128, 128, 128, 0.2)",
          borderColor: "#808080",
          borderWidth: 1,
          opacity: 1,
          locked: false,
        },
      ]);
      setDrawingRectangle(null);
      setActiveTool("Move");
    } else if (drawingLine && activeTool === "Line") {
      const startX = drawingLine.startX;
      const startY = drawingLine.startY;
      const endX = mouseX;
      const endY = mouseY;

      setDrawnRectangles((prev) => [
        ...prev,
        {
          type: "line",
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          color: "#000000",
          width: 2,
          opacity: 1,
          locked: false,
        },
      ]);
      setDrawingLine(null);
      setActiveTool("Move");
    } else if (drawingCircle && activeTool === "Circle") {
      const startX = drawingCircle.startX;
      const startY = drawingCircle.startY;
      const endX = mouseX;
      const endY = mouseY;

      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      );

      setDrawnRectangles((prev) => [
        ...prev,
        {
          type: "circle",
          x: startX,
          y: startY,
          radius: radius,
          backgroundColor: "rgba(128, 128, 128, 0.2)",
          borderColor: "#808080",
          borderWidth: 1,
          opacity: 1,
          locked: false,
        },
      ]);
      setDrawingCircle(null);
      setActiveTool("Move");
    } else if (drawingTriangle && activeTool === "Triangle") {
      const startX = drawingTriangle.startX;
      const startY = drawingTriangle.startY;
      const endX = mouseX;
      const endY = mouseY;

      // Calculate the third point to form an equilateral triangle
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx);
      const length = Math.sqrt(dx * dx + dy * dy);
      const x3 = startX + length * Math.cos(angle + Math.PI / 3);
      const y3 = startY + length * Math.sin(angle + Math.PI / 3);

      setDrawnRectangles((prev) => [
        ...prev,
        {
          type: "triangle",
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          x3: x3,
          y3: y3,
          backgroundColor: "rgba(128, 128, 128, 0.2)",
          borderColor: "#808080",
          borderWidth: 1,
          opacity: 1,
          locked: false,
        },
      ]);
      setDrawingTriangle(null);
      setActiveTool("Move");
    } else if (textBox && activeTool === "Text") {
      const startX = textBox.startX;
      const startY = textBox.startY;
      const endX = mouseX;
      const endY = mouseY;

      const rectX = Math.min(startX, endX);
      const rectY = Math.min(startY, endY);
      const rectWidth = Math.abs(endX - startX);
      const rectHeight = Math.abs(endY - startY);

      setTextInput({
        x: rectX,
        y: rectY,
        width: rectWidth,
        height: rectHeight,
        text: "",
        fontSize: 16,
        color: "#000000",
        opacity: 1,
        locked: false,
      });
      setTextBox(null);
      setActiveTool("Move");
    }
  };

  // Handle mouse leave to stop panning or drawing
  const handleMouseLeave = () => {
    setIsDragging(false);
    setMovingShape(null);
    setHoveredShape(null);
    setDrawingRectangle(null);
    setDrawingLine(null);
    setDrawingCircle(null);
    setDrawingTriangle(null);
    setTextBox(null);
    setSelectionBox(null); // Added selectionBox to cleanup
    setSelectedShapes([]); // Added selectedShapes to cleanup
  };

  // Add keyboard shortcut handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip shortcuts if inside textarea or text input is active
      if (document.activeElement.tagName === "TEXTAREA" || textInput) return;

      // Tool shortcuts
      if (e.key.toLowerCase() === "r") {
        setActiveTool("Rectangle");
      } else if (e.key.toLowerCase() === "l") {
        setActiveTool("Line");
      } else if (e.key.toLowerCase() === "c") {
        setActiveTool("Circle");
      } else if (e.key.toLowerCase() === "t") {
        setActiveTool("Text");
      } else if (e.key.toLowerCase() === "v") {
        setActiveTool("Hand");
      } else if (e.key.toLowerCase() === "p") {
        setActiveTool("Triangle");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [textInput]); // Add textInput to dependencies

  // Handle text input
  const handleTextInput = (e) => {
    // Allow all keyboard shortcuts in text input
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textInput && textInput.text.trim()) {
        setDrawnRectangles((prev) => [
          ...prev,
          {
            type: "text",
            ...textInput,
            locked: false,
          },
        ]);
      }
      setTextInput(null);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTextInput(null);
    }
  };

  // Handle text change
  const handleTextChange = (e) => {
    if (textInput) {
      setTextInput((prev) => ({
        ...prev,
        text: e.target.value,
      }));
    }
  };

  // Handle click outside text input
    const handleClickOutside = (e) => {
      if (textInput && !e.target.closest(".text-input-container")) {
        if (textInput.text.trim()) {
          setDrawnRectangles((prev) => [
            ...prev,
            {
              type: "text",
              ...textInput,
              locked: false,
            },
          ]);
        }
        setTextInput(null);
      }
    };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [textInput]);

  // Add a helper to check if a point is inside a shape
  const isPointInShape = (shape, x, y, ctx = null) => {
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
        width = ctx.measureText(shape.text).width;
        height = (shape.fontSize || 16) * 1.2;
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

  // Add context menu handler for locking shapes
  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;

    // Find topmost shape under mouse
    for (let i = drawnRectangles.length - 1; i >= 0; i--) {
      const shape = drawnRectangles[i];
      if (isPointInShape(shape, mouseX, mouseY)) {
        setDrawnRectangles((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, locked: !s.locked } : s
          )
        );
        return;
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        className={`canvas ${activeTool === "Hand" ? "hand-tool" : ""}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onContextMenu={handleContextMenu}
      />
      {textInput && (
        <div
          className="text-input-container"
          style={{
            position: "absolute",
            left: textInput.x * scale + position.x,
            top: textInput.y * scale + position.y,
            zIndex: 1000,
          }}
        >
          <textarea
            value={textInput.text}
            onChange={handleTextChange}
            onKeyDown={handleTextInput}
            autoFocus
            style={{
              width: textInput.width * scale,
              height: textInput.height * scale,
              fontSize: textInput.fontSize * scale,
              color: textInput.color,
              opacity: textInput.opacity,
              border: "none",
              outline: "none",
              resize: "none",
              background: "transparent",
              fontFamily: "Arial",
              lineHeight: "1.2",
              padding: "4px",
            }}
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};


export default Canvas;
