// import { PDFDocument } from 'pdf-lib';
// import { drawCard } from './drawCardHelpers';

// export async function exportCardsAsPDF({ frontBackShapes, excelData, files }) {
//   const cmToPt = cm => cm * 28.35;
//   const inchToCm = inch => inch * 2.54;

//   // Actual real-world card dimensions provided by user (converted from inches to cm)
//   // Card is 2.125 inches wide and 3.375 inches tall.
//   // When placed landscape, its effective width will be 3.375 inches (original height)
//   // and its effective height will be 2.125 inches (original width).
//   const originalCardWidthCm = inchToCm(2.125);  // Actual width of the physical card (5.3975 cm)
//   const originalCardHeightCm = inchToCm(3.375); // Actual height of the physical card (8.5725 cm)

//   // Page dimensions (as confirmed: 20cm wide, 30cm tall - portrait)
//   const pageWidthCm = 20;
//   const pageHeightCm = 30;

//   // Desired number of rows per page
//   const desiredRowsPerPage = 5;

//   // Calculate the required effective height for each card to fit 5 rows vertically on the 30cm page.
//   // When placed landscape, the originalCardWidthCm (5.3975cm) becomes the effective height.
//   // So, 30cm page height / 5 rows = 6cm effective height per card.
//   const requiredEffectiveCardHeightCm = pageHeightCm / desiredRowsPerPage; // This will be 6cm

//   // Calculate the scaling factor needed to make the original card's effective height (originalCardWidthCm)
//   // match the required effective height (6cm), while maintaining aspect ratio.
//   const scalingFactorForFit = requiredEffectiveCardHeightCm / originalCardWidthCm; // 6cm / 5.3975cm

//   // Apply this scaling factor to both original dimensions to get the new, scaled dimensions.
//   // These are the dimensions the card will actually have on the PDF page.
//   const scaledCardEffectiveHeightCm = originalCardWidthCm * scalingFactorForFit; // This will be 6cm
//   const scaledCardEffectiveWidthCm = originalCardHeightCm * scalingFactorForFit; // This will be 8.5725cm * (6/5.3975) approx 9.53cm

//   // Convert scaled dimensions to PDF points for precise placement
//   const scaledCardEffectiveHeightPt = cmToPt(scaledCardEffectiveHeightCm);
//   const scaledCardEffectiveWidthPt = cmToPt(scaledCardEffectiveWidthCm);

//   // Convert page dimensions to PDF points
//   const pageWidthPt = cmToPt(pageWidthCm);
//   const pageHeightPt = cmToPt(pageHeightCm);

//   // High-resolution canvas dimensions for rendering the card content.
//   // These are passed to drawCardHelpers.js and should be used proportionally within drawCard.
//   const hiResScaleFactor = 4; // Multiplier for canvas rendering quality
//   const hiResCanvasWidthForCard = scaledCardEffectiveWidthPt * hiResScaleFactor;  // Canvas width for one landscape card
//   const hiResCanvasHeightForCard = scaledCardEffectiveHeightPt * hiResScaleFactor; // Canvas height for one landscape card

//   const rowsPerPage = desiredRowsPerPage;

//   const frontShapes = frontBackShapes.filter(s => s.side === 'front');
//   const backShapes = frontBackShapes.filter(s => s.side === 'back');

//   async function renderPageToDataURL(rows) {
//     // Calculate the total dimensions of the canvas that will hold all cards for one PDF page.
//     // This canvas will contain two columns (front and back) and 'rows.length' rows.
//     const sheetWidth = 2 * hiResCanvasWidthForCard; // Two cards side-by-side
//     const sheetHeight = hiResCanvasHeightForCard * rows.length; // Stacked vertically, tightly packed

//     const canvas = document.createElement('canvas');
//     canvas.width = sheetWidth;
//     canvas.height = sheetHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.fillStyle = '#fff'; // Set white background for the sheet
//     ctx.fillRect(0, 0, sheetWidth, sheetHeight);

