import { createPortal } from "react-dom";
import All from "../../../../../../assets/RightPanel/border.png";
import Left from "../../../../../../assets/RightPanel/border_left.png";
import Right from "../../../../../../assets/RightPanel/border_right.png";
import Bottom from "../../../../../../assets/RightPanel/bottom_border.png";
import Top from "../../../../../../assets/RightPanel/top_border.png";

const borderIcons = {
  all: All,
  top: Top,
  bottom: Bottom,
  left: Left,
  right: Right,
};

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
        width: "110px",
        backgroundColor: "#000000",
        color: "#fff",
        borderRadius: "14px",
        zIndex: 9999,
        padding: "8px 0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            margin: "0 8px",
            backgroundColor:
              selectedKey === option.key ? "#189eff" : "transparent",
            color: selectedKey === option.key ? "#fff" : "#ccc"
          }}
        >
          <img
            src={borderIcons[option.key]}
            alt={option.label}
            style={{ width: "14px", height: "14px", filter: "brightness(0) invert(1)" }}
          />
          <span style={{ textTransform: "capitalize" }}>
            {option.label}
          </span>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default BorderPanel;
