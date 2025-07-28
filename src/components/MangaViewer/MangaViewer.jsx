// src/components/MangaViewer/MangaViewer.jsx
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import ImageDisplay from './ImageDisplay';
import Navigation from './Navigation';
import ZoomControls from '../Controls/ZoomControls';
import useZoomPan from '../../hooks/useZoomPan';

const MangaViewer = () => {
  const { imagePaths, currentIndex, setCurrentIndex } = useContext(AppContext);
  const { transform, handleZoomIn, handleZoomOut, handlePan, resetZoomPan } = useZoomPan();

  useEffect(() => {
    resetZoomPan();
  }, [currentIndex, resetZoomPan]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagePaths.length - 1 : prevIndex - 1
    );
  };

  if (imagePaths.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={resetZoomPan} />
        <ImageDisplay src={imagePaths[currentIndex]} transform={transform} onPan={handlePan} />
        <Navigation onNext={handleNext} onPrev={handlePrev} />
      </div>
    </div>
  );
};

export default MangaViewer;