//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];

//       // Calculate the Y position for the current row on the sheet canvas.
//       // This ensures no vertical gaps between rows.
//       const currentY = i * hiResCanvasHeightForCard;

//       // Create canvas for the FRONT of the card
//       const frontCardCanvas = document.createElement('canvas');
//       frontCardCanvas.width = hiResCanvasWidthForCard;
//       frontCardCanvas.height = hiResCanvasHeightForCard;
//       const frontCtx = frontCardCanvas.getContext('2d');
//       // Draw content onto the front card canvas using the scaled dimensions
//       await drawCard(frontCtx, frontShapes, row, files, hiResCanvasWidthForCard, hiResCanvasHeightForCard);
//       // Draw the front card onto the main sheet canvas
//       ctx.drawImage(frontCardCanvas, 0, currentY, hiResCanvasWidthForCard, hiResCanvasHeightForCard);

//       // Create canvas for the BACK of the card
//       const backCardCanvas = document.createElement('canvas');
//       backCardCanvas.width = hiResCanvasWidthForCard;
//       backCardCanvas.height = hiResCanvasHeightForCard;
//       const backCtx = backCardCanvas.getContext('2d');
//       backCtx.fillStyle = '#fff'; // Set white background for the back card
//       backCtx.fillRect(0, 0, hiResCanvasWidthForCard, hiResCanvasHeightForCard);
//       // Draw content onto the back card canvas using the scaled dimensions
//       await drawCard(backCtx, backShapes, row, files, hiResCanvasWidthForCard, hiResCanvasHeightForCard);
//       // Draw the back card onto the main sheet canvas, next to the front card
//       ctx.drawImage(backCardCanvas, hiResCanvasWidthForCard, currentY, hiResCanvasWidthForCard, hiResCanvasHeightForCard);
//     }

//     return canvas.toDataURL('image/png');
//   }

//   const pdfDoc = await PDFDocument.create();
//   const totalRows = excelData.length;
//   const totalPages = Math.ceil(totalRows / rowsPerPage);

//   for (let i = 0; i < totalPages; i++) {
//     const startIdx = i * rowsPerPage;
//     const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
//     const pageRows = excelData.slice(startIdx, endIdx);
//     const dataUrl = await renderPageToDataURL(pageRows);
//     const pngImageBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
//     const pngImage = await pdfDoc.embedPng(pngImageBytes);

//     // Calculate the actual dimensions of the combined image based on scaled cards
//     // and the number of rows on this specific page.
//     const actualImageWidth = scaledCardEffectiveWidthPt * 2; // Two cards wide
//     const actualImageHeight = scaledCardEffectiveHeightPt * pageRows.length; // Height based on number of rows

//     // Add a portrait page to the PDF document
//     const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);

//     // Calculate x and y to center the image horizontally and place it at the top vertically
//     const xPos = (pageWidthPt - actualImageWidth) / 2;
//     const yPos = pageHeightPt - actualImageHeight; // Draw from the top

//     // Draw the combined image onto the PDF page, maintaining aspect ratio.
//     page.drawImage(pngImage, {
//       x: xPos,
//       y: yPos,
//       width: actualImageWidth,
//       height: actualImageHeight,
//     });
//   }

//   const pdfBytes = await pdfDoc.save();
//   const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = 'cards.pdf';
//   document.body.appendChild(a);
//   a.click();
//   setTimeout(() => {
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }, 100);
// }


// in chunks
// import { PDFDocument } from 'pdf-lib';
// import { drawCard } from './drawCardHelpers';

// let isExporting = false; // ✅ Prevent duplicate exports

// export async function exportCardsAsPDF({ frontBackShapes, excelData, files }) {
//   if (isExporting) {
//     console.warn("⛔ Export already in progress. Skipping duplicate call.");
//     return;
//   }
//   isExporting = true;

