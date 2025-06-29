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
      const ctrlMatch = keyCombo.ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = keyCombo.shift ? event.shiftKey : !event.shiftKey;

      if (key === expectedKey && ctrlMatch && shiftMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, keyCombo]);
};

export default useShortcut;
