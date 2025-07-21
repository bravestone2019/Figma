import { useEffect } from "react";

const useKeyboardShortcuts = (setActiveTool, textInput, handleCopy, handlePaste) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip shortcuts if inside textarea or text input is active
      if (document.activeElement.tagName === "TEXTAREA" || textInput) return;

      // Escape key to cancel current tool and switch to Move
      if (e.key === "Escape") {
        setActiveTool("Move");
        return;
      }

      // Copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (handleCopy) handleCopy();
        e.preventDefault();
        return;
      }

      // Paste (Ctrl/Cmd + V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (handlePaste) handlePaste();
        e.preventDefault();
        return;
      }

      // Tool shortcuts
      if (e.key.toLowerCase() === "r") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Rectangle");
        }
      } else if (e.key.toLowerCase() === "l") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Line");
        }
      } else if (e.key.toLowerCase() === "c") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Circle");
        }
      } else if (e.key.toLowerCase() === "v") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Move");
        }
      } else if (e.key.toLowerCase() === "h") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Hand");
        }
      } else if (e.key.toLowerCase() === "k") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Scale");
        }
      } else if (e.key.toLowerCase() === "f") {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Frame");
        }
      } else if (e.key.toLowerCase() === "s") {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Section");
        } else if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Slice");
        }
      } else if (e.key.toLowerCase() === "p") {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Pencil");
        } else if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Pen");
        }
      } else if (e.key.toLowerCase() === "t") {
        if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          setActiveTool("Triangle");
        } else if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          setActiveTool("Text");
        }
      } else if (e.key.toLowerCase() === "i" && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
        setActiveTool("Image");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveTool, textInput, handleCopy, handlePaste]);
};

export default useKeyboardShortcuts; 