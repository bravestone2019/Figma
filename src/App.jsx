import './App.css';
import Tool from './components/Tools/Tool.jsx';
import Panel from './components/Panel/Panel.jsx';
import Canvas from './components/Canvas/Canvas';
import { useState } from 'react';

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [drawnRectangles, setDrawnRectangles] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);

  return (
    <>
      <Panel 
        selectedShapes={selectedShapes}
        setSelectedShapes={setSelectedShapes}
        drawnRectangles={drawnRectangles}
        setDrawnRectangles={setDrawnRectangles}
      />
      <Canvas 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        position={position}
        setPosition={setPosition}
        scale={scale}
        setScale={setScale}
        drawnRectangles={drawnRectangles}
        setDrawnRectangles={setDrawnRectangles}
        selectedShapes={selectedShapes}
        setSelectedShapes={setSelectedShapes}
      />
      {/* </div> */}
      <Tool 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        position={position}
        scale={scale}
        setDrawnRectangles={setDrawnRectangles}
      />
    </>
  )
}

export default App;
