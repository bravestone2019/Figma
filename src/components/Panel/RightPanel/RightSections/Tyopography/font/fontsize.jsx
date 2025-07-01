import { createPortal } from "react-dom";

// Font sizes array for the new dropdown
const fontSizes = [
  10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128,
];

// NEW COMPONENT: FontSizeDropdown
const FontSizeDropdown = ({
  top,
  left,
  onClose,
  onSelect,
  selectedSize,
  dropdownRef,
}) => {
  const handlePanelClick = (e) => {
    e.stopPropagation(); // Stop event bubbling
  };

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top,
        left,
        width: "100px", // Adjust width as needed
        backgroundColor: "#000000", // Black background
        color: "#fff", // White text color
        border: "1px solid #ccc",
        borderRadius: "15px", // Rounded corners
        zIndex: 9999,
        padding: "8px 0", // Padding for the entire dropdown
        // overflowY: "auto", // Enable scrolling if many sizes
        maxHeight: "500px", // Max height before scrolling
      }}
      onClick={handlePanelClick}
    >
      {fontSizes.map((size, idx) => (
        <div
          key={idx}
          onClick={() => {
            onSelect(size);
            onClose();
          }}
          style={{
            padding: "3px 5px", // Padding for individual items
            fontSize: "14px",
            "&:hover": {
              // Basic hover effect
              background: size === selectedSize ? "#189eff" : "#333", // Darker on hover
            },
          }}
        >
          {/* {size === selectedSize && (
            <span style={{ fontSize: "14px", marginRight: "5px" }}>✓</span> // Checkmark for selected
          )} */}
          <div
            style={{
              padding: "4px 12px",
              background: size === selectedSize ? "#189eff" : "transparent", // Highlight selected
              display: "flex",
              alignItems: "center",
              borderRadius: "8px", // Slightly rounded corners for items
            }}
          >
            {size}
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default FontSizeDropdown;