//   try {
//     const cmToPt = cm => cm * 28.35;
//     const inchToCm = inch => inch * 2.54;

//     const originalCardWidthCm = inchToCm(2.125);
//     const originalCardHeightCm = inchToCm(3.375);
//     const pageWidthCm = 20;
//     const pageHeightCm = 30;
//     const desiredRowsPerPage = 5;

//     const requiredEffectiveCardHeightCm = pageHeightCm / desiredRowsPerPage;
//     const scalingFactorForFit = requiredEffectiveCardHeightCm / originalCardWidthCm;

//     const scaledCardEffectiveHeightCm = originalCardWidthCm * scalingFactorForFit;
//     const scaledCardEffectiveWidthCm = originalCardHeightCm * scalingFactorForFit;

//     const scaledCardEffectiveHeightPt = cmToPt(scaledCardEffectiveHeightCm);
//     const scaledCardEffectiveWidthPt = cmToPt(scaledCardEffectiveWidthCm);
//     const pageWidthPt = cmToPt(pageWidthCm);
//     const pageHeightPt = cmToPt(pageHeightCm);

//     const hiResScaleFactor = 4;
//     const hiResCanvasWidth = scaledCardEffectiveWidthPt * hiResScaleFactor;
//     const hiResCanvasHeight = scaledCardEffectiveHeightPt * hiResScaleFactor;

//     const rowsPerPage = desiredRowsPerPage;
//     const totalRows = excelData.length;
//     const totalPages = Math.ceil(totalRows / rowsPerPage);
//     const CHUNK_SIZE = 200;
//     const totalChunks = Math.ceil(totalPages / CHUNK_SIZE);

//     const frontShapes = frontBackShapes.filter(s => s.side === 'front');
//     const backShapes = frontBackShapes.filter(s => s.side === 'back');

//     // Shared canvases
//     const frontCardCanvas = document.createElement('canvas');
//     frontCardCanvas.width = hiResCanvasWidth;
//     frontCardCanvas.height = hiResCanvasHeight;
//     const frontCtx = frontCardCanvas.getContext('2d');

//     const backCardCanvas = document.createElement('canvas');
//     backCardCanvas.width = hiResCanvasWidth;
//     backCardCanvas.height = hiResCanvasHeight;
//     const backCtx = backCardCanvas.getContext('2d');

//     const sheetCanvas = document.createElement('canvas');
//     const sheetCtx = sheetCanvas.getContext('2d');

//     async function renderPageToBlob(rows) {
//       const sheetWidth = 2 * hiResCanvasWidth;
//       const sheetHeight = hiResCanvasHeight * rows.length;

//       sheetCanvas.width = sheetWidth;
//       sheetCanvas.height = sheetHeight;
//       sheetCtx.fillStyle = '#fff';
//       sheetCtx.fillRect(0, 0, sheetWidth, sheetHeight);

//       for (let i = 0; i < rows.length; i++) {
//         const row = rows[i];
//         const currentY = i * hiResCanvasHeight;

//         // Front
//         frontCtx.clearRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
//         await drawCard(frontCtx, frontShapes, row, files, hiResCanvasWidth, hiResCanvasHeight);
//         sheetCtx.drawImage(frontCardCanvas, 0, currentY);

//         // Back
//         backCtx.clearRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
//         backCtx.fillStyle = '#fff';
//         backCtx.fillRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
//         await drawCard(backCtx, backShapes, row, files, hiResCanvasWidth, hiResCanvasHeight);
//         sheetCtx.drawImage(backCardCanvas, hiResCanvasWidth, currentY);
//       }

//       return new Promise(resolve => {
//         sheetCanvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92);
//       });
//     }

//     // ✅ Loop through ALL chunks
//     for (let chunk = 0; chunk < totalChunks; chunk++) {
//       const pdfDoc = await PDFDocument.create();

