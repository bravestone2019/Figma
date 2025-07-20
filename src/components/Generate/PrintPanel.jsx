import React, { useState, useEffect } from 'react';
import PrintPanelCardGrid from './PrintPanelCardGrid';
import PrintPanelPagination from './PrintPanelPagination';
import PropTypes from 'prop-types';

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
        <PrintPanelCardGrid frontBackShapes={frontBackShapes} excelData={excelData} files={files} startIdx={startIdx} endIdx={endIdx} />
        <PrintPanelPagination page={page} totalPages={totalPages} setPage={setPage} handleExportPDF={handleExportPDF} />
      </div>
    </div>
  );
}

PrintPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  frontBackShapes: PropTypes.array.isRequired,
  excelData: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  handleExportPDF: PropTypes.func.isRequired,
};

export default PrintPanel; 