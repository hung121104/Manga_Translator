// src/components/MangaViewer/ImageDisplay.jsx
import React from 'react';

const ImageDisplay = ({ src, transform, onPan }) => {
  return (
    <div
      className="overflow-hidden border-2 border-gray-700 rounded-lg"
      onMouseMove={onPan}
      onMouseDown={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt="Manga Page"
        className="w-full h-auto"
        style={{
          transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
          cursor: 'grab',
          transition: 'transform 0.1s ease-out',
        }}
      />
    </div>
  );
};

export default ImageDisplay;