//       const pageStart = chunk * CHUNK_SIZE;
//       const pageEnd = Math.min(pageStart + CHUNK_SIZE, totalPages);

//       for (let i = pageStart; i < pageEnd; i++) {
//         const startIdx = i * rowsPerPage;
//         const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
//         const pageRows = excelData.slice(startIdx, endIdx);

//         console.log(`⏳ Rendering chunk ${chunk + 1}, page ${i + 1}`);

//         const blob = await renderPageToBlob(pageRows);
//         const arrayBuffer = await blob.arrayBuffer();
//         const jpgImage = await pdfDoc.embedJpg(arrayBuffer);

//         const actualImageWidth = scaledCardEffectiveWidthPt * 2;
//         const actualImageHeight = scaledCardEffectiveHeightPt * pageRows.length;

//         const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
//         const xPos = (pageWidthPt - actualImageWidth) / 2;
//         const yPos = pageHeightPt - actualImageHeight;

//         page.drawImage(jpgImage, {
//           x: xPos,
//           y: yPos,
//           width: actualImageWidth,
//           height: actualImageHeight,
//         });
//       }

//       const pdfBytes = await pdfDoc.save();
//       const finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const url = URL.createObjectURL(finalBlob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `chuck${chunk + 1}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       setTimeout(() => {
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       }, 200);
//     }

//     console.log("✅ All chunks generated and downloaded.");
//   } catch (error) {
//     console.error("❌ Error generating PDF:", error);
//   } finally {
//     isExporting = false;
//   }
// }




// import { PDFDocument } from 'pdf-lib';
// import { drawCard } from './drawCardHelpers';

// let isExporting = false;

// export async function exportCardsAsPDF({ frontBackShapes, excelData, files }) {
//   if (isExporting) {
//     console.warn("⛔ Export already in progress. Skipping duplicate call.");
//     return;
//   }
//   isExporting = true;

//   try {
//     const cmToPt = cm => cm * 28.35;
//     const inchToCm = inch => inch * 2.54;

//     const originalCardWidthCm = inchToCm(2.125);
//     const originalCardHeightCm = inchToCm(3.375);
//     const pageWidthCm = 20;
//     const pageHeightCm = 30;
//     const desiredRowsPerPage = 5;

//     const requiredEffectiveCardHeightCm = pageHeightCm / desiredRowsPerPage;
//     const scalingFactorForFit = requiredEffectiveCardHeightCm / originalCardWidthCm;

//     const scaledCardEffectiveHeightCm = originalCardWidthCm * scalingFactorForFit;
//     const scaledCardEffectiveWidthCm = originalCardHeightCm * scalingFactorForFit;

//     const scaledCardEffectiveHeightPt = cmToPt(scaledCardEffectiveHeightCm);
//     const scaledCardEffectiveWidthPt = cmToPt(scaledCardEffectiveWidthCm);
//     const pageWidthPt = cmToPt(pageWidthCm);
//     const pageHeightPt = cmToPt(pageHeightCm);

//     const hiResScaleFactor = 3; // or 4, but may cause memory crash
//     const hiResCanvasWidth = scaledCardEffectiveWidthPt * hiResScaleFactor;
//     const hiResCanvasHeight = scaledCardEffectiveHeightPt * hiResScaleFactor;

//     const rowsPerPage = desiredRowsPerPage;
//     const totalRows = excelData.length;
//     const totalPages = Math.ceil(totalRows / rowsPerPage);

//     const frontShapes = frontBackShapes.filter(s => s.side === 'front');
//     const backShapes = frontBackShapes.filter(s => s.side === 'back');

//     // Shared canvases
//     const frontCardCanvas = document.createElement('canvas');
//     frontCardCanvas.width = hiResCanvasWidth;
//     frontCardCanvas.height = hiResCanvasHeight;
//     const frontCtx = frontCardCanvas.getContext('2d');

