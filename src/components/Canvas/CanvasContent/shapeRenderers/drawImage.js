// drawImage.js
// Handles image shape rendering with loading, caching, and state management

import { applyShapeStyling, drawShapeBorder } from './shapeStyling.js';

// Image cache to store loaded images
const imageCache = new Map();
const loadingImages = new Set(); // Track images currently loading

// Helper function to load and cache images
function loadImage(src) {
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }
  
  if (loadingImages.has(src)) {
    // Image is already loading, return existing promise
    return imageCache.get(src);
  }
  
  const img = new Image();
  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      imageCache.set(src, img); // Store the actual image, not the promise
      loadingImages.delete(src);
      resolve(img);
    };
    img.onerror = () => {
      imageCache.set(src, null); // Store null to indicate error
      loadingImages.delete(src);
      reject(new Error('Failed to load image'));
    };
  });
  
  loadingImages.add(src);
  imageCache.set(src, promise); // Store promise while loading
  img.src = src;
  return promise;
}

export function drawImage(ctx, shape, options = {}) {
  const { 
    isHovered = false, 
    isLocked = false, 
    scale = 1,
    activeTool = null,
    canvas = null,
    x, y, width, height, rotation = 0
  } = options;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  ctx.globalAlpha = shape.opacity;

  // --- Rounded corners logic ---
  const tl = shape.cornerRadiusTopLeft ?? shape.cornerRadius ?? 0;
  const tr = shape.cornerRadiusTopRight ?? shape.cornerRadius ?? 0;
  const br = shape.cornerRadiusBottomRight ?? shape.cornerRadius ?? 0;
  const bl = shape.cornerRadiusBottomLeft ?? shape.cornerRadius ?? 0;
  if (tl > 0 || tr > 0 || br > 0 || bl > 0) {
    ctx.save();
    roundedRectPath(ctx, shape.x, shape.y, shape.width, shape.height, tl, tr, br, bl);
    ctx.clip();
  }

  // Check if image is already loaded
  const cachedImage = imageCache.get(shape.src);
  if (cachedImage && !cachedImage.then) {
    if (cachedImage) {
      ctx.drawImage(cachedImage, shape.x, shape.y, shape.width, shape.height);
    }
  } else {
    drawImagePlaceholder(ctx, shape, scale);
    if (!cachedImage && !loadingImages.has(shape.src)) {
      loadImage(shape.src).then(() => {
        if (canvas && canvas.redrawCallback && !canvas.redrawScheduled) {
          canvas.redrawScheduled = true;
          setTimeout(() => {
            canvas.redrawCallback();
            canvas.redrawScheduled = false;
          }, 16);
        }
      }).catch(() => {
        if (canvas && canvas.redrawCallback && !canvas.redrawScheduled) {
          canvas.redrawScheduled = true;
          setTimeout(() => {
            canvas.redrawCallback();
            canvas.redrawScheduled = false;
          }, 16);
        }
      });
    }
  }

  if (tl > 0 || tr > 0 || br > 0 || bl > 0) {
    ctx.restore(); // Restore after clipping
  }

  // --- INSIDE/OUTSIDE/CENTER STROKE LOGIC ---
  // Draw stroke (border) with rounded corners if needed
  const inside = shape.strokePosition === 'inside';
  const outside = shape.strokePosition === 'outside';
  const center = shape.strokePosition === 'center';
  const topWidth = shape.borderTopWidth ?? shape.borderWidth ?? 0;
  const rightWidth = shape.borderRightWidth ?? shape.borderWidth ?? 0;
  const bottomWidth = shape.borderBottomWidth ?? shape.borderWidth ?? 0;
  const leftWidth = shape.borderLeftWidth ?? shape.borderWidth ?? 0;
  const allWidthsEqual = topWidth === rightWidth && rightWidth === bottomWidth && bottomWidth === leftWidth;
  const topColor = shape.borderTopColor ?? shape.borderColor ?? "transparent";
  const rightColor = shape.borderRightColor ?? shape.borderColor ?? "transparent";
  const bottomColor = shape.borderBottomColor ?? shape.borderColor ?? "transparent";
  const leftColor = shape.borderLeftColor ?? shape.borderColor ?? "transparent";
  const allColorsEqual = topColor === rightColor && rightColor === bottomColor && bottomColor === leftColor;
  const borderWidth = topWidth; // all equal
  const borderColor = topColor; // all equal
  const borderAlpha = shape.borderOpacity !== undefined ? shape.borderOpacity : 1;
  if (allWidthsEqual && allColorsEqual && borderWidth > 0 && borderColor !== 'transparent') {
    ctx.save();
    ctx.globalAlpha = borderAlpha;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    let strokeX = shape.x;
    let strokeY = shape.y;
    let strokeW = shape.width;
    let strokeH = shape.height;
    if (inside) {
      strokeX += borderWidth / 2;
      strokeY += borderWidth / 2;
      strokeW -= borderWidth;
      strokeH -= borderWidth;
    } else if (outside) {
      strokeX -= borderWidth / 2;
      strokeY -= borderWidth / 2;
      strokeW += borderWidth;
      strokeH += borderWidth;
    }
    if (tl > 0 || tr > 0 || br > 0 || bl > 0) {
      roundedRectPath(ctx, strokeX, strokeY, strokeW, strokeH, tl, tr, br, bl);
      ctx.stroke();
    } else {
      ctx.strokeRect(strokeX, strokeY, strokeW, strokeH);
    }
    ctx.restore();
  } else {
    // Per-side fallback: draw filled rectangles for each side
    // Top border
    if (topWidth > 0) {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = topColor;
      ctx.fillRect(shape.x, shape.y, shape.width, topWidth);
      ctx.restore();
    }
    // Right border
    if (rightWidth > 0) {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = rightColor;
      ctx.fillRect(shape.x + shape.width - rightWidth, shape.y, rightWidth, shape.height);
      ctx.restore();
    }
    // Bottom border
    if (bottomWidth > 0) {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = bottomColor;
      ctx.fillRect(shape.x, shape.y + shape.height - bottomWidth, shape.width, bottomWidth);
      ctx.restore();
    }
    // Left border
    if (leftWidth > 0) {
      ctx.save();
      ctx.globalAlpha = borderAlpha;
      ctx.fillStyle = leftColor;
      ctx.fillRect(shape.x, shape.y, leftWidth, shape.height);
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawImagePlaceholder(ctx, shape, scale) {
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1 / scale;
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  
  ctx.fillStyle = "#666";
  ctx.font = `${12 / scale}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText("Loading...", shape.x + shape.width / 2, shape.y + shape.height / 2);
}

function drawImageBorder(ctx, shape, isHovered, isLocked, scale, activeTool) {
  // Use shared styling for line dash, line width, and globalAlpha
  applyShapeStyling(ctx, shape, isHovered, isLocked, scale, activeTool);
  // Colors and fills remain unchanged
  if (isLocked) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / scale;
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  } else if (activeTool === "Move" && isHovered) {
    // Draw hover border with better visibility
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = Math.max(2 / scale, 1);
    ctx.globalAlpha = 1; // Ensure full opacity for hover border
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    // Add subtle background highlight for better visual feedback
    ctx.fillStyle = "rgba(33, 150, 243, 0.1)";
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  } else {
    // Always draw a border using shape.borderColor and shape.borderWidth if set
    if (shape.borderColor) {
      ctx.strokeStyle = shape.borderColor;
      ctx.lineWidth = shape.borderWidth && shape.borderWidth > 0 ? shape.borderWidth / scale : 1 / scale;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  }
} 

// Helper for rounded rectangle path
function roundedRectPath(ctx, x, y, width, height, tl, tr, br, bl) {
  const maxR = Math.min(width, height) / 2;
  tl = Math.max(0, Math.min(tl, maxR));
  tr = Math.max(0, Math.min(tr, maxR));
  br = Math.max(0, Math.min(br, maxR));
  bl = Math.max(0, Math.min(bl, maxR));
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
} 