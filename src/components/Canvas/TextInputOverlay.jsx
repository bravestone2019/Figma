import { useEffect, useRef } from "react";

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
      setDrawnRectangles((prev) => [
        ...prev,
        {
          type: "text",
          ...textInput,
          locked: false,
        },
      ]);
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
  }, [textInput]);

  // Ensure redraw happens after text input state changes
  useEffect(() => {
    if (redrawAllShapes?.current?.redrawAllShapes) {
      requestAnimationFrame(() => {
        redrawAllShapes.current.redrawAllShapes();
      });
    }
  }, [textInput, redrawAllShapes]);

  if (!textInput) return null;

  return (
    <div
      ref={containerRef}
      className="text-input-container"
      style={{
        position: "absolute",
        left: textInput.x * scale + position.x,
        top: textInput.y * scale + position.y,
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <textarea
        value={textInput.text || ""}
        onChange={handleTextChange}
        onKeyDown={handleTextInput}
        autoFocus
        style={{
          width: textInput.width * scale,
          height: textInput.height * scale,
          fontSize: textInput.fontSize * scale,
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
        }}
      />
    </div>
  );
};

export default TextInputOverlay; 