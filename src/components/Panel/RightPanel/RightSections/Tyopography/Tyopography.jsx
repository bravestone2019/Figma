import "../../RightPanel.css";
import "./Typography.css";
import WebFont from "webfontloader";
import Fonts from "./font/Font";
import FontSize from "./font/fontsize";
import FontWeight from "./font/fontweight";
import { useState, useEffect, useRef } from "react";
import Down from "../../../../../assets/down.png";
import AlignLeft from "../../../../../assets/RightPanel/left.png";
import AlignCenter from "../../../../../assets/RightPanel/center.png";
import AlignRight from "../../../../../assets/RightPanel/right.png";

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

const TextPropertiesPanel = ({ selectedShapes, drawnRectangles, setDrawnRectangles, isOpen, setOpen }) => {
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const fontInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [panelCoords, setPanelCoords] = useState(null);

  // NEW STATE FOR FONT WEIGHT DROPDOWN
  const [showFontWeightPanel, setShowFontWeightPanel] = useState(false);
  const [selectedFontWeight, setSelectedFontWeight] = useState("Regular"); // Default
  const fontWeightInputRef = useRef(null);
  const fontWeightDropdownRef = useRef(null);
  const [fontWeightPanelCoords, setFontWeightPanelCoords] = useState(null);

  // NEW STATE FOR FONT SIZE DROPDOWN
  const [showFontSizePanel, setShowFontSizePanel] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState(16); // Default to 16
  const fontSizeInputRef = useRef(null); // Ref for the "100" input box
  const fontSizeDropdownRef = useRef(null); // Ref for the FontSizeDropdown itself
  const [fontSizePanelCoords, setFontSizePanelCoords] = useState(null);

  // NEW STATE FOR ALIGNMENT
  const [selectedHorizontalAlignment, setSelectedHorizontalAlignment] =
    useState("left"); // Default

  // Check if exactly one text shape is selected
  const isSingleTextSelected = selectedShapes && selectedShapes.length === 1;
  let selectedTextShape = null;
  
  if (isSingleTextSelected) {
    selectedTextShape = drawnRectangles.find((s) => s.id === selectedShapes[0]);
    if (selectedTextShape && selectedTextShape.type !== "text") {
      selectedTextShape = null; // Not a text shape
    }
  }

  // Update local state when selected text shape changes or its properties change
  useEffect(() => {
    if (selectedTextShape) {
      if (selectedFont !== (selectedTextShape.fontFamily || "Arial")) {
        setSelectedFont(selectedTextShape.fontFamily || "Arial");
      }
      if (selectedFontSize !== (selectedTextShape.fontSize || 16)) {
        setSelectedFontSize(selectedTextShape.fontSize || 16);
      }
      if (selectedFontWeight !== (selectedTextShape.fontWeight || "Regular")) {
        setSelectedFontWeight(selectedTextShape.fontWeight || "Regular");
      }
      if (selectedHorizontalAlignment !== (selectedTextShape.textAlign || "left")) {
        setSelectedHorizontalAlignment(selectedTextShape.textAlign || "left");
      }
    }
    // eslint-disable-next-line
  }, [selectedTextShape?.fontFamily, selectedTextShape?.fontSize, selectedTextShape?.fontWeight, selectedTextShape?.textAlign]);

  // Function to update and store changes to the selected text shape(s)
  const storeTextShapeChanges = (updates) => {
    if (!selectedShapes || selectedShapes.length === 0) return;
    setDrawnRectangles((prev) =>
      prev.map((shape) => {
        if (selectedShapes.includes(shape.id) && shape.type === "text") {
          return { ...shape, ...updates };
        }
        return shape;
      })
    );
  };

  // Handle font family change
  const handleFontChange = (newFont) => {
    setSelectedFont(newFont);
    storeTextShapeChanges({ fontFamily: newFont });
  };

  // Handle font size change (from dropdown or input)
  const handleFontSizeChange = (newSize) => {
    setSelectedFontSize(newSize);
    storeTextShapeChanges({ fontSize: newSize });
  };

  // Handle font weight change
  const handleFontWeightChange = (newWeight) => {
    setSelectedFontWeight(newWeight);
    storeTextShapeChanges({ fontWeight: newWeight });
  };

  // Handle text alignment change
  const handleAlignmentChange = (newAlignment) => {
    setSelectedHorizontalAlignment(newAlignment);
    storeTextShapeChanges({ textAlign: newAlignment });
  };

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

  useEffect(() => {
    if (selectedFont) {
      WebFont.load({
        google: {
          families: [selectedFont],
        },
      });
    }
  }, [selectedFont]);


  // Don't render if no text shape is selected
  if (!isSingleTextSelected || !selectedTextShape) {
    return (
      <>
        <div className="right-section-title">Typography</div>
        <div style={{ 
          margin: "20px", 
          color: "#666", 
          fontSize: "12px",
          fontStyle: "italic"
        }}>
          Select a text element to edit typography
        </div>
        <div className="section-divider" />
      </>
    );
  }

  return (
    <>
      <div className="right-section-title">Typography</div>
      <div style={{ marginBottom: "-10px" }}>
        {/* Font Selector */}
        <div
          className="pos-box"
          ref={fontInputRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "1px solid #e0e0e0",
            padding: "2px 10px",
            margin: "10px 40px 25px 15px",
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
              fontFamily: selectedFont,
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
              onSelect={handleFontChange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredFonts={filteredFonts}
              selectedFont={selectedFont}
              dropdownRef={dropdownRef}
            />
          )}
          <span className="tooltip">Fonts</span>
        </div>

        <div
          // className="position-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            // gap: "8px",
            marginLeft: "30px",
            marginTop: "-18px",
          }}
        >
          {/* Font Weight Dropdown Trigger */}
          <div
            className="pos-box"
            ref={fontWeightInputRef}
            style={{
              marginLeft: "-15px",
              background: "transparent",
              border: "1px solid #e0e0e0",
              padding: "2px 6px",
              height: "24px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => setShowFontWeightPanel(!showFontWeightPanel)}
          >
            <input
              type="text"
              value={selectedFontWeight}
              readOnly
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
                border: "none",
                background: "transparent",
                width: "100%",
              }}
            />
            <img
              src={Down}
              alt="Down"
              style={{ width: "10px", height: "10px", marginRight: "8px" }}
            />
            <span className="tooltip">Font weight</span>
          </div>

          {showFontWeightPanel && fontWeightPanelCoords && (
            <FontWeight
              top={fontWeightPanelCoords.top}
              left={fontWeightPanelCoords.left}
              onClose={() => setShowFontWeightPanel(false)}
              onSelect={handleFontWeightChange}
              selectedWeight={selectedFontWeight}
              dropdownRef={fontWeightDropdownRef} // Pass new ref
            />
          )}

          {/* Font Size Panel */}
          <div
            className="pos-box"
            ref={fontSizeInputRef}
            style={{
              marginLeft: "10px",
              marginRight: "40px",
              border: "1px solid #e0e0e0",
              padding: "2px 6px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={() => setShowFontSizePanel(!showFontSizePanel)}
          >
            <input
              type="number"
              value={selectedFontSize} // Display selected size
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              style={{
                border: "none",
                outline: "none",
                fontSize: "12px",
                background: "transparent",
                 width: "25px",  
              }}
            />
            <img
              src={Down}
              alt="Down"
              style={{ width: "10px", height: "10px", marginRight: "2px" }}
            />
            <span className="tooltip">Font size</span>
          </div>
          {showFontSizePanel &&
            fontSizePanelCoords && ( // Conditionally render
              <FontSize
                top={fontSizePanelCoords.top}
                left={fontSizePanelCoords.left}
                onClose={() => setShowFontSizePanel(false)}
                onSelect={handleFontSizeChange}
                selectedSize={selectedFontSize}
                dropdownRef={fontSizeDropdownRef}
              />
            )}

          {/* Text Alignment */}
          <div
            className="alignment-panel"
            style={{
              marginTop: "10px",
              marginLeft: "45px",
              marginRight: "-54px",
              marginBottom: 5
            }}
          >
            <div className="alignment-group">
              <button
                className={`alignment-button ${
                  selectedHorizontalAlignment === "left" ? "active" : ""
                }`}
                onClick={() => handleAlignmentChange("left")}
              >
                <img src={AlignLeft} alt="Align Left" />
                <span className="tooltip" style={{ bottom: "-30px" }}>
                  Align left
                </span>
              </button>
              <button
                className={`alignment-button ${
                  selectedHorizontalAlignment === "center" ? "active" : ""
                }`}
                onClick={() => handleAlignmentChange("center")}
              >
                <img src={AlignCenter} alt="Align Center" />
                <span className="tooltip" style={{ bottom: "-30px" }}>
                  Align center
                </span>
              </button>
              <button
                className={`alignment-button ${
                  selectedHorizontalAlignment === "right" ? "active" : ""
                }`}
                onClick={() => handleAlignmentChange("right")}
              >
                <img src={AlignRight} alt="Align Right" />
                <span className="tooltip" style={{ bottom: "-30px" }}>
                  Align right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thin grey line divider */}
      <div className="section-divider" />
    </>
  );
};

export default TextPropertiesPanel;