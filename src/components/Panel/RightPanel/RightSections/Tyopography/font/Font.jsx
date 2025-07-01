import { createPortal } from "react-dom";

const FontDropdown = ({
  top,
  left,
  onClose,
  onSelect,
  searchTerm,
  setSearchTerm,
  filteredFonts,
  selectedFont,
  dropdownRef,
}) => {
  // Function to stop event propagation
  const handlePanelClick = (e) => {
    e.stopPropagation(); // Prevents the click from reaching the document or other parents
  };
  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top,
        left,
        width: "210px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        zIndex: 9999,
        padding: "12px",
        overflow: "hidden",
      }}
      onClick={handlePanelClick}
    >
      {/* HEADER SECTION: "Fonts" text and CLOSE BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Distributes space between items
          alignItems: "center", // Vertically centers items
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "bold", // Make it bold
            color: "#333", // Darker color for emphasis
            marginLeft: "5px",
          }}
        >
          Fonts
        </span>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "18px",
            color: "#888",
            fontWeight: "bold",
          }}
          aria-label="Close font dropdown"
        >
          ×
        </button>
      </div>

      <input
        type="text"
        placeholder="Search fonts"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          display: "flex",
          width: "100%",
          padding: "8px 6px",
          marginLeft: "-6px",
          marginBottom: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "12px",
        }}
      />
      <div
        className="font-list-scrollable-area"
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          fontSize: "14px",
          padding: " 0 8px 0",
        }}
      >
        {filteredFonts.map((font, idx) => (
          <div
            key={idx}
            onClick={() => {
              onSelect(font);
              onClose();
            }}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              background: font === selectedFont ? "#f0f0f0" : "transparent",
              "&:hover": {
                background: font === selectedFont ? "#f0f0f0" : "#f5f5f5",
              },
            }}
          >
            {font}
          </div>
        ))}
        {filteredFonts.length === 0 && (
          <div style={{ padding: "2px", color: "#888" }}>No fonts found</div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default FontDropdown;