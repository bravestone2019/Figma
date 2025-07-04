import { createPortal } from "react-dom";

// Font weights array for the new dropdown
const fontWeights = [
  { label: "Thin", weight: 100 },
  { label: "ExtraLight", weight: 200 },
  { label: "Light", weight: 300 },
  { label: "Regular", weight: 400 },
  { label: "Medium", weight: 500 },
  { label: "SemiBold", weight: 600 },
  { label: "Bold", weight: 700 },
  { label: "Thin Italic", weight: 100, italic: true },
  { label: "ExtraLight Italic", weight: 200, italic: true },
  { label: "Light Italic", weight: 300, italic: true },
  { label: "Italic", weight: 400, italic: true },
  { label: "Medium Italic", weight: 500, italic: true },
  { label: "SemiBold Italic", weight: 600, italic: true },
  { label: "Bold Italic", weight: 700, italic: true },
];

const FontWeightDropdown = ({
  top,
  left,
  onClose,
  onSelect,
  selectedWeight,
  dropdownRef, // Pass this ref for click outside logic
}) => {
  const handlePanelClick = (e) => {
    e.stopPropagation(); // Stop event bubbling to document
  };

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top,
        left,
        width: "150px", // Adjust width as needed
        backgroundColor: "#000000",
        color: "#fff",
        border: "1px solid #ccc",
        borderRadius: "15px",
        // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        zIndex: 9999, // Ensure it's above other elements
        padding: "8px 0", // Padding for the entire dropdown
        overflowY: "auto", // Enable scrolling if many weights
        maxHeight: "500px", // Max height before scrolling for weights
      }}
      onClick={handlePanelClick}
    >
      <div
        className="font-list-scrollable-area"
        style={{
        //   maxHeight: "500px",
          overflowY: "auto",
          fontSize: "14px",
          padding: " 0 8px 0",
        }}
      >
      {fontWeights.map((weight, idx) => (
        <div
          key={idx}
          onClick={() => {
            onSelect(weight.label);
            onClose();
          }}
          style={{
            padding: "6px 15px", // Padding for individual items
            background: weight.label === selectedWeight ? "#189eff" : "transparent", // Highlight selected
            display: "flex",
            alignItems: "center",
            gap: "8px", // Space for checkmark if you add it
            borderRadius: "10px",
            // Optional: Add hover effect for better UX
            "&:hover": {
              background: weight.label === selectedWeight ? "#f0f0f0" : "#f5f5f5",
            },
          }}
        >
          {/* Add a checkmark if needed, like Figma */}
          {/* {weight === selectedWeight && (
            <span style={{ fontSize: "14px", marginRight: "5px" }}>✓</span>
          )} */}
          {weight.label}
        </div>
        
      ))}
      </div>
    </div>,
    document.body
  );
};

export default FontWeightDropdown;