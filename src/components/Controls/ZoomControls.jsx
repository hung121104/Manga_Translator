// src/components/Controls/ZoomControls.jsx
import React from 'react';

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      <button
        onClick={onZoomIn}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
      >
        Zoom In
      </button>
      <button
        onClick={onZoomOut}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
      >
        Zoom Out
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
      >
        Reset
      </button>
    </div>
  );
};

export default ZoomControls;
