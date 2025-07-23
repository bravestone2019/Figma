import { drawRectangle, drawLine, drawCircle, drawTriangle, drawImage, drawText } from "../Canvas/CanvasContent/shapeRenderers";
import JsBarcode from 'jsbarcode';

// Helper to load an image and return a Promise that resolves when loaded
const imageCache = {};
export function loadImageAsync(src) {
  if (!src) return Promise.resolve(null);
  if (imageCache[src]) return Promise.resolve(imageCache[src]);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = (e) => resolve(null); // resolve with null so placeholder is drawn
    img.src = src;
  });
}

// Helper to draw a rounded rectangle path (supports uniform or per-corner radii)
export function roundedRectPath(ctx, x, y, width, height, radii) {
  let tl, tr, br, bl;
  if (typeof radii === 'number') {
    tl = tr = br = bl = radii;
  } else if (typeof radii === 'object') {
    tl = radii.tl || 0;
    tr = radii.tr || 0;
    br = radii.br || 0;
    bl = radii.bl || 0;
  } else {
    tl = tr = br = bl = 0;
  }
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

// Main drawCard function
export async function drawCard(ctx, shapes, excelRow, files, width = 320, height = 200, onImageLoad) {
  ctx.clearRect(0, 0, width, height);
  if (!shapes || shapes.length === 0) {
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#888';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No shapes', width / 2, height / 2);
    return;
  }
  ctx.save();
  ctx.translate(0, height);
  ctx.rotate(-Math.PI / 2);
  // Bounding box calculation
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  shapes.forEach(shape => {
    if (shape.type === 'line') {
      minX = Math.min(minX, shape.x1, shape.x2);
      minY = Math.min(minY, shape.y1, shape.y2);
      maxX = Math.max(maxX, shape.x1, shape.x2);
      maxY = Math.max(maxY, shape.y1, shape.y2);
    } else if (shape.type === 'triangle') {
      minX = Math.min(minX, shape.x1, shape.x2, shape.x3);
      minY = Math.min(minY, shape.y1, shape.y2, shape.y3);
      maxX = Math.max(maxX, shape.x1, shape.x2, shape.x3);
      maxY = Math.max(maxY, shape.y1, shape.y2, shape.y3);
    } else if (shape.x !== undefined && shape.y !== undefined && shape.width !== undefined && shape.height !== undefined) {
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    }
  });
  if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
    minX = 0; minY = 0; maxX = height; maxY = width;
  }
  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const margin = 16;
  const scale = Math.min((height - 2 * margin) / boxW, (width - 2 * margin) / boxH);
  const offsetX = (height - boxW * scale) / 2 - minX * scale;
  const offsetY = (width - boxH * scale) / 2 - minY * scale;
  ctx.scale(scale, scale);
  ctx.translate(offsetX / scale, offsetY / scale);
  for (const shape of shapes) {
    await drawShape(ctx, shape, excelRow, files, onImageLoad);
  }
  ctx.restore();
}

// Dispatcher for shape rendering
async function drawShape(ctx, shape, excelRow, files, onImageLoad) {
  // Barcode placeholder logic
  if (shape.role === 'placeholder' && (shape.name || '').toLowerCase() === 'barcode') {
    // Find the code value in excelRow (case-insensitive)
    let codeValue = undefined;
    if (excelRow) {
      const codeKey = Object.keys(excelRow).find(k => k.toLowerCase() === 'code');
      if (codeKey) codeValue = excelRow[codeKey];
    }
    if (codeValue) {
      drawBarcodeShape(ctx, shape, codeValue);
    }
    return; // Skip normal rendering for barcode placeholder
  }

  // Normal shape rendering
  switch (shape.type) {
    case 'rectangle':
    case 'rec':
      drawRectangleShape(ctx, shape);
      break;
    case 'img':
    case 'image':
      await drawImageShape(ctx, shape, excelRow, files, onImageLoad);
      break;
    case 'line':
      drawLineShape(ctx, shape);
      break;
    case 'circle':
      drawCircleShape(ctx, shape);
      break;
    case 'triangle':
      drawTriangleShape(ctx, shape);
      break;
    case 'text':
      drawTextShape(ctx, shape, excelRow);
      break;
    default:
      break;
  }
}

function drawRectangleShape(ctx, shape) {
  drawRectangle(ctx, shape, { ...shape });
}

