import { useState, useEffect } from 'react';

export function CanvasSettings({ canvas }) {
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [canvasWidth, setCanvasWidth] = useState(500);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvasHeight, canvasWidth, canvas]);

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);
    if (intValue >= 0) {
      setCanvasWidth(intValue);
    } else {
      setCanvasWidth('');
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);
    if (intValue >= 0) {
      setCanvasHeight(intValue);
    } else {
      setCanvasHeight('');
    }
  };

  return (
    <div>
      <label htmlFor="width">Width:</label>
      <input
        type="text"
        id="width"
        value={canvasWidth}
        onChange={handleWidthChange}
      />

      <label htmlFor="height">Height:</label>
      <input
        type="text"
        id="height"
        value={canvasHeight}
        onChange={handleHeightChange}
      />
    </div>
  );
}