//     const backCardCanvas = document.createElement('canvas');
//     backCardCanvas.width = hiResCanvasWidth;
//     backCardCanvas.height = hiResCanvasHeight;
//     const backCtx = backCardCanvas.getContext('2d');

//     const sheetCanvas = document.createElement('canvas');
//     const sheetCtx = sheetCanvas.getContext('2d');

//     async function renderPageToBlob(rows) {
//       const sheetWidth = 2 * hiResCanvasWidth;
//       const sheetHeight = hiResCanvasHeight * rows.length;

//       sheetCanvas.width = sheetWidth;
//       sheetCanvas.height = sheetHeight;
//       sheetCtx.fillStyle = '#fff';
//       sheetCtx.fillRect(0, 0, sheetWidth, sheetHeight);

//       for (let i = 0; i < rows.length; i++) {
//         const row = rows[i];
//         const currentY = i * hiResCanvasHeight;

//         frontCtx.clearRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
//         await drawCard(frontCtx, frontShapes, row, files, hiResCanvasWidth, hiResCanvasHeight);
//         sheetCtx.drawImage(frontCardCanvas, 0, currentY);

//         backCtx.clearRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
//         backCtx.fillStyle = '#fff';
//         backCtx.fillRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
//         await drawCard(backCtx, backShapes, row, files, hiResCanvasWidth, hiResCanvasHeight);
//         sheetCtx.drawImage(backCardCanvas, hiResCanvasWidth, currentY);
//       }

//       return new Promise(resolve => {
//         sheetCanvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92);
//       });
//     }

//     // ✅ Create ONE PDF document for all pages
//     const pdfDoc = await PDFDocument.create();

//     for (let i = 0; i < totalPages; i++) {
//       const startIdx = i * rowsPerPage;
//       const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
//       const pageRows = excelData.slice(startIdx, endIdx);

//       console.log(`🖨️ Rendering page ${i + 1} of ${totalPages}`);

//       const blob = await renderPageToBlob(pageRows);
//       const arrayBuffer = await blob.arrayBuffer();
//       const jpgImage = await pdfDoc.embedJpg(arrayBuffer);

//       const actualImageWidth = scaledCardEffectiveWidthPt * 2;
//       const actualImageHeight = scaledCardEffectiveHeightPt * pageRows.length;

//       const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
//       const xPos = (pageWidthPt - actualImageWidth) / 2;
//       const yPos = pageHeightPt - actualImageHeight;

//       page.drawImage(jpgImage, {
//         x: xPos,
//         y: yPos,
//         width: actualImageWidth,
//         height: actualImageHeight,
//       });
//     }

//     // ✅ Save single PDF
//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Cards.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(() => {
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     }, 200);

//     console.log("✅ All pages exported into a single PDF!");
//   } catch (error) {
//     console.error("❌ Error generating single PDF:", error);
//   } finally {
//     isExporting = false;
//   }
// }


// // for all in one print
import { PDFDocument } from 'pdf-lib';
import { drawCard } from './drawCardHelpers';

let isExporting = false;

