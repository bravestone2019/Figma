import { useEffect } from "react";

const useShortcut = (keyCombo, callback) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const el = document.activeElement;
      const tag = el?.tagName?.toLowerCase();

      // ❌ BLOCK all shortcuts if focused in <input>, <textarea>, or contentEditable
      if (
        tag === 'textarea' ||
        tag === 'input' ||
        el?.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const expectedKey = keyCombo.key.toLowerCase();
      // Only match modifiers if specified in keyCombo; otherwise, allow any value
      const ctrlMatch = keyCombo.ctrl === undefined ? true : keyCombo.ctrl === event.ctrlKey;
      const shiftMatch = keyCombo.shift === undefined ? true : keyCombo.shift === event.shiftKey;
      const altMatch = keyCombo.alt === undefined ? true : keyCombo.alt === event.altKey;
      const metaMatch = keyCombo.meta === undefined ? true : keyCombo.meta === event.metaKey;

      if (key === expectedKey && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, keyCombo]);
};

export default useShortcut;
