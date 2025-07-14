import { useCallback } from 'react';
import { STROKE_DEFAULTS, BORDER_SIDES } from '../constants';
import { hasStroke } from '../utils';

export const useStrokeHandlers = (state, setters, selectedShapes, drawnRectangles, setDrawnRectangles) => {
  const {
    isStrokeable,
    shapeType,
    selectedBorderSide,
    strokeWidth,
    lastUniformStrokePosition,
    isSingle,
    isShown,
    prevWidthsRef
  } = state;

  const {
    setColor,
    setOpacity,
    setStrokeWidth: setStrokeWidthState,
    setIsShown,
    setStrokePosition
  } = setters;

  // Main expand/collapse handler
  const handleExpandCollapse = useCallback((isOpen, setOpen) => {
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );

    if (!isStrokeable || shapeIdx === -1) {
      setOpen((prev) => !prev);
      return;
    }

    const updatedShape = { ...drawnRectangles[shapeIdx] };
    const newRects = [...drawnRectangles];
    const isCurrentlyOpen = isOpen;

    if (isCurrentlyOpen) {
      // COLLAPSE: Remove stroke completely
      if (shapeType === "rectangle") {
        updatedShape.borderColor = null;
        updatedShape.borderTopColor = null;
        updatedShape.borderRightColor = null;
        updatedShape.borderBottomColor = null;
        updatedShape.borderLeftColor = null;
        updatedShape.borderWidth = 0;
        updatedShape.borderTopWidth = 0;
        updatedShape.borderRightWidth = 0;
        updatedShape.borderBottomWidth = 0;
        updatedShape.borderLeftWidth = 0;
        updatedShape.borderOpacity = 0;
      } else if (shapeType === "image") {
        updatedShape.borderColor = null;
        updatedShape.borderTopColor = null;
        updatedShape.borderRightColor = null;
        updatedShape.borderBottomColor = null;
        updatedShape.borderLeftColor = null;
        updatedShape.borderWidth = 0;
        updatedShape.borderTopWidth = 0;
        updatedShape.borderRightWidth = 0;
        updatedShape.borderBottomWidth = 0;
        updatedShape.borderLeftWidth = 0;
        updatedShape.borderOpacity = 0;
      } else if (shapeType === "text") {
        updatedShape.strokeColor = null;
        updatedShape.strokeWidth = 0;
        updatedShape.strokeOpacity = 0;
      } else if (shapeType === "line") {
        updatedShape.color = null;
        updatedShape.width = 0;
        updatedShape.opacity = 0;
      }
      setIsShown(false);
    } else {
      // EXPAND: Add default black stroke if shape doesn't have one
      const shouldSetDefault = !hasStroke(updatedShape, shapeType);

      if (shouldSetDefault) {
        // Only set to black if the previous color was transparent or not set
        const prevColor = (shapeType === "rectangle" || shapeType === "image") ? (updatedShape.borderColor || updatedShape.borderTopColor || updatedShape.borderRightColor || updatedShape.borderBottomColor || updatedShape.borderLeftColor) : (shapeType === "text" ? updatedShape.strokeColor : updatedShape.color);
        const isPrevTransparent = !prevColor || prevColor === "transparent";
        const defaultColor = isPrevTransparent ? "#000000" : prevColor;
        if (shapeType === "rectangle" || shapeType === "image") {
          updatedShape.borderColor = defaultColor;
          updatedShape.borderTopColor = defaultColor;
          updatedShape.borderRightColor = defaultColor;
          updatedShape.borderBottomColor = defaultColor;
          updatedShape.borderLeftColor = defaultColor;
          updatedShape.borderWidth = STROKE_DEFAULTS.WIDTH;
          updatedShape.borderTopWidth = STROKE_DEFAULTS.WIDTH;
          updatedShape.borderRightWidth = STROKE_DEFAULTS.WIDTH;
          updatedShape.borderBottomWidth = STROKE_DEFAULTS.WIDTH;
          updatedShape.borderLeftWidth = STROKE_DEFAULTS.WIDTH;
          updatedShape.borderOpacity = STROKE_DEFAULTS.OPACITY / 100;
        } else if (shapeType === "text") {
          updatedShape.strokeColor = defaultColor;
          updatedShape.strokeWidth = STROKE_DEFAULTS.WIDTH;
          updatedShape.strokeOpacity = STROKE_DEFAULTS.OPACITY / 100;
        } else if (shapeType === "line") {
          updatedShape.color = defaultColor;
          updatedShape.width = STROKE_DEFAULTS.WIDTH;
          updatedShape.opacity = STROKE_DEFAULTS.OPACITY / 100;
        }
        setColor(defaultColor);
        setOpacity(STROKE_DEFAULTS.OPACITY);
        setStrokeWidthState(STROKE_DEFAULTS.WIDTH);
      } else {
        // Restore the current stroke properties to UI state
        if (shapeType === "rectangle" || shapeType === "image") {
          setColor(updatedShape.borderColor || STROKE_DEFAULTS.COLOR);
          setOpacity(updatedShape.borderOpacity !== undefined ? Math.round(updatedShape.borderOpacity * 100) : STROKE_DEFAULTS.OPACITY);
          setStrokeWidthState(updatedShape.borderWidth || STROKE_DEFAULTS.WIDTH);
        } else if (shapeType === "text") {
          setColor(updatedShape.strokeColor || STROKE_DEFAULTS.COLOR);
          setOpacity(updatedShape.strokeOpacity !== undefined ? Math.round(updatedShape.strokeOpacity * 100) : STROKE_DEFAULTS.OPACITY);
          setStrokeWidthState(updatedShape.strokeWidth || STROKE_DEFAULTS.WIDTH);
        } else if (shapeType === "line") {
          setColor(updatedShape.color || STROKE_DEFAULTS.COLOR);
          setOpacity(updatedShape.opacity !== undefined ? Math.round(updatedShape.opacity * 100) : STROKE_DEFAULTS.OPACITY);
          setStrokeWidthState(updatedShape.width || STROKE_DEFAULTS.WIDTH);
        }
      }
      setIsShown(true);
    }

    newRects[shapeIdx] = updatedShape;
    setDrawnRectangles(newRects);
    setOpen(!isCurrentlyOpen);
  }, [isStrokeable, shapeType, drawnRectangles, setDrawnRectangles, selectedShapes, setColor, setOpacity, setStrokeWidthState, setIsShown]);

  // Color update handler
  const handleColorUpdate = useCallback((newColor) => {
    const hexColor = typeof newColor === "string" ? newColor : newColor.hex;
    setColor(hexColor);

    if (newColor.rgb?.a !== undefined) {
      setOpacity(Math.round(newColor.rgb.a * 100));
    }

    if (!isStrokeable) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;

    const newShape = { ...drawnRectangles[shapeIdx] };
    if (shapeType === "rectangle") {
      if (selectedBorderSide === BORDER_SIDES.ALL) {
        newShape.borderColor = hexColor;
        newShape.borderTopColor = hexColor;
        newShape.borderRightColor = hexColor;
        newShape.borderBottomColor = hexColor;
        newShape.borderLeftColor = hexColor;
      } else {
        newShape.borderTopColor = selectedBorderSide === BORDER_SIDES.TOP ? hexColor : "transparent";
        newShape.borderRightColor = selectedBorderSide === BORDER_SIDES.RIGHT ? hexColor : "transparent";
        newShape.borderBottomColor = selectedBorderSide === BORDER_SIDES.BOTTOM ? hexColor : "transparent";
        newShape.borderLeftColor = selectedBorderSide === BORDER_SIDES.LEFT ? hexColor : "transparent";
      }
    } else if (shapeType === "image") {
      if (selectedBorderSide === BORDER_SIDES.ALL) {
        newShape.borderColor = hexColor;
        newShape.borderTopColor = hexColor;
        newShape.borderRightColor = hexColor;
        newShape.borderBottomColor = hexColor;
        newShape.borderLeftColor = hexColor;
      } else {
        newShape.borderTopColor = selectedBorderSide === BORDER_SIDES.TOP ? hexColor : "transparent";
        newShape.borderRightColor = selectedBorderSide === BORDER_SIDES.RIGHT ? hexColor : "transparent";
        newShape.borderBottomColor = selectedBorderSide === BORDER_SIDES.BOTTOM ? hexColor : "transparent";
        newShape.borderLeftColor = selectedBorderSide === BORDER_SIDES.LEFT ? hexColor : "transparent";
      }
      newShape.borderColor = hexColor;
    } else if (shapeType === "text") newShape.strokeColor = hexColor;
    else if (shapeType === "line") newShape.color = hexColor;

    if (newColor.rgb?.a !== undefined) {
      newShape.strokeOpacity = newColor.rgb.a;
    }

    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  }, [isStrokeable, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType, selectedBorderSide, setColor, setOpacity]);

  // Opacity update handler
  const handleOpacityUpdate = useCallback((val) => {
    let newOpacity = parseInt(val);
    if (isNaN(newOpacity)) newOpacity = 100;
    newOpacity = Math.max(0, Math.min(100, newOpacity));
    setOpacity(newOpacity);

    if (!isStrokeable) return;
    const shapeIdx = drawnRectangles.findIndex(
      (s) => s.id === selectedShapes[0]
    );
    if (shapeIdx === -1) return;

    const newShape = { ...drawnRectangles[shapeIdx] };
    if (shapeType === "rectangle") {
      newShape.borderOpacity = newOpacity / 100;
    } else if (shapeType === "text") {
      newShape.strokeOpacity = newOpacity / 100;
    } else if (shapeType === "line") {
      newShape.strokeOpacity = newOpacity / 100;
    } else if (shapeType === "image") {
      newShape.borderOpacity = newOpacity / 100;
    }
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  }, [isStrokeable, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType, setOpacity]);

  // Stroke width change handler
  const handleStrokeWidthChange = useCallback((e) => {
    let newWidth = parseInt(e.target.value);
    if (isNaN(newWidth) || newWidth < 1) newWidth = 1;
    setStrokeWidthState(newWidth);

    if (isStrokeable) {
      const shapeIdx = drawnRectangles.findIndex(
        (s) => s.id === selectedShapes[0]
      );
      if (shapeIdx !== -1) {
        const updated = [...drawnRectangles];
        const shape = updated[shapeIdx];
        if (shape.type === "rectangle" || shape.type === "image") {
          if (selectedBorderSide === BORDER_SIDES.ALL) {
            shape.borderWidth = newWidth;
            shape.borderTopWidth = newWidth;
            shape.borderRightWidth = newWidth;
            shape.borderBottomWidth = newWidth;
            shape.borderLeftWidth = newWidth;
          } else if (selectedBorderSide === BORDER_SIDES.TOP) {
            shape.borderTopWidth = newWidth;
          } else if (selectedBorderSide === BORDER_SIDES.RIGHT) {
            shape.borderRightWidth = newWidth;
          } else if (selectedBorderSide === BORDER_SIDES.BOTTOM) {
            shape.borderBottomWidth = newWidth;
          } else if (selectedBorderSide === BORDER_SIDES.LEFT) {
            shape.borderLeftWidth = newWidth;
          }
        } else if (shape.type === "line") {
          shape.width = newWidth;
        } else if (shape.type === "text") {
          shape.strokeWidth = newWidth;
        }
        updated[shapeIdx] = { ...shape };
        setDrawnRectangles(updated);
      }
    }
  }, [isStrokeable, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType, selectedBorderSide, setStrokeWidthState]);

  // Border edit handler
  const handleBorderEdit = useCallback((side, { color, width }) => {
    if (!isStrokeable || !isSingle) return;
    const shapeIdx = drawnRectangles.findIndex((s) => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    const newShape = { ...drawnRectangles[shapeIdx] };
    if (shapeType === "rectangle" || shapeType === "image") {
      if (side === BORDER_SIDES.ALL) {
        if (color) {
          newShape.borderColor = color;
          newShape.borderTopColor = color;
          newShape.borderRightColor = color;
          newShape.borderBottomColor = color;
          newShape.borderLeftColor = color;
        }
        if (width) {
          newShape.borderWidth = width;
          newShape.borderTopWidth = width;
          newShape.borderRightWidth = width;
          newShape.borderBottomWidth = width;
          newShape.borderLeftWidth = width;
        }
        setStrokePosition(lastUniformStrokePosition.current || STROKE_DEFAULTS.POSITION);
        newShape.strokePosition = lastUniformStrokePosition.current || STROKE_DEFAULTS.POSITION;
      } else {
        const cap = side.charAt(0).toUpperCase() + side.slice(1);
        if (color) newShape[`border${cap}Color`] = color;
        if (width) newShape[`border${cap}Width`] = width;
      }
      // Ensure all per-side properties are present
      newShape.borderTopColor = newShape.borderTopColor ?? newShape.borderColor ?? STROKE_DEFAULTS.COLOR;
      newShape.borderRightColor = newShape.borderRightColor ?? newShape.borderColor ?? STROKE_DEFAULTS.COLOR;
      newShape.borderBottomColor = newShape.borderBottomColor ?? newShape.borderColor ?? STROKE_DEFAULTS.COLOR;
      newShape.borderLeftColor = newShape.borderLeftColor ?? newShape.borderColor ?? STROKE_DEFAULTS.COLOR;
      newShape.borderTopWidth = newShape.borderTopWidth ?? newShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
      newShape.borderRightWidth = newShape.borderRightWidth ?? newShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
      newShape.borderBottomWidth = newShape.borderBottomWidth ?? newShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
      newShape.borderLeftWidth = newShape.borderLeftWidth ?? newShape.borderWidth ?? STROKE_DEFAULTS.WIDTH;
    }
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
  }, [isStrokeable, isSingle, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType, setStrokePosition, lastUniformStrokePosition]);

  // Toggle stroke visibility handler
  const handleToggleStroke = useCallback(() => {
    if (!isStrokeable || !isSingle) return;
    const shapeIdx = drawnRectangles.findIndex((s) => s.id === selectedShapes[0]);
    if (shapeIdx === -1) return;
    const newShape = { ...drawnRectangles[shapeIdx] };
    if (shapeType === "rectangle") {
      if (isShown) {
        // Hide: store current widths and set all to 0
        prevWidthsRef.current = {
          borderTopWidth: newShape.borderTopWidth,
          borderRightWidth: newShape.borderRightWidth,
          borderBottomWidth: newShape.borderBottomWidth,
          borderLeftWidth: newShape.borderLeftWidth,
        };
        newShape.borderTopWidth = 0;
        newShape.borderRightWidth = 0;
        newShape.borderBottomWidth = 0;
        newShape.borderLeftWidth = 0;
      } else {
        // Show: restore previous widths or use strokeWidth
        const prev = prevWidthsRef.current;
        newShape.borderTopWidth = prev.borderTopWidth ?? strokeWidth;
        newShape.borderRightWidth = prev.borderRightWidth ?? strokeWidth;
        newShape.borderBottomWidth = prev.borderBottomWidth ?? strokeWidth;
        newShape.borderLeftWidth = prev.borderLeftWidth ?? strokeWidth;
      }
    }
    const newRects = [...drawnRectangles];
    newRects[shapeIdx] = newShape;
    setDrawnRectangles(newRects);
    setIsShown((prev) => !prev);
  }, [isStrokeable, isSingle, selectedShapes, drawnRectangles, setDrawnRectangles, shapeType, isShown, strokeWidth, setIsShown, prevWidthsRef]);

  return {
    handleExpandCollapse,
    handleColorUpdate,
    handleOpacityUpdate,
    handleStrokeWidthChange,
    handleBorderEdit,
    handleToggleStroke
  };
}; 