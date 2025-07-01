import "../../RightPanel.css";
import "./Typography.css";
import Fonts from "./font/Font";
import FontSize from "./font/fontsize";
import FontWeight from "./font/fontweight";
import { useState, useEffect, useRef } from "react";
import Down from "../../../../../assets/down.png";
// import demo from "../../../../../assets/LeftPanel/layout.png";

const fonts = [
  "Josefin Sans",
  "Roboto",
  "Inter",
  "Poppins",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Nunito",
  "Playfair Display",
];

const TextPropertiesPanel = () => {
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFont, setSelectedFont] = useState("Josefin Sans");
  const fontInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [panelCoords, setPanelCoords] = useState(null);

  // NEW STATE FOR FONT WEIGHT DROPDOWN
  const [showFontWeightPanel, setShowFontWeightPanel] = useState(false);
  const [selectedFontWeight, setSelectedFontWeight] = useState("SemiBold"); // Default
  const fontWeightInputRef = useRef(null);
  const fontWeightDropdownRef = useRef(null);
  const [fontWeightPanelCoords, setFontWeightPanelCoords] = useState(null);

  // NEW STATE FOR FONT SIZE DROPDOWN
  const [showFontSizePanel, setShowFontSizePanel] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState(10); // Default to 100
  const fontSizeInputRef = useRef(null); // Ref for the "100" input box
  const fontSizeDropdownRef = useRef(null); // Ref for the FontSizeDropdown itself
  const [fontSizePanelCoords, setFontSizePanelCoords] = useState(null);

  const filteredFonts = fonts.filter((font) =>
    font.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (showFontPanel && fontInputRef.current) {
      const rect = fontInputRef.current.getBoundingClientRect();
      setPanelCoords({
        top: rect.bottom + window.scrollY - 200,
        left: rect.left + window.scrollX - 250 - 20,
      });
    } else if (!showFontPanel) {
      setPanelCoords(null); // Reset coords when panel is closed
    }
  }, [showFontPanel]);

  // Effect for Font Weight Dropdown positioning
  useEffect(() => {
    if (showFontWeightPanel && fontWeightInputRef.current) {
      const rect = fontWeightInputRef.current.getBoundingClientRect();
      setFontWeightPanelCoords({
        top: rect.bottom + window.scrollY - 300, // Position directly below
        left: rect.left + window.scrollX, // Align left edge
      });
    } else if (!showFontWeightPanel) {
      setFontWeightPanelCoords(null); // Reset coords when panel is closed
    }
  }, [showFontWeightPanel]);

  // NEW EFFECT FOR FONT SIZE DROPDOWN POSITIONING
  useEffect(() => {
    if (showFontSizePanel && fontSizeInputRef.current) {
      const rect = fontSizeInputRef.current.getBoundingClientRect();
      setFontSizePanelCoords({
        top: rect.bottom + window.scrollY - 350, // Position directly below the input
        left: rect.left + window.scrollX, // Align left edge of the input
      });
    } else if (!showFontSizePanel) {
      setFontSizePanelCoords(null);
    }
  }, [showFontSizePanel]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showFontPanel &&
        fontInputRef.current &&
        dropdownRef.current &&
        !fontInputRef.current.contains(e.target) &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowFontPanel(false);
      }
      // Logic for Font Weight Dropdown
      if (
        showFontWeightPanel &&
        fontWeightInputRef.current &&
        fontWeightDropdownRef.current &&
        !fontWeightInputRef.current.contains(e.target) &&
        !fontWeightDropdownRef.current.contains(e.target)
      ) {
        setShowFontWeightPanel(false);
      }
      // Logic for Font Size Dropdown
      if (
        showFontSizePanel &&
        fontSizeInputRef.current &&
        fontSizeDropdownRef.current &&
        !fontSizeInputRef.current.contains(e.target) &&
        !fontSizeDropdownRef.current.contains(e.target)
      ) {
        setShowFontSizePanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFontPanel, showFontWeightPanel, showFontSizePanel]);

  return (
    <>
      <div className="right-section-title">Tyopography</div>
      <div style={{ marginBottom: "-10px" }}>
        <div
          className="pos-box"
          ref={fontInputRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "2px solid #e0e0e0",
            width: "72%",
            height: "auto",
            padding: "8px 10px",
            margin: "10px 0 25px 10px",
            gap: "8px",
          }}
          onClick={() => setShowFontPanel(!showFontPanel)}
        >
          <input
            type="text"
            value={selectedFont}
            readOnly
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              width: "100%",
            }}
          />
          <img
            src={Down}
            alt={Down}
            style={{ width: "10px", height: "10px" }}
          />

          {showFontPanel && panelCoords && (
            <Fonts
              top={panelCoords.top}
              left={panelCoords.left}
              onClose={() => setShowFontPanel(false)}
              onSelect={setSelectedFont}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredFonts={filteredFonts}
              selectedFont={selectedFont}
              dropdownRef={dropdownRef}
            />
          )}
        </div>

        <div
          className="position-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            width: "75%",
            height: "75%",
            marginLeft: "25px",
            marginTop: "-18px",
          }}
        >
          {/* Font Weight Dropdown Trigger */}
          <div
            className="pos-box"
            ref={fontWeightInputRef}
            style={{
              width: "95%",
              height: "10%",
              gap: "25px",
              marginLeft: "-14px",
              background: "transparent",
              border: "2px solid #e0e0e0",
              padding: "12px 12px",
            }}
            onClick={() => setShowFontWeightPanel(!showFontWeightPanel)}
          >
            <input
              type="text"
              value={selectedFontWeight} // Display selected weight
              readOnly
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                width: "100%",
              }}
            />
            <img
              src={Down}
              alt="Down"
              style={{ width: "10px", height: "10px" }}
            />
          </div>

          {showFontWeightPanel && fontWeightPanelCoords && (
            <FontWeight
              top={fontWeightPanelCoords.top}
              left={fontWeightPanelCoords.left}
              onClose={() => setShowFontWeightPanel(false)}
              onSelect={setSelectedFontWeight}
              selectedWeight={selectedFontWeight}
              dropdownRef={fontWeightDropdownRef} // Pass new ref
            />
          )}

          <div
            className="pos-box"
            ref={fontSizeInputRef}
            style={{
              width: "60%",
              height: "10%",
              marginLeft: "8px",
              border: "2px solid #e0e0e0",
              padding: "12px 12px",
            }}
            onClick={() => setShowFontSizePanel(!showFontSizePanel)}
          >
            <input
              type="number"
              value={selectedFontSize} // Display selected size
              onChange={(e) => setSelectedFontSize(Number(e.target.value))}
            />
            <img
              src={Down}
              alt="Down"
              style={{ width: "10px", height: "10px" }}
            />
          </div>

          {showFontSizePanel &&
            fontSizePanelCoords && ( // Conditionally render
              <FontSize
                top={fontSizePanelCoords.top}
                left={fontSizePanelCoords.left}
                onClose={() => setShowFontSizePanel(false)}
                onSelect={setSelectedFontSize}
                selectedSize={selectedFontSize}
                dropdownRef={fontSizeDropdownRef}
              />
            )}

          {/* <div
            className="pos-box"
            style={{
              display: "flex",
              width: "60%",
              height: "10%",
              marginTop: "-10px",
              marginLeft: "-12px",
              border: "2px solid #e0e0e0",
              padding: "12px 26px",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
              }}
            >
              <img src={demo} alt={demo} style={{ width: 14, height: 14 }} />
            </button>
          </div> */}


        </div>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default TextPropertiesPanel;
