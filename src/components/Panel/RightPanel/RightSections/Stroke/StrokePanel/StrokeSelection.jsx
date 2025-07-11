import { createPortal } from "react-dom";
import { useEffect } from "react";

const strokeOptions = [
  { label: "Center", value: "center" },
  { label: "Inside", value: "inside" },
  { label: "Outside", value: "outside" },
];

const StrokePositionPanel = ({
  top,
  left,
  onSelect,
  onClose,
  selectedValue,
  dropdownRef,
}) => {
  const handlePanelClick = (e) => {
    e.stopPropagation(); // Prevent clicks from closing the panel
  };

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      dropdownRef?.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [dropdownRef, onClose]);



  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top,
        left,
        width: "120px",
        backgroundColor: "#000000",
        color: "#fff",
        borderRadius: "14px",
        zIndex: 9999,
        padding: "8px 0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      onClick={handlePanelClick}
    >
      {strokeOptions.map((option) => (
        <div
          key={option.value}
          onClick={() => {
            onSelect(option.value);
            onClose();
          }}
          style={{
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            margin: "0 8px",
            backgroundColor:
              selectedValue === option.value ? "#189eff" : "transparent",
            color: selectedValue === option.value ? "#fff" : "#ccc",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>{option.label}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default StrokePositionPanel;
