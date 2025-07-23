import React, { useRef, useEffect } from 'react';
import { drawCard, loadImageAsync } from './drawCardHelpers';
import PropTypes from 'prop-types';

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

CardPreview.propTypes = {
  shapes: PropTypes.array.isRequired,
  excelRow: PropTypes.object,
  files: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default CardPreview; 