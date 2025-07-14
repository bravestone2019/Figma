import React from 'react';
import ColorPanel from '../StrokePanel/strokePanel';
import MiniColorPicker from '../../Fill/color/MiniColorPicker';

export const ColorPicker = ({ 
  color, 
  opacity, 
  onColorChange, 
  onOpacityChange,
  colorPanelOpen,
  onColorPanelToggle,
  coords,
  panelInputRef,
  disabled 
}) => {
  return (
    <div
      className="pos-box-fill"
      ref={panelInputRef}
      style={{
        border: "1px solid #e0e0e0",
        flex: 1,
      }}
    >
      <button
        style={{
          width: "17px",
          height: "17px",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          background: color,
          display: "inline-block",
          padding: 0,
          zIndex: 10,
        }}
        onClick={onColorPanelToggle}
        disabled={disabled}
      />
      {colorPanelOpen && coords && (
        <ColorPanel
          top={coords.top}
          left={coords.left}
          setColorPickerOpen={onColorPanelToggle}
          color={color}
          opacity={opacity}
          setColor={onColorChange}
          setOpacity={onOpacityChange}
        >
          <MiniColorPicker
            color={{ ...color, a: opacity / 100 }}
            onChange={onColorChange}
          />
        </ColorPanel>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
        }}
      >
        <input
          type="text"
          value={(color || "#000000").replace("#", "").toUpperCase()}
          onChange={(e) => {
            let val = e.target.value.trim();
            // Only allow valid hex codes (3 or 6 hex digits, no #)
            if (/^([0-9A-Fa-f]{3}){1,2}$/.test(val)) {
              onColorChange("#" + val.toUpperCase());
            }
          }}
          style={{
            width: "70px",
            padding: "2px 0",
            fontSize: "11px",
            textAlign: "center",
            color: "#333",
            marginLeft: -6,
          }}
          disabled={disabled}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <input
            type="number"
            value={opacity}
            min={0}
            max={100}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            style={{
              width: "40px",
              textAlign: "center",
              fontSize: "11px",
            }}
            disabled={disabled}
          />
          <div
            style={{
              marginLeft: -8,
              zIndex: 10,
              fontSize: "12px",
              color: "#666",
              background: "none",
            }}
          >
            %
          </div>
        </div>
      </div>
    </div>
  );
}; 