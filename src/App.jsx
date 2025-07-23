import './App.css';
import Tool from './components/Tools/Tool.jsx';
import Panel from './components/Panel/Panel.jsx';
import Canvas from './components/Canvas/Canvas';
import { useState, useEffect } from 'react';
import { saveAppState, loadAppState } from './utils/persistence';

function App() {
  // Load initial state from localStorage if available
  const loaded = loadAppState();
  const [pages, setPages] = useState(
    loaded?.pages || [
      {
        id: 'page-1',
        name: 'Page 1',
        drawnRectangles: [],
        selectedShapes: [],
        backgroundColor: '#FFFFFF', // Default background color
        backgroundOpacity: 100, // Add default opacity
      },
    ]
  );
  const [activePageId, setActivePageId] = useState(loaded?.activePageId || 'page-1');
  const [collection, setCollection] = useState(loaded?.collection || []);
  const [activeTool, setActiveTool] = useState(null);
  const [position, setPosition] = useState(loaded?.position || { x: 0, y: 0 });
  const [scale, setScale] = useState(loaded?.scale || 1);
  // Persist collections in localStorage
  const [collections, setCollections] = useState(loaded?.collections || [
    { id: 'col-1', name: 'Collection 1', shapeIds: [] }
  ]);

  // Save to localStorage whenever pages, activePageId, collection, collections, position, or scale changes
  useEffect(() => {
    saveAppState(pages, activePageId, collection, collections, position, scale);
  }, [pages, activePageId, collection, collections, position, scale]);

  // Find the active page, fallback to first page or empty object
  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || {};

  // --- Figma-like canvas order logic ---
  const allCollectedIds = collections.flatMap(col => col.shapeIds);
  const collectionShapes = collections.flatMap(col =>
    col.shapeIds.map(id => (activePage.drawnRectangles || []).find(s => s.id === id)).filter(Boolean)
  );
  const mainListShapes = (activePage.drawnRectangles || []).filter(s => !allCollectedIds.includes(s.id));
  const canvasShapes = [...collectionShapes, ...mainListShapes];

  // Setter for background color of the active page
  const setBackgroundColor = (color) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === activePageId
          ? { ...page, backgroundColor: color }
          : page
      )
    );
  };

  // Setter for background opacity of the active page
  const setBackgroundOpacity = (opacity) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === activePageId
          ? { ...page, backgroundOpacity: opacity }
          : page
      )
    );
  };

  // Setters for drawnRectangles and selectedShapes for the active page
  const setDrawnRectangles = (newRectsOrFn) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === activePageId
          ? {
              ...page,
              drawnRectangles:
                typeof newRectsOrFn === 'function'
                  ? newRectsOrFn(page.drawnRectangles)
                  : newRectsOrFn,
            }
          : page
      )
    );
  };
  const setSelectedShapes = (newShapesOrFn) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === activePageId
          ? {
              ...page,
              selectedShapes:
                typeof newShapesOrFn === 'function'
                  ? newShapesOrFn(page.selectedShapes)
                  : newShapesOrFn,
            }
          : page
      )
    );
  };

  return (
    <>
      <Panel
        pages={pages}
        setPages={setPages}
        activePageId={activePageId}
        setActivePageId={setActivePageId}
        selectedShapes={activePage.selectedShapes || []}
        setSelectedShapes={setSelectedShapes}
        drawnRectangles={activePage.drawnRectangles || []}
        setDrawnRectangles={setDrawnRectangles}
        setActiveTool={setActiveTool}
        collection={collection}
        setCollection={setCollection}
        backgroundColor={activePage.backgroundColor || '#FFFFFF'}
        setBackgroundColor={setBackgroundColor}
        backgroundOpacity={activePage.backgroundOpacity ?? 100}
        setBackgroundOpacity={setBackgroundOpacity}
        collections={collections}
        setCollections={setCollections}
      />
      <Canvas
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        position={position}
        setPosition={setPosition}
        scale={scale}
        setScale={setScale}
        drawnRectangles={canvasShapes}
        setDrawnRectangles={setDrawnRectangles}
        selectedShapes={activePage.selectedShapes || []}
        setSelectedShapes={setSelectedShapes}
        backgroundColor={activePage.backgroundColor || '#FFFFFF'}
        backgroundOpacity={activePage.backgroundOpacity ?? 100}
      />
      <Tool
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        position={position}
        scale={scale}
        setDrawnRectangles={setDrawnRectangles}
        drawnRectangles={canvasShapes} // <-- pass real array
        collections={collections} // <-- pass collections
      />
    </>
  );
}

export default App;
