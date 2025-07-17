import "./Generate.css";
import Upload from "./Upload/Upload";
import Download from "./download/download";
import Shortcut from "../Shortcut";
import { useEffect, useState, useRef } from "react";
import folder from "../../assets/auto.png";
import {
  drawRectangle,
  drawLine,
  drawCircle,
  drawTriangle,
  drawImage,
  drawText,
} from "../Canvas/CanvasContent/shapeRenderers";

const Generate = ({
  activeTool,
  setActiveTool,
  openDropdown,
  isGenerateOpen,
  setIsGenerateOpen,
  drawnRectangles, // <-- receive real array
  collections, // <-- receive collections
}) => {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);
 
  useEffect(() => {
    if (openDropdown) {
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }
    return () => {
      document.body.classList.remove("dropdown-open");
    };
  }, [openDropdown]);

  useEffect(() => {
    if (drawnRectangles) {
      console.log("[Generate] Real drawnRectangles for preview:", drawnRectangles);
    }
  }, [drawnRectangles]);

  // Register shortcut for 'g' (open generate)
  Shortcut({ key: "g" }, () => {
    setActiveTool("Generate");
    setOpen(true);
    setIsGenerateOpen(true);
  });
  // Register shortcut for 'escape' (close generate)
  Shortcut({ key: "escape" }, () => {
    if (open) {
      setOpen(false);
      setIsGenerateOpen(false);
    }
  });

  const handleOnClick = () => {
    setActiveTool("Generate");
    setOpen(true);
    setIsGenerateOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsGenerateOpen(false);
  };

  useEffect(() => {
    if (!isGenerateOpen) setOpen(false);
  }, [isGenerateOpen]);

  // Find front/back collections
  const frontBackCollections = (collections || []).filter(
    col => col.name === 'front' || col.name === 'back'
  );
  // Gather all shape IDs in order
  const frontBackShapeIds = frontBackCollections.flatMap(col => col.shapeIds);
  // Map IDs to shape objects (preserving order)
  let frontBackShapes = frontBackShapeIds
    .map(id => (drawnRectangles || []).find(s => s.id === id))
    .filter(Boolean);

  // Sort by zorder (ascending, lower zorder drawn first)
  frontBackShapes = [...frontBackShapes].sort((a, b) => (a.zorder ?? 0) - (b.zorder ?? 0));

  useEffect(() => {
    if (!open || !canvasRef.current || !frontBackShapes.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Set canvas size to match modal/client size
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;
    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f7f7f9';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    // Optionally scale to fit, or use 1:1
    ctx.scale(dpr, dpr);
    // Render each shape
    frontBackShapes.forEach(shape => {
      const role = shape.role || 'default';
      const type = shape.shapeId || shape.type;
      // Prepare shape copy for rendering
      let renderShape = { ...shape };
      // Placeholder: override fill/background
      if (role === 'placeholder') {
        if (type === 'rec' || type === 'rectangle') {
          renderShape.backgroundColor = '#e0e0e0';
          renderShape.fillOpacity = 1;
          renderShape.opacity = 1;
        } else if (type === 'img' || type === 'image') {
          renderShape.src = '';
          renderShape.backgroundColor = '#e0e0e0';
          renderShape.opacity = 1;
        } else if (type === 'text') {
          renderShape.color = '#b0b0b0';
          renderShape.text = 'Placeholder';
          renderShape.opacity = 0.7;
        } else if (type === 'line') {
          renderShape.color = '#b0b0b0';
          renderShape.opacity = 0.7;
        } else if (type === 'circle') {
          renderShape.backgroundColor = '#e0e0e0';
          renderShape.opacity = 1;
        } else if (type === 'triangle') {
          renderShape.backgroundColor = '#e0e0e0';
          renderShape.opacity = 1;
        }
      }
      // Render by type
      switch (type) {
        case 'rec':
        case 'rectangle':
          drawRectangle(ctx, renderShape, { ...renderShape });
          break;
        case 'img':
        case 'image':
          // Only call drawImage if src is a non-empty string
          if (typeof renderShape.src === 'string' && renderShape.src.trim() !== '') {
            drawImage(ctx, renderShape, { ...renderShape, canvas });
          } else {
            // Draw placeholder for image
            ctx.save();
            ctx.fillStyle = renderShape.backgroundColor || '#e0e0e0';
            ctx.globalAlpha = renderShape.opacity ?? 1;
            ctx.fillRect(renderShape.x, renderShape.y, renderShape.width, renderShape.height);
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.strokeRect(renderShape.x, renderShape.y, renderShape.width, renderShape.height);
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Placeholder', renderShape.x + renderShape.width / 2, renderShape.y + renderShape.height / 2);
            ctx.restore();
          }
          break;
        case 'line':
          drawLine(ctx, renderShape, { ...renderShape, x1: renderShape.x1, y1: renderShape.y1, x2: renderShape.x2, y2: renderShape.y2 });
          break;
        case 'circle':
          drawCircle(ctx, renderShape, { ...renderShape });
          break;
        case 'triangle':
          drawTriangle(ctx, renderShape, { ...renderShape });
          break;
        case 'text':
          drawText(ctx, renderShape, { ...renderShape });
          break;
        default:
          break;
      }
    });
    ctx.restore();
  }, [open, frontBackShapes]);

  useEffect(() => {
    if (frontBackShapes) {
      console.log("[Generate] Shapes for front/back collections:", frontBackShapes);
    }
  }, [frontBackShapes]);

  const hasFrontOrBack = frontBackShapes.length > 0;

  return (
    <>
      <div
        className={`icon-wrapper${activeTool === "Generate" ? " active" : ""}`}
        onClick={handleOnClick}
      >
        <img src={folder} alt="Generate" className="icon" />
        <span className="tooltip">Generate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G</span>
      </div>
      {open && (
        <div className="preview-modal-overlay">
          <div className="preview-modal" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Full-area preview canvas, absolutely positioned */}
            {hasFrontOrBack ? (
              <canvas
                id="generate-preview-canvas"
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: '#f7f7f9',
                  borderRadius: 12,
                  zIndex: 1
                }}
              />
            ) : (
              <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#888', zIndex: 2}}>
                No 'front' or 'back' collection found.
              </div>
            )}
            {/* Close button, above canvas */}
            <button className="close-btn" onClick={handleClose} style={{ zIndex: 2 }}>
              x
            </button>
            {/* Toolbar, above canvas, bottom center */}
            <div className="generate-container" style={{ position: 'absolute', left: '50%', bottom: 32, transform: 'translateX(-50%)', zIndex: 2 }}>
              <Upload />
              <Download />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Generate;
