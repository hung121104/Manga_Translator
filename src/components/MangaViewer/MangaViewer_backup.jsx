// src/components/MangaViewer/MangaViewer.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import ImageDisplay from './ImageDisplay';
import Navigation from './Navigation';
import ZoomControls from '../Controls/ZoomControls';
import TranslateButton from '../Controls/TranslateButton';
import useZoomPan from '../../hooks/useZoomPan';
import { translateImageComplete } from '../../services/translationService';
import TranslationDisplay from '../TranslationDisplay';

const MangaViewer = () => {
  const { imagePaths, currentIndex, setCurrentIndex } = useContext(AppContext);
  const { transform, handleZoomIn, handleZoomOut, handlePan, resetZoomPan } = useZoomPan();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);

  useEffect(() => {
    resetZoomPan();
    setTranslationResult(null); // Clear translation when image changes
  }, [currentIndex, resetZoomPan]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagePaths.length - 1 : prevIndex - 1
    );
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    setTranslationResult(null);
    try {
      const currentImage = imagePaths[currentIndex];
      // Use exact same options as working Nuxt.js version
      const options = {
        target_language: 'CHT', // Fixed: was 'language', now matches Nuxt.js
        detector: 'default',    // Fixed: was 'craft', now matches Nuxt.js default
        direction: 'default',   // Fixed: was 'auto', now matches Nuxt.js default
        translator: 'gpt3.5',   // Fixed: was 'gpt35', now matches Nuxt.js
        size: 'L',              // Fixed: was 'S', now matches Nuxt.js default
      };
      
      console.log('Translation options:', options);
      const result = await uploadImage(currentImage, options);
      setTranslationResult(result);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslationResult({ error: error.message });
    } finally {
      setIsTranslating(false);
    }
  };

  if (imagePaths.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={resetZoomPan} />
        <TranslateButton onClick={handleTranslate} isLoading={isTranslating} />
        <ImageDisplay src={imagePaths[currentIndex]} transform={transform} onPan={handlePan} />
        <Navigation onNext={handleNext} onPrev={handlePrev} />
        <TranslationDisplay translationResult={translationResult} />
      </div>
    </div>
  );
};

export default MangaViewer;
