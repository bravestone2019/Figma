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
import { extractFrontBackShapes } from "./shapeUtils";
import { createPortal } from 'react-dom';
import { PDFDocument } from 'pdf-lib';
import JsBarcode from 'jsbarcode';

// Helper to load an image and return a Promise that resolves when loaded
const imageCache = {};
function loadImageAsync(src) {
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
function roundedRectPath(ctx, x, y, width, height, radii) {
  // radii: number or {tl, tr, br, bl}
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

// Helper to draw a card (refactored from CardPreview, now async for images)
async function drawCard(ctx, shapes, excelRow, files, width = 320, height = 200, onImageLoad) {
  const landscapeWidth = width;
  const landscapeHeight = height;
  ctx.clearRect(0, 0, landscapeWidth, landscapeHeight);
  if (!shapes || shapes.length === 0) {
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, landscapeWidth, landscapeHeight);
    ctx.fillStyle = '#888';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No shapes', landscapeWidth / 2, landscapeHeight / 2);
    return;
  }
  ctx.save();
  ctx.translate(0, landscapeHeight);
  ctx.rotate(-Math.PI / 2);
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
  const scale = Math.min((landscapeHeight - 2 * margin) / boxW, (landscapeWidth - 2 * margin) / boxH);
  const offsetX = (landscapeHeight - boxW * scale) / 2 - minX * scale;
  const offsetY = (landscapeWidth - boxH * scale) / 2 - minY * scale;
  ctx.scale(scale, scale);
  ctx.translate(offsetX / scale, offsetY / scale);
  for (const shape of shapes) {
    let renderShape = { ...shape };
    // Barcode placeholder logic
    if (shape.role === 'placeholder' && (shape.name || '').toLowerCase() === 'barcode') {
      // Find the code value in excelRow (case-insensitive)
      let codeValue = undefined;
      if (excelRow) {
        const codeKey = Object.keys(excelRow).find(k => k.toLowerCase() === 'code');
        if (codeKey) codeValue = excelRow[codeKey];
      }
      if (codeValue) {
        // Create a temporary canvas for JsBarcode
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
          // If barcode fails, fallback to text
          ctx.save();
          ctx.fillStyle = renderShape.color || '#000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(codeValue), renderShape.x + (renderShape.width || 80) / 2, renderShape.y + (renderShape.height || 40) / 2);
          ctx.restore();
        }
        continue; // Skip normal text/image rendering for barcode placeholder
      }
    }
    if (renderShape.type === 'image' || renderShape.type === 'img') {
      const name = (renderShape.name || '').toLowerCase();
      if (name.includes('profile') || name.includes('photo') || name.includes('avatar')) {
        renderShape.clip = 'circle';
      }
    }
    if (shape.role === 'placeholder') {
      if (shape.type === 'text') {
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
      } else if (shape.type === 'image' || shape.type === 'img') {
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
    }
    switch (shape.type) {
      case 'rectangle':
      case 'rec':
        drawRectangle(ctx, renderShape, { ...renderShape });
        break;
      case 'img':
      case 'image':
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
        } else {
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
  }
  ctx.restore();
}

// Helper to render a card preview for a given row (front or back)
function CardPreview({ shapes, excelRow, files, width = 320, height = 200 }) {
  const landscapeWidth = 320;
  const landscapeHeight = 200;
  const canvasRef = useRef(null);
  // Preload all image sources for this card
  useEffect(() => {
    let isMounted = true;
    async function draw() {
      if (!canvasRef.current) return;
      // Find all image shapes for this card
      const imageShapes = shapes ? shapes.filter(s => (s.type === 'image' || s.type === 'img') && s.src) : [];
      // Preload all images
      await Promise.all(imageShapes.map(s => loadImageAsync(s.src)));
      // Now draw the card (all shapes)
      if (!isMounted) return;
      const ctx = canvasRef.current.getContext('2d');
      await drawCard(ctx, shapes, excelRow, files, width, height);
    }
    draw();
    return () => { isMounted = false; };
  }, [JSON.stringify(shapes), JSON.stringify(excelRow), JSON.stringify(files)]);
  return <canvas ref={canvasRef} width={landscapeWidth} height={landscapeHeight} style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none' }} />;
}

// PrintPanel component
function PrintPanel({ open, onClose, frontBackShapes, excelData, files, handleExportPDF }) {
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const totalRows = excelData ? excelData.length : 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIdx = page * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  const hasFront = frontBackShapes && frontBackShapes.some(s => s.side === 'front');
  const hasBack = frontBackShapes && frontBackShapes.some(s => s.side === 'back');
  return (
    <div className="print-panel-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'transparent', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="print-panel-modal print-preview-modal" style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 1600, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 4px 32px rgba(0,0,0,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 32, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 24 }}>Print Preview</h2>
        {(!hasFront && !hasBack) && <div style={{ color: '#888', textAlign: 'center', margin: 32 }}>No card shapes found for front or back.</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0px 0px', justifyContent: 'center', alignItems: 'flex-start', marginBottom: 0 }}>
          {excelData && excelData.slice(startIdx, endIdx).map((row, idx) => (
            <div key={row.rollNo || row.id || (startIdx + idx)} style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0px',
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: '100%',
              background: 'transparent',
              borderRadius: 0,
              padding: 0,
              boxShadow: 'none'
            }}>
              <div style={{ textAlign: 'center' }}>
                {hasFront ? (
                  (() => { const frontShapes = frontBackShapes.filter(s => s.side === 'front'); return (
                    <CardPreview key={'front-' + (row.rollNo || row.id || (startIdx + idx)) + '-' + JSON.stringify(frontShapes)} shapes={frontShapes} excelRow={row} files={files} width={320} height={200} />
                  ); })()
                ) : (
                  <div style={{ color: '#aaa', fontStyle: 'italic' }}>No front card</div>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                {hasBack ? (
                  <CardPreview key={'back-' + (row.rollNo || row.id || (startIdx + idx)) + '-' + JSON.stringify(frontBackShapes.filter(s => s.side === 'back'))} shapes={frontBackShapes.filter(s => s.side === 'back')} excelRow={row} files={files} width={320} height={200} />
                ) : (
                  <div style={{ color: '#aaa', fontStyle: 'italic' }}>No back card</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={handleExportPDF} style={{ marginRight: 16, padding: '8px 20px', fontSize: 16, borderRadius: 8, background: '#388e3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Export as PDF</button>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
          <span style={{ margin: '0 16px' }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>Next</button>
        </div>
      </div>
    </div>
  );
}

// --- PDF Export Logic ---
async function exportCardsAsPDF({ frontBackShapes, excelData, files, rowsPerPage = 5 }) {
  // Use the same card size as preview
  const cardWidth = 320;
  const cardHeight = 200;
  async function renderPageToDataURL(rows) {
    // Sheet canvas: two cards side by side, stack rows vertically
    const sheetWidth = 2 * cardWidth;
    const sheetHeight = cardHeight * rows.length;
    const canvas = document.createElement('canvas');
    canvas.width = sheetWidth;
    canvas.height = sheetHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, sheetWidth, sheetHeight);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Draw front card
      const frontShapes = frontBackShapes.filter(s => s.side === 'front');
      const frontCard = document.createElement('canvas');
      frontCard.width = cardWidth;
      frontCard.height = cardHeight;
      const frontCtx = frontCard.getContext('2d');
      await drawCard(frontCtx, frontShapes, row, files, cardWidth, cardHeight);
      ctx.drawImage(frontCard, 0, i * cardHeight, cardWidth, cardHeight);
      // Draw back card
      const backShapes = frontBackShapes.filter(s => s.side === 'back');
      const backCard = document.createElement('canvas');
      backCard.width = cardWidth;
      backCard.height = cardHeight;
      const backCtx = backCard.getContext('2d');
      backCtx.fillStyle = '#fff';
      backCtx.fillRect(0, 0, cardWidth, cardHeight);
      await drawCard(backCtx, backShapes, row, files, cardWidth, cardHeight);
      ctx.drawImage(backCard, cardWidth, i * cardHeight, cardWidth, cardHeight);
    }
    return canvas.toDataURL('image/png');
  }
  const pdfDoc = await PDFDocument.create();
  const totalRows = excelData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  for (let i = 0; i < totalPages; i++) {
        const startIdx = i * rowsPerPage;
        const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
    const pageRows = excelData.slice(startIdx, endIdx);
    const dataUrl = await renderPageToDataURL(pageRows);
    const pngImageBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    // Use the actual pixel dimensions for the PDF page
    const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
    page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });
  }
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cards.pdf';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

const Generate = ({
  activeTool,
  setActiveTool,
  openDropdown,
  isGenerateOpen,
  setIsGenerateOpen,
  drawnRectangles, // <-- receive real array
  collections, // <-- receive collections
  excelData, // <-- receive excelData
  setExcelData, // <-- receive setExcelData
  files, // <-- receive files for image mapping
  setFiles, // <-- receive setFiles for file management
}) => {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);
  // Dummy state to force re-render
  const [redrawTick, setRedrawTick] = useState(0);
  const [printMode, setPrintMode] = useState(false);
  // Track image blob URL version for instant redraw
  const [imageBlobUrlsVersion, setImageBlobUrlsVersion] = useState(0);

  // Whenever files change, ensure all images have blob URLs and increment version
  useEffect(() => {
    let changed = false;
    if (files && files.length > 0) {
      files.forEach(f => {
        if (f.type && f.type.startsWith('image/') && !f._blobUrl) {
          f._blobUrl = URL.createObjectURL(f);
          changed = true;
        }
      });
    }
    if (changed) setImageBlobUrlsVersion(v => v + 1);
  }, [files]);

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

  // Set up redrawCallback on the canvas DOM node
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.redrawCallback = () => {
        setRedrawTick(tick => tick + 1);
      };
    }
  }, []);

  // Find front/back shapes using shared utility
  let frontBackShapes = extractFrontBackShapes(collections, drawnRectangles);


  // Deep clone before sorting to avoid mutation
  frontBackShapes = JSON.parse(JSON.stringify(frontBackShapes)).sort((a, b) => (a.zorder ?? 0) - (b.zorder ?? 0));

  useEffect(() => {
    if (!open || !canvasRef.current || !frontBackShapes.length) return;
    let isMounted = true;
    async function drawPreview() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      // Find all image shapes in frontBackShapes
      const imageShapes = frontBackShapes.filter(s => (s.type === 'image' || s.type === 'img') && s.src);
      await Promise.all(imageShapes.map(s => loadImageAsync(s.src)));
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

  const hasFrontOrBack = frontBackShapes.length > 0;
  const [printPanelOpen, setPrintPanelOpen] = useState(false);
  // Add export PDF handler
  const handleExportPDF = async () => {
    await exportCardsAsPDF({ frontBackShapes, excelData, files, rowsPerPage: 5 });
  };
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
              <Upload setExcelData={setExcelData} files={files} setFiles={setFiles} />
              <div style={{ display: 'inline-block' }} onClick={() => setPrintPanelOpen(true) }>
                <Download />
              </div>
              {/* Export as PDF button intentionally removed from here */}
            </div>
            <PrintPanel open={printPanelOpen} onClose={() => setPrintPanelOpen(false)} frontBackShapes={frontBackShapes} excelData={excelData} files={files} handleExportPDF={handleExportPDF} />
          </div>
        </div>
      )}
    </>
  );
};

export default Generate;