export async function exportCardsAsPDF({ frontBackShapes, excelData, files }) {
  if (isExporting) {
    console.warn("⛔ Export already in progress. Skipping duplicate call.");
    return;
  }
  isExporting = true;

  try {
    const cmToPt = cm => cm * 28.35;
    const inchToCm = inch => inch * 2.54;

    const originalCardWidthCm = inchToCm(2.125);
    const originalCardHeightCm = inchToCm(3.375);
    const pageWidthCm = 20;
    const pageHeightCm = 30;
    const desiredRowsPerPage = 5;

    const requiredEffectiveCardHeightCm = pageHeightCm / desiredRowsPerPage;
    const scalingFactorForFit = requiredEffectiveCardHeightCm / originalCardWidthCm;

    const scaledCardEffectiveHeightCm = originalCardWidthCm * scalingFactorForFit;
    const scaledCardEffectiveWidthCm = originalCardHeightCm * scalingFactorForFit;

    const scaledCardEffectiveHeightPt = cmToPt(scaledCardEffectiveHeightCm);
    const scaledCardEffectiveWidthPt = cmToPt(scaledCardEffectiveWidthCm);
    const pageWidthPt = cmToPt(pageWidthCm);
    const pageHeightPt = cmToPt(pageHeightCm);

    const hiResScaleFactor = 4; // or 4, but may cause memory crash
    const hiResCanvasWidth = scaledCardEffectiveWidthPt * hiResScaleFactor;
    const hiResCanvasHeight = scaledCardEffectiveHeightPt * hiResScaleFactor;

    const rowsPerPage = desiredRowsPerPage;
    const totalRows = excelData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const frontShapes = frontBackShapes.filter(s => s.side === 'front');
    const backShapes = frontBackShapes.filter(s => s.side === 'back');

    // Shared canvases
    const frontCardCanvas = document.createElement('canvas');
    frontCardCanvas.width = hiResCanvasWidth;
    frontCardCanvas.height = hiResCanvasHeight;
    const frontCtx = frontCardCanvas.getContext('2d');

    const backCardCanvas = document.createElement('canvas');
    backCardCanvas.width = hiResCanvasWidth;
    backCardCanvas.height = hiResCanvasHeight;
    const backCtx = backCardCanvas.getContext('2d');

    const sheetCanvas = document.createElement('canvas');
    const sheetCtx = sheetCanvas.getContext('2d');

    async function renderPageToBlob(rows) {
      const sheetWidth = 2 * hiResCanvasWidth;
      const sheetHeight = hiResCanvasHeight * rows.length;

      sheetCanvas.width = sheetWidth;
      sheetCanvas.height = sheetHeight;
      sheetCtx.fillStyle = '#fff';
      sheetCtx.fillRect(0, 0, sheetWidth, sheetHeight);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const currentY = i * hiResCanvasHeight;

        frontCtx.clearRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
        await drawCard(frontCtx, frontShapes, row, files, hiResCanvasWidth, hiResCanvasHeight);
        sheetCtx.drawImage(frontCardCanvas, 0, currentY);

        backCtx.clearRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
        backCtx.fillStyle = '#fff';
        backCtx.fillRect(0, 0, hiResCanvasWidth, hiResCanvasHeight);
        await drawCard(backCtx, backShapes, row, files, hiResCanvasWidth, hiResCanvasHeight);
        sheetCtx.drawImage(backCardCanvas, hiResCanvasWidth, currentY);
      }

      return new Promise(resolve => {
        sheetCanvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92);
      });
    }

    // ✅ Create ONE PDF document for all pages
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < totalPages; i++) {
      const startIdx = i * rowsPerPage;
      const endIdx = Math.min(startIdx + rowsPerPage, totalRows);
      const pageRows = excelData.slice(startIdx, endIdx);

      console.log(`🖨️ Rendering page ${i + 1} of ${totalPages}`);

      const blob = await renderPageToBlob(pageRows);
      const arrayBuffer = await blob.arrayBuffer();
      const jpgImage = await pdfDoc.embedJpg(arrayBuffer);

      const actualImageWidth = scaledCardEffectiveWidthPt * 2;
      const actualImageHeight = scaledCardEffectiveHeightPt * pageRows.length;

      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
      const xPos = (pageWidthPt - actualImageWidth) / 2;
      const yPos = pageHeightPt - actualImageHeight;

      page.drawImage(jpgImage, {
        x: xPos,
        y: yPos,
        width: actualImageWidth,
        height: actualImageHeight,
      });
    }

    // ✅ Save single PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cards_all_in_one.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);

    console.log("✅ All pages exported into a single PDF!");
  } catch (error) {
    console.error("❌ Error generating single PDF:", error);
  } finally {
    isExporting = false;
  }
}


