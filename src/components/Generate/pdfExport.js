import { PDFDocument } from 'pdf-lib';
import { drawCard } from './drawCardHelpers';

export async function exportCardsAsPDF({ frontBackShapes, excelData, files, rowsPerPage = 5 }) {
  // Use the same card size as preview
  const cardWidth = 320;
  const cardHeight = 200;
  const scaleFactor = 4; // Increase for higher quality
  const hiResCardWidth = cardWidth * scaleFactor;
  const hiResCardHeight = cardHeight * scaleFactor;

  async function renderPageToDataURL(rows) {
    // Sheet canvas: two cards side by side, stack rows vertically
    const sheetWidth = 2 * hiResCardWidth;
    const sheetHeight = hiResCardHeight * rows.length;
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
      frontCard.width = hiResCardWidth;
      frontCard.height = hiResCardHeight;
      const frontCtx = frontCard.getContext('2d');
      await drawCard(frontCtx, frontShapes, row, files, hiResCardWidth, hiResCardHeight);
      // Draw scaled down to sheet
      ctx.drawImage(frontCard, 0, i * hiResCardHeight, hiResCardWidth, hiResCardHeight);
      // Draw back card
      const backShapes = frontBackShapes.filter(s => s.side === 'back');
      const backCard = document.createElement('canvas');
      backCard.width = hiResCardWidth;
      backCard.height = hiResCardHeight;
      const backCtx = backCard.getContext('2d');
      backCtx.fillStyle = '#fff';
      backCtx.fillRect(0, 0, hiResCardWidth, hiResCardHeight);
      await drawCard(backCtx, backShapes, row, files, hiResCardWidth, hiResCardHeight);
      ctx.drawImage(backCard, hiResCardWidth, i * hiResCardHeight, hiResCardWidth, hiResCardHeight);
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
    // Use the original (not hi-res) pixel dimensions for the PDF page
    const page = pdfDoc.addPage([cardWidth * 2, cardHeight * pageRows.length]);
    // Draw the hi-res image scaled down to the PDF page size
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: cardWidth * 2,
      height: cardHeight * pageRows.length,
    });
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