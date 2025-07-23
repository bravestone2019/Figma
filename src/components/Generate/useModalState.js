import { useState, useCallback } from 'react';

function useModalState(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);
  return [isOpen, open, close, toggle];
}

export default useModalState; 