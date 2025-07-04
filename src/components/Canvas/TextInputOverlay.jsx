import { useEffect, useRef } from "react";

// Utility to get the next available shape name for a given type
function getNextShapeName(type, drawnRectangles) {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);
  const sameType = drawnRectangles.filter(s => s.type === type);
  const namePattern = new RegExp(`^${typeName}(?: (\\d+))?$`, 'i');
  const numbers = sameType
    .map(s => {
      const shapeName = s.name || typeName;
      const match = shapeName.match(namePattern);
      return match ? (match[1] ? parseInt(match[1], 10) : 1) : null;
    })
    .filter(n => n !== null);
  let nextNumber = 1;
  while (numbers.includes(nextNumber)) nextNumber++;
  return nextNumber === 1 ? typeName : `${typeName} ${nextNumber}`;
}

const TextInputOverlay = ({
  textInput,
  setTextInput,
  setDrawnRectangles,
  scale,
  position,
  redrawAllShapes,
}) => {
  const containerRef = useRef(null);

  // Handle text input completion
  const completeTextInput = () => {
    if (textInput?.text?.trim()) {
      setDrawnRectangles((prev) => {
        const name = getNextShapeName("text", prev);
        return [
          ...prev,
          {
            type: "text",
            name,
            ...textInput,
            locked: false,
          },
        ];
      });
    }
    setTextInput(null);
  };

  // Handle text input (Enter/Escape)
  const handleTextInput = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      completeTextInput();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTextInput(null);
    }
  };

  // Handle text change
  const handleTextChange = (e) => {
    if (textInput) {
      setTextInput((prev) => ({
        ...prev,
        text: e.target.value,
      }));
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        textInput &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        completeTextInput();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [textInput, completeTextInput]);

  // Ensure redraw happens after text input state changes
  useEffect(() => {
    if (redrawAllShapes?.current?.redrawAllShapes) {
      requestAnimationFrame(() => {
        redrawAllShapes.current.redrawAllShapes();
      });
    }
  }, [textInput, redrawAllShapes]);

  if (!textInput) return null;

  // Calculate the position to match where text is drawn in the canvas
  // The text is drawn at textInput.y + fontSize, so we need to adjust the overlay accordingly
  const fontSize = textInput.fontSize || 16;
  const adjustedY = textInput.y + fontSize;

  return (
    <div
      ref={containerRef}
      className="text-input-container"
      style={{
        position: "absolute",
        left: textInput.x * scale + position.x,
        top: adjustedY * scale + position.y,
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <textarea
        value={textInput.text || ""}
        onChange={handleTextChange}
        onKeyDown={handleTextInput}
        autoFocus
        wrap="soft"
        style={{
          width: textInput.width * scale,
          height: (textInput.height - fontSize) * scale, // Adjust height to account for font offset
          fontSize: fontSize * scale,
          color: textInput.color,
          opacity: textInput.opacity,
          border: "none",
          outline: "none",
          resize: "none",
          background: "transparent",
          fontFamily: "Arial",
          lineHeight: "1.2",
          padding: "4px",
          pointerEvents: "auto",
          overflow: "hidden",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

export default TextInputOverlay; 