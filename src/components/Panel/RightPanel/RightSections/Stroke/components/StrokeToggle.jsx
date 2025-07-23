import React from 'react';
import Hide from '../../../../../../assets/RightPanel/hide.png';
import Show from '../../../../../../assets/RightPanel/show.png';

export const StrokeToggle = ({ isShown, onToggle, disabled }) => {
  return (
    <button
      className="reset-size-btn"
      onClick={onToggle}
      disabled={disabled}
      style={{
        width: "33px",
        height: "15px",
        marginBottom: "-3px",
        marginRight: -3,
      }}
    >
      <img
        src={isShown ? Show : Hide}
        alt={isShown ? "Show" : "Hide"}
        style={{ width: 15, height: 15, marginBottom: 2 }}
      />
      <span className="tooltip" style={{ left: -1 }}>
        {isShown ? "Hide Stroke" : "Show Stroke"}
      </span>
    </button>
  );
}; 