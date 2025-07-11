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
      },
    ]
  );
  const [activePageId, setActivePageId] = useState(loaded?.activePageId || 'page-1');
  const [collection, setCollection] = useState(loaded?.collection || []);
  const [activeTool, setActiveTool] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Save to localStorage whenever pages, activePageId, or collection changes
  useEffect(() => {
    saveAppState(pages, activePageId, collection);
  }, [pages, activePageId, collection]);

  // Find the active page, fallback to first page or empty object
  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || {};

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
      />
      <Canvas
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        position={position}
        setPosition={setPosition}
        scale={scale}
        setScale={setScale}
        drawnRectangles={activePage.drawnRectangles || []}
        setDrawnRectangles={setDrawnRectangles}
        selectedShapes={activePage.selectedShapes || []}
        setSelectedShapes={setSelectedShapes}
      />
      <Tool
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        position={position}
        scale={scale}
        setDrawnRectangles={setDrawnRectangles}
      />
    </>
  );
}

export default App;
