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
  
  // Check if image is already loaded
  const cachedImage = imageCache.get(shape.src);
  
  if (cachedImage && !cachedImage.then) {
    // Image is loaded, draw it
    if (cachedImage) {
      ctx.drawImage(cachedImage, shape.x, shape.y, shape.width, shape.height);
    }
  } else {
    // Image is loading or not started, draw placeholder
    drawImagePlaceholder(ctx, shape, scale);
    
    // Start loading if not already loading
    if (!cachedImage && !loadingImages.has(shape.src)) {
      loadImage(shape.src).then(() => {
        // Only trigger redraw once when image loads
        if (canvas && canvas.redrawCallback && !canvas.redrawScheduled) {
          canvas.redrawScheduled = true;
          setTimeout(() => {
            canvas.redrawCallback();
            canvas.redrawScheduled = false;
          }, 16); // ~60fps
        }
      }).catch(() => {
        // Handle error silently, placeholder will remain
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
  
  // Draw border for selected/locked images
  drawImageBorder(ctx, shape, isHovered, isLocked, scale, activeTool);
  
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
  }
} 