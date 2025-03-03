import { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Circle, Triangle } from 'fabric';
import { CanvasSettings } from './CanvasSettings';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = '#fff';
      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: '#d84d42',
      });

      canvas.add(rect);
    }
  };
  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 100,
        left: 50,
        radius: 50,
        fill: '#2f4dc6',
      });

      canvas.add(circle);
    }
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} />
      <button onClick={addRectangle}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>
      <CanvasSettings canvas={canvas} />
    </div>
  );
}

export default App;
