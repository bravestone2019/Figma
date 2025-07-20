import React from 'react';
import PropTypes from 'prop-types';

function PrintPanelPagination({ page, totalPages, setPage, handleExportPDF }) {
  return (
    <div style={{ marginTop: 24, textAlign: 'center' }}>
      <button onClick={handleExportPDF} style={{ marginRight: 16, padding: '8px 20px', fontSize: 16, borderRadius: 8, background: '#388e3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Export as PDF</button>
      <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
      <span style={{ margin: '0 16px' }}>Page {page + 1} of {totalPages}</span>
      <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>Next</button>
    </div>
  );
}

PrintPanelPagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  handleExportPDF: PropTypes.func.isRequired,
};

export default PrintPanelPagination; 