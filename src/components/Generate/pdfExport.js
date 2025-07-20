import { PDFDocument } from 'pdf-lib';
import { drawCard } from './drawCardHelpers';

export async function exportCardsAsPDF({ frontBackShapes, excelData, files, rowsPerPage = 5 }) {
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