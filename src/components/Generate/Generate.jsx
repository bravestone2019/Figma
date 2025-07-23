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
import { drawCard, loadImageAsync, roundedRectPath } from "./drawCardHelpers";
import PrintPanel from "./PrintPanel";
import CardPreview from "./CardPreview";
import useImageBlobs from "./useImageBlobs";
import useShortcut from "../Shortcut";
import useModalState from "./useModalState";
import { exportCardsAsPDF } from "./pdfExport";
import PropTypes from 'prop-types';
import GeneratePreviewCanvas from "./GeneratePreviewCanvas";

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
  const [open, openGenerate, closeGenerate] = useModalState(false);
  const [printPanelOpen, openPrintPanel, closePrintPanel] = useModalState(false);
  const canvasRef = useRef(null);
  // Dummy state to force re-render
  const [redrawTick, setRedrawTick] = useState(0);
  const imageBlobUrlsVersion = useImageBlobs(files);

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

  useShortcut({ key: "g" }, () => { setActiveTool("Generate"); openGenerate(); setIsGenerateOpen(true); });
  useShortcut({ key: "escape" }, () => { if (open) { closeGenerate(); setIsGenerateOpen(false); } });

  const handleOnClick = () => {
    setActiveTool("Generate");
    openGenerate();
    setIsGenerateOpen(true);
  };

  const handleClose = () => {
    closeGenerate();
    setIsGenerateOpen(false);
  };

  useEffect(() => {
    if (!isGenerateOpen) closeGenerate();
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

  // Add export PDF handler
  const handleExportPDF = async () => {
    await exportCardsAsPDF({ frontBackShapes, excelData, files, rowsPerPage: 5 });
  };
  const hasFrontOrBack = frontBackShapes && frontBackShapes.length > 0;
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
              <GeneratePreviewCanvas
                open={open}
                frontBackShapes={frontBackShapes}
                excelData={excelData}
                files={files}
                canvasRef={canvasRef}
                imageBlobUrlsVersion={imageBlobUrlsVersion}
                redrawTick={redrawTick}
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
              <div style={{ display: 'inline-block' }} onClick={() => openPrintPanel() }>
                <Download />
              </div>
              {/* Export as PDF button intentionally removed from here */}
            </div>
            <PrintPanel open={printPanelOpen} onClose={() => closePrintPanel()} frontBackShapes={frontBackShapes} excelData={excelData} files={files} handleExportPDF={handleExportPDF} />
          </div>
        </div>
      )}
    </>
  );
};

Generate.propTypes = {
  activeTool: PropTypes.string.isRequired,
  setActiveTool: PropTypes.func.isRequired,
  openDropdown: PropTypes.bool.isRequired,
  isGenerateOpen: PropTypes.bool.isRequired,
  setIsGenerateOpen: PropTypes.func.isRequired,
  drawnRectangles: PropTypes.array.isRequired,
  collections: PropTypes.array.isRequired,
  excelData: PropTypes.array.isRequired,
  setExcelData: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default Generate;
