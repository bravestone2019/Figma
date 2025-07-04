// BorderPanel.jsx
import { createPortal } from "react-dom";

const borderOptions = [
  { label: "All", key: "all" },
  { label: "Top", key: "top" },
  { label: "Bottom", key: "bottom" },
  { label: "Left", key: "left" },
  { label: "Right", key: "right" },
];

const BorderPanel = ({
  top,
  left,
  onSelect,
  onClose,
  selectedKey,
  dropdownRef,
}) => {
  const handleClick = (e) => e.stopPropagation();

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top,
        left,
        width: "100px",
        backgroundColor: "#000000",
        color: "#fff",
        border: "1px solid #ccc",
        borderRadius: "15px",
        zIndex: 9999,
        padding: "8px 0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
      }}
      onClick={handleClick}
    >
      {borderOptions.map((option) => (
        <div
          key={option.key}
          onClick={() => {
            onSelect(option.key);
            onClose();
          }}
          style={{
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            margin: "0 10px 0 10px",
            backgroundColor:
              selectedKey === option.key ? "#189eff" : "transparent",
            color: selectedKey === option.key ? "#fff" : "#ccc",
          }}
        >
          {/* Replace below emoji with real icon if needed */}
            <span style={{ textTransform: "capitalize" }} >{option.label}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default BorderPanel;
