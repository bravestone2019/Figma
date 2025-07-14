import React from 'react';

export const StrokeHeader = ({ isOpen, onExpandCollapse }) => {
  return (
    <div className="right-section-title clickable">
      Stroke
      <button
        className="expand-collapse-btn"
        onClick={onExpandCollapse}
      >
        {isOpen ? "−" : "+"}
        <span className="tooltip" style={{ left: "80%" }}>
          {isOpen ? "Remove Stroke" : "Add Stroke"}
        </span>
      </button>
    </div>
  );
}; 