async function drawImageShape(ctx, shape, excelRow, files, onImageLoad) {
  let renderShape = { ...shape };
  // Placeholder logic for image
  if (shape.role === 'placeholder') {
    let rollNoKey;
    if (excelRow) {
      const normalizeKey = str => (str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
      const possibleKeys = Object.keys(excelRow);
      rollNoKey = possibleKeys.find(k => normalizeKey(k).includes('rollno'));
    }
    let rollNoValue = rollNoKey && excelRow ? String(excelRow[rollNoKey]) : undefined;
    let matchedFile;
    if (rollNoValue && files && files.length > 0) {
      const normalizeFileName = name => name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
      const rollNoNorm = rollNoValue.toLowerCase().replace(/[^a-z0-9]/gi, '');
      matchedFile = files.find(f => normalizeFileName(f.name) === rollNoNorm);
    }
    if (matchedFile) {
      if (!matchedFile._blobUrl) {
        matchedFile._blobUrl = URL.createObjectURL(matchedFile);
      }
      renderShape.src = matchedFile._blobUrl;
      renderShape.backgroundColor = undefined;
      renderShape.opacity = 1;
    } else {
      renderShape.src = '';
      renderShape.backgroundColor = '#e0e0e0';
      renderShape.opacity = 1;
    }
  }
  if (typeof renderShape.src === 'string' && renderShape.src.trim() !== '') {
    const img = await loadImageAsync(renderShape.src);
    if (img) {
      ctx.save();
      ctx.globalAlpha = renderShape.opacity ?? 1;
      let radii = 0;
      if (typeof renderShape.cornerRadius === 'number') {
        radii = renderShape.cornerRadius;
      } else if (
        renderShape.cornerRadiusTopLeft || renderShape.cornerRadiusTopRight ||
        renderShape.cornerRadiusBottomRight || renderShape.cornerRadiusBottomLeft
      ) {
        radii = {
          tl: renderShape.cornerRadiusTopLeft || 0,
          tr: renderShape.cornerRadiusTopRight || 0,
          br: renderShape.cornerRadiusBottomRight || 0,
          bl: renderShape.cornerRadiusBottomLeft || 0,
        };
      }
      if (radii) {
        roundedRectPath(ctx, renderShape.x, renderShape.y, renderShape.width, renderShape.height, radii);
        ctx.clip();
      }
      ctx.drawImage(img, renderShape.x, renderShape.y, renderShape.width, renderShape.height);
      ctx.restore();
      if (onImageLoad) onImageLoad();
    } else {
      drawImagePlaceholder(ctx, renderShape);
    }
  } else {
    drawImagePlaceholder(ctx, renderShape);
  }
}

function drawImagePlaceholder(ctx, shape) {
  ctx.save();
  ctx.fillStyle = shape.backgroundColor || '#e0e0e0';
  ctx.globalAlpha = shape.opacity ?? 1;
  ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Placeholder', shape.x + shape.width / 2, shape.y + shape.height / 2);
  ctx.restore();
}

function drawLineShape(ctx, shape) {
  drawLine(ctx, shape, { ...shape, x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2 });
}

function drawCircleShape(ctx, shape) {
  drawCircle(ctx, shape, { ...shape });
}

function drawTriangleShape(ctx, shape) {
  drawTriangle(ctx, shape, { ...shape });
}

function drawTextShape(ctx, shape, excelRow) {
  let renderShape = { ...shape };
  if (shape.role === 'placeholder') {
    let matchedKey;
    function normalizeKey(str) {
      return (str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
    }
    if (excelRow && shape.name) {
      const shapeNameNorm = normalizeKey(shape.name);
      matchedKey = Object.keys(excelRow).find(k => normalizeKey(k) === shapeNameNorm);
    }
    if (matchedKey && excelRow[matchedKey] !== undefined) {
      renderShape.text = String(excelRow[matchedKey]);
      renderShape.opacity = 1;
    } else {
      renderShape.text = 'Placeholder';
      renderShape.color = '#b0b0b0';
      renderShape.opacity = 0.7;
    }
  }
  drawText(ctx, renderShape, { ...renderShape });
}

// Barcode rendering logic
function drawBarcodeShape(ctx, shape, codeValue) {
  const barcodeCanvas = document.createElement('canvas');
  try {
    JsBarcode(barcodeCanvas, String(codeValue), {
      format: 'CODE128',
      width: 2,
      height: shape.height || 40,
      displayValue: false,
      margin: 0,
      background: 'transparent',
    });
    ctx.save();
    ctx.globalAlpha = shape.opacity ?? 1;
    ctx.drawImage(
      barcodeCanvas,
      shape.x,
      shape.y,
      shape.width,
      shape.height
    );
    ctx.restore();
  } catch (e) {
    ctx.save();
    ctx.fillStyle = shape.color || '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(codeValue), shape.x + (shape.width || 80) / 2, shape.y + (shape.height || 40) / 2);
    ctx.restore();
  }
} 