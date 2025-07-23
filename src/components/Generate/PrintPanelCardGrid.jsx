import React from 'react';
import PropTypes from 'prop-types';
import CardPreview from './CardPreview';

function PrintPanelCardGrid({ frontBackShapes, excelData, files, startIdx, endIdx }) {
  const hasFront = frontBackShapes && frontBackShapes.some(s => s.side === 'front');
  const hasBack = frontBackShapes && frontBackShapes.some(s => s.side === 'back');
  return (
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
  );
}

PrintPanelCardGrid.propTypes = {
  frontBackShapes: PropTypes.array.isRequired,
  excelData: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  startIdx: PropTypes.number.isRequired,
  endIdx: PropTypes.number.isRequired,
};

export default PrintPanelCardGrid; 