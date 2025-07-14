import { useEffect } from 'react';
import { PANEL_OFFSETS } from '../constants';

export const usePanelPositioning = (state, setters) => {
  const {
    colorPanelOpen,
    showBorderPanel,
    strokePanelOpen,
    panelInputRef,
    borderRef,
    strokeDropdownRef,
    borderDropdownRef
  } = state;

  const {
    setCoords,
    setBorderPanelCoords,
    setStrokePanelCoords,
    setColorPanelOpen,
    setShowBorderPanel,
    setStrokePanelOpen
  } = setters;

  // Color Panel Positioning
  useEffect(() => {
    if (colorPanelOpen && panelInputRef.current) {
      const rect = panelInputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + PANEL_OFFSETS.COLOR_PANEL.TOP,
        left: rect.left + window.scrollX + PANEL_OFFSETS.COLOR_PANEL.LEFT,
      });
    } else if (!colorPanelOpen) {
      setCoords(null);
    }
  }, [colorPanelOpen, panelInputRef, setCoords]);

  // Border Panel Positioning
  useEffect(() => {
    if (showBorderPanel && borderRef.current) {
      const rect = borderRef.current.getBoundingClientRect();
      setBorderPanelCoords({
        top: rect.bottom + window.scrollY + PANEL_OFFSETS.BORDER_PANEL.TOP,
        left: rect.left + window.scrollX + PANEL_OFFSETS.BORDER_PANEL.LEFT,
      });
    }
  }, [showBorderPanel, borderRef, setBorderPanelCoords]);

  // Stroke Position Panel Positioning
  useEffect(() => {
    if (strokePanelOpen && borderRef.current) {
      const rect = borderRef.current.getBoundingClientRect();
      setStrokePanelCoords({
        top: rect.bottom + window.scrollY + PANEL_OFFSETS.STROKE_POSITION_PANEL.TOP,
        left: rect.left + window.scrollX + PANEL_OFFSETS.STROKE_POSITION_PANEL.LEFT,
      });
    }
  }, [strokePanelOpen, borderRef, setStrokePanelCoords]);

  // Color Panel Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorPanelOpen &&
        panelInputRef.current &&
        !panelInputRef.current.contains(e.target) &&
        !document.getElementById("floating-color-picker")?.contains(e.target)
      ) {
        setColorPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorPanelOpen, panelInputRef, setColorPanelOpen]);

  // Border Panel Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showBorderPanel &&
        borderRef.current &&
        !borderRef.current.contains(e.target) &&
        !borderDropdownRef.current?.contains(e.target)
      ) {
        setShowBorderPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBorderPanel, borderRef, borderDropdownRef, setShowBorderPanel]);
}; 