import { createPortal } from "react-dom";

const effectsList = [
  "Inner shadow",
  "Drop shadow",
  "Layer blur",
  "Background blur",
  "Noise",
  "Texture",
];

const EffectsDropdown = ({
  top,
  left,
  selectedEffect,
  onSelect,
  onClose,
  dropdownRef,
}) => {
  const handlePanelClick = (e) => {
    e.stopPropagation(); // Prevent clicks from bubbling
  };

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top,
        left,
        width: "180px",
        backgroundColor: "#000000", // Dark theme
        color: "#ffffff",
        borderRadius: "15px",
        zIndex: 9999,
        padding: "12px 0",
        maxHeight: "500px",
        overflowY: "auto",
      }}
      onClick={handlePanelClick}
    >
      {effectsList.map((effect) => {
        const isSelected = selectedEffect === effect;
        return (
          <div
            key={effect}
            onClick={() => {
              onSelect(effect);
              onClose();
            }}
            style={{
              padding: "2px 10px",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                padding: "4px 12px",
                background: isSelected ? "#189eff" : "transparent",
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                color: isSelected ? "#fff" : "#eaeaea",
              }}
              //   onMouseEnter={(e) => {
              //     if (!isSelected)
              //       e.currentTarget.style.backgroundColor = "#2c2c2c";
              //   }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {effect}
            </div>
          </div>
        );
      })}
    </div>,
    document.body
  );
};

export default EffectsDropdown;
