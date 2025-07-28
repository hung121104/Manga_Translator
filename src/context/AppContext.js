// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import imageService from '../services/imageService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [imagePaths, setImagePaths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const paths = imageService.getMangaPages();
    setImagePaths(paths);
  }, []);

  const value = {
    imagePaths,
    currentIndex,
    setCurrentIndex,
  };

  return React.createElement(AppContext.Provider, { value }, children);
};
