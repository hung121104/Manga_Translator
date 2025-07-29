// src/hooks/useZoomPan.js
import { useState, useCallback } from 'react';

const useZoomPan = () => {
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const handleZoomIn = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: prev.scale * 1.2 }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: prev.scale / 1.2 }));
  }, []);

  const handlePan = useCallback((e) => {
    if (e.buttons === 1) { // Left mouse button down
      setTransform((prev) => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  }, []);

  const resetZoomPan = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);


  return {
    transform,
    handleZoomIn,
    handleZoomOut,
    handlePan,
    resetZoomPan,
  };
};

export default useZoomPan;
