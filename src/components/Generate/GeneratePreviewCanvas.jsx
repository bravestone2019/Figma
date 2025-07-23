import React, { useEffect } from 'react';
import { drawRectangle, drawLine, drawCircle, drawTriangle, drawImage, drawText } from '../Canvas/CanvasContent/shapeRenderers';
import JsBarcode from 'jsbarcode';

function GeneratePreviewCanvas({ open, frontBackShapes, excelData, files, canvasRef, imageBlobUrlsVersion, redrawTick }) {
  useEffect(() => {
    if (!open || !canvasRef.current || !frontBackShapes.length) return;
    let isMounted = true;
    async function drawPreview() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      // Find all image shapes in frontBackShapes
      const imageShapes = frontBackShapes.filter(s => (s.type === 'image' || s.type === 'img') && s.src);
      await Promise.all(imageShapes.map(s => drawImage.preload ? drawImage.preload(s.src) : Promise.resolve()));
      if (!isMounted) return;
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
      // --- Bounding box logic ---
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      frontBackShapes.forEach(shape => {
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
      // Fallback if no valid shapes
      if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
        minX = 0; minY = 0; maxX = width; maxY = height;
      }
      const boxW = maxX - minX;
      const boxH = maxY - minY;
      // Add margin
      const margin = 32 * dpr;
      const scale = Math.min((width - 2 * margin) / boxW, (height - 2 * margin) / boxH);
      const offsetX = (width - boxW * scale) / 2 - minX * scale;
      const offsetY = (height - boxH * scale) / 2 - minY * scale;
      ctx.scale(scale, scale);
      ctx.translate(offsetX / scale, offsetY / scale);
      // Render each shape (positions relative to bounding box)
      frontBackShapes.forEach(shape => {
        const role = shape.role || 'default';
        const type = shape.shapeId || shape.type;
        let renderShape = { ...shape };
        // Barcode placeholder logic for preview
        if (role === 'placeholder' && (renderShape.name || '').toLowerCase() === 'barcode') {
          let codeValue = undefined;
          if (excelData && excelData.length > 0) {
            const codeKey = Object.keys(excelData[0]).find(k => k.toLowerCase() === 'code');
            if (codeKey) codeValue = excelData[0][codeKey];
          }
          if (codeValue) {
            const barcodeCanvas = document.createElement('canvas');
            try {
              JsBarcode(barcodeCanvas, String(codeValue), {
                format: 'CODE128',
                width: 2,
                height: renderShape.height || 40,
                displayValue: false,
                margin: 0,
                background: 'transparent',
              });
              ctx.save();
              ctx.globalAlpha = renderShape.opacity ?? 1;
              ctx.drawImage(
                barcodeCanvas,
                renderShape.x,
                renderShape.y,
                renderShape.width,
                renderShape.height
              );
              ctx.restore();
            } catch (e) {
              ctx.save();
              ctx.fillStyle = renderShape.color || '#000';
              ctx.font = '14px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(String(codeValue), renderShape.x + (renderShape.width || 80) / 2, renderShape.y + (renderShape.height || 40) / 2);
              ctx.restore();
            }
            return; // Skip normal rendering for barcode placeholder
          }
        }
        // Placeholder: override fill/background
        if (role === 'placeholder') {
          if (type === 'rec' || type === 'rectangle') {
            renderShape.backgroundColor = '#e0e0e0';
            renderShape.fillOpacity = 1;
            renderShape.opacity = 1;
          } else if (type === 'img' || type === 'image') {
            // Image placeholder logic
            // Find the roll no field in excelData[0] (normalize keys)
            let rollNoKey = undefined;
            if (excelData && excelData.length > 0) {
              const normalizeKey = str => (str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
              const possibleKeys = Object.keys(excelData[0]);
              rollNoKey = possibleKeys.find(k => normalizeKey(k).includes('rollno'));
            }
            let rollNoValue = rollNoKey && excelData && excelData.length > 0 ? String(excelData[0][rollNoKey]) : undefined;
            let matchedFile = undefined;
            if (rollNoValue && files && files.length > 0) {
              // Find file whose name (without extension) matches rollNoValue (normalize both)
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
          } else if (type === 'text') {
            // Case-insensitive, punctuation/space-insensitive header matching
            let matchedKey = undefined;
            function normalizeKey(str) {
              return (str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
            }
            if (excelData && excelData.length > 0 && renderShape.name) {
              const shapeNameNorm = normalizeKey(renderShape.name);
              matchedKey = Object.keys(excelData[0]).find(
                k => normalizeKey(k) === shapeNameNorm
              );
            }
            if (excelData && excelData.length > 0 && matchedKey && excelData[0][matchedKey] !== undefined) {
              renderShape.text = String(excelData[0][matchedKey]);
              // Do NOT set renderShape.color here; keep the original color/fill
              renderShape.opacity = 1;
            } else {
              renderShape.text = 'Placeholder';
              renderShape.color = '#b0b0b0'; // Only set grey for placeholder
              renderShape.opacity = 0.7;
            }
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
              drawImage(ctx, renderShape, { ...renderShape, canvas: canvasRef.current });
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
    }
    drawPreview();
    return () => { isMounted = false; };
  }, [open, frontBackShapes, redrawTick, imageBlobUrlsVersion]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#f7f7f9', borderRadius: 12, zIndex: 1 }} />;
}

export default GeneratePreviewCanvas; 