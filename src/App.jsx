import './App.css';
import Tool from './components/Tool.jsx';
import Canvas from './components/Canvas/Canvas';
import { useState } from 'react';

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [drawnRectangles, setDrawnRectangles] = useState([]);

  return (
    <>
      <Canvas 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        position={position}
        setPosition={setPosition}
        scale={scale}
        setScale={setScale}
        drawnRectangles={drawnRectangles}
        setDrawnRectangles={setDrawnRectangles}
      />
      <Tool 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        position={position}
        scale={scale}
      />
    </>
  )
}

export default App;
