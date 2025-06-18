import { useEffect, useRef, useState } from "react";
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

  // Grid configuration
  const GRID_SIZE = 5; // Size of each grid cell in pixels
  const GRID_COLOR = "#e0e0e0"; // Light gray color for grid lines
  const MIN_SCALE_FOR_GRID = 2; // Minimum scale to show grid lines

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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
  }, [textInput]);

  // Draw grid lines and shapes
  const drawCanvasContent = () => {
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
    drawnRectangles.forEach((shape) => {
      if (shape.type === "rectangle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.strokeStyle = shape.borderColor;
        ctx.lineWidth = shape.borderWidth / scale;
        ctx.globalAlpha = shape.opacity;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "line") {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width / scale;
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
      } else if (shape.type === "circle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.strokeStyle = shape.borderColor;
        ctx.lineWidth = shape.borderWidth / scale;
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "triangle") {
        ctx.fillStyle = shape.backgroundColor;
        ctx.strokeStyle = shape.borderColor;
        ctx.lineWidth = shape.borderWidth / scale;
        ctx.globalAlpha = shape.opacity;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.lineTo(shape.x3, shape.y3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "text") {
        ctx.font = `${shape.fontSize * scale}px Arial`;
        ctx.fillStyle = shape.color;
        ctx.globalAlpha = shape.opacity;
        ctx.fillText(shape.text, shape.x * scale, shape.y * scale);
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

    // Draw the line being currently drawn (dynamic preview)
    if (drawingLine) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2 / scale;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(drawingLine.startX, drawingLine.startY);
      ctx.lineTo(drawingLine.currentX, drawingLine.currentY);
      ctx.stroke();
    }

    // Draw the circle being currently drawn (dynamic preview)
    if (drawingCircle) {
      const startX = drawingCircle.startX;
      const startY = drawingCircle.startY;
      const currentX = drawingCircle.currentX;
      const currentY = drawingCircle.currentY;

      const radius = Math.sqrt(
        Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
      );

      ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 1 / scale;
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Draw the triangle being currently drawn (dynamic preview)
    if (drawingTriangle) {
      const startX = drawingTriangle.startX;
      const startY = drawingTriangle.startY;
      const currentX = drawingTriangle.currentX;
      const currentY = drawingTriangle.currentY;

      // Calculate the third point to form an equilateral triangle
      const dx = currentX - startX;
      const dy = currentY - startY;
      const angle = Math.atan2(dy, dx);
      const length = Math.sqrt(dx * dx + dy * dy);
      const x3 = startX + length * Math.cos(angle + Math.PI / 3);
      const y3 = startY + length * Math.sin(angle + Math.PI / 3);

      ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 1 / scale;
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw the text box being currently drawn
    if (textBox) {
      const startX = textBox.startX;
      const startY = textBox.startY;
      const currentX = textBox.currentX;
      const currentY = textBox.currentY;

      const rectX = Math.min(startX, currentX);
      const rectY = Math.min(startY, currentY);
      const rectWidth = Math.abs(currentX - startX);
      const rectHeight = Math.abs(currentY - startY);

      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 1 / scale;
      ctx.globalAlpha = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      ctx.setLineDash([]);
    }

    // Restore the context state
    ctx.restore();
  };

  // Re-draw canvas content when position, scale, or drawnRectangles changes
  useEffect(() => {
    drawCanvasContent();
  }, [
    position,
    scale,
    drawnRectangles,
    drawingRectangle,
    drawingLine,
    drawingCircle,
    drawingTriangle,
    textBox,
  ]);

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

  // Handle mouse down for panning or starting shape draw
  const handleMouseDown = (e) => {
    // Don't handle mouse down if in text input mode
    if (textInput) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;

    if (activeTool === "Hand") {
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
    }
  };

  // Handle mouse move for panning or drawing shapes
  const handleMouseMove = (e) => {
    // Don't handle mouse move if in text input mode
    if (textInput) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;

    if (isDragging && activeTool === "Hand") {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    } else if (drawingRectangle && activeTool === "Rectangle") {
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

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - position.x) / scale;
    const mouseY = (e.clientY - rect.top - position.y) / scale;

    setIsDragging(false);
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
        },
      ]);
      setDrawingRectangle(null);
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
        },
      ]);
      setDrawingLine(null);
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
        },
      ]);
      setDrawingCircle(null);
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
        },
      ]);
      setDrawingTriangle(null);
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
      });
      setTextBox(null);
    }
  };

  // Handle mouse leave to stop panning or drawing
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDrawingRectangle(null);
    setDrawingLine(null);
    setDrawingCircle(null);
    setDrawingTriangle(null);
    setTextBox(null);
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
    </div>
  );
};

export default Canvas;
