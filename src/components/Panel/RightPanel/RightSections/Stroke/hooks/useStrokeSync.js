import { useEffect } from 'react';
import { 
  getCurrentStrokeColor, 
  getCurrentStrokeWidth, 
  getInitialOpacity,
  isUniformBorder,
  ensurePerSideBorders,
  ensurePerSideBordersImage
} from '../utils';

export const useStrokeSync = (state, setters, drawnRectangles, setDrawnRectangles) => {
  const {
    selectedShapes,
    shapeType,
    selectedBorderSide,
    shape,
    isStrokeable,
    strokePosition,
    lastUniformStrokePosition
  } = state;

  const {
    setColor,
    setOpacity,
    setStrokeWidth,
    setStrokePosition
  } = setters;

  // Sync UI state with shape data when selection changes
  useEffect(() => {
    if (isStrokeable && shape) {
      setColor(getCurrentStrokeColor(isStrokeable, shapeType, shape, selectedBorderSide));
      setOpacity(getInitialOpacity(isStrokeable, shapeType, shape));
      setStrokeWidth(getCurrentStrokeWidth(isStrokeable, shapeType, shape, selectedBorderSide));
    }
  }, [selectedShapes, shapeType, selectedBorderSide, shape, isStrokeable]);

  // Set initial strokePosition from shape if present
  useEffect(() => {
    if (isStrokeable && shape && shape.strokePosition) {
      setStrokePosition(shape.strokePosition);
    }
  }, [isStrokeable, shape, setStrokePosition]);

  // Migrate all rectangles and images on mount or when drawnRectangles changes
  useEffect(() => {
    const migrated = drawnRectangles.map((s) => {
      if (s.type === 'rectangle') return ensurePerSideBorders(s);
      if (s.type === 'image') return ensurePerSideBordersImage(s);
      return s;
    });
    
    if (JSON.stringify(migrated) !== JSON.stringify(drawnRectangles)) {
      setDrawnRectangles(migrated);
    }
  }, [drawnRectangles, setDrawnRectangles]);

  // When strokePosition changes and border is uniform, remember it
  useEffect(() => {
    if (isStrokeable && state.isSingle && isUniformBorder(shape, selectedBorderSide)) {
      lastUniformStrokePosition.current = strokePosition;
    }
  }, [strokePosition, isStrokeable, state.isSingle, shape, selectedBorderSide, lastUniformStrokePosition]);
}; 