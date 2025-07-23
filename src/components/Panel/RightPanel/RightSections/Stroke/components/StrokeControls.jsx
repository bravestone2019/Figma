import React from 'react';
import Weight from '../../../../../../assets/RightPanel/weight.png';
import Dropdown from '../../../../../../assets/down.png';
import StrokeBorder from '../StrokePanel/strokeBorder';
import StrokePositionPanel from '../StrokePanel/StrokeSelection';
import { BORDER_ICONS } from '../constants';

export const StrokeControls = ({ 
  strokePosition, 
  strokeWidth, 
  selectedBorderSide,
  onPositionChange,
  onWidthChange,
  onBorderSideChange,
  isUniformBorder,
  strokePanelOpen,
  strokePanelCoords,
  showBorderPanel,
  borderPanelCoords,
  borderRef,
  strokeDropdownRef,
  borderDropdownRef,
  onStrokePanelToggle,
  onBorderPanelToggle
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: 8,
        gap: "2px",
        marginLeft: "15px",
        alignsItems: "center",
      }}
    >
      {/* Stroke Selection Dropdown */}
      <div
        ref={borderRef}
        onClick={() => isUniformBorder && onStrokePanelToggle()}
        style={{
          flex: 1,
          display: "flex",
          background: isUniformBorder ? "transparent" : "#f5f5f5",
          border: "1px solid #e0e0e0",
          padding: "7px 10px",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 6,
          marginRight: "28%",
          opacity: isUniformBorder ? 1 : 0.5,
          pointerEvents: isUniformBorder ? "auto" : "none",
          cursor: isUniformBorder ? "pointer" : "not-allowed",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {strokePosition.charAt(0).toUpperCase() + strokePosition.slice(1)}
        </span>
        <img
          src={Dropdown}
          alt={Dropdown}
          style={{
            width: "12px",
            height: "12px",
            marginLeft: "5px",
          }}
        />
        <span className="tooltip" style={{ bottom: "35px" }}>
          Stroke selection{!isUniformBorder ? " (only for uniform stroke)" : ""}
        </span>
      </div>

      {strokePanelOpen && strokePanelCoords && isUniformBorder && (
        <StrokePositionPanel
          top={strokePanelCoords.top}
          left={strokePanelCoords.left}
          onClose={() => onStrokePanelToggle()}
          onSelect={onPositionChange}
          selectedValue={strokePosition}
          dropdownRef={strokeDropdownRef}
        />
      )}

      {/* Stroke Weight Input */}
      <div
        style={{
          flex: 1,
          display: "flex",
          background: "transparent",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          marginLeft: "-25%",
          marginRight: 25,
          alignItems: "center",
        }}
      >
        <img
          src={Weight}
          alt={Weight}
          style={{
            width: "14px",
            height: "17px",
            paddingLeft: 10,
            marginRight: "5px",
          }}
        />
        <input
          type="number"
          value={strokeWidth}
          onChange={onWidthChange}
          style={{
            flex: 1,
            fontSize: "11px",
            fontWeight: "bold",
            color: "#333",
            marginRight: "-150px",
            borderRadius: "4px",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        <span className="tooltip" style={{ bottom: "35px" }}>
          Stroke weight
        </span>
      </div>

      {showBorderPanel && borderPanelCoords && (
        <StrokeBorder
          top={borderPanelCoords.top}
          left={borderPanelCoords.left}
          onSelect={onBorderSideChange}
          onClose={() => onBorderPanelToggle()}
          selectedKey={selectedBorderSide}
          dropdownRef={borderDropdownRef}
        />
      )}

      <button
        className="reset-size-btn"
        ref={borderRef}
        onClick={onBorderPanelToggle}
        style={{
          width: "33px",
          height: "15px",
          marginBottom: "-2px",
          marginLeft: -21,
        }}
      >
        <img
          src={BORDER_ICONS[selectedBorderSide]}
          alt={selectedBorderSide}
          style={{ width: 15, height: 15, marginBottom: 2 }}
        />
        <span className="tooltip" style={{ left: -25 }}>
          Individual Strokes
        </span>
      </button>
    </div>
  );
}; 