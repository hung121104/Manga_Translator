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
  const [translationProgress, setTranslationProgress] = useState(null);
  const [translatedImageUrl, setTranslatedImageUrl] = useState(null);

  useEffect(() => {
    resetZoomPan();
    setTranslationResult(null);
    setTranslatedImageUrl(null);
    setTranslationProgress(null);
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
    setTranslatedImageUrl(null);
    setTranslationProgress(null);
    
    try {
      const currentImage = imagePaths[currentIndex];
      // Use exact same options as working Nuxt.js version
      const options = {
        target_language: 'CHT', // Fixed field name
        detector: 'default',    // Fixed value
        direction: 'default',   // Fixed value  
        translator: 'gpt3.5',   // Fixed value
        size: 'L',              // Fixed value
      };
      
      console.log('🚀 Starting complete translation workflow with options:', options);
      
      const result = await translateImageComplete(
        currentImage, 
        options, 
        (progress) => {
          console.log('📊 Translation progress:', progress);
          setTranslationProgress(progress);
        }
      );
      
      console.log('✅ Translation completed:', result);
      setTranslatedImageUrl(result.translatedImageUrl);
      setTranslationResult({ 
        success: true, 
        taskId: result.taskId,
        message: 'Translation completed successfully!'
      });
      
    } catch (error) {
      console.error('❌ Translation failed:', error);
      setTranslationResult({ 
        success: false, 
        error: error.message 
      });
    } finally {
      setIsTranslating(false);
      setTranslationProgress(null);
    }
  };

  if (imagePaths.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const currentImageSrc = translatedImageUrl || imagePaths[currentIndex];

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={resetZoomPan} />
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <TranslateButton onClick={handleTranslate} isLoading={isTranslating} />
          
          {translatedImageUrl && (
            <button
              onClick={() => {
                setTranslatedImageUrl(null);
                setTranslationResult(null);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
            >
              Show Original
            </button>
          )}
        </div>

        {/* Translation Progress */}
        {translationProgress && (
          <div className="mb-4 p-3 bg-blue-900 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-blue-200 font-medium">{translationProgress.message}</span>
            </div>
            <div className="mt-2 text-sm text-blue-300">
              Status: {translationProgress.status}
            </div>
          </div>
        )}
        
        <ImageDisplay src={currentImageSrc} transform={transform} onPan={handlePan} />
        <Navigation onNext={handleNext} onPrev={handlePrev} />
        
        {/* Translation Status */}
        {translationResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            translationResult.success ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
          }`}>
            <p className="font-bold">
              {translationResult.success ? '✅ Success!' : '❌ Error:'}
            </p>
            <p>{translationResult.message || translationResult.error}</p>
            {translationResult.taskId && (
              <p className="text-sm mt-1">Task ID: {translationResult.taskId}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaViewer;
