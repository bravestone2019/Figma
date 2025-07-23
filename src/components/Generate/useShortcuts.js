import { useEffect } from 'react';
import Shortcut from '../Shortcut';

function useShortcuts(shortcuts) {
  useEffect(() => {
    const cleanups = shortcuts.map(({ key, callback }) => {
      // Register the shortcut
      return Shortcut({ key }, callback);
    });
    // No explicit cleanup needed if Shortcut handles it internally
    // If needed, return a cleanup function here
    // return () => { ... };
  }, [JSON.stringify(shortcuts)]);
}

export default useShortcuts; 