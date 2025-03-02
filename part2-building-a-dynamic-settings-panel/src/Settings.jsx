import { useEffect, useState } from 'react';

export function Settings({ canvas }) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [color, setColor] = useState('');
  const [diameter, setDiameter] = useState('');

  useEffect(() => {
    if (canvas) {
      canvas.on('selection:created', (event) => {
        handleObjectSelection(event.selected[0]);
      });

      canvas.on('selection:updated', (event) => {
        handleObjectSelection(event.selected[0]);
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
        clearSettings();
      });

      canvas.on('object:modified', (event) => {
        handleObjectSelection(event.target);
      });

      canvas.on('object:scaling', (event) => {
        handleObjectSelection(event.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) {
      return;
    }

    setSelectedObject(object);

    if (object.type === 'rect') {
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
      setDiameter('');
    } else if (object.type === 'circle') {
      setDiameter(Math.round(object.radius * object.scaleX));
      setColor(object.fill);
      setWidth('');
      setHeight('');
    }
  };

  const clearSettings = () => {
    setWidth('');
    setHeight('');
    setColor('');
    setDiameter('');
  };

  const handleWidthChange = (event) => {
    const value = event.target.value.replace(/,/g, '');
    const initValue = parseInt(value, 10);

    if (Number(initValue) >= 0) {
      setWidth(initValue);
    } else {
      setWidth('');
    }

    if (selectedObject && selectedObject.type === 'rect' && initValue >= 0) {
      selectedObject.set({ width: initValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  };

  const handleHeightChange = (event) => {
    const value = event.target.value.replace(/,/g, '');
    const initValue = parseInt(value, 10);

    if (Number(initValue) >= 0) {
      setHeight(initValue);
    } else {
      setHeight('');
    }

    if (selectedObject && selectedObject.type === 'rect' && initValue >= 0) {
      selectedObject.set({ height: initValue / selectedObject.scaleY });
      canvas.renderAll();
    }
  };

  const handleColorChange = (event) => {
    const value = event.target.value;

    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  const handleDiameterChange = (event) => {
    const value = event.target.value.replace(/,/g, '');
    const initValue = parseInt(value, 10);

    if (Number(initValue) >= 0) {
      setDiameter(initValue);
    } else {
      setDiameter('');
    }

    if (selectedObject && selectedObject.type === 'circle' && initValue >= 0) {
      selectedObject.set({ radius: initValue / 2 / selectedObject.scaleX });
      canvas.renderAll();
    }
  };

  return (
    <div>
      {selectedObject && selectedObject.type === 'rect' && (
        <>
          <input value={width} onChange={handleWidthChange} />
          <input value={height} onChange={handleHeightChange} />
          <input value={color} onChange={handleColorChange} />
        </>
      )}
      {selectedObject && selectedObject.type === 'circle' && (
        <>
          <input value={diameter} onChange={handleDiameterChange} />
          <input type="color" value={color} onChange={handleColorChange} />
        </>
      )}
    </div>
  );
}